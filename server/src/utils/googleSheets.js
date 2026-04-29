import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseMultilineGoogleCredentials(envFilePath) {
  if (!fs.existsSync(envFilePath)) return null;

  const rawEnv = fs.readFileSync(envFilePath, "utf8");
  const marker = "GOOGLE_CREDENTIALS=";
  const start = rawEnv.indexOf(marker);

  if (start === -1) return null;

  const jsonStart = rawEnv.indexOf("{", start);
  if (jsonStart === -1) return null;

  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let i = jsonStart; i < rawEnv.length; i += 1) {
    const char = rawEnv[i];

    if (escaping) {
      escaping = false;
      continue;
    }

    if (char === "\\") {
      escaping = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      return JSON.parse(rawEnv.slice(jsonStart, i + 1));
    }
  }

  return null;
}

// Load credentials from environment or file
let credentials;
try {
  const envCredentials = process.env.GOOGLE_CREDENTIALS?.trim();
  const envFilePath = path.join(__dirname, "../../.env");
  const credentialsFilePath = path.join(__dirname, "../../credentials.json");

  if (envCredentials) {
    try {
      credentials = JSON.parse(envCredentials);
    } catch {
      credentials = null;
    }
  }

  if (!credentials) {
    credentials = parseMultilineGoogleCredentials(envFilePath);
  }

  if (!credentials && fs.existsSync(credentialsFilePath)) {
    credentials = JSON.parse(fs.readFileSync(credentialsFilePath, "utf8"));
  }
} catch (error) {
  console.warn(
    "Google Sheets credentials not found. Volunteer form will not save to spreadsheet.",
  );
  credentials = null;
}

let auth = null;
if (credentials) {
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

const sheets = auth ? google.sheets({ version: "v4", auth }) : null;

export async function appendToSheet(spreadsheetId, range, values) {
  if (!sheets) {
    console.warn("Google Sheets not configured. Skipping spreadsheet update.");
    return;
  }
  try {
    const [sheetName, columns = "A:H"] = range.split("!");
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${columns}`,
    });

    const nextRow = (existing.data.values?.length || 0) + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${nextRow}:H${nextRow}`,
      valueInputOption: "RAW",
      resource: { values },
    });
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw error;
  }
}

export default sheets;
