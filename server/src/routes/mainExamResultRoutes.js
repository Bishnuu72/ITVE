import express from "express";
import {
  getMainResults,
  createMainResult,
  deleteMainResult,
} from "../controllers/mainExamResultController.js";

const router = express.Router();

router.get("/", getMainResults);
router.post("/", createMainResult);
router.delete("/:id", deleteMainResult);

export default router;
