import { Router } from "express";
import BlogPost from "../models/BlogPost.model.js";

const router = Router();

const staticPages = [
  "/",
  "/about",
  "/team",
  "/programmes",
  "/impact",
  "/volunteers",
  "/partnership",
  "/blog",
  "/donate",
  "/donation/success",
  "/privacy",
  "/terms",
];

const programSlugs = [
  "rugan-idgc-school-tours",
  "rugan-healthy-period-project",
  "the-rise-project",
  "excellence-award-project",
  "rural-to-global-programme",
];

function formatLastMod(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

function buildUrl(baseUrl, pathname, lastmod, changefreq = "weekly", priority) {
  return [
    "  <url>",
    `    <loc>${baseUrl}${pathname}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    typeof priority === "number"
      ? `    <priority>${priority.toFixed(1)}</priority>`
      : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function getBaseUrl(req) {
  return (
    process.env.SITE_URL || `${req.protocol}://${req.get("host")}`
  ).replace(/\/+$/, "");
}

router.get("/", async (req, res, next) => {
  try {
    const baseUrl = getBaseUrl(req);
    const pages = staticPages.map((pathname) =>
      buildUrl(baseUrl, pathname, formatLastMod(new Date()), "weekly", 0.9),
    );

    const programs = programSlugs.map((slug) =>
      buildUrl(
        baseUrl,
        `/programmes/${slug}`,
        formatLastMod(new Date()),
        "monthly",
        0.8,
      ),
    );

    const posts = await BlogPost.find({ status: "published" })
      .select("slug publishedAt updatedAt")
      .sort({ publishedAt: -1 })
      .lean();

    const articles = posts.map((post) =>
      buildUrl(
        baseUrl,
        `/blog/${post.slug}`,
        formatLastMod(post.updatedAt || post.publishedAt),
        "weekly",
        0.7,
      ),
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
      ...pages,
      ...programs,
      ...articles,
    ].join("\n")}\n</urlset>`;

    res.type("application/xml").send(xml);
  } catch (error) {
    next(error);
  }
});

export default router;
