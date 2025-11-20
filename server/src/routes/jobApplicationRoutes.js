// src/routes/jobApplicationRoutes.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // multer middleware
import {
  submitJobApplication,
  getAllJobApplications,
  getJobApplicationById,
  updateJobStatus,
  deleteJobApplication,
  downloadResume,
} from "../controllers/jobApplicationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Public Route
// ==========================
// Submit job application (with resume upload)
router.post("/", upload.single("resume"), submitJobApplication);

// ==========================
// Admin Routes (protected)
// ==========================
router.use(protect); // All routes below require login
router.use(admin);   // All routes below require admin

// Get all job applications
router.get("/", getAllJobApplications);
//
// Admin: Update status only
router.put("/:id/status", updateJobStatus);


// Download resume file (must be before '/:id')
router.get("/:id/download", downloadResume);

// Get single job application by ID
router.get("/:id", getJobApplicationById);

// Delete job application by ID
router.delete("/:id", deleteJobApplication);

export default router;
