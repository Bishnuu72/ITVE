import express from "express";
import {
  addDelivery,
  getDeliveries,
  getDeliveryById,
  trackDelivery,
  updateDelivery,
  deleteDelivery
} from "../controllers/deliveryController.js";

const router = express.Router();

router.post("/", addDelivery);
router.get("/", getDeliveries);
router.get("/:id", getDeliveryById); // ✅ Required for frontend getDeliveryById
router.get("/track/:consignmentId", trackDelivery);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

export default router;
