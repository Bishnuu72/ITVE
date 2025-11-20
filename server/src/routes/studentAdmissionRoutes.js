import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  deleteStudent,
} from "../controllers/studentAdmissionController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================
// Public + Admin: Create student (with file uploads)
// ==========================
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "eduProof", maxCount: 1 },
  ]),
  createStudent
);

// ==========================
// Admin-only routes
// ==========================
// ✅ Only admins can view or delete student records
router.get("/", protect, admin, getStudents);       // Get all students
router.get("/:id", protect, admin, getStudentById); // Get student by ID
router.delete("/:id", protect, admin, deleteStudent); // Delete student

export default router;
