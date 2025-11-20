import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CourseList() {
  const navigate = useNavigate();

  // State for fetched data
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/courses`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const { data } = await response.json();
        setCourses(data || []);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // When user clicks "Details"
  const handleDetailsClick = (id) => {
    navigate(`/courses/${id}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="relative w-full md:h-50 mb-10">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
            alt="Courses Banner"
            className="w-full h-full object-cover"
          />
          {/* Overlay title on image */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Available Courses
            </h1>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {error ? (
            <p className="text-center text-red-600 py-10">Error loading courses. Please try again.</p>
          ) : courses.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Course Name</th>
                  <th className="py-3 px-4 text-left">Course Code</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {course.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{course.code}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDetailsClick(course._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-10">No courses available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}