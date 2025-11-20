// src/services/contactService.js
import axios from "axios";

// Base URL from .env (Vite uses import.meta.env)
const API_URL = import.meta.env.VITE_API_URL;

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add JWT token to request headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// Contact API Methods
// =====================

// Submit a contact form (public)
export const submitContact = async (contactData) => {
  const { data } = await api.post("/contacts", contactData);
  return data; // { success, message, data }
};

// Get all contact messages (admin only)
export const getAllContacts = async () => {
  const { data } = await api.get("/contacts");
  return data.data; // return array of messages
};

// Get contact message by ID (admin only)
export const getContactById = async (id) => {
  const { data } = await api.get(`/contacts/${id}`);
  return data.data; // return single message object
};

// Mark message as read/unread (admin only)
export const markContactRead = async (id, read) => {
  const { data } = await api.put(`/contacts/${id}/read`, { read });
  return data.data; // updated message object
};

// Delete a contact message (admin only)
export const deleteContact = async (id) => {
  const { data } = await api.delete(`/contacts/${id}`);
  return data; // message with success status
};

export default api;
