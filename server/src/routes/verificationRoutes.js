import express from "express";
import { verifyStaff, verifyCenter, verifyStudent, verifyStudentForDownload, verifyStudentResult, verifyDocument } from "../controllers/verificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Staff (protected)
router.post("/staff", protect, verifyStaff);

// Center (protected)
router.post("/center", protect, verifyCenter);

// Student (public)
router.post("/verify", verifyStudent); // Matches frontend POST /api/students/verify
router.post("/verify-download", verifyStudentForDownload);  // New endpoint
router.post("/verify-result", verifyStudentResult);  // New endpoint
router.post("/verify-document", verifyDocument);


export default router;