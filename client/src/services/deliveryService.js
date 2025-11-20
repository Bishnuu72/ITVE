// src/services/deliveryService.js
import axios from "axios";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL?.trim();
if (!BASE_URL) console.error("VITE_API_URL is not defined in .env");

const API_URL = `${BASE_URL}/deliveries`;

// Get all deliveries
export const getAllDeliveries = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    throw error;
  }
};

// Get delivery by ID
export const getDeliveryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching delivery with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Add a new delivery
export const addDelivery = async (deliveryData) => {
  try {
    const response = await axios.post(API_URL, deliveryData);
    return response.data;
  } catch (error) {
    console.error("Error adding delivery:", error.response || error);
    throw error;
  }
};

// Update an existing delivery
export const updateDelivery = async (id, deliveryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, deliveryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating delivery with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Delete a delivery
export const deleteDelivery = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting delivery with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Track a delivery by consignment ID
export const trackDelivery = async (consignmentId) => {
  try {
    const response = await axios.get(`${API_URL}/track/${consignmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error tracking delivery with consignment ID ${consignmentId}:`, error.response || error);
    throw error;
  }
};
