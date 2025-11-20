// src/services/feedbackService.js
import axios from "axios";

// Base URL from .env
const API_URL = import.meta.env.VITE_API_URL

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token to request headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // or whatever key you use
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// Feedback API Methods
// =====================

// Submit feedback (public)
export const submitFeedback = async (feedbackData) => {
  const { data } = await api.post("/feedbacks", feedbackData);
  return data;
};

// Get all feedbacks (admin only)
export const getAllFeedbacks = async () => {
  const { data } = await api.get("/feedbacks");
  return data;
};

// Get feedback by ID (admin only)
export const getFeedbackById = async (id) => {
  const { data } = await api.get(`/feedbacks/${id}`);
  return data;
};

// Mark feedback as read/unread (admin only)
export const markFeedbackRead = async (id, read) => {
  const { data } = await api.put(`/feedbacks/${id}/read`, { read });
  return data;
};

// Delete feedback (admin only)
export const deleteFeedback = async (id) => {
  const { data } = await api.delete(`/feedbacks/${id}`);
  return data;
};

export default api;
