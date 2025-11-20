import axios from "axios";

// Base URLs from .env
const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Blog API Methods
// ==========================

// 🟢 Get all blogs
export const getAllBlogs = async () => {
  const { data } = await api.get("/blogs");
  return data;
};

// 🟢 Get blog by ID
export const getBlogById = async (id) => {
  if (!id) throw new Error("Blog ID is required");
  const { data } = await api.get(`/blogs/${id}`);
  return data;
};

// 🟢 Create new blog (with image)
export const createBlog = async (formData) => {
  const { data } = await api.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 🟢 Update blog by ID (with optional image)
export const updateBlog = async (id, formData) => {
  if (!id) throw new Error("Blog ID is required");
  const { data } = await api.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 🟢 Delete blog by ID
export const deleteBlog = async (id) => {
  if (!id) throw new Error("Blog ID is required");
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
};

// Export uploads URL for image preview
export const uploadsUrl = UPLOADS_URL;

export default api;