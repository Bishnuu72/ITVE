// src/middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure main uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in specific subfolders based on fieldname
    let folderName = "others"; // default folder
    if (file.fieldname === "resume") folderName = "resumes";
    if (file.fieldname === "image") folderName = "images";
    if (file.fieldname === "centerApply") folderName = "center-apply";

    // ✅ Added for gallery
    if (file.fieldname === "photo") folderName = "gallery/";
    if (file.fieldname === "videoFile") folderName = "gallery/";

    const folder = path.join(uploadDir, folderName);
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Timestamp + original name (sanitized)
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${sanitized}`);
  },
});

// ✅ File filter (Images + PDFs + Videos for gallery)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only images (jpeg, jpg, png), PDFs, and videos (mp4, mov, avi) are allowed"
      )
    );
  }
};

// ✅ File size limit (50 MB for videos)
const limits = {
  fileSize: 50 * 1024 * 1024, // 50 MB
};

// ✅ Export multer instance
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;