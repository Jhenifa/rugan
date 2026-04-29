const FREEMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
]);

function getEnvValue(name) {
  return process.env[name]?.trim() || "";
}

function getOriginFromUrl(urlValue) {
  if (!urlValue) return "";

  try {
    return new URL(urlValue).origin;
  } catch {
    return "";
  }
}

function extractEmailAddress(rawValue) {
  const value = rawValue?.trim() || "";
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] || value).trim().toLowerCase();
}

export function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}

export function getFrontendUrl() {
  return getEnvValue("FRONTEND_URL").replace(/\/+$/, "");
}

export function getAllowedOrigins() {
  const configuredOrigins = getEnvValue("CORS_ORIGIN")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = new Set(configuredOrigins);
  const frontendOrigin = getOriginFromUrl(getEnvValue("FRONTEND_URL"));

  if (frontendOrigin) origins.add(frontendOrigin);

  if (!isProductionEnv()) {
    origins.add("http://localhost:5173");
    origins.add("http://localhost:5174");
    origins.add("http://localhost:5175");
  }

  if (origins.size === 0) {
    origins.add("https://rugan.org");
    origins.add("https://www.rugan.org");
  }

  return [...origins];
}

export function isEmailConfigured() {
  return [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
  ].every((name) => Boolean(getEnvValue(name)));
}

export function isPaystackConfigured() {
  return Boolean(getEnvValue("PAYSTACK_SECRET_KEY"));
}

export function isGoogleSheetsConfigured() {
  return Boolean(
    getEnvValue("VOLUNTEER_SHEET_ID") && getEnvValue("GOOGLE_CREDENTIALS"),
  );
}

export function getVolunteerSheetUrl() {
  const spreadsheetId = getEnvValue("VOLUNTEER_SHEET_ID");
  return spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : "";
}

export function hasAdminBootstrapConfig() {
  return Boolean(getEnvValue("ADMIN_EMAIL") && getEnvValue("ADMIN_PASSWORD"));
}

export function getFeatureFlags() {
  return {
    email: isEmailConfigured(),
    paystack: isPaystackConfigured(),
    volunteerSheets: isGoogleSheetsConfigured(),
    adminBootstrap: hasAdminBootstrapConfig(),
  };
}

export function validateEnvironment() {
  const missingRequired = ["JWT_SECRET", "JWT_EXPIRES_IN", "FRONTEND_URL"]
    .filter((name) => !getEnvValue(name));

  if (isProductionEnv() && !getEnvValue("MONGODB_URI")) {
    missingRequired.push("MONGODB_URI");
  }

  if (missingRequired.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingRequired.join(", ")}`,
    );
  }

  if (isProductionEnv() && isEmailConfigured()) {
    const senderDomain = extractEmailAddress(getEnvValue("EMAIL_FROM"))
      .split("@")
      .pop();

    if (senderDomain && FREEMAIL_DOMAINS.has(senderDomain)) {
      console.warn(
        `EMAIL_FROM uses ${senderDomain}. Switch to a verified rugan.org sender in Brevo for production deliverability.`,
      );
    }
  }

  if (!getEnvValue("ADMIN_EMAIL")) {
    console.warn(
      "ADMIN_EMAIL is not configured. Admin notifications will not be sent.",
    );
  }

  if (
    Boolean(getEnvValue("VOLUNTEER_SHEET_ID")) !==
    Boolean(getEnvValue("GOOGLE_CREDENTIALS"))
  ) {
    console.warn(
      "Volunteer Sheets integration is partially configured. Set both VOLUNTEER_SHEET_ID and GOOGLE_CREDENTIALS.",
    );
  }

  if (!isPaystackConfigured()) {
    console.warn("PAYSTACK_SECRET_KEY is not configured. Card donations are disabled.");
  }

  if (!hasAdminBootstrapConfig()) {
    console.warn(
      "ADMIN_EMAIL and ADMIN_PASSWORD are not both configured. Admin bootstrap is disabled.",
    );
  }
}
