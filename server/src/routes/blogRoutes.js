import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create blog (admin only, with image upload)
router.post("/", protect, admin, upload.single("image"), createBlog);

// Get all blogs (public)
router.get("/", getBlogs);

// Get blog by ID (public)
router.get("/:id", getBlogById);

// Update blog (admin only, with optional image upload)
router.put("/:id", protect, admin, upload.single("image"), updateBlog);

// Delete blog (admin only)
router.delete("/:id", protect, admin, deleteBlog);

export default router;