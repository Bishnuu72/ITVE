import axios from "axios";

// Base API URL from your .env file
const API_URL = import.meta.env.VITE_API_URL + "/online-exam";

// Helper function to attach JWT token
const getAuthConfig = () => {
    const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found. Please login.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ✅ Get all exams
export const getAllExams = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch exams" };
  }
};

// ✅ Get exam by ID
export const getExamById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch exam details" };
  }
};

// ✅ Create a new exam (Admin only)
export const createExam = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create exam" };
  }
};

// ✅ Update exam (Admin only)
export const updateExam = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update exam" };
  }
};

// ✅ Delete exam (Admin only)
export const deleteExam = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete exam" };
  }
};
