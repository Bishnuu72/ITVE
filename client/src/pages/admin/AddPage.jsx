import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createPage,
  getAdminPageById,
  updatePage,
  getImageUrl,
} from "../../services/pageService";

export default function AddPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    shortDescription: "",
    longDescription: "",
    banner: null,
    featuredImage: null,
    status: "Active",
  });

  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewFeaturedImage, setPreviewFeaturedImage] = useState(null);

  useEffect(() => {
    if (id) {
      getAdminPageById(id)
        .then((data) => {
          setFormData({
            ...data,
            banner: null,
            featuredImage: null,
          });
          setPreviewBanner(data.banner ? getImageUrl(data.banner.split("/").pop()) : null);
          setPreviewFeaturedImage(data.featuredImage ? getImageUrl(data.featuredImage.split("/").pop()) : null);
        })
        .catch(() => {
          Swal.fire("Error", "Failed to load page data", "error");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const previewUrl = URL.createObjectURL(file);
      if (name === "banner") setPreviewBanner(previewUrl);
      if (name === "featuredImage") setPreviewFeaturedImage(previewUrl);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) form.append(key, formData[key]);
    }

    try {
      if (id) {
        await updatePage(id, form);
        Swal.fire("Success", "Page updated successfully", "success");
      } else {
        await createPage(form);
        Swal.fire("Success", "Page created successfully", "success");
      }
      navigate("/manage-page");
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
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
              {id ? "Edit Page" : "Add Page"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Text Inputs */}
              {["name", "metaTitle", "metaKeyword"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace(/([A-Z])/g, " $1") + ":"}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* Textareas */}
              {["metaDescription", "shortDescription", "longDescription"].map((field, i) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace(/([A-Z])/g, " $1") + ":"}
                  </label>
                  <textarea
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    rows={i === 2 ? 6 : 2}
                    className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner:</label>
                <input
                  type="file"
                  name="banner"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500"
                />
                {previewBanner && (
                  <img src={previewBanner} alt="Banner Preview" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image:</label>
                <input
                  type="file"
                  name="featuredImage"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500"
                />
                {previewFeaturedImage && (
                  <img src={previewFeaturedImage} alt="Featured Preview" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  {id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/manage-page")}
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