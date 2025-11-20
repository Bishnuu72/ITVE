import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/qr-balance";
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

// ✅ Get all QR balances
export const getAllQRBalances = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch QR balances" };
  }
};

// ✅ Get QR balance by ID
export const getQRBalanceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch QR balance" };
  }
};

// ✅ Add new QR balance
export const addQRBalance = async (formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add QR balance" };
  }
};

// ✅ Update QR balance
export const updateQRBalance = async (id, formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.put(`${API_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update QR balance" };
  }
};

// ✅ Delete QR balance
export const deleteQRBalance = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete QR balance" };
  }
};

// ✅ Helper to get full image URL
export const getImageUrl = (filename) => `${UPLOADS_URL}/gallery/${filename}`;