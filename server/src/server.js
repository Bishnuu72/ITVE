import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import FeedbackRoutes from "./routes/feedbackRoutes.js";
import studentAdmissionRoutes from "./routes/studentAdmissionRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import centerApplyRoutes from "./routes/centerApplyRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import liveClassRoutes from "./routes/liveClassRoutes.js";
import onlineExamRoutes from "./routes/onlineExamRoutes.js";
// import mainExamResultRoutes from "./routes/mainExamResultRoutes.js";
// import practicalExamResultRoutes from "./routes/practicalExamResultRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import blogCategoryRoutes from "./routes/blogCategoryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import pageRoutes from './routes/pageRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import settingRoutes from "./routes/settingRoutes.js";
import qrBalanceRoutes from "./routes/qrBalanceRoutes.js";
import offlineBalanceRoutes from "./routes/offlineBalanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import studentManagementRoutes from "./routes/StudentManagementRoutes.js";
import courseManagementRoutes from "./routes/CourseManagementRoutes.js";
import centreManagementRoutes from "./routes/CentreManagementRoutes.js";
import downloadRoutes from "./routes/DownloadListRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
// app.use(express.json());
// app.use(cors({
//   origin: `https://itveindia.vercel.app`, // frontend URL
//   credentials: true,
// }));

app.use(cors({
  origin: ["https://itveindia.vercel.app", "http://localhost:5173"],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// ✅ NEW: Create uploads directory if it doesn't exist (fixes Multer 500 errors)
const uploadsDir = path.join(__dirname, "uploads"); // Full path to uploads/ in project root
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads/ directory at: ${uploadsDir}`);
} else {
  console.log(`📁 uploads/ directory already exists at: ${uploadsDir}`);
}

// Static files (serve uploads after ensuring dir exists)
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedbacks", FeedbackRoutes);
app.use("/api/student-applications", studentAdmissionRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/center-apply", centerApplyRoutes);
// FIXED: Mount verification routes under /api/students (makes POST /api/students/verify work)
app.use("/api/students", verificationRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/live-classes", liveClassRoutes);
app.use("/api/online-exam", onlineExamRoutes);
// app.use("/api/main-exam-result", mainExamResultRoutes);
// app.use("/api/practical-exam-result", practicalExamResultRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use('/api/pages', pageRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/qr-balance", qrBalanceRoutes);
app.use("/api/offline-balance", offlineBalanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/students", studentManagementRoutes);
app.use("/api/courses", courseManagementRoutes);
app.use("/api/centres", centreManagementRoutes);
app.use("/api/downloads", downloadRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running and DB connected!" });
});

// FIXED: JSON-only 404 handler (returns JSON for unmatched routes, prevents HTML in frontend)
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `Route '${req.method} ${req.originalUrl}' not found` 
  });
});

// ✅ UPDATED: Enhanced error handler (better Multer error logging)
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err.stack);
  
  // ✅ NEW: Specific handling for Multer/FS errors
  let message = err.message || "Server Error";
  if (err.code === 'ENOENT') {
    message = "File system error: Directory not found (check uploads/)";
    console.error("🔍 Multer/FS Error Details:", err);
  } else if (err.name === 'MulterError') {
    message = `File upload error: ${err.message}`;
    console.error("🔍 Multer Error Details:", err);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message,
  });
});

// Connect DB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});