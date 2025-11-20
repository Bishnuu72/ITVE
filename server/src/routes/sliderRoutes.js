import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getAllSliders, addSlider, deleteSlider, updateSlider } from "../controllers/sliderController.js";
import upload from "../middleware/uploadMiddleware.js"; // multer setup

const router = express.Router();

// Public route to fetch sliders (for frontend display)
router.get("/", getAllSliders);

// Admin routes (protected)
// Use multer.fields to handle both 'photo' and 'logo' uploads
const multiUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "logo", maxCount: 1 }
]);

router.post("/", protect, admin, multiUpload, addSlider);
router.put("/:id", protect, admin, multiUpload, updateSlider);
router.delete("/:id", protect, admin, deleteSlider);

export default router;