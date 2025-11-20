import axios from "axios";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Axios instance
const api = axios.create({
  baseURL: `${API_URL}/settings`,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: prepend full URL to image paths
const prependFileUrl = (setting) => {
  if (!setting) return null;
  return {
    ...setting,
    logo: setting.logo ? `${UPLOADS_URL}/${setting.logo}` : null,
    qrCode: setting.qrCode ? `${UPLOADS_URL}/${setting.qrCode}` : null,
    signature: setting.signature ? `${UPLOADS_URL}/${setting.signature}` : null,
  };
};

// ================= CRUD OPERATIONS =================

// Get all settings (return latest or null)
export const getAllSettings = async () => {
  const res = await api.get("/");
  const data = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
  return prependFileUrl(data);
};

// Get setting by ID
export const getSettingById = async (id) => {
  const res = await api.get(`/${id}`);
  return prependFileUrl(res.data);
};

// Create or update setting (supports file upload)
export const createOrUpdateSetting = async (formData) => {
  const res = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const setting = res.data.settings || res.data;
  return prependFileUrl(setting);
};

// Delete a setting
export const deleteSetting = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data; // { message: "Setting deleted successfully" }
};