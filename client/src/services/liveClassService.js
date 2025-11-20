import axios from "axios";

// ✅ Base URL from environment variable (example: http://localhost:4000/api/live-classes)
const API_URL = `${import.meta.env.VITE_API_URL}/live-classes`;

// ✅ Helper: attach Authorization token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("authToken"); // ✅ must match AuthContext
  if (!token) throw new Error("No token found. Please log in again.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ✅ Get all live classes (Admin protected)
export const getLiveClasses = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch live classes"
    );
  }
};

// ✅ Get a single live class by ID
export const getLiveClassById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch live class details"
    );
  }
};

// ✅ Add a new live class (Admin only)
export const addLiveClass = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to add live class"
    );
  }
};

// ✅ Update a live class (Admin only)
export const updateLiveClass = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update live class"
    );
  }
};

// ✅ Delete a live class (Admin only)
export const deleteLiveClass = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to delete live class"
    );
  }
};
