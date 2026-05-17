import slugify from "slugify";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import BlogPost from "../models/BlogPost.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { notifySubscribersOfPublishedPost } from "../services/newsletter.service.js";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const MAX_PAGE_SIZE = 50;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
  }

  if (typeof tags === "string") {
    return [
      ...new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];
  }

  return [];
}

function normalizeContent(content) {
  if (typeof content === "string") {
    return DOMPurify.sanitize(content.trim());
  }

  if (Array.isArray(content)) {
    // Sanitize blocks if it's block-based content
    return content.map(block => {
      if (block.text) {
        block.text = DOMPurify.sanitize(block.text);
      }
      return block;
    });
  }

  return "";
}

function resolveAssetUrl(value, req) {
  const rawValue = String(value || "").trim();

  if (!rawValue) return "";
  if (/^(?:[a-z]+:)?\/\//i.test(rawValue) || rawValue.startsWith("data:") || rawValue.startsWith("blob:")) {
    return rawValue;
  }

  if (!rawValue.startsWith("/")) {
    return rawValue;
  }

  return new URL(rawValue, `${req.protocol}://${req.get("host")}`).toString();
}

function normalizeBlocksForResponse(content, req) {
  if (!Array.isArray(content)) return content;

  return content.map((block) => (
    block?.type === "image"
      ? { ...block, url: resolveAssetUrl(block.url, req) }
      : block
  ));
}

function serializePostForResponse(post, req) {
  const serialized = typeof post?.toObject === "function"
    ? post.toObject({ getters: true })
    : { ...(post || {}) };

  serialized.coverImage = resolveAssetUrl(serialized.coverImage, req);
  serialized.content = normalizeBlocksForResponse(serialized.content, req);

  if (Array.isArray(serialized.related)) {
    serialized.related = serialized.related.map((item) => serializePostForResponse(item, req));
  }

  return serialized;
}

function normalizePostPayload(payload, { isCreate = false } = {}) {
  const normalized = {};

  if (isCreate || "title" in payload) {
    normalized.title = String(payload.title || "").trim();
  }

  if (isCreate || "excerpt" in payload) {
    normalized.excerpt = String(payload.excerpt || "").trim();
  }

  if (isCreate || "content" in payload) {
    normalized.content = normalizeContent(payload.content);
  }

  if ("coverImage" in payload || isCreate) {
    normalized.coverImage = String(payload.coverImage || "").trim();
  }

  if ("tags" in payload || isCreate) {
    normalized.tags = normalizeTags(payload.tags);
  }

  if ("status" in payload || isCreate) {
    normalized.status = payload.status === "published" ? "published" : "draft";
  }

  if ("content" in payload) {
    const hasContent =
      typeof normalized.content === "string"
        ? Boolean(normalized.content)
        : Array.isArray(normalized.content) && normalized.content.length > 0;

    if (!hasContent) {
      throw new AppError("Content is required", 400);
    }
  }

  if (isCreate) {
    if (!normalized.title) throw new AppError("Title is required", 400);
    if (!normalized.excerpt) throw new AppError("Excerpt is required", 400);
  }

  return normalized;
}

