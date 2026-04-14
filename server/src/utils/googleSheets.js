import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load credentials from environment or file
let credentials;
try {
  credentials = JSON.parse(
    process.env.GOOGLE_CREDENTIALS ||
      fs.readFileSync(path.join(__dirname, "../../credentials.json"), "utf8"),
  );
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
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: { values },
    });
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw error;
  }
}

export default sheets;
