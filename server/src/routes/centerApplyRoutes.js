// src/routes/centerApplyRoutes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // Multer middleware
import {
  applyForCenter,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/centerApplyController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * =============================
 * 📤 Public Route: Apply for Center (with file uploads)
 * =============================
 */

// ✅ File fields must exactly match your backend schema
const fileFields = [
  { name: "passportPhoto", maxCount: 1 },
  { name: "educationProof", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "aadhaarCard", maxCount: 1 },
  { name: "photoTheoryRoom", maxCount: 1 },
  { name: "photoPracticalRoom", maxCount: 1 },
  { name: "photoOfficeRoom", maxCount: 1 },
  { name: "photoCentreFront", maxCount: 1 },
  { name: "centreLogo", maxCount: 1 },
  { name: "signatureStamp", maxCount: 1 },
];

// Multer middleware
const cpUpload = upload.fields(fileFields);

// Public: Submit new center application
router.post("/", cpUpload, applyForCenter);

/**
 * =============================
 * 🔐 Admin Routes (Protected)
 * =============================
 */

// Get all applications
router.get("/", protect, admin, getAllApplications);

// Get single application by ID
router.get("/:id", protect, admin, getApplicationById);

// Update application (with file uploads)
router.put("/:id", protect, admin, upload.fields(fileFields), updateApplication);

// Delete application by ID
router.delete("/:id", protect, admin, deleteApplication);

export default router;
