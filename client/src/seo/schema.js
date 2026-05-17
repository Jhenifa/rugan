import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE_PATH,
  ORGANIZATION_ADDRESS,
  ORGANIZATION_ALTERNATE_NAMES,
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_EMAIL,
  ORGANIZATION_FOUNDER,
  ORGANIZATION_FOUNDING_DATE,
  ORGANIZATION_LOGO_PATH,
  ORGANIZATION_SLOGAN,
  ORGANIZATION_TELEPHONE,
  SITE_LANGUAGE,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_NAVIGATION,
  SITE_SEARCH,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "./site.js";

function prune(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => prune(item))
      .filter((item) => item !== undefined && item !== null && item !== "");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, entryValue]) => [key, prune(entryValue)])
      .filter(([, entryValue]) => {
        if (entryValue === undefined || entryValue === null || entryValue === "") {
          return false;
        }

        if (Array.isArray(entryValue) && entryValue.length === 0) {
          return false;
        }

        return true;
      });

    return Object.fromEntries(entries);
  }

  return value;
}

export function toIsoDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

export function toAbsoluteImage(imagePath) {
  return absoluteUrl(imagePath || DEFAULT_IMAGE_PATH);
}

export function buildOrganizationSchema() {
  return prune({
    "@context": "https://schema.org",
    "@type": ["NGO", "NonprofitOrganization", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    alternateName: ORGANIZATION_ALTERNATE_NAMES,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absoluteUrl(ORGANIZATION_LOGO_PATH),
      contentUrl: absoluteUrl(ORGANIZATION_LOGO_PATH),
      caption: `${SITE_NAME} – ${SITE_LEGAL_NAME}`,
      inLanguage: SITE_LANGUAGE,
    },
    image: [absoluteUrl(DEFAULT_IMAGE_PATH)],
    email: ORGANIZATION_EMAIL,
    telephone: ORGANIZATION_TELEPHONE,
    description: ORGANIZATION_DESCRIPTION,
    slogan: ORGANIZATION_SLOGAN,
    foundingDate: ORGANIZATION_FOUNDING_DATE,
    founder: {
      "@type": "Person",
      name: ORGANIZATION_FOUNDER.name,
      url: ORGANIZATION_FOUNDER.url,
      jobTitle: ORGANIZATION_FOUNDER.jobTitle,
      sameAs: ORGANIZATION_FOUNDER.sameAs,
    },
    address: ORGANIZATION_ADDRESS,
    nonprofitStatus: "Nonprofit",
    sameAs: SOCIAL_PROFILES,
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    knowsAbout: [
      "Girls education",
      "Rural girl-child empowerment",
      "Menstrual health education",
      "Leadership development",
      "School outreaches",
      "Volunteer engagement",
      "Period poverty",
      "Girl-child advocacy",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: ORGANIZATION_EMAIL,
        telephone: ORGANIZATION_TELEPHONE,
        areaServed: "NG",
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "partnership enquiries",
        email: ORGANIZATION_EMAIL,
        telephone: ORGANIZATION_TELEPHONE,
        areaServed: "NG",
        availableLanguage: ["en"],
      },
    ],
  });
}

export function buildWebsiteSchema() {
  return prune({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: [SITE_LEGAL_NAME, "RUGAN Nigeria"],
    description: DEFAULT_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl(
          `${SITE_SEARCH.path}?${SITE_SEARCH.queryParam}={search_term_string}`,
        ),
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function buildSiteNavigationSchema() {
  return SITE_NAVIGATION.map((item) =>
    prune({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: item.name,
      url: absoluteUrl(item.path),
    }),
  );
}

export function buildBreadcrumbSchema(breadcrumbs = []) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return null;
  }

  return prune({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  });
}

export function buildWebPageSchema({
  url,
  title,
  description,
  image,
  pageType = "WebPage",
  breadcrumbs = [],
}) {
  const types = Array.from(
    new Set(Array.isArray(pageType) ? [...pageType, "WebPage"] : [pageType, "WebPage"]),
  );

  return prune({
    "@context": "https://schema.org",
    "@type": types,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
    },
    breadcrumb: breadcrumbs.length
      ? {
          "@id": `${url}#breadcrumb`,
        }
      : undefined,
  });
}

export function buildFaqSchema(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return prune({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

export function buildArticleSchema({
  url,
  title,
  description,
  image,
  authorName,
  publishedTime,
  modifiedTime,
  keywords = [],
  section,
}) {
  return prune({
    "@context": "https://schema.org",
    "@type": ["BlogPosting", "Article"],
    "@id": `${url}#article`,
    headline: title,
    description,
    image: [image],
    mainEntityOfPage: {
      "@id": `${url}#webpage`,
    },
    url,
    datePublished: toIsoDate(publishedTime),
    dateModified: toIsoDate(modifiedTime || publishedTime),
    author: {
      "@type": "Person",
      name: authorName || SITE_NAME,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    articleSection: section,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
    inLanguage: SITE_LANGUAGE,
  });
}

export function buildServiceSchema({
  name,
  description,
  url,
  image,
  serviceType,
  areaServed = "Nigeria",
  audience,
  providerName = SITE_NAME,
}) {
  if (!name || !description) {
    return null;
  }

  return prune({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    image,
    serviceType: serviceType || name,
    provider: {
      "@type": "Organization",
      name: providerName,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: areaServed,
    },
    audience: audience
      ? {
          "@type": "Audience",
          audienceType: audience,
        }
      : undefined,
  });
}

export function buildPersonSchema({ name, description, image, url, sameAs = [], jobTitle }) {
  if (!name) {
    return null;
  }

  return prune({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    image: image ? absoluteUrl(image) : undefined,
    url,
    sameAs,
    jobTitle,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
    },
  });
}
