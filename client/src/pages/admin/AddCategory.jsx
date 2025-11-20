import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active",
  });

  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    if (photo) submitData.append("photo", photo);

    try {
      const response = await fetch(`${API_BASE}/courses/categories`, {
        method: "POST",
        body: submitData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add category");
      }
      alert("✅ Category Added Successfully!");
      navigate("/category-lists");
    } catch (err) {
      setError(err.message);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-6">
              Manage Category
            </h2>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">Error: {error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Category Name :
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Photo :
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Code */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Category Code :
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category code"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description :
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category description"
                ></textarea>
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Status :
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === "Active"}
                      onChange={handleChange}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === "Inactive"}
                      onChange={handleChange}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/category-list")}
                  className="bg-gray-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-600 transition-all shadow"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}