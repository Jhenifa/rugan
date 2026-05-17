export const SITE_NAME = "RUGAN";
export const SITE_LEGAL_NAME = "The Rural Girl-Child Advancement Network";
export const SITE_URL = "https://rugan.org";
export const SITE_LANGUAGE = "en-NG";
export const SITE_LOCALE = "en_NG";
export const DEFAULT_IMAGE_PATH = "/images/homepage/Hero.jpg";
export const DEFAULT_IMAGE_ALT =
  "RUGAN empowering rural girls through education and community programmes in Nigeria";
export const DEFAULT_DESCRIPTION =
  "The Rural Girl-Child Advancement Network (RUGAN) empowers rural girls in Nigeria through quality education, menstrual health dignity, mentorship, advocacy, and leadership development.";
export const ORGANIZATION_DESCRIPTION =
  "The Rural Girl-Child Advancement Network (RUGAN) is a Nigerian nonprofit dedicated to advancing education, menstrual health, and leadership opportunities for rural girls in underserved communities.";
export const ORGANIZATION_FOUNDING_DATE = "2022-11-01";
export const ORGANIZATION_EMAIL = "info@rugan.org";
export const ORGANIZATION_TELEPHONE = "+2348143158700";
export const ORGANIZATION_LOGO_PATH = "/icons/favicon.jpg";
export const ORGANIZATION_FOUNDER = {
  name: "Fidel Bethel Nnadi",
  url: `${SITE_URL}/team`,
};

export const SOCIAL_PROFILES = [
  "https://www.facebook.com/share/1E1x2wHhog/?mibextid=wwXIfr",
  "https://www.youtube.com/@therugannigeria",
  "https://www.instagram.com/theruralgirladvancementnetwork?igsh=dWw5cGtyZGhrOTd0",
  "https://www.linkedin.com/company/theruralgirlchildadvancementnetwork/",
];

export const SITE_NAVIGATION = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Team", path: "/team" },
  { name: "Programmes", path: "/programmes" },
  { name: "Impact", path: "/impact" },
  { name: "Volunteer", path: "/volunteers" },
  { name: "Partnership", path: "/partnership" },
  { name: "Blog", path: "/blog" },
  { name: "Donate", path: "/donate" },
];

export const SITE_SEARCH = {
  path: "/blog",
  queryParam: "query",
};

export function absoluteUrl(pathname = "/") {
  const raw = String(pathname || "").trim();

  if (!raw) return SITE_URL;
  if (/^(?:[a-z]+:)?\/\//i.test(raw)) return raw;

  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function normalizeCanonicalPath(pathname = "/") {
  const raw = String(pathname || "/").trim() || "/";
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;

  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.replace(/\/+$/, "");
}
