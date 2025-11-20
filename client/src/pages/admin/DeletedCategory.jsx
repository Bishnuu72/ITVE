import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function DeletedCategories() {
  const [search, setSearch] = useState("");
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch deleted categories only
  const fetchDeletedCategories = async (searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/courses/categories/deleted${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch deleted categories");
      const { data } = await response.json();
      setDeletedCategories(data || []);
    } catch (err) {
      setError(err.message);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDeletedCategories(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle search button click
  const handleSearch = () => {
    fetchDeletedCategories(search);
  };

  // Restore action (unmarks deleted, refreshes list)
  const handleRestore = async (id) => {
    if (window.confirm("Are you sure you want to restore this category?")) {
      try {
        const response = await fetch(`${API_BASE}/courses/categories/${id}/restore`, { method: "PUT" });
        if (!response.ok) throw new Error("Failed to restore");
        alert("✅ Category restored to Categories list!");
        fetchDeletedCategories(search); // Refresh (category disappears from deleted list)
      } catch (err) {
        alert(`❌ Error: ${err.message}`);
      }
    }
  };

  // Photo Error Handler
  const handlePhotoError = (e, fullPath) => {
    const filename = fullPath.replace(/^\/uploads\//, '');
    console.error(`❌ Photo load failed for ${fullPath}: 404 - File not found at /uploads/${filename}`);
    if (e?.target) {
      e.target.style.display = "none";
      const parent = e.target.parentElement;
      if (parent) {
        parent.innerHTML = '<div class="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 mx-auto">No Photo</div>';
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        {/* Content - Scrollable only if needed */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Deleted Categories
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  GO
                </button>
              </div>
            </div>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">Error: {error}</div>}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center w-16">Photo</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedCategories.map((c, index) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {c.photo ? (
                          <img
                            src={`${API_BASE_URL}${c.photo}`}
                            alt="Category"
                            className="w-12 h-12 object-cover rounded-md mx-auto"
                            onError={(e) => handlePhotoError(e, c.photo)}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 mx-auto">
                            No Photo
                          </div>
                        )}
                      </td>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2 text-center">{c.code}</td>
                      <td className="border p-2">
                        {c.description || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleRestore(c._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                        >
                          ♻️ Restore
                        </button>
                      </td>
                    </tr>
                  ))}

                  {deletedCategories.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-500 py-4 italic">No deleted categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}