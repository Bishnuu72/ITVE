// src/routes/feedbackRoutes.js
import express from "express";
import {
  submitFeedback,
  getAllFeedbacks,
  getFeedbackById,
  markFeedbackRead,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", submitFeedback);

// Admin only
router.get("/", protect, admin, getAllFeedbacks);
router.get("/:id", protect, admin, getFeedbackById);
router.put("/:id/read", protect, admin, markFeedbackRead);
router.delete("/:id", protect, admin, deleteFeedback);

export default router;
