import { ARTICLE_ROUTE_ENTRIES, STATIC_ROUTE_ENTRIES } from "../src/seo/routes.js";
import { DEFAULT_IMAGE_PATH, SITE_URL, absoluteUrl } from "../src/seo/site.js";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveApiBaseUrl() {
  const raw = String(
    process.env.VITE_API_BASE_URL ||
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "",
  ).trim();

  if (!raw) {
    return "";
  }

  const normalized = raw.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

function getAuthorName(post) {
  if (!post) return "RUGAN Team";

  if (typeof post.author === "string" && post.author.trim()) {
    return post.author.trim();
  }

  if (post.author && typeof post.author === "object") {
    return post.author.name || post.author.fullName || post.authorName || "RUGAN Team";
  }

  return post.authorName || "RUGAN Team";
}

export function formatDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString().split("T")[0]
    : parsed.toISOString().split("T")[0];
}

export async function loadPublishedPosts(limit = 100) {
  const apiBaseUrl = resolveApiBaseUrl();

  if (!apiBaseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/blog/posts?limit=${limit}&includePagination=true`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export function buildArticleRouteEntries(posts = []) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return ARTICLE_ROUTE_ENTRIES;
  }

  return posts
    .filter((post) => Boolean(post?.slug))
    .map((post) => ({
      path: `/blog/${post.slug}`,
      title: post.title,
      description:
        post.excerpt ||
        `Read ${post.title} on the RUGAN blog for insights on rural girls, education, dignity, and opportunity.`,
      image: post.coverImage || post.image || DEFAULT_IMAGE_PATH,
      pageType: "ArticlePage",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ],
      article: {
        authorName: getAuthorName(post),
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
        section: "Blog",
        keywords: Array.isArray(post.tags) ? post.tags : [],
      },
      shell: {
        intro:
          post.excerpt ||
          "Explore this RUGAN article for practical insight, field context, and guidance connected to girls' education and empowerment.",
        sections: [
          {
            heading: "Topics covered",
            items:
              Array.isArray(post.tags) && post.tags.length > 0
                ? post.tags
                : ["Girls education", "RUGAN blog", "Community impact"],
          },
        ],
      },
    }));
}

export async function loadStaticRouteEntries() {
  const publishedPosts = await loadPublishedPosts();
  const articleEntries = buildArticleRouteEntries(publishedPosts);
  const baseEntries = STATIC_ROUTE_ENTRIES.filter(
    (entry) => !entry.path.startsWith("/blog/"),
  );

  return [...baseEntries, ...articleEntries];
}

export function toAbsoluteRouteUrl(pathname) {
  return absoluteUrl(pathname);
}

export function buildStaticShellMarkup(entry) {
  const sections = Array.isArray(entry?.shell?.sections) ? entry.shell.sections : [];
  const intro = entry?.shell?.intro || entry?.description || "";
  const breadcrumbs = Array.isArray(entry?.breadcrumbs) ? entry.breadcrumbs : [];

  const breadcrumbMarkup = breadcrumbs.length
    ? `
      <nav aria-label="Breadcrumb" class="seo-shell-breadcrumbs">
        ${breadcrumbs
          .map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const itemHtml = isLast
              ? `<span aria-current="page">${escapeHtml(item.name)}</span>`
              : `<a href="${item.path}">${escapeHtml(item.name)}</a>`;

            return `<span>${itemHtml}</span>`;
          })
          .join('<span class="seo-shell-separator">/</span>')}
      </nav>
    `
    : "";

  const sectionMarkup = sections
    .map((section) => {
      const items = Array.isArray(section.items)
        ? `<ul>${section.items
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}</ul>`
        : "";
      const links = Array.isArray(section.links)
        ? `<ul>${section.links
            .map(
              (link) =>
                `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`,
            )
            .join("")}</ul>`
        : "";

      return `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${items || links}
        </section>
      `;
    })
    .join("");

  return `
    <!-- SEO_STATIC_SHELL_START -->
    <div id="seo-static-shell" class="seo-static-shell">
      <main class="seo-shell-main">
        ${breadcrumbMarkup}
        <h1>${escapeHtml(entry.title)}</h1>
        <p>${escapeHtml(intro)}</p>
        ${sectionMarkup}
      </main>
    </div>
    <!-- SEO_STATIC_SHELL_END -->
  `;
}

export function buildGlobalSeoHeadExtras() {
  const apiBaseUrl = resolveApiBaseUrl();
  const apiOrigin = apiBaseUrl ? new URL(apiBaseUrl).origin : "";
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

  const lines = [
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<meta name="theme-color" content="#4F7B44" />',
    '<meta name="format-detection" content="telephone=yes" />',
    '<link rel="manifest" href="/site.webmanifest" />',
    '<link rel="icon" type="image/jpeg" href="/icons/rugan-logo.jpg" />',
    '<link rel="apple-touch-icon" href="/icons/rugan-logo.jpg" />',
    `<link rel="sitemap" type="application/xml" title="Sitemap" href="${SITE_URL}/sitemap.xml" />`,
    apiOrigin ? `<link rel="preconnect" href="${apiOrigin}" crossorigin />` : "",
    apiOrigin ? `<link rel="dns-prefetch" href="${apiOrigin}" />` : "",
    googleVerification
      ? `<meta name="google-site-verification" content="${googleVerification}" />`
      : "",
    bingVerification
      ? `<meta name="msvalidate.01" content="${bingVerification}" />`
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
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>`,
    );
    lines.push(
      `<script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaMeasurementId}', { send_page_view: false, anonymize_ip: true });
      </script>`,
    );
  }

  return lines.join("\n");
}
