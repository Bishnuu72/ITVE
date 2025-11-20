import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected admin routes
router.post("/", protect, admin, upload.single("photo"), createCategory);
router.put("/:id", protect, admin, upload.single("photo"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

// 🌐 Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

export default router;
