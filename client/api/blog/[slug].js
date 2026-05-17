import { readFile } from "fs/promises";
import path from "path";
import { buildSeoPayload } from "../../src/seo/meta.js";

const DEFAULT_TITLE = "RUGAN | Empowering Rural Girls";
const DEFAULT_DESCRIPTION =
  "Empowering rural girl-children through education, mentorship, and advocacy.";
const DEFAULT_IMAGE_PATH = "/images/homepage/Hero.jpg";

function getOrigin(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "https")
    .split(",")[0]
    .trim();
  const forwardedHost = String(
    req.headers["x-forwarded-host"] || req.headers.host || "rugan.org",
  )
    .split(",")[0]
    .trim();

  return `${forwardedProto}://${forwardedHost}`;
}

function normalizeApiBaseUrl(value, origin) {
  const raw = String(value || "").trim();
  if (!raw) return `${origin}/api`;

  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

function toAbsoluteUrl(value, origin) {
  const raw = String(value || "").trim();
  if (!raw) return `${origin}${DEFAULT_IMAGE_PATH}`;

  if (/^(?:[a-z]+:)?\/\//i.test(raw) || raw.startsWith("data:")) {
    return raw;
  }

  return new URL(raw, origin).toString();
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  const text = stripHtml(value);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeJsonLd(graph) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
      .filter(Boolean)
      .map((item) => {
        const { "@context": _context, ...rest } = item;
        return rest;
      }),
  }).replace(/</g, "\\u003c");
}

function buildGlobalHeadExtras(origin) {
  const googleVerification = String(
    process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.VITE_GOOGLE_SITE_VERIFICATION ||
      "",
  ).trim();
  const bingVerification = String(
    process.env.BING_SITE_VERIFICATION ||
      process.env.VITE_BING_SITE_VERIFICATION ||
      "",
  ).trim();
  const gaMeasurementId = String(
    process.env.GA_MEASUREMENT_ID ||
      process.env.GOOGLE_ANALYTICS_ID ||
      process.env.VITE_GA_MEASUREMENT_ID ||
      process.env.VITE_GOOGLE_ANALYTICS_ID ||
      "",
  ).trim();

  const preconnect = normalizeApiBaseUrl(
    process.env.VITE_API_BASE_URL ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL,
    origin,
  );
  const apiOrigin = preconnect ? new URL(preconnect).origin : "";

  const lines = [
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<meta name="theme-color" content="#4F7B44" />',
    '<meta name="format-detection" content="telephone=yes" />',
    '<link rel="manifest" href="/site.webmanifest" />',
    '<link rel="icon" type="image/jpeg" href="/icons/favicon.jpg" />',
    '<link rel="apple-touch-icon" href="/icons/favicon.jpg" />',
    `<link rel="sitemap" type="application/xml" title="Sitemap" href="${escapeHtml(
      `${origin}/sitemap.xml`,
    )}" />`,
    apiOrigin ? `<link rel="preconnect" href="${escapeHtml(apiOrigin)}" crossorigin />` : "",
    apiOrigin ? `<link rel="dns-prefetch" href="${escapeHtml(apiOrigin)}" />` : "",
    googleVerification
      ? `<meta name="google-site-verification" content="${escapeHtml(googleVerification)}" />`
      : "",
    bingVerification
      ? `<meta name="msvalidate.01" content="${escapeHtml(bingVerification)}" />`
      : "",
    `<style>
      .seo-static-shell {
        min-height: 100vh;
        background: linear-gradient(180deg, #f8fbf8 0%, #ffffff 50%, #f7faf7 100%);
        color: #111827;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .seo-shell-main {
        max-width: 960px;
        margin: 0 auto;
        padding: 120px 24px 72px;
      }
      .seo-shell-breadcrumbs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: #667085;
        font-size: 14px;
      }
      .seo-shell-breadcrumbs a {
        color: inherit;
        text-decoration: none;
      }
      .seo-shell-separator {
        color: #98a2b3;
      }
      .seo-shell-main h1 {
        margin: 0 0 16px;
        font-size: clamp(2rem, 4vw, 3.25rem);
        line-height: 1.1;
      }
      .seo-shell-main p {
        margin: 0 0 24px;
        color: #475467;
        font-size: 1rem;
        line-height: 1.75;
        max-width: 72ch;
      }
      .seo-shell-main section {
        margin-top: 28px;
      }
      .seo-shell-main h2 {
        margin: 0 0 12px;
        font-size: 1.25rem;
        line-height: 1.25;
      }
      .seo-shell-main ul {
        margin: 0;
        padding-left: 20px;
        color: #344054;
        line-height: 1.75;
      }
      .seo-shell-main li + li {
        margin-top: 8px;
      }
      .seo-shell-main a {
        color: #2f5f2f;
      }
    </style>`,
  ].filter(Boolean);

  if (gaMeasurementId) {
    lines.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(gaMeasurementId)}"></script>`,
    );
    lines.push(
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js', new Date());gtag('config','${escapeHtml(gaMeasurementId)}',{ send_page_view: false, anonymize_ip: true });</script>`,
    );
  }

  return lines.join("\n    ");
}

