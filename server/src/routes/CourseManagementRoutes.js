import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getDeletedCategories, // ✅ NEW: Import for deleted categories
  getCourses,
  getDeletedCourses,
  getCourseDetail,
  addCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
} from "../controllers/CourseManagementController.js";

// Compute __dirname for absolute paths (this file is in /routes/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads"); // Absolute: project-root/uploads

console.log(`📁 Multer will save to: ${UPLOADS_DIR}`); // ✅ NEW: Log on startup

// Multer config (absolute destination)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Absolute path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
});

const router = express.Router();

// ===== CATEGORY ROUTES =====
router.get("/categories", getCategories);
router.get("/categories/deleted", getDeletedCategories); // ✅ NEW: Route for deleted categories
router.get("/categories/:id", getCategoryById);
router.post("/categories", upload.single("photo"), addCategory);
router.put("/categories/:id", upload.single("photo"), updateCategory);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id/restore", restoreCategory);

// ===== COURSE ROUTES =====
router.get("/", getCourses);
router.get("/deleted", getDeletedCourses);
router.get("/:id", getCourseDetail);
router.post("/", upload.single("photo"), addCourse);
router.put("/:id", upload.single("photo"), updateCourse);
router.delete("/:id", deleteCourse);
router.put("/:id/restore", restoreCourse);


export default router;