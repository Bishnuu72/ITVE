import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/categories";
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// 🔐 Helper to attach JWT token
const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found. Please login.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * ✅ Get all categories (Public)
 */
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

/**
 * ✅ Get category by ID (Public)
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch category" };
  }
};

/**
 * ✅ Create category (Admin only)
 */
export const createCategory = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create category" };
  }
};

/**
 * ✅ Update category (Admin only)
 */
export const updateCategory = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update category" };
  }
};

/**
 * ✅ Delete category (Admin only)
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete category" };
  }
};

/**
 * ✅ Get full image URL
 */
export const getImageUrl = (path) => `${UPLOADS_URL}/${path}`;

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getImageUrl,
};