import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/sliders";
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Helper to attach JWT token
const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found. Please login.");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Get all sliders (public)
export const getSliders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch sliders" };
  }
};

// ✅ Add new slider (admin)
export const addSlider = async (formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.post(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add slider" };
  }
};

// ✅ Delete slider (admin)
export const deleteSlider = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete slider" };
  }
};

// ✅ Update slider (admin)
export const updateSlider = async (id, formData) => {
  try {
    const config = getAuthConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.put(`${API_URL}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update slider" };
  }
};

// ✅ Helper to get full image URL
export const getImageUrl = (filename) => `${UPLOADS_URL}/others/${filename}`;