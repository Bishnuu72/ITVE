// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // JWT auth

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", protect, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword); 
router.put("/updatepassword", protect, updatePassword); // change own password

export default router;
