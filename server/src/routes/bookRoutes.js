// src/routes/bookRoutes.js
import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Protected (adjust as needed)
router.get("/", protect, getAllBooks);                    // Admin + logged in users
router.get("/:id", protect, getBookById);

// Admin only
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  createBook
);

router.put(
  "/:id",
  protect,
  admin,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  updateBook
);

router.delete("/:id", protect, admin, deleteBook);

export default router;