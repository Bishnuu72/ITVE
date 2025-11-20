import { Router } from "express";
import {
  addGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// ✅ Admin routes
router.post(
  "/",
  protect,
  admin,
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "videoFile", maxCount: 1 }]),
  addGallery
);

router.put(
  "/:id",
  protect,
  admin,
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "videoFile", maxCount: 1 }]),
  updateGallery
);

router.delete("/:id", protect, admin, deleteGallery);

// ✅ Public routes
router.get("/", getGalleries);
router.get("/:id", getGalleryById);

export default router;
