import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function DownloadList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Modal state for PDF preview
  const [previewModal, setPreviewModal] = useState({ open: false, fileUrl: "", fileName: "" });

  // Fetch downloads from backend
  const fetchDownloads = async (searchTerm = "") => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      const response = await fetch(`${API_BASE}/downloads?${params}`);
      if (!response.ok) throw new Error("Failed to fetch downloads");
      const { data } = await response.json();
      setDownloads(data || []);
    } catch (err) {
      console.error("Error fetching downloads:", err);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads(search);
  }, [search]);

  // Refetch if ?refetch=true (from AddDownload success)
  useEffect(() => {
    if (searchParams.get("refetch") === "true") {
      fetchDownloads(search);
      // Clear refetch param
      searchParams.delete("refetch");
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  // Handle search submission (triggers fetch via useEffect)
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value || ""); // Update search state
  };

  // Handle preview (open modal with iframe) - ✅ FIXED: Added /uploads prefix
  const handlePreview = (filePath, fileName) => {
    if (filePath) {
      const fullUrl = `${API_BASE_URL}/uploads/${filePath}`;
      setPreviewModal({ open: true, fileUrl: fullUrl, fileName });
    } else {
      alert("No file available for preview");
    }
  };

  // Handle download (direct download) - ✅ FIXED: Added /uploads prefix
  const handleDownload = (filePath, fileName) => {
    if (filePath) {
      const fullUrl = `${API_BASE_URL}/uploads/${filePath}`;
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = fileName || filePath.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No file available");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this download?")) {
      try {
        const response = await fetch(`${API_BASE}/downloads/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete");
        const result = await response.json();
        alert(result.message || "Deleted successfully");
        // Refetch after delete
        fetchDownloads(search);
      } catch (err) {
        console.error("Error deleting download:", err);
        alert("Failed to delete download");
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setPreviewModal({ open: false, fileUrl: "", fileName: "" });
  };

  // Filtered downloads (backend handles, but local for display)
  const filteredDownloads = downloads;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-lg">Loading downloads...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Downloads
              </h2>

              <div className="flex items-center gap-2">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    defaultValue={search}
                    className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 ml-2"
                  >
                    GO
                  </button>
                </form>
                <button
                  onClick={() => navigate("/add-download")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add Download
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">File</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Course</th>
                    <th className="border p-2 text-center w-48">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDownloads.length > 0 ? (
                    filteredDownloads.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{item.type}</td>
                        <td className="border p-2">
                          {/* ✅ FIXED: Added /uploads prefix */}
                          <a
                            href={`${API_BASE_URL}/uploads/${item.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                          >
                            {item.file.split("/").pop()} {/* Show filename only */}
                          </a>
                        </td>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.course || "N/A"}</td>
                        <td className="border p-2 text-center flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => handlePreview(item.file, item.name)}
                            className="bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 text-xs"
                          >
                            👁️ Preview
                          </button>
                          <button
                            onClick={() => handleDownload(item.file, item.name)}
                            className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 text-xs"
                          >
                            ⬇️ Download
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border p-4 text-center text-gray-500">
                        No downloads found. {search && "Try adjusting your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview: {previewModal.fileName}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <iframe
                src={previewModal.fileUrl}
                width="100%"
                height="600"
                className="border"
                title="PDF Preview"
              />
              <p className="text-sm text-gray-500 mt-2">
                If the file doesn't load (non-PDF), use the download button below.
              </p>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <a
                href={previewModal.fileUrl}
                download={previewModal.fileName}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Download
              </a>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}