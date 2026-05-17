import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";

import { ensureAdminUser } from "./config/admin.js";
import { connectDB } from "./config/db.js";
import {
  getAllowedOrigins,
  getFeatureFlags,
  validateEnvironment,
} from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { injectBlogMeta } from "./middleware/metaInjection.js";
// import { injectBaseMeta } from "./middleware/baseMetaInjection.js";

import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import sitemapRoutes from "./routes/sitemap.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import partnershipRoutes from "./routes/partnership.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let initializationPromise = null;

validateEnvironment();
const allowedOrigins = getAllowedOrigins();
const allowAllOrigins = allowedOrigins.includes("*");

export function initializeApp() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await connectDB();
      await ensureAdminUser();
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

app.set("trust proxy", 1);

// ── Security ──────────────────────────────────────────────
app.use(helmet());

// ── Compression (gzip all JSON/text responses) ────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowAllOrigins ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);

// ── Body parsing ──────────────────────────────────────────
app.use(
  express.json({
    limit: "10mb",
    verify(req, _res, buffer) {
      req.rawBody = buffer.toString("utf8");
    },
  }),
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Logging ───────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// ── Rate limiting ─────────────────────────────────────────
// General API limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET", // GETs are read-only, don't limit them
});

// Stricter limiter for form submissions (volunteer, partnership, newsletter)
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many submissions. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth brute-force protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again in 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/blog", limiter, blogRoutes);
app.use("/api/volunteers", formLimiter, volunteerRoutes);
app.use("/api/partnerships", formLimiter, partnershipRoutes);
app.use("/api/donations", limiter, donationRoutes);
app.use("/api/newsletter", formLimiter, newsletterRoutes);
app.use("/api/contact", formLimiter, contactRoutes);
app.use("/api/upload", limiter, uploadRoutes);
app.use("/api/analytics", limiter, analyticsRoutes);
app.use("/sitemap.xml", sitemapRoutes);

// ── SEO Meta Injection (for social crawlers) ─────────────
// This matches blog post URLs and serves index.html with injected tags
app.get("/blog/:slug", injectBlogMeta);

// Handle base pages (Home, About, etc.)
// const basePages = ["/about", "/team", "/programmes", "/impact", "/volunteers", "/partnership", "/blog", "/donate"];
// app.get(basePages, injectBaseMeta);

// ── Static Files ──────────────────────────────────────────
// Serve static files from the client build folder
app.use(express.static(path.resolve(__dirname, "../../client/dist"), { redirect: false }));
// Serve uploads folder
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));


// ── Health check (no rate limit) ─────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    features: getFeatureFlags(),
  }),
);

// ── Error handling ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
