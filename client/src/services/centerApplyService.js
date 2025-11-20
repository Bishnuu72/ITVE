// src/services/centerApplyService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const submitCenterApplication = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/centres/online/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting center application:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit application');
  }
};

export const getNotices = async () => {
  // Placeholder - implement if needed
  return [];
};

export const getAllSettings = async () => {
  // Placeholder - implement if needed
  return { headBranchRegFee: 5000, centerRegFee: 3000 };
};