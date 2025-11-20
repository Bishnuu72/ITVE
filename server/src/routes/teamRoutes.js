import express from "express";
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/", protect, getAllTeamMembers);
router.get("/:id", protect, getTeamMemberById);

// Admin-only routes with image upload
router.post("/", protect, admin, upload.single("image"), createTeamMember);
router.put("/:id", protect, admin, upload.single("image"), updateTeamMember);
router.delete("/:id", protect, admin, deleteTeamMember);

export default router;