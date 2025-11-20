import axios from "axios";

// Base URLs from .env
const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Axios instance with token interceptor
const api = axios.create({
  baseURL: `${API_URL}/pages`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Ensure token is stored as 'authToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Public APIs
export const getPublicPages = async () => {
  const { data } = await api.get("/public");
  return data;
};

export const getPublicPageById = async (id) => {
  const { data } = await api.get(`/public/${id}`);
  return data;
};

// ✅ Admin APIs
export const getAdminPages = async () => {
  const { data } = await api.get("/");
  return data;
};

export const getAdminPageById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createPage = async (formData) => {
  const { data } = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePage = async (id, formData) => {
  const { data } = await api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePage = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};

// ✅ Helper to get full image URL
export const getImageUrl = (filename) => `${UPLOADS_URL}/others/${filename}`;

export default api;