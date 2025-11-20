import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { addGallery, updateGallery, getGalleryById, getMediaUrl } from "../../services/galleryService";

export default function AddGallery() {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    link: "",
    slNo: "",
    description: "",
    photo: null,
    videoFile: null,
    status: "Active",
  });

  const [existingMedia, setExistingMedia] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing gallery if editing
  useEffect(() => {
    if (id) {
      getGalleryById(id).then((g) => {
        if (!g) return;
        setFormData({
          type: g.type || "",
          name: g.name || "",
          link: g.link || "",
          slNo: g.slNo || "",
          description: g.description || "",
          photo: null,
          videoFile: null,
          status: g.status || "Active",
        });

        // ✅ Set existing media for preview
        if (g.type === "Photo" && g.photo) {
          setExistingMedia(getMediaUrl(g.photo));
        } else if (g.type === "Video" && g.videoFile) {
          setExistingMedia(getMediaUrl(g.videoFile));
        } else if (g.type === "Video" && g.link) {
          setExistingMedia(g.link);
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0], videoFile: null });
      setExistingMedia(null);
    } else if (name === "videoFile") {
      setFormData({ ...formData, videoFile: files[0], photo: null });
      setExistingMedia(null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) fd.append(key, formData[key]);
    });

    try {
      if (id) {
        await updateGallery(id, fd);
        Swal.fire("Updated!", "Gallery updated successfully!", "success");
      } else {
        await addGallery(fd);
        Swal.fire("Added!", "Gallery added successfully!", "success");
      }
      navigate("/gallery-list");
    } catch (error) {
      Swal.fire("Error!", error.message || "Failed to save gallery", "error");
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
              {id ? "Edit Gallery" : "Add Gallery"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Photo">Photo</option>
                  <option value="Video">Video</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Conditional Media Fields */}
              {formData.type === "Photo" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Photo:</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1 block w-full text-sm text-gray-600"
                  />
                  {formData.photo && (
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                  {!formData.photo && existingMedia && (
                    <img
                      src={existingMedia}
                      alt="Existing"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              )}

              {formData.type === "Video" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Video:</label>
                    <input
                      type="file"
                      name="videoFile"
                      accept="video/*"
                      onChange={handleChange}
                      className="mt-1 block w-full text-sm text-gray-600"
                    />
                    {formData.videoFile && (
                      <video
                        src={URL.createObjectURL(formData.videoFile)}
                        controls
                        className="mt-2 w-full h-48 object-cover rounded border"
                      ></video>
                    )}
                    {!formData.videoFile && existingMedia && (
                      existingMedia.includes("youtube") || existingMedia.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${
                            existingMedia.split("v=")[1] || existingMedia.split("/").pop()
                          }`}
                          className="w-full h-48"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={existingMedia}
                          controls
                          className="mt-2 w-full h-48 object-cover rounded border"
                        ></video>
                      )
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">OR Paste YouTube/Video URL:</label>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      placeholder="e.g., https://youtu.be/dQw4w9WgXcQ or MP4 URL"
                      className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Sl No */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Sl No:</label>
                <input
                  type="number"
                  name="slNo"
                  value={formData.slNo}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Saving..." : id ? "Update Gallery" : "Add Gallery"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}