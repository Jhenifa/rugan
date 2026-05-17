import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import BlogPost from "../models/BlogPost.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Middleware to inject dynamic Open Graph tags for blog posts.
 * This is essential for social media cards (WhatsApp, Twitter, etc.)
 * because their crawlers do not execute JavaScript.
 */
export async function injectBlogMeta(req, res, next) {
  // Only target blog post pages and only for GET requests
  // We ignore /blog (the list page) as it can use default tags, 
  // and focus on /blog/:slug.
  const isBlogPost = req.path.startsWith("/blog/") && req.path.split("/").length === 3;
  
  if (req.method !== "GET" || !isBlogPost) {
    return next();
  }

  const slug = req.path.split("/")[2];
  
  // Skip if it's the search page or empty
  if (!slug || slug === "search") {
    return next();
  }

  try {
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!post) return next();

    // Determine the path to index.html. 
    // In production, this usually lives in the client build folder.
    const indexPath = path.resolve(__dirname, "../../../client/dist/index.html");
    
    let html;
    try {
      html = await fs.readFile(indexPath, "utf8");
    } catch (err) {
      // If index.html is missing (e.g. dev mode without build), just skip
      return next();
    }

    const siteUrl = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");
    
    // Ensure absolute image URL
    let absoluteImageUrl = post.coverImage || "/images/blog/hero.jpg";
    if (!absoluteImageUrl.startsWith("http")) {
      absoluteImageUrl = `${siteUrl}${absoluteImageUrl.startsWith("/") ? "" : "/"}${absoluteImageUrl}`;
    }

    // Clean title and description
    const title = post.title; // Substack-like: just the title
    const description = post.excerpt;

    // Inject tags into <head>
    // 1. Update <title>
    html = html.replace(/<title>.*?<\/title>/, `<title>${title} | RUGAN</title>`);

    // 2. Strip existing OG/Twitter tags to prevent duplicates
    html = html.replace(/<meta\s+property="og:[^"]+"\s+content="[^"]*"\s*\/?>/gi, "");
    html = html.replace(/<meta\s+name="twitter:[^"]+"\s+content="[^"]*"\s*\/?>/gi, "");
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gi, "");

    // 3. Add OG and Twitter tags before </head>
    const metaTags = `
    <!-- Social Media Meta Tags (Injected) -->
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${absoluteImageUrl}" />
    ${absoluteImageUrl.startsWith("https") ? `<meta property="og:image:secure_url" content="${absoluteImageUrl}" />` : ""}
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:url" content="${siteUrl}/blog/${post.slug}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="RUGAN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${absoluteImageUrl}" />
    `;

    html = html.replace("</head>", `${metaTags}\n  </head>`);

    res.send(html);
  } catch (error) {
    console.error("Meta injection error:", error);
    next();
  }
}
