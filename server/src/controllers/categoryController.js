import Category from "../models/Category.js";
import path from "path";

/**
 * ✅ Normalize photo path to be relative to /uploads
 */
const normalizePhotoPath = (fullPath) => {
  const parts = fullPath.replace(/\\/g, "/").split("uploads/");
  return parts[1] || null;
};

// ✅ Create Category
export const createCategory = async (req, res) => {
  try {
    const {
      title,
      name,
      code,
      type,
      duration,
      eligibility,
      description,
      status,
    } = req.body;

    const photo = req.file ? normalizePhotoPath(req.file.path) : null;

    const category = new Category({
      title,
      name,
      code,
      type,
      duration,
      eligibility,
      description,
      status,
      photo,
    });

    await category.save();
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Category
export const updateCategory = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.photo = normalizePhotoPath(req.file.path);
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};