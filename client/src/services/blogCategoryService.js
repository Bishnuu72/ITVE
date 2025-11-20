import axios from "axios";

// Base API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token automatically for admin routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Must match login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Blog Category API Methods
// ==========================

// 🟢 Get all blog categories (public or admin)
export const getAllCategories = async () => {
  const { data } = await api.get("/blog-category");
  return data;
};

// 🟢 Get blog category by ID
export const getCategoryById = async (id) => {
  if (!id) throw new Error("Category ID is required");
  const { data } = await api.get(`/blog-category/${id}`);
  return data;
};

// 🟢 Create new category (admin only)
export const createCategory = async (categoryData) => {
  if (!categoryData) throw new Error("Category data is required");
  const { data } = await api.post("/blog-category", categoryData);
  return data;
};

// 🟢 Update category by ID (admin only)
export const updateCategory = async (id, categoryData) => {
  if (!id) throw new Error("Category ID is required");
  const { data } = await api.put(`/blog-category/${id}`, categoryData);
  return data;
};

// 🟢 Delete category by ID (admin only)
export const deleteCategory = async (id) => {
  if (!id) throw new Error("Category ID is required");
  const { data } = await api.delete(`/blog-category/${id}`);
  return data;
};

export default api;