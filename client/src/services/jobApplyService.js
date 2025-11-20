// src/services/jobApplyService.js
import axios from "axios";

// Base URLs from .env
const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token for admin routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================
// Public: Submit Job Application
// ==========================
export const submitJobApplication = async (applicationData) => {
  const formData = new FormData();
  for (const key in applicationData) {
    if (applicationData[key] !== null && applicationData[key] !== undefined) {
      formData.append(key, applicationData[key]);
    }
  }

  const { data } = await api.post("/job-applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

// ==========================
// Admin: Get All Applications
// ==========================
export const getAllJobApplications = async () => {
  const { data } = await api.get("/job-applications");
  return data;
};

// ==========================
// Admin: Get Application by ID
// ==========================
export const getJobApplicationById = async (id) => {
  const { data } = await api.get(`/job-applications/${id}`);
  return data;
};

// ==========================
// Admin: Delete Application
// ==========================
export const deleteJobApplication = async (id) => {
  const { data } = await api.delete(`/job-applications/${id}`);
  return data;
};

// ==========================
// Admin: Download Resume (Direct URL)
// ==========================
export const downloadResume = (resumePath) => {
  if (!resumePath) return null;
  // Construct permanent URL
  return `${UPLOADS_URL}/${resumePath.replace(/^resumes[\\/]/, "resumes/")}`;
};

// ==========================
// Admin: Update Status Only
// ==========================
export const updateJobStatus = async (id, status) => {
  const { data } = await api.put(`/job-applications/${id}/status`, { status });
  return data;
};

export default api;
