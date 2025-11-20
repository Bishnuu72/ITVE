// routes/settingRoutes.js
import express from "express";
import {
  getAllSettings,
  getSettingById,
  createOrUpdateSettings,
  deleteSetting,
} from "../controllers/settingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Corrected import

const router = express.Router();

// ================= Public Routes =================
// Get all settings
router.get("/", getAllSettings);

// Get setting by ID
router.get("/:id", getSettingById);

// ================= Admin Routes =================
// Create or update settings (with file upload)
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createOrUpdateSettings
);

// Delete a setting by ID
router.delete("/:id", protect, admin, deleteSetting);

export default router;