import axios from "axios";

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

// ✅ Helper for error handling
const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  return { success: false, message: error.response?.data?.message || "Something went wrong" };
};

// ✅ Get all galleries (Public)
export const getGalleries = async () => {
  try {
    const response = await api.get("/gallery");
    return response?.data?.data || [];
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Get single gallery by ID (Public)
export const getGalleryById = async (id) => {
  try {
    const response = await api.get(`/gallery/${id}`);
    return response?.data?.data || null;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Add new gallery (Admin)
export const addGallery = async (formData) => {
  try {
    const response = await api.post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Update gallery (Admin)
export const updateGallery = async (id, formData) => {
  try {
    const response = await api.put(`/gallery/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Delete gallery (Admin)
export const deleteGallery = async (id) => {
  try {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ✅ Helper to get full image/video URL
export const getMediaUrl = (filename) => `${UPLOADS_URL}/gallery/${filename}`;

export default api;