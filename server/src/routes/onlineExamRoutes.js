import express from "express";
import {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/onlineExamController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // ✅ Import protection middleware

const router = express.Router();

/**
 * @route   GET /api/online-exam
 * @desc    Get all exams
 * @access  Private/Admin
 */
router.get("/", protect, authorizeRoles("admin", "center"), getAllExams);

/**
 * @route   GET /api/online-exam/:id
 * @desc    Get exam by ID
 * @access  Private/Admin
 */
router.get("/:id", protect, authorizeRoles("admin", "center"), getExamById);

/**
 * @route   POST /api/online-exam
 * @desc    Create a new exam
 * @access  Private/Admin
 */
router.post("/", protect, authorizeRoles("admin", "center"), createExam);

/**
 * @route   PUT /api/online-exam/:id
 * @desc    Update an existing exam
 * @access  Private/Admin
 */
router.put("/:id", protect, authorizeRoles("admin", "center"), updateExam);

/**
 * @route   DELETE /api/online-exam/:id
 * @desc    Delete an exam
 * @access  Private/Admin
 */
router.delete("/:id", protect, authorizeRoles("admin", "center"), deleteExam);

export default router;
