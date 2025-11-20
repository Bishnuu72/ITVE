import express from "express";
import {
  addFee,
  getFees,
  getFeeById,
  deleteFee,
  updateFee,
} from "../controllers/feeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc Admin/Center-only routes (protected with roles)
 */
router.post("/", protect, authorizeRoles("admin", "center"), addFee);
router.get("/", protect, authorizeRoles("admin", "center"), getFees);
router.put("/:id", protect, authorizeRoles("admin", "center"), updateFee);
router.delete("/:id", protect, authorizeRoles("admin", "center"), deleteFee);

/**
 * @desc Get fee by ID (admin, center, or owner/creator - protected, auth in controller)
 */
router.get("/:id", protect, getFeeById);

export default router;