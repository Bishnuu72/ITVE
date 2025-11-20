import express from "express";
import {
  submitContact,
  getAllContacts,
  getContactById,
  markContactRead,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protect, admin, getAllContacts);
router.get("/:id", protect, admin, getContactById);
router.put("/:id/read", protect, admin, markContactRead);
router.delete("/:id", protect, admin, deleteContact);

export default router;
