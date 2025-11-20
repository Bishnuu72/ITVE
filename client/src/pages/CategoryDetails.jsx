import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function CategoryDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch category details
        const categoryResponse = await fetch(`${API_BASE}/courses/categories/${id}`);
        if (!categoryResponse.ok) throw new Error("Failed to fetch category");
        const { data: categoryData } = await categoryResponse.json();
        setCategory(categoryData);

        // Fetch all courses and filter by category ID (client-side)
        const coursesResponse = await fetch(`${API_BASE}/courses`);
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses");
        const { data: allCourses } = await coursesResponse.json();
        const coursesInCategory = allCourses.filter(
          (course) => course.categoryType?._id === id
        );
        setCourses(coursesInCategory);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryAndCourses();
  }, [id]);

  if (loading) {
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

  if (error || !category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-center text-red-600 text-lg">Category not found or error loading data.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center">
        {/* 🔹 Full-width banner image */}
        <div className="relative w-full h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Course Categories Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0  bg-opacity-100 flex items-center justify-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold">
              📚 {category.name} Courses
            </h1>
          </div>
        </div>

        {/* 🧱 Grid of Cards */}
        <div className="py-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden w-[300px] mx-auto"
              >
                <div className="w-full h-52 relative">
                  {course.photo ? (
                    <img
                      src={`${API_BASE_URL}${course.photo}`}
                      alt={course.name}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = '<div class="w-full h-52 bg-gray-300 flex items-center justify-center text-sm text-gray-500">No Image</div>';
                      }}
                    />
                  ) : category.photo ? (
                    <img
                      src={`${API_BASE_URL}${category.photo}`}
                      alt={course.name}
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = '<div class="w-full h-52 bg-gray-300 flex items-center justify-center text-sm text-gray-500">No Image</div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-[15px] font-semibold text-gray-900 mb-2 leading-snug">
                    {course.name}
                  </h2>
                  <p className="text-sm text-gray-700">
                    <strong>Course Short Name:</strong> {course.shortName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Course Code:</strong> {course.code}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Course Type:</strong> {course.type}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Eligibility:</strong> {course.eligibility}
                  </p>
                  <div className="flex justify-between mb-3">
                    <button
                      onClick={() => navigate("/student-admission")}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Join Now
                    </button>
                  </div>
                  <button
                    onClick={() => navigate("/category-list")}
                    className="bg-red-500 hover:bg-red-600 w-full text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    List Of Categories
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg col-span-full">No courses found in this category.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}