async function buildUniqueSlug(title, excludeId = null) {
  const baseSlug = slugify(title, { lower: true, strict: true });

  if (!baseSlug) {
    throw new AppError("Unable to generate a slug from this title", 400);
  }

  let candidate = baseSlug;
  let suffix = 2;

  while (
    await BlogPost.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function dispatchPublishNotification(post) {
  if (post.status !== "published") {
    return { notified: false, reason: "not-published" };
  }

  if (post.newsletterSentAt) {
    return { notified: false, reason: "already-sent" };
  }

  const result = await notifySubscribersOfPublishedPost(post);

  if (result.reason === "no-active-subscribers" || result.sent > 0) {
    post.newsletterSentAt = new Date();
    await post.save({ validateBeforeSave: false });
  }

  return {
    notified: result.reason === "sent" || result.reason === "no-active-subscribers",
    ...result,
  };
}

export async function getPosts(req, res, next) {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = Math.min(toPositiveInteger(req.query.limit, 10), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;
    const filter = { status: "published" };
    const includePagination = String(req.query.includePagination || "").toLowerCase() === "true";

    const postsQuery = BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt coverImage publishedAt createdAt author authorName tags")
      .populate("author", "name")
      .lean();

    const [posts, total] = includePagination
      ? await Promise.all([postsQuery, BlogPost.countDocuments(filter)])
      : [await postsQuery, null];

    const response = {
      success: true,
      data: posts.map((post) => serializePostForResponse(post, req)),
    };

    if (includePagination) {
      response.pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      };
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function getPostMetadata(req, res, next) {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published",
    })
      .select("title slug excerpt coverImage publishedAt createdAt author authorName tags")
      .populate("author", "name")
      .lean();

    if (!post) throw new AppError("Post not found", 404);

    res.json({
      success: true,
      data: serializePostForResponse(post, req),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    // Increment view count atomically and fetch post in one operation
    const [post, related] = await Promise.all([
      BlogPost.findOneAndUpdate(
        { slug: req.params.slug, status: "published" },
        { $inc: { views: 1 } },
        { new: true },
      ).populate("author", "name"),
      BlogPost.find({
        status: "published",
        slug: { $ne: req.params.slug },
      })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3)
        .select("title slug excerpt coverImage publishedAt createdAt author authorName")
        .lean(),
    ]);

    if (!post) throw new AppError("Post not found", 404);

    res.json({
      success: true,
      data: serializePostForResponse({ ...post.toObject({ getters: true }), related }, req),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminPosts(req, res, next) {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = Math.min(toPositiveInteger(req.query.limit, 20), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;
    const status = String(req.query.status || "all");
    const search = String(req.query.search || "").trim();
    const filter = {};

    if (status === "draft" || status === "published") {
      filter.status = status;
    }

    if (req.user?.role === "editor") {
      filter.author = req.user._id;
    }

    if (search) {
      // Escape regex special characters in user input
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { excerpt: { $regex: escaped, $options: "i" } },
        { tags: { $regex: escaped, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "title slug excerpt coverImage status publishedAt newsletterSentAt createdAt updatedAt author authorName tags views",
        )
        .populate("author", "name"),
      BlogPost.countDocuments(filter),
    ]);

    // When searching, prioritize titles where match is at a word boundary
    let sortedPosts = posts;
    if (search) {
      const wordBoundary = new RegExp(`\\b${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
      sortedPosts = [...posts].sort((a, b) => {
        const aWordMatch = wordBoundary.test(a.title) ? 0 : 1;
        const bWordMatch = wordBoundary.test(b.title) ? 0 : 1;
        return aWordMatch - bWordMatch;
      });
    }

    res.json({
      success: true,
      data: sortedPosts.map((post) => serializePostForResponse(post, req)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminPost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id).populate("author", "name");

    if (!post) throw new AppError("Post not found", 404);

    if (req.user?.role === "editor" && post.author._id.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized to access this post", 403);
    }

    res.json({ success: true, data: serializePostForResponse(post, req) });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const payload = normalizePostPayload(req.body, { isCreate: true });

    const post = new BlogPost({
      ...payload,
      slug: await buildUniqueSlug(payload.title),
      author: req.user._id,
      authorName: req.user.name,
    });

    await post.save();
    const newsletter = await dispatchPublishNotification(post);
    await post.populate("author", "name");

    res.status(201).json({
      success: true,
      data: serializePostForResponse(post, req),
      meta: { newsletter },
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) throw new AppError("Post not found", 404);

    if (req.user?.role === "editor" && post.author.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized to update this post", 403);
    }

    const payload = normalizePostPayload(req.body);
    const titleChanged =
      typeof payload.title === "string" && payload.title !== post.title;

    Object.assign(post, payload);

    if (!post.slug || (titleChanged && post.status !== "published")) {
      post.slug = await buildUniqueSlug(post.title, post._id);
    }

    await post.save();
    const newsletter = await dispatchPublishNotification(post);
    await post.populate("author", "name");

    res.json({
      success: true,
      data: serializePostForResponse(post, req),
      meta: { newsletter },
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) throw new AppError("Post not found", 404);

    if (req.user?.role === "editor" && post.author.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}
