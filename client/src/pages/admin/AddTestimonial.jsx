import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

export default function AddTestimonial() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    description: "",
    photo: null,
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Testimonial saved (demo only)");
    // Reset or navigate back
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              Manage Testimonial
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="w-32 font-semibold">Name :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1 border rounded-md p-2"
                  placeholder="Enter name"
                  required
                />
              </div>

              {/* Tag */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="w-32 font-semibold">Tag :</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  className="flex-1 border rounded-md p-2"
                  placeholder="Enter tag"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <label className="w-32 font-semibold">Description :</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex-1 border rounded-md p-2 h-32"
                  placeholder="Enter description"
                />
              </div>

              {/* Photo */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="w-32 font-semibold">Photo :</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="flex-1"
                  accept="image/*"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <label className="w-32 font-semibold">Status :</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex-1 border rounded-md p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
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
