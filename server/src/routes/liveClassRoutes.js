import express from "express";
import {
  getAllLiveClasses,
  getLiveClassById,
  createLiveClass,
  updateLiveClass,
  deleteLiveClass,
} from "../controllers/liveClassController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllLiveClasses);

// Protected route - admin only
router.post("/", protect, authorizeRoles("admin", "center"), createLiveClass);
router.put("/:id", protect, authorizeRoles("admin", "center"), updateLiveClass);
router.delete("/:id", protect, authorizeRoles("admin", "center"), deleteLiveClass);

// Get single class - protected but all logged-in users can view
router.get("/:id", protect, getLiveClassById);

export default router;
