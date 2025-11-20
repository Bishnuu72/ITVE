import express from "express";
import multer from "multer";
import path from "path";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDeletedStudents,
  restoreStudent,
  updateStudentStatus, // ✅ ADDED: Import the new status function
  updateAdmit,
  studentLogin, // ✅ NEW: Import for admit-only updates
} from "../controllers/StudentManagementController.js";
// ✅ NEW: Import PDF generation functions
import { generateAdmitCard, generateCertificate, generateIDCard, generateNewIDCard } from "../controllers/pdfController.js"; // Adjust path if pdfController is elsewhere

const router = express.Router();

// ✅ FIXED: Use absolute path for Multer (matches server.js static serving)
const uploadsPath = path.join(process.cwd(), "uploads"); // ✅ Absolute root
console.log("📁 Multer save path:", uploadsPath); // ✅ Debug

// 🛠️ Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); // ✅ Absolute path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    console.log(`📸 Saving ${file.fieldname} to ${uploadsPath}/${filename}`); // ✅ Debug save
    cb(null, filename);
  },
});

// ✅ File filter (unchanged)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/png", 
    "application/pdf",
    "application/msword"
  ];
  console.log(`📄 Uploaded ${file.fieldname} MIME: ${file.mimetype}`);
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file type for ${file.fieldname}! Only JPEG, PNG, PDF, and DOC allowed.`);
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ✅ Multer error handler (unchanged)
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File too large! Max size is 5MB.` });
    }
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  next(err);
};

// 📌 API Endpoints (Route order fixed from before)
router.get("/deleted", getDeletedStudents);
router.put("/:id/restore", restoreStudent);

router.post(
  "/",
  upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "eduProof", maxCount: 1 },
    { name: "questionPaper", maxCount: 1 }, // ✅ NEW: For create (future-proof)
    { name: "answerSheet", maxCount: 1 },   // ✅ NEW: For create (future-proof)
  ]),
  handleMulterError,
  createStudent
);

router.get("/", getAllStudents);

router.get("/:id", getStudentById);

// ✅ FIXED: Existing general update (with files/Multer)
router.put(
  "/:id",
  upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "eduProof", maxCount: 1 },
    { name: "questionPaper", maxCount: 1 }, // ✅ NEW: For update (question paper)
    { name: "answerSheet", maxCount: 1 },   // ✅ NEW: For update (answer sheet)
  ]),
  handleMulterError,
  updateStudent
);

// ✅ NEW: Dedicated route for admit updates (JSON only, no files/Multer)
router.put("/:id/admit", express.json(), updateAdmit); // Matches frontend: /api/students/:id/admit

router.delete("/:id", deleteStudent);

// ✅ NEW: Dynamic Status Update Route (PUT /api/students/:id/status)
router.put("/:id/status", express.json(), updateStudentStatus); // No Multer needed for status change

// ✅ NEW: PDF Generation Routes (after /:id to avoid conflicts)
router.get("/:id/admit-pdf", generateAdmitCard); // Matches frontend: /api/students/:id/admit-pdf
router.get("/:id/certificate-pdf", generateCertificate); // Matches frontend: /api/students/:id/certificate-pdf

// ✅ NEW: ID Card Routes
router.get("/:id/id-card-pdf", generateIDCard);
router.get("/:id/new-id-card-pdf", generateNewIDCard);

router.post("/student-login", studentLogin); // ✅ NEW: Student login route
console.log("Student Login route registered: POST /api/students/student-login");



export default router;