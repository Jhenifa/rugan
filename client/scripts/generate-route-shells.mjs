import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { buildSeoPayload } from "../src/seo/meta.js";
import { buildGlobalSeoHeadExtras, buildStaticShellMarkup, loadStaticRouteEntries } from "./seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");
const distIndexPath = path.join(distDir, "index.html");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripManagedHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name="description"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="viewport"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="theme-color"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="format-detection"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="robots"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="googlebot"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="bingbot"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="author"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="application-name"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="keywords"[\s\S]*?>/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="google-site-verification"[\s\S]*?>/gi, "")
    .replace(/<meta\s+name="msvalidate\.01"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="alternate"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="image_src"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="manifest"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="apple-touch-icon"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="icon"[\s\S]*?>/gi, "")
    .replace(/<link\s+rel="sitemap"[\s\S]*?>/gi, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");
}

function serializeJsonLd(graph) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": graph
        .filter(Boolean)
        .map((item) => {
          const { "@context": _context, ...rest } = item;
          return rest;
        }),
    },
  ).replace(/</g, "\\u003c");
}

function renderManagedHead(entry) {
  const payload = buildSeoPayload({
    title: entry.title,
    description: entry.description,
    path: entry.path,
    image: entry.image,
    pageType: entry.pageType,
    breadcrumbs: entry.breadcrumbs,
    faq: entry.faq,
    service: entry.service,
    article: entry.article,
  });

  return `
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
      .join("\n")}
    <script type="application/ld+json">${serializeJsonLd(payload.graph)}</script>
  `.trim();
}

function injectHead(html, headMarkup) {
  return stripManagedHead(html).replace(
    "</head>",
    `  ${buildGlobalSeoHeadExtras()}\n  ${headMarkup}\n</head>`,
  );
}

function injectShell(html, shellMarkup) {
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

function toOutputPath(pathname) {
  if (pathname === "/") {
    return distIndexPath;
  }

  const segments = pathname.replace(/^\/+/, "").split("/");
  const lastSegment = segments.pop();
  return path.join(distDir, ...segments, `${lastSegment}.html`);
}

async function writeRouteFile(baseHtml, entry) {
  const outputPath = toOutputPath(entry.path);
  const outputDir = path.dirname(outputPath);

  await mkdir(outputDir, { recursive: true });

  const htmlWithHead = injectHead(baseHtml, renderManagedHead(entry));
  const htmlWithShell = injectShell(htmlWithHead, buildStaticShellMarkup(entry));

  await writeFile(outputPath, htmlWithShell, "utf8");
}

async function main() {
  const baseHtml = await readFile(distIndexPath, "utf8");
  const entries = await loadStaticRouteEntries();

  for (const entry of entries) {
    if (entry.path.includes("?")) {
      continue;
    }

    await writeRouteFile(baseHtml, entry);
  }

  console.log(`Generated prerender shells for ${entries.length} routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
