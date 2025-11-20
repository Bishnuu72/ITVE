import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for fetched data
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course detail from backend
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/courses/${id}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const { data } = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-center text-gray-600 mt-10">Course not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* 🔹 Banner Section */}
        <div className="relative w-full h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
            alt="Course Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Course Details
            </h1>
          </div>
        </div>

        {/* 🔹 Details Section */}
        <div className="max-w-5xl mx-auto rounded-lg shadow-lg mt-10 p-8">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4 w-1/3">
                  Course Name
                </td>
                <td className="p-4 text-gray-800">{course.name}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Course Short Name
                </td>
                <td className="p-4 text-gray-800">{course.shortName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Course Code
                </td>
                <td className="p-4 text-gray-800">{course.code}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Course Type
                </td>
                <td className="p-4 text-gray-800">{course.type}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Duration
                </td>
                <td className="p-4 text-gray-800">{course.duration}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Eligibility
                </td>
                <td className="p-4 text-gray-800">{course.eligibility}</td>
              </tr>
              <tr>
                <td className="bg-gray-100 font-semibold text-gray-700 p-4">
                  Total Subjects
                </td>
                <td className="p-4 text-gray-800">{course.totalSubjects}</td>
              </tr>
            </tbody>
          </table>

          {/* 🔹 Back Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/course-list")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md text-sm font-medium shadow-md transition"
            >
              ← Back to Course List
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}