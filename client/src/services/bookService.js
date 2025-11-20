// src/services/bookService.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/books`; // http://localhost:4000/api/books

export const getBooks = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const getBookById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
  return response.data;
};

export const addBook = async (bookData) => {
  const response = await axios.post(API_URL, bookData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await axios.put(`${API_URL}/${id}`, bookData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBook = async (id) => {
  await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};