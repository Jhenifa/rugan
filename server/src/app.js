import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { ensureAdminUser } from "./config/admin.js";
import { connectDB } from "./config/db.js";
import {
  getAllowedOrigins,
  getFeatureFlags,
  validateEnvironment,
} from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import partnershipRoutes from "./routes/partnership.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import contactRoutes from "./routes/contact.routes.js";

const app = express();

validateEnvironment();
const allowedOrigins = getAllowedOrigins();
const allowAllOrigins = allowedOrigins.includes("*");

await connectDB();
await ensureAdminUser();

app.set("trust proxy", 1);
app.use(helmet());
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
app.use(
  express.json({
    limit: "10mb",
    verify(req, _res, buffer) {
      req.rawBody = buffer.toString("utf8");
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    features: getFeatureFlags(),
  }),
);

app.use(notFound);
app.use(errorHandler);

export default app;
