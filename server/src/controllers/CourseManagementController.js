import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // ✅ NEW: For dir/file checks
import { Category, Course } from "../models/CourseManagementModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads"); // Absolute: project-root/uploads (matches routes)

// ===== CATEGORY CONTROLLER =====

// Get all categories (with search, non-deleted only)
export const getCategories = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? { 
          name: { $regex: search, $options: "i" },
          isDeleted: false
        }
      : { isDeleted: false };
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NEW: Get deleted categories (with search)
export const getDeletedCategories = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? { 
          name: { $regex: search, $options: "i" },
          isDeleted: true
        }
      : { isDeleted: true };
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    console.log(`👁️ Fetched category ID: ${category._id} (with photo: ${category.photo})`);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("❌ Get Category By ID Error:", error);
    res.status(500).json({ success: false, message: "Invalid ID format or server error" });
  }
};

// Add category (with logging)
export const addCategory = async (req, res) => {
  try {
    const { name, code, description, status = "Active" } = req.body;
    if (!name || !code) return res.status(400).json({ success: false, message: "Name and code required" });

    // ✅ NEW: Logging for debug
    console.log(`📁 UPLOADS_DIR exists? ${fs.existsSync(UPLOADS_DIR)}`);
    if (req.file) {
      console.log(`💾 Saving file: ${req.file.path} (URL: /uploads/${req.file.filename})`);
      // Verify file was written
      if (fs.existsSync(req.file.path)) {
        console.log(`✅ File saved successfully: ${req.file.path}`);
      } else {
        console.error(`❌ File not found after save: ${req.file.path}`);
      }
    }

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const category = new Category({ name, code, description, status, photo: photoPath });
    await category.save();
    console.log(`✅ Category added: ${category.name} (Photo URL: ${photoPath})`);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error("❌ Add Category Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category (with logging)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) {
      // ✅ NEW: Logging for update
      console.log(`📁 UPLOADS_DIR exists? ${fs.existsSync(UPLOADS_DIR)}`);
      console.log(`💾 Updating file: ${req.file.path} (URL: /uploads/${req.file.filename})`);
      if (fs.existsSync(req.file.path)) {
        console.log(`✅ Update file saved: ${req.file.path}`);
      } else {
        console.error(`❌ Update file not found: ${req.file.path}`);
      }
      updates.photo = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category || category.isDeleted) return res.status(404).json({ success: false, message: "Category not found" });
    console.log(`✅ Category updated: ${category.name} (Photo URL: ${category.photo})`);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error("❌ Update Category Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    console.log(`🗑️ Category soft-deleted: ${category.name}`);
    res.json({ success: true, message: "✅ Category moved to deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Restore category
export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    console.log(`♻️ Category restored: ${category.name}`);
    res.json({ success: true, message: "✅ Category restored!", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== COURSE CONTROLLER ===== (Unchanged except minor logging)
export const getCourses = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? { name: { $regex: search, $options: "i" }, deleted: false }
      : { deleted: false };
    const courses = await Course.find(query)
      .populate("categoryType", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeletedCourses = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? { name: { $regex: search, $options: "i" }, deleted: true }
      : { deleted: true };
    const courses = await Course.find(query)
      .populate("categoryType", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("categoryType", "name");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const {
      code,
      name,
      shortName,
      duration,
      type,
      categoryType,
      eligibility,
      totalSubjects,
      regFeeWithoutKit,
      regFeeWithKit,
      examQuestionPapers,
      semester = "No",
      semesterType = "None",
      details,
      subjects = "[]",
    } = req.body;

    if (!code || !name || !categoryType || !details)
      return res.status(400).json({ success: false, message: "Required fields missing" });

    const parsedSubjects = JSON.parse(subjects || "[]");

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const course = new Course({
      code,
      name,
      shortName,
      duration,
      type,
      categoryType,
      eligibility,
      totalSubjects: parseInt(totalSubjects),
      regFeeWithoutKit: parseFloat(regFeeWithoutKit),
      regFeeWithKit: parseFloat(regFeeWithKit),
      examQuestionPapers,
      semester,
      semesterType,
      details,
      photo: photoPath,
      subjects: parsedSubjects,
    });
    await course.save();
    await course.populate("categoryType", "name");
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.photo = `/uploads/${req.file.filename}`;

    if (updates.subjects) updates.subjects = JSON.parse(updates.subjects || "[]");

    if (updates.totalSubjects) updates.totalSubjects = parseInt(updates.totalSubjects);
    if (updates.regFeeWithoutKit) updates.regFeeWithoutKit = parseFloat(updates.regFeeWithoutKit);
    if (updates.regFeeWithKit) updates.regFeeWithKit = parseFloat(updates.regFeeWithKit);

    const course = await Course.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    await course.populate("categoryType", "name");
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    console.log(`🗑️ Course soft-deleted: ${course.name}`);
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, { deleted: false }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    console.log(`♻️ Course restored: ${course.name}`);
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};