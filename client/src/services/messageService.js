import axios from "axios";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL?.trim();
if (!BASE_URL) {
  console.error("VITE_API_URL is not defined in .env");
}

const API_URL = `${BASE_URL}/messages`;

// ✅ Get all messages
export const getAllMessages = async () => {
  try {
    const response = await axios.get(API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching messages:", error.response?.data || error.message || error);
    throw error;
  }
};

// ✅ Get message by ID
export const getMessageById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching message with ID ${id}:`, error.response?.data || error.message || error);
    throw error;
  }
};

// ✅ Add a new message
export const addMessage = async (messageData) => {
  try {
    const formData = new FormData();
    Object.keys(messageData).forEach((key) => {
      if (messageData[key] !== null && messageData[key] !== undefined) {
        formData.append(key, messageData[key]);
      }
    });

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding message:", error.response?.data || error.message || error);
    throw error;
  }
};

// ✅ Update an existing message
export const updateMessage = async (id, messageData) => {
  try {
    const formData = new FormData();
    Object.keys(messageData).forEach((key) => {
      if (messageData[key] !== null && messageData[key] !== undefined) {
        formData.append(key, messageData[key]);
      }
    });

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating message with ID ${id}:`, error.response?.data || error.message || error);
    throw error;
  }
};

// ✅ Delete message
export const deleteMessage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting message with ID ${id}:`, error.response?.data || error.message || error);
    throw error;
  }
};
