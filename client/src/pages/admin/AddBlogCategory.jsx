import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from "../../services/blogCategoryService";

export default function AddBlogCategory() {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);

  // 🟡 Fetch category by ID if editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return; // Add mode

      try {
        const category = await getCategoryById(id);
        setName(category.name);
        setStatus(category.status);
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || error.message, "error");
        navigate("/blog-category-list");
      }
    };

    fetchCategory();
  }, [id, navigate]);

  // 🟢 Handle form submit (add or update)
  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Validation Error", "Please enter a category name", "warning");
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await updateCategory(id, { name, status });
        Swal.fire("Updated!", "Blog Category updated successfully!", "success");
      } else {
        await createCategory({ name, status });
        Swal.fire("Created!", "Blog Category created successfully!", "success");
      }

      navigate("/blog-category-list");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              {id ? "Edit Blog Category" : "Add Blog Category"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Blog Category Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Blog Category Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Blog Category Name"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? "Saving..." : id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/blog-category-list")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
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