function buildStaticShell(article, pathname) {
  const title = article?.title || "RUGAN Blog";
  const intro = truncate(
    article?.excerpt ||
      "Read the latest RUGAN blog stories, educational resources, and community updates.",
    260,
  );
  const tags = Array.isArray(article?.tags) ? article.tags.filter(Boolean) : [];
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(article?.slug ? [{ name: title, path: pathname }] : []),
  ];

  return `
    <!-- SEO_STATIC_SHELL_START -->
    <div id="seo-static-shell" class="seo-static-shell">
      <main class="seo-shell-main">
        <nav aria-label="Breadcrumb" class="seo-shell-breadcrumbs">
          ${breadcrumbs
            .map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const item = isLast
                ? `<span aria-current="page">${escapeHtml(crumb.name)}</span>`
                : `<a href="${escapeHtml(crumb.path)}">${escapeHtml(crumb.name)}</a>`;

              return `<span>${item}</span>`;
            })
            .join('<span class="seo-shell-separator">/</span>')}
        </nav>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(intro)}</p>
        ${
          tags.length
            ? `<section><h2>Topics covered</h2><ul>${tags
                .map((tag) => `<li>${escapeHtml(tag)}</li>`)
                .join("")}</ul></section>`
            : ""
        }
      </main>
    </div>
    <!-- SEO_STATIC_SHELL_END -->
  `;
}

