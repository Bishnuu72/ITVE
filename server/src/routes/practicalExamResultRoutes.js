import express from "express";
import {
  getPracticalResults,
  createPracticalResult,
  deletePracticalResult,
} from "../controllers/practicalExamResultController.js";

const router = express.Router();

router.get("/", getPracticalResults);
router.post("/", createPracticalResult);
router.delete("/:id", deletePracticalResult);

export default router;
