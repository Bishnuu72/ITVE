import axios from "axios";

// Base API URL from your .env file
const API_URL = import.meta.env.VITE_API_URL + "/notices";

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

// ✅ Public: Get all notices
export const getNotices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching notices:", error);
    throw error.response?.data || { message: "Failed to fetch notices" };
  }
};

// ✅ Public: Get single notice by ID
export const getNoticeById = async (id) => {
  if (!id) {
    console.error("getNoticeById called with undefined ID");
    throw new Error("Notice ID is required");
  }
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notice with ID ${id}:`, error);
    throw error.response?.data || { message: "Failed to fetch notice details" };
  }
};

// ✅ Admin: Create a new notice
export const createNotice = async (data) => {
  try {
    const response = await axios.post(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error creating notice:", error);
    throw error.response?.data || { message: "Failed to create notice" };
  }
};

// ✅ Admin: Update an existing notice
export const updateNotice = async (id, data) => {
  if (!id) {
    console.error("updateNotice called with undefined ID");
    throw new Error("Notice ID is required for update");
  }
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error updating notice with ID ${id}:`, error);
    throw error.response?.data || { message: "Failed to update notice" };
  }
};

// ✅ Admin: Delete a notice
export const deleteNotice = async (id) => {
  if (!id) {
    console.error("deleteNotice called with undefined ID");
    throw new Error("Notice ID is required for deletion");
  }
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error deleting notice with ID ${id}:`, error);
    throw error.response?.data || { message: "Failed to delete notice" };
  }
};