import express from "express";
import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, admin, createNotice);
router.put("/:id", protect, admin, updateNotice);
router.delete("/:id", protect, admin, deleteNotice);

// Public route
router.get("/", getNotices);
router.get("/:id", getNoticeById);

export default router;