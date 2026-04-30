import { Router } from "express";
import { upload, uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// POST /api/upload — upload a single image file
router.post("/", protect, upload.single("image"), uploadImage);

export default router;
