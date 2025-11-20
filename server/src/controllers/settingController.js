// controllers/settingController.js
import Setting from "../models/Setting.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

// Helper: Delete old uploaded files safely
const deleteOldFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(uploadDir, filePath);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
};

// ================= GET ALL SETTINGS =================
export const getAllSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find().sort({ createdAt: -1 });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// ================= GET SETTING BY ID =================
export const getSettingById = async (req, res, next) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) return res.status(404).json({ message: "Setting not found" });
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

// ================= CREATE OR UPDATE SETTINGS =================
export const createOrUpdateSettings = async (req, res, next) => {
  try {
    const data = req.body;
    let settings = await Setting.findOne();

    // Handle uploaded files dynamically
    const files = req.files || {};
    const uploads = {};
    if (files.logo) uploads.logo = path.relative(uploadDir, files.logo[0].path);
    if (files.qrCode) uploads.qrCode = path.relative(uploadDir, files.qrCode[0].path);
    if (files.signature) uploads.signature = path.relative(uploadDir, files.signature[0].path);

    if (settings) {
      // Delete old files if replaced
      Object.keys(uploads).forEach((key) => {
        if (uploads[key] && settings[key]) deleteOldFile(settings[key]);
      });

      // Update existing settings
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        { ...data, ...uploads },
        { new: true }
      );

      return res.json({ message: "Settings updated successfully", settings });
    }

    // Create new settings
    const newSettings = new Setting({ ...data, ...uploads });
    await newSettings.save();
    res.status(201).json({ message: "Settings created successfully", settings: newSettings });
  } catch (error) {
    next(error);
  }
};

// ================= DELETE SETTINGS =================
export const deleteSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) return res.status(404).json({ message: "Setting not found" });

    // Delete associated files
    ["logo", "qrCode", "signature"].forEach((key) => {
      if (setting[key]) deleteOldFile(setting[key]);
    });

    await setting.deleteOne();
    res.json({ message: "Setting deleted successfully" });
  } catch (error) {
    next(error);
  }
};