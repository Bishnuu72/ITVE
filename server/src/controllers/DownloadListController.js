import Download from "../models/DownloadListModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration (save to /uploads/downloads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/downloads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Created downloads/ directory at: ${uploadDir}`);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Main file: PDF/Doc; Picture: Images only
    if (file.fieldname === "file" && (file.mimetype.startsWith("application/") || file.mimetype.includes("word") || file.mimetype.startsWith("image/"))) {
      cb(null, true);
    } else if (file.fieldname === "picture" && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. PDFs/Docs for file; Images for picture.`), false);
    }
  },
});

// GET all downloads (for admin list and client download page)
export const getAllDownloads = async (req, res) => {
  try {
    const { search, type, course } = req.query; // Optional filters (e.g., ?search=exam&type=Notice)
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (type) query.type = type;
    if (course) query.course = { $regex: course, $options: "i" }; // String search for course name

    const downloads = await Download.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: downloads,
      count: downloads.length,
    });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    res.status(500).json({ success: false, error: "Failed to fetch downloads" });
  }
};

// GET single download by ID
export const getDownloadById = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await Download.findById(id).lean();

    if (!download) {
      return res.status(404).json({ success: false, error: "Download not found" });
    }

    res.json({ success: true, data: download });
  } catch (error) {
    console.error("Error fetching download:", error);
    res.status(500).json({ success: false, error: "Failed to fetch download" });
  }
};

// POST create new download (with file and picture uploads)
export const createDownload = async (req, res) => {
  try {
    upload.fields([{ name: "file", maxCount: 1 }, { name: "picture", maxCount: 1 }])(req, res, async (err) => {
      // Enhanced Multer error handling to catch cast/validation errors early
      if (err) {
        console.error("Multer error:", err);
        // Check for specific Mongoose cast errors (though less likely now)
        if (err.name === 'CastError') {
          return res.status(400).json({ success: false, error: "Invalid course value. Please select a valid course." });
        }
        return res.status(400).json({ success: false, error: err.message });
      }

      const { type, name, description, course } = req.body;
      const filePath = req.files && req.files["file"] ? req.files["file"][0] : null;
      const picturePath = req.files && req.files["picture"] ? req.files["picture"][0] : null;

      // Validation
      if (!type || !name || !description || !filePath) {
        return res.status(400).json({ success: false, error: "Type, name, description, and file are required" });
      }
      if (!picturePath) {
        return res.status(400).json({ success: false, error: "Picture upload is required" });
      }

      // course is now a string (name), no casting needed
      const newDownload = new Download({
        type,
        name,
        file: `downloads/${filePath.filename}`,
        picture: `downloads/${picturePath.filename}`,
        description,
        course: course || "", // String course name (empty if none)
      });

      const savedDownload = await newDownload.save();

      console.log("✅ Download created:", savedDownload._id, "Course:", savedDownload.course); // Debug log

      res.status(201).json({
        success: true,
        message: "Download created successfully",
        data: savedDownload,
      });
    });
  } catch (error) {
    console.error("Error creating download:", error);
    // Handle any remaining validation/cast errors
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      const fieldError = Object.keys(error.errors)[0];
      return res.status(400).json({ 
        success: false, 
        error: `Invalid ${fieldError}: ${error.errors[fieldError].message}` 
      });
    }
    res.status(500).json({ success: false, error: "Failed to create download" });
  }
};

// PUT update download by ID (with optional file/picture re-upload)
export const updateDownload = async (req, res) => {
  try {
    const { id } = req.params;
    upload.fields([{ name: "file", maxCount: 1 }, { name: "picture", maxCount: 1 }])(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        if (err.name === 'CastError') {
          return res.status(400).json({ success: false, error: "Invalid course value. Please select a valid course." });
        }
        return res.status(400).json({ success: false, error: err.message });
      }

      const existing = await Download.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: "Download not found" });
      }

      // Delete old files if new ones uploaded
      if (req.files && req.files["file"] && existing.file) {
        const oldFilePath = path.join(__dirname, "../uploads", existing.file);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      if (req.files && req.files["picture"] && existing.picture) {
        const oldPicturePath = path.join(__dirname, "../uploads", existing.picture);
        if (fs.existsSync(oldPicturePath)) fs.unlinkSync(oldPicturePath);
      }

      const updateData = {
        type: req.body.type || existing.type,
        name: req.body.name || existing.name,
        description: req.body.description || existing.description,
        // course as string
        course: req.body.course || existing.course,
        isActive: req.body.isActive !== undefined ? req.body.isActive : existing.isActive,
      };

      if (req.files && req.files["file"]) updateData.file = `downloads/${req.files["file"][0].filename}`;
      if (req.files && req.files["picture"]) updateData.picture = `downloads/${req.files["picture"][0].filename}`;

      const updatedDownload = await Download.findByIdAndUpdate(id, updateData, { new: true });

      res.json({
        success: true,
        message: "Download updated successfully",
        data: updatedDownload,
      });
    });
  } catch (error) {
    console.error("Error updating download:", error);
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      const fieldError = Object.keys(error.errors)[0];
      return res.status(400).json({ 
        success: false, 
        error: `Invalid ${fieldError}: ${error.errors[fieldError].message}` 
      });
    }
    res.status(500).json({ success: false, error: "Failed to update download" });
  }
};

// DELETE download by ID (also delete file and picture)
export const deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({ success: false, error: "Download not found" });
    }

    // Delete files from disk
    if (download.file) {
      const filePath = path.join(__dirname, "../uploads", download.file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted file: ${filePath}`);
      }
    }
    if (download.picture) {
      const picturePath = path.join(__dirname, "../uploads", download.picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
        console.log(`🗑️ Deleted picture: ${picturePath}`);
      }
    }

    await Download.findByIdAndDelete(id);

    res.json({ success: true, message: "Download deleted successfully" });
  } catch (error) {
    console.error("Error deleting download:", error);
    res.status(500).json({ success: false, error: "Failed to delete download" });
  }
};

// GET download file by ID (forces download with attachment header)
export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const download = await Download.findById(id).lean();

    if (!download || !download.file) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", download.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "File not found on server" });
    }

    // Determine MIME type based on extension (simple fallback)
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Force download with attachment header
    res.setHeader('Content-Disposition', `attachment; filename="${download.name}${ext}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fs.statSync(filePath).size);

    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    console.log(`📥 File downloaded: ${download.name} (ID: ${id})`);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ success: false, error: "Failed to download file" });
  }
};