import express from "express";
import {
  addMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Ensure correct import

const router = express.Router();

// ✅ Route: Add a new message (with optional attachment)
router.post("/", upload.single("attachment"), addMessage);

// ✅ Route: Get all messages
router.get("/", getMessages);

// ✅ Route: Get single message by ID
router.get("/:id", getMessageById);

// ✅ Route: Update message by ID (with optional attachment)
router.put("/:id", upload.single("attachment"), updateMessage);

// ✅ Route: Delete message by ID
router.delete("/:id", deleteMessage);

export default router;
