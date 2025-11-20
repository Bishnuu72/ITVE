import express from "express";
import {
  getAllDownloads,
  getDownloadById,
  createDownload,
  updateDownload,
  deleteDownload,
  downloadFile, // ✅ FIXED: Imported the new downloadFile function
} from "../controllers/DownloadListController.js";

const router = express.Router();

// GET /api/downloads - Get all downloads (with optional filters)
router.get("/", getAllDownloads);

// GET /api/downloads/:id - Get single download
router.get("/:id", getDownloadById);

// ✅ FIXED: GET /api/downloads/:id/download - Force download file (new endpoint)
router.get("/:id/download", downloadFile);

// POST /api/downloads - Create new download (multipart/form-data with file and picture)
router.post("/", createDownload);

// PUT /api/downloads/:id - Update download
router.put("/:id", updateDownload);

// DELETE /api/downloads/:id - Delete download
router.delete("/:id", deleteDownload);

export default router;