function buildDynamicHead(article, origin) {
  const path = article?.slug ? `/blog/${article.slug}` : "/blog";
  const authorName = article?.authorName || article?.author?.name || "RUGAN Team";
  const payload = buildSeoPayload({
    title: article?.title || "Blog",
    description: article?.excerpt || DEFAULT_DESCRIPTION,
    path,
    image: article?.coverImage || DEFAULT_IMAGE_PATH,
    pageType: article ? "ArticlePage" : "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      ...(article?.slug ? [{ name: article.title, path }] : []),
    ],
    article: article
      ? {
          authorName,
          publishedTime: article.publishedAt || article.createdAt,
          modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
          section: "Blog",
          keywords: Array.isArray(article.tags) ? article.tags : [],
        }
      : null,
    noindex: !article,
    nofollow: !article,
  });

  return {
    headMarkup: `
      ${buildGlobalHeadExtras(origin)}
      <title>${escapeHtml(payload.pageTitle)}</title>
      <meta name="description" content="${escapeHtml(payload.pageDescription)}" />
      <meta name="robots" content="${escapeHtml(payload.robots)}" />
      <meta name="googlebot" content="${escapeHtml(payload.robots)}" />
      <meta name="bingbot" content="${escapeHtml(payload.robots)}" />
      <meta name="author" content="${escapeHtml(payload.author || payload.siteName)}" />
      <meta name="application-name" content="${escapeHtml(payload.siteName)}" />
      <meta name="keywords" content="${escapeHtml(payload.keywords || "")}" />
      <link rel="canonical" href="${escapeHtml(payload.canonicalUrl)}" />
      <link rel="alternate" hrefLang="en-NG" href="${escapeHtml(payload.canonicalUrl)}" />
      <link rel="alternate" hrefLang="x-default" href="${escapeHtml(payload.canonicalUrl)}" />
      <link rel="image_src" href="${escapeHtml(payload.imageUrl)}" />
      <meta property="og:site_name" content="${escapeHtml(payload.siteName)}" />
      <meta property="og:locale" content="${escapeHtml(payload.locale)}" />
      <meta property="og:type" content="${escapeHtml(payload.type)}" />
      <meta property="og:title" content="${escapeHtml(payload.pageTitle)}" />
      <meta property="og:description" content="${escapeHtml(payload.pageDescription)}" />
      <meta property="og:url" content="${escapeHtml(payload.canonicalUrl)}" />
      <meta property="og:image" content="${escapeHtml(payload.imageUrl)}" />
      <meta property="og:image:secure_url" content="${escapeHtml(payload.imageUrl)}" />
      <meta property="og:image:alt" content="${escapeHtml(payload.imageAlt)}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(payload.pageTitle)}" />
      <meta name="twitter:description" content="${escapeHtml(payload.pageDescription)}" />
      <meta name="twitter:image" content="${escapeHtml(payload.imageUrl)}" />
      <meta name="twitter:image:alt" content="${escapeHtml(payload.imageAlt)}" />
      ${
        payload.publishedTimeIso
          ? `<meta property="article:published_time" content="${escapeHtml(payload.publishedTimeIso)}" />`
          : ""
      }
      ${
        payload.modifiedTimeIso
          ? `<meta property="article:modified_time" content="${escapeHtml(payload.modifiedTimeIso)}" />`
          : ""
      }
      ${
        payload.modifiedTimeIso
          ? `<meta property="og:updated_time" content="${escapeHtml(payload.modifiedTimeIso)}" />`
          : ""
      }
      ${
        payload.section
          ? `<meta property="article:section" content="${escapeHtml(payload.section)}" />`
          : ""
      }
      ${payload.articleTags
        .map(
          (tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`,
        )
        .join("\n      ")}
      <script type="application/ld+json">${serializeJsonLd(payload.graph)}</script>
    `.trim(),
    shellMarkup: buildStaticShell(article, path),
    robotsHeader: article
      ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      : "noindex, nofollow, noarchive",
  };
}

function injectDynamicHead(html, dynamicHead) {
  const strippedHtml = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="viewport"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="theme-color"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="format-detection"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:site_name"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:title"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:description"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:type"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:url"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image:alt"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image:width"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="og:image:height"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:card"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:title"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:description"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="twitter:image"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="robots"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="googlebot"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="bingbot"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="author"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="application-name"[\s\S]*?>/i, "")
    .replace(/<meta\s+name="keywords"[\s\S]*?>/i, "")
    .replace(/<meta\s+property="article:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>/i, "")
    .replace(/<link\s+rel="alternate"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="image_src"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="manifest"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="apple-touch-icon"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="icon"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="google-site-verification"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="msvalidate\.01"[\s\S]*?>/gi, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  return strippedHtml.replace("</head>", `    ${dynamicHead}\n  </head>`);
}

function injectDynamicShell(html, shellMarkup) {
  if (html.includes("SEO_STATIC_SHELL_START")) {
    return html.replace(
      /<!-- SEO_STATIC_SHELL_START -->[\s\S]*?<!-- SEO_STATIC_SHELL_END -->/i,
      shellMarkup,
    );
  }

  return html.replace(
    /<div id="root"><\/div>/i,
    `${shellMarkup}\n    <div id="root"></div>`,
  );
}

async function readBuiltIndexHtml(origin) {
  const distPath = path.resolve(process.cwd(), "dist", "index.html");

  try {
    return await readFile(distPath, "utf8");
  } catch {
    const response = await fetch(`${origin}/`);
    if (!response.ok) {
      throw new Error(`Failed to load index HTML: ${response.status}`);
    }

    return response.text();
  }
}

async function fetchArticleMetadata(slug, origin) {
  const apiBaseUrl = normalizeApiBaseUrl(
    process.env.VITE_API_BASE_URL ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL,
    origin,
  );

  if (!apiBaseUrl || !slug) {
    return { status: 200, article: null };
  }

  const response = await fetch(
    `${apiBaseUrl}/blog/posts/${encodeURIComponent(slug)}/metadata`,
  );

  if (!response.ok) {
    return { status: response.status, article: null };
  }

  const payload = await response.json();
  return { status: 200, article: payload?.data || null };
}

export default async function handler(req, res) {
  const slug = Array.isArray(req.query.slug)
    ? req.query.slug[0]
    : req.query.slug;
  const origin = getOrigin(req);

  try {
    const [baseHtml, metadata] = await Promise.all([
      readBuiltIndexHtml(origin),
      fetchArticleMetadata(slug, origin),
    ]);

    const { headMarkup, shellMarkup, robotsHeader } = buildDynamicHead(
      metadata.article,
      origin,
    );
    const html = injectDynamicShell(
      injectDynamicHead(baseHtml, headMarkup),
      shellMarkup,
    );
    const status = metadata.status === 404 ? 404 : 200;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", robotsHeader);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600",
    );
    res.status(status).send(html);
  } catch (error) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res
      .status(500)
      .send(
        `<!DOCTYPE html><html lang="en"><head><title>${escapeHtml(
          DEFAULT_TITLE,
        )}</title></head><body><p>${escapeHtml(error.message)}</p></body></html>`,
      );
  }
}
