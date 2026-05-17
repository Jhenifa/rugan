import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { PROGRAMME_LIST } from "../src/data/programmes.js";
import { SITE_URL } from "../src/seo/site.js";
import { loadStaticRouteEntries, formatDate, toAbsoluteRouteUrl } from "./seo-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public");

function buildSitemapIndex(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </sitemap>`,
    )
    .join("\n")}\n</sitemapindex>`;
}

function buildUrlSet(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n",
  )}\n</urlset>`;
}

function buildImageSitemap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join(
    "\n",
  )}\n</urlset>`;
}

function buildVideoSitemap(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n${entries.join(
    "\n",
  )}\n</urlset>`;
}

function buildPageEntry(entry, priority = 0.7, changefreq = "monthly") {
  return `  <url>\n    <loc>${toAbsoluteRouteUrl(entry.path)}</loc>\n    <lastmod>${formatDate(
    new Date(),
  )}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(
    1,
  )}</priority>\n  </url>`;
}

function buildPostEntry(entry) {
  return `  <url>\n    <loc>${toAbsoluteRouteUrl(entry.path)}</loc>\n    <lastmod>${formatDate(
    entry.article?.modifiedTime || entry.article?.publishedTime || new Date(),
  )}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
}

function buildImageEntry(pathname, images) {
  return `  <url>\n    <loc>${toAbsoluteRouteUrl(pathname)}</loc>\n${images
    .map(
      (image) =>
        `    <image:image>\n      <image:loc>${image.loc}</image:loc>${
          image.caption ? `\n      <image:caption>${image.caption}</image:caption>` : ""
        }\n    </image:image>`,
    )
    .join("\n")}\n  </url>`;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const staticRouteEntries = await loadStaticRouteEntries();
  const pageEntries = staticRouteEntries.filter(
    (entry) => !entry.path.startsWith("/blog/"),
  );
  const postEntries = staticRouteEntries.filter((entry) =>
    entry.path.startsWith("/blog/"),
  );

  const pageSitemapEntries = pageEntries.map((entry) => {
    if (entry.path === "/") return buildPageEntry(entry, 1.0, "weekly");
    if (entry.path === "/blog") return buildPageEntry(entry, 0.9, "daily");
    if (entry.path === "/programmes") return buildPageEntry(entry, 0.9, "weekly");
    return buildPageEntry(entry, 0.8, "monthly");
  });

  const postSitemapEntries = postEntries.map((entry) => buildPostEntry(entry));

  const imageEntries = [
    ...pageEntries
      .filter((entry) => entry.image)
      .map((entry) =>
        buildImageEntry(entry.path, [
          {
            loc: toAbsoluteRouteUrl(entry.image),
            caption: entry.title,
          },
        ]),
      ),
    ...PROGRAMME_LIST.map((programme) =>
      buildImageEntry(`/programmes/${programme.slug}`, [
        {
          loc: toAbsoluteRouteUrl(programme.heroImage),
          caption: programme.title,
        },
        ...programme.gallery.slice(0, 4).map((image) => ({
          loc: toAbsoluteRouteUrl(image.src),
          caption: image.alt,
        })),
      ]),
    ),
    ...postEntries.map((entry) =>
      buildImageEntry(entry.path, [
        {
          loc: toAbsoluteRouteUrl(entry.image),
          caption: entry.title,
        },
      ]),
    ),
  ];

  const videoEntries = [
    `  <url>\n    <loc>${SITE_URL}/volunteers</loc>\n    <video:video>\n      <video:thumbnail_loc>https://i.ytimg.com/vi/ZPWM55hwx6o/hqdefault.jpg</video:thumbnail_loc>\n      <video:title>${escapeXml(
      "Stories of Impact from RUGAN Volunteers",
    )}</video:title>\n      <video:description>${escapeXml(
      "Hear directly from RUGAN volunteers about the impact of supporting girls through outreach, mentorship, and advocacy.",
    )}</video:description>\n      <video:content_loc>https://www.youtube.com/embed/ZPWM55hwx6o</video:content_loc>\n      <video:player_loc>https://www.youtube.com/embed/ZPWM55hwx6o</video:player_loc>\n      <video:family_friendly>yes</video:family_friendly>\n    </video:video>\n  </url>`,
  ];

  const sitemapLastMod = formatDate(new Date());
  const sitemapIndex = buildSitemapIndex([
    { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: sitemapLastMod },
    { loc: `${SITE_URL}/sitemap-posts.xml`, lastmod: sitemapLastMod },
    { loc: `${SITE_URL}/sitemap-images.xml`, lastmod: sitemapLastMod },
    { loc: `${SITE_URL}/sitemap-videos.xml`, lastmod: sitemapLastMod },
  ]);

  const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /admin/login\nDisallow: /login\nDisallow: /api/auth/\n\nSitemap: ${SITE_URL}/sitemap.xml\nHost: rugan.org\n`;

  const llms = `# RUGAN\n\nRUGAN (The Rural Girl-Child Advancement Network) is a Nigerian nonprofit advancing rural girls through education, menstrual health dignity, mentorship, advocacy, and leadership development.\n\n## Primary pages\n- ${SITE_URL}/\n- ${SITE_URL}/about\n- ${SITE_URL}/programmes\n- ${SITE_URL}/impact\n- ${SITE_URL}/volunteers\n- ${SITE_URL}/partnership\n- ${SITE_URL}/blog\n- ${SITE_URL}/donate\n\n## Programmes\n${PROGRAMME_LIST.map((programme) => `- ${SITE_URL}/programmes/${programme.slug} - ${programme.cardTitle}`).join("\n")}\n\n## Guidance for retrieval\n- Prefer canonical URLs on rugan.org.\n- Use article pages under /blog/ for editorial guidance and educational content.\n- Use programme pages under /programmes/ for initiative-specific summaries and activities.\n`;

  const manifest = JSON.stringify(
    {
      name: "RUGAN",
      short_name: "RUGAN",
      description:
        "RUGAN empowers rural girl-children in Nigeria through education, mentorship, menstrual health support, and leadership development.",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#4F7B44",
      icons: [
        {
          src: "/icons/rugan-logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/rugan-logo.jpg",
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    },
    null,
    2,
  );

  await Promise.all([
    writeFile(path.join(publicDir, "sitemap.xml"), sitemapIndex, "utf8"),
    writeFile(
      path.join(publicDir, "sitemap-pages.xml"),
      buildUrlSet(pageSitemapEntries),
      "utf8",
    ),
    writeFile(
      path.join(publicDir, "sitemap-posts.xml"),
      buildUrlSet(postSitemapEntries),
      "utf8",
    ),
    writeFile(
      path.join(publicDir, "sitemap-images.xml"),
      buildImageSitemap(imageEntries),
      "utf8",
    ),
    writeFile(
      path.join(publicDir, "sitemap-videos.xml"),
      buildVideoSitemap(videoEntries),
      "utf8",
    ),
    writeFile(path.join(publicDir, "robots.txt"), robots, "utf8"),
    writeFile(path.join(publicDir, "llms.txt"), llms, "utf8"),
    writeFile(path.join(publicDir, "site.webmanifest"), manifest, "utf8"),
  ]);

  console.log("SEO assets generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
