import express from "express";
import {
  addQRBalance,
  getAllQRBalances,
  getQRBalanceById,
  updateQRBalance,
  deleteQRBalance,
} from "../controllers/qrBalanceController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Use your middleware path

const router = express.Router();

// ✅ Create QR Balance (with photo upload)
router.post("/", protect, authorizeRoles("admin", "center"), upload.single("photo"), addQRBalance);

// ✅ Get all QR Balances
router.get("/", protect, authorizeRoles("admin", "center"), getAllQRBalances);

// ✅ Get QR Balance by ID
router.get("/:id", protect,  getQRBalanceById);

// ✅ Update QR Balance (with optional photo upload)
router.put("/:id", protect, authorizeRoles("admin", "center"), upload.single("photo"), updateQRBalance);

// ✅ Delete QR Balance
router.delete("/:id", protect, authorizeRoles("admin", "center"), deleteQRBalance);

export default router;