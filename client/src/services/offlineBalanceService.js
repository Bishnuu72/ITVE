import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/offline-balance";
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// ✅ Helper to attach JWT token
const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found. Please login.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Add Offline Balance (with photo upload)
export const addOfflineBalance = async (formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add offline balance" };
  }
};

// ✅ Get All Offline Balances
export const getAllOfflineBalances = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch offline balances" };
  }
};

// ✅ Get Offline Balance by ID
export const getOfflineBalanceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch offline balance" };
  }
};

// ✅ Update Offline Balance (with photo upload)
export const updateOfflineBalance = async (id, formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.put(`${API_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update offline balance" };
  }
};

// ✅ Delete Offline Balance
export const deleteOfflineBalance = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete offline balance" };
  }
};

// ✅ Helper to get full image URL
export const getImageUrl = (filename) => `${UPLOADS_URL}/gallery/${filename}`;