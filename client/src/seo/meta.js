import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE_ALT,
  DEFAULT_IMAGE_PATH,
  SITE_LEGAL_NAME,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  normalizeCanonicalPath,
} from "./site.js";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildServiceSchema,
  buildSiteNavigationSchema,
  buildWebPageSchema,
  buildWebsiteSchema,
  toAbsoluteImage,
  toIsoDate,
} from "./schema.js";

function truncateDescription(value, maxLength = 160) {
  const text = String(value || "").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function buildSeoPayload({
  title,
  description,
  path = "/",
  url,
  image,
  imageAlt,
  type = "website",
  keywords,
  author,
  noindex = false,
  nofollow = false,
  pageType = "WebPage",
  breadcrumbs = [],
  faq = [],
  service = null,
  person = null,
  persons = [],
  article = null,
  publishedTime,
  modifiedTime,
  section,
  structuredData = [],
}) {
  const normalizedPath = normalizeCanonicalPath(url || path || "/");
  const canonicalUrl = absoluteUrl(normalizedPath);

  // Substack-like: For articles, the primary title should be the headline.
  // For other pages, we append the site name.
  const pageTitle =
    title && article
      ? title
      : title
        ? `${title} | ${SITE_NAME}`
        : `${SITE_LEGAL_NAME} (${SITE_NAME}) | Empowering Rural Girls`;

  const pageDescription = truncateDescription(description || DEFAULT_DESCRIPTION);
  const pageImage = toAbsoluteImage(image || DEFAULT_IMAGE_PATH);
  const pageImageAlt = imageAlt || title || DEFAULT_IMAGE_ALT;
  const pageKeywords =
    Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : keywords;
  const articleKeywords = Array.isArray(article?.keywords)
    ? article.keywords
    : Array.isArray(keywords)
      ? keywords
      : String(keywords || "")
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean);

  const robots = noindex
    ? `noindex, ${nofollow ? "nofollow" : "follow"}, noarchive, nosnippet`
    : `index, ${nofollow ? "nofollow" : "follow"}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`;

  const graph = [
    buildOrganizationSchema(),
    buildWebsiteSchema(),
    ...buildSiteNavigationSchema(),
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  if (breadcrumbSchema) {
    breadcrumbSchema["@id"] = `${canonicalUrl}#breadcrumb`;
    graph.push(breadcrumbSchema);
  }

  graph.push(
    buildWebPageSchema({
      url: canonicalUrl,
      title: pageTitle,
      description: pageDescription,
      image: pageImage,
      pageType,
      breadcrumbs,
    }),
  );

  const faqSchema = buildFaqSchema(faq);
  if (faqSchema) {
    graph.push(faqSchema);
  }

  const serviceSchema = service
    ? buildServiceSchema({
        ...service,
        url: canonicalUrl,
        image: pageImage,
      })
    : null;
  if (serviceSchema) {
    graph.push(serviceSchema);
  }

  const personSchema = person ? buildPersonSchema(person) : null;
  if (personSchema) {
    graph.push(personSchema);
  }

  if (Array.isArray(persons) && persons.length > 0) {
    graph.push(
      ...persons
        .map((item) => buildPersonSchema(item))
        .filter(Boolean),
    );
  }

  const articleSchema = article
    ? buildArticleSchema({
        url: canonicalUrl,
        title,
        description: pageDescription,
        image: pageImage,
        authorName: article.authorName || author,
        publishedTime: article.publishedTime || publishedTime,
        modifiedTime: article.modifiedTime || modifiedTime,
        keywords: article.keywords || articleKeywords,
        section: article.section || section,
      })
    : null;
  if (articleSchema) {
    graph.push(articleSchema);
  }

  if (Array.isArray(structuredData) && structuredData.length > 0) {
    graph.push(...structuredData.filter(Boolean));
  }

  return {
    author,
    canonicalUrl,
    graph,
    imageAlt: pageImageAlt,
    imageUrl: pageImage,
    keywords: pageKeywords,
    locale: SITE_LOCALE,
    pageDescription,
    pageTitle,
    publishedTimeIso: toIsoDate(article?.publishedTime || publishedTime),
    modifiedTimeIso: toIsoDate(article?.modifiedTime || modifiedTime),
    robots,
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    type: article ? "article" : type,
    section: article?.section || section,
    articleTags: articleKeywords,
  };
}
