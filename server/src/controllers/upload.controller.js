import { randomUUID } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import { AppError } from "../middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer config — store in memory, we write to disk manually for more control
const storage = multer.memoryStorage();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed.", 400));
    }
  },
});

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError("No image file provided.", 400);
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    writeFileSync(filepath, req.file.buffer);

    const url = `/api/uploads/${filename}`;

    res.status(201).json({
      success: true,
      data: { url, filename },
    });
  } catch (err) {
    next(err);
  }
}
