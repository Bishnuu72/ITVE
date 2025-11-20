import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function CategoryList() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ NEW: Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active",
  });
  const [editPhoto, setEditPhoto] = useState(null);
  const [existingEditPhoto, setExistingEditPhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch categories
  const fetchCategories = async (searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/courses/categories${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
      const response = await fetch(url);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle search button click
  const handleSearch = () => {
    fetchCategories(search);
  };

  // Handle Action
  const handleAction = async (id, action) => {
    switch (action) {
      case "view":
        navigate(`/category-detail/${id}`);
        break;
      case "update":
        // ✅ NEW: Open edit modal and fetch data
        setShowEditModal(true);
        setEditingCategory(id);
        await fetchCategoryForEdit(id);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this category? It will move to Deleted Categories.")) {
          try {
            const response = await fetch(`${API_BASE}/courses/categories/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete");
            alert("✅ Category moved to Deleted Categories!");
            fetchCategories(search); // Refresh list
          } catch (err) {
            alert(`❌ Error: ${err.message}`);
          }
        }
        break;
      default:
        break;
    }
  };

  // ✅ NEW: Fetch category data for edit modal (pre-fills form)
  const fetchCategoryForEdit = async (id) => {
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await fetch(`${API_BASE}/courses/categories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch category for edit");
      const { data } = await response.json();
      // Pre-fill form with previous data
      setEditFormData({
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",
        status: data.status || "Active",
      });
      setExistingEditPhoto(data.photo || "");
    } catch (err) {
      setEditError(err.message);
      alert(`❌ Error loading data: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  // ✅ NEW: Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // ✅ NEW: Handle edit photo change
  const handleEditPhotoChange = (e) => {
    setEditPhoto(e.target.files[0]);
  };

  // ✅ NEW: Handle edit submit (PUT update)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError(null);

    const submitData = new FormData();
    Object.keys(editFormData).forEach((key) => {
      submitData.append(key, editFormData[key]);
    });
    if (editPhoto) submitData.append("photo", editPhoto);

    try {
      const response = await fetch(`${API_BASE}/courses/categories/${editingCategory}`, {
        method: "PUT",
        body: submitData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update category");
      }
      alert("✅ Category Updated Successfully!");
      setShowEditModal(false); // Close modal
      fetchCategories(search); // Refresh list
    } catch (err) {
      setEditError(err.message);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ NEW: Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setEditFormData({ name: "", code: "", description: "", status: "Active" });
    setEditPhoto(null);
    setExistingEditPhoto("");
    setEditError(null);
  };

  // ✅ UPDATED: Photo Error Handler (for list)
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

  // ✅ NEW: Render existing photo preview in modal
  const renderEditPhotoPreview = () => {
    if (!existingEditPhoto) {
      return (
        <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500">
          No Photo
        </div>
      );
    }
    const fullUrl = `${API_BASE_URL}${existingEditPhoto}`;
    return (
      <img
        src={fullUrl}
        alt="Current Photo"
        className="w-32 h-32 rounded-md object-cover"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    );
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
                All Category
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
                <button
                  onClick={() => navigate("/add-category")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
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
                    <th className="border p-2 text-center">Photo</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center w-24">Action</th> {/* ✅ ADJUSTED WIDTH FOR ICONS */}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, index) => (
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
                      <td className="border p-2">
                        {c.description || "—"}
                      </td>
                      <td className="border p-2 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        {/* ✅ NEW: Edit Icon */}
                        <button
                          onClick={() => handleAction(c._id, "update")}
                          className="text-blue-600 hover:text-blue-800 text-lg p-1 hover:bg-blue-100 rounded transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        {/* ✅ NEW: Delete Icon */}
                        <button
                          onClick={() => handleAction(c._id, "delete")}
                          className="text-red-600 hover:text-red-800 text-lg p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-4 italic">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>
            
            {editLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>}
            {editError && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">Error: {editError}</div>}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditPhotoChange}
                  className="w-full border rounded-md p-2"
                />
                {existingEditPhoto && (
                  <div className="mt-2 flex justify-center">
                    {renderEditPhotoPreview()}
                    <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500 hidden">
                      No Photo
                    </div>
                  </div>
                )}
                {editPhoto && <p className="text-sm text-gray-500 mt-1">Selected: {editPhoto.name}</p>}
              </div>

              {/* Code */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  name="code"
                  value={editFormData.code}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={editFormData.status === "Active"}
                      onChange={handleEditChange}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={editFormData.status === "Inactive"}
                      onChange={handleEditChange}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}