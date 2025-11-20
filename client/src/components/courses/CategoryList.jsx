import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:4000/api";
const API_BASE = import.meta.env.VITE_API_URL;

function CourseCategory() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/courses/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const { data } = await response.json();
        setCategories(data || []);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on search (client-side)
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="min-h-screen bg-gray-50">
 
       {/* 🔹 Full-width banner image */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="Course Categories Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  bg-opacity-100 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            📚 Course Categories
          </h1>
        </div>
      </div>

        {/* 🔍 Search Bar */}
        <div className="max-w-4xl mx-auto mt-10 px-6">
          <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4">
            <input
              type="text"
              placeholder="🔍 Search category by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-gray-700 text-base px-2"
            />
          </div>
        </div>

        {/* 🔹 Category Grid */}
        <div className="py-12 px-6 max-w-7xl mx-auto">
          {error ? (
            <p className="text-center text-red-600 mt-12 text-lg">
              Error loading categories. Please try again.
            </p>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden w-[300px] mx-auto"
                >
                  <div className="w-full h-52 relative">
                    {cat.photo ? (
                      <img
                        src={`http://localhost:4000${cat.photo}`}
                        alt={cat.name}
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
                      {cat.name}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {cat.description}
                    </p>
                    <button
                      onClick={() => navigate(`/category-details/${cat._id}`)}
                      className="bg-red-500 hover:bg-red-600 w-full text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-12 text-lg">
              No categories found matching your search.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CourseCategory;