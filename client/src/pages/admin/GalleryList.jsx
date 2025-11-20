import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getGalleries, deleteGallery, getMediaUrl } from "../../services/galleryService";

export default function GalleryList() {
  const [search, setSearch] = useState("");
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch galleries from API
  useEffect(() => {
    getGalleries().then((items) => {
      setGalleries(Array.isArray(items) ? items : []);
    });
  }, []);

  const filtered = Array.isArray(galleries)
    ? galleries.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleEdit = (id) => {
    navigate(`/edit-gallery/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteGallery(id);
        Swal.fire("Deleted!", "Gallery has been deleted.", "success");
        setGalleries(galleries.filter((g) => g._id !== id));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete gallery.", "error");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Gallery
              </h2>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                />
                <button
                  onClick={() => navigate("/add-gallery")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 w-full md:w-auto"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm min-w-[700px]">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center w-28">Photo/Video</th>
                    <th className="border p-2 text-left w-32">Type</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center w-24">Status</th>
                    <th className="border p-2 text-center w-40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {item.type === "Photo" && item.photo ? (
                          <img
                            src={getMediaUrl(item.photo)}
                            alt={item.name}
                            className="h-12 w-24 object-cover mx-auto rounded"
                          />
                        ) : item.type === "Video" ? (
                          item.videoFile ? (
                            <video
                              src={getMediaUrl(item.videoFile)}
                              className="h-12 w-24 object-cover mx-auto rounded"
                              controls
                            ></video>
                          ) : item.link ? (
                            item.link.includes("youtube") ||
                            item.link.includes("youtu.be") ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${
                                  item.link.split("v=")[1] ||
                                  item.link.split("/").pop()
                                }`}
                                className="h-12 w-24 mx-auto"
                                frameBorder="0"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <video
                                src={item.link}
                                className="h-12 w-24 object-cover mx-auto rounded"
                                controls
                              ></video>
                            )
                          ) : (
                            <span className="text-gray-400 italic">No Media</span>
                          )
                        ) : (
                          <span className="text-gray-400 italic">No Media</span>
                        )}
                      </td>
                      <td className="border p-2">{item.type}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                        No gallery items found.
                      </td>
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