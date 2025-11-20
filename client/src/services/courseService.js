import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_APP_UPLOADS_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Attach token if needed (from AddCourse context, assuming admin auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for error handling
const handleError = (error) => {
  console.error("API Error:", error.response?.data || error.message);
  return { success: false, message: error.response?.data?.message || "Something went wrong" };
};

// Get all courses (enhanced with logging)
export const getCourses = async () => {
  try {
    const response = await api.get("/courses");
    const data = response?.data?.data || [];
    console.log("🔍 Fetched courses data (full response):", data); // DEBUG: Log ALL course objects to see fields like 'photo', 'image', 'name', 'details'
    data.forEach((course, index) => {
      console.log(`Course ${index + 1} fields:`, {
        _id: course._id,
        name: course.name,
        code: course.code,
        photo: course.photo,
        image: course.image, // Check if backend uses 'image' instead
        details: course.details
      }); // DEBUG: Per-course key fields
    });
    return data;
  } catch (error) {
    console.error("❌ getCourses error:", error); // DEBUG
    return handleError(error);
  }
};

// Enhanced helper to get full course image URL with fallbacks and logging
export const getCourseMediaUrl = (filename) => {
  if (!filename) {
    console.warn("⚠️ No filename provided for course image (photo/image is null/undefined)"); // DEBUG
    return null; // Triggers placeholder in component
  }

  // Try 'photo' or 'image' if passed as object, but assume filename string
  const cleanFilename = String(filename).replace(/^\/uploads\/courses\//i, '').replace(/^uploads\/courses\//i, '').replace(/^\/uploads\//i, '');

  if (!cleanFilename) {
    console.warn("⚠️ Invalid filename after cleaning:", filename); // DEBUG
    return null;
  }

  // Try multiple common URL patterns (log each)
  const possibleUrls = [
    `${UPLOADS_URL}/uploads/courses/${cleanFilename}`, // Direct static (e.g., http://localhost:4000/uploads/courses/test.jpg)
    `${UPLOADS_URL}/api/uploads/courses/${cleanFilename}`, // Via API route
    `${UPLOADS_URL}/uploads/${cleanFilename}` // Generic uploads if no /courses subfolder
  ];

  console.log(`🖼️ Attempting course image URLs for "${cleanFilename}":`, possibleUrls); // DEBUG: See in console

  // Return the first (most common); test and change index if needed (e.g., possibleUrls[1] if API route works)
  const url = possibleUrls[0];
  console.log(`📍 Selected URL for image: ${url}`); // DEBUG
  return url;
};

export default api;