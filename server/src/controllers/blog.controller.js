import slugify from "slugify";

import BlogPost from "../models/BlogPost.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { notifySubscribersOfPublishedPost } from "../services/newsletter.service.js";

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
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content;
  }

  return "";
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

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title slug excerpt coverImage publishedAt createdAt author authorName tags views")
        .populate("author", "name"),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
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

export async function getPost(req, res, next) {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      status: "published",
    }).populate("author", "name");

    if (!post) throw new AppError("Post not found", 404);

    post.views += 1;
    await post.save({ validateBeforeSave: false });

    const related = await BlogPost.find({
      status: "published",
      slug: { $ne: req.params.slug },
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .select("title slug excerpt coverImage publishedAt createdAt author authorName")
      .populate("author", "name");

    res.json({
      success: true,
      data: { ...post.toObject({ getters: true }), related },
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

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
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

    res.json({
      success: true,
      data: posts,
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

    res.json({ success: true, data: post });
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

    res.status(201).json({ success: true, data: post, meta: { newsletter } });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) throw new AppError("Post not found", 404);

    const payload = normalizePostPayload(req.body);
    const titleChanged =
      typeof payload.title === "string" && payload.title !== post.title;

    Object.assign(post, payload);

    if (!post.slug || (titleChanged && post.status !== "published")) {
      post.slug = await buildUniqueSlug(post.title, post._id);
    }

    if (req.user?._id) {
      post.author = req.user._id;
      post.authorName = req.user.name;
    }

    await post.save();
    const newsletter = await dispatchPublishNotification(post);
    await post.populate("author", "name");

    res.json({ success: true, data: post, meta: { newsletter } });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) throw new AppError("Post not found", 404);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}
