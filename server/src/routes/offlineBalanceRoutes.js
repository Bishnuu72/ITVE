import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  addOfflineBalance,
  getAllOfflineBalances,
  getOfflineBalanceById,
  updateOfflineBalance,
  deleteOfflineBalance,
} from "../controllers/offlineBalanceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ADMIN ROUTES
 */
// Add new offline balance
router.post("/", protect, admin, upload.single("photo"), addOfflineBalance);

// Get all offline balances
router.get("/", protect,  getAllOfflineBalances);

// Get offline balance by ID
router.get("/:id", protect,  getOfflineBalanceById);

// Update offline balance
router.put("/:id", protect, admin, upload.single("photo"), updateOfflineBalance);

// Delete offline balance
router.delete("/:id", protect, admin, deleteOfflineBalance);

export default router;
``