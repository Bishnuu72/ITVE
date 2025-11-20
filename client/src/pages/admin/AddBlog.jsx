import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createBlog,
  updateBlog,
  getBlogById,
  uploadsUrl,
} from "../../services/blogService";
import { getAllCategories } from "../../services/blogCategoryService";

export default function AddBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blogData, setBlogData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeyword: "",
    title: "",
    category: "",
    youtubeCode: "",
    tags: "",
    image: null,
    status: "Active",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        Swal.fire("Error", "Failed to load categories", "error");
      }
    };
    fetchCategories();
  }, []);

  // Fetch blog if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const data = await getBlogById(id);
          setBlogData({
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            metaKeyword: data.metaKeyword || "",
            title: data.title || "",
            category: data.category?._id || data.category || "",
            youtubeCode: data.youtubeCode || "",
            tags: data.tags?.join(", ") || "",
            image: null,
            status: data.status || "Active",
            description: data.description || "",
          });
          if (data.image) {
            setPreviewImage(`${uploadsUrl}/${data.image}`);
          }
        } catch (error) {
          Swal.fire("Error", "Failed to load blog data", "error");
          navigate("/blogs");
        }
      };
      fetchBlog();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in blogData) {
        if (blogData[key]) {
          formData.append(key, blogData[key]);
        }
      }

      if (id) {
        await updateBlog(id, formData);
        Swal.fire("Updated!", "Blog updated successfully!", "success");
      } else {
        await createBlog(formData);
        Swal.fire("Created!", "Blog created successfully!", "success");
      }

      navigate("/blog-list");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
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
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              {id ? "Edit Blog" : "Add Blog"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Meta Title */}
              <div>
                <label className="block font-semibold mb-1">Meta Title:</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={blogData.metaTitle}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block font-semibold mb-1">Meta Description:</label>
                <textarea
                  name="metaDescription"
                  value={blogData.metaDescription}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  rows={2}
                />
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block font-semibold mb-1">Meta Keyword:</label>
                <input
                  type="text"
                  name="metaKeyword"
                  value={blogData.metaKeyword}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Blog Title */}
              <div>
                <label className="block font-semibold mb-1">Blog Title:</label>
                <input
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>

              {/* Blog Category */}
              <div>
                <label className="block font-semibold mb-1">Blog Category:</label>
                <select
                  name="category"
                  value={blogData.category}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* YouTube Code */}
              <div>
                <label className="block font-semibold mb-1">YouTube Code:</label>
                <input
                  type="text"
                  name="youtubeCode"
                  value={blogData.youtubeCode}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-semibold mb-1">Tags (comma separated):</label>
                <input
                  type="text"
                  name="tags"
                  value={blogData.tags}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>

              {/* Blog Image */}
              <div>
                <label className="block font-semibold mb-1">Blog Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {previewImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-48 h-auto rounded border"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block font-semibold mb-1">Status:</label>
                <select
                  name="status"
                  value={blogData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1">Blog Description:</label>
                <textarea
                  name="description"
                  value={blogData.description}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  rows={6}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  {loading ? "Saving..." : id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/blog-list")}
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