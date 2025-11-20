import React, { useState, useEffect } from "react";
import { FileText, Download as DownloadIcon, Search, Eye as EyeIcon } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function Download() {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state for PDF preview
  const [previewModal, setPreviewModal] = useState({ open: false, fileUrl: "", fileName: "", id: "" });

  // Fetch downloads from backend
  const fetchDownloads = async (searchTerm = "") => {
    try {
      setLoading(true);
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
    fetchDownloads(searchTerm);
  }, [searchTerm]);

  // Format date from createdAt
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle preview (open modal with iframe) - Uses static URL for viewing
  const handlePreview = (filePath, fileName, id) => {
    if (filePath) {
      const fullUrl = `${API_BASE_URL}/uploads/${filePath}`;
      setPreviewModal({ open: true, fileUrl: fullUrl, fileName, id });
    } else {
      alert("No file available for preview");
    }
  };

  // Handle download (forces save to local device via backend endpoint) - ✅ FIXED: Uses API endpoint with blob
  const handleDownload = async (id, fileName) => {
    try {
      const response = await fetch(`${API_BASE}/downloads/${id}/download`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Ensures filename is preserved
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up

      console.log(`✅ Downloaded: ${fileName}`);
    } catch (err) {
      console.error("Download error:", err);
      alert(`Failed to download: ${err.message}. Please try again.`);
    }
  };

  // Close modal
  const closeModal = () => {
    setPreviewModal({ open: false, fileUrl: "", fileName: "", id: "" });
  };

  // Filtered downloads (backend handles, but local for display)
  const filteredDownloads = downloads;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80"
            alt="Download Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              📥 Download Center
            </h1>
            <p className="text-white text-lg mt-2 text-center px-4">
              Access your Certificates, Admit Cards, and more from ITVE
            </p>
          </div>
        </div>

        {/* Download Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full sm:w-2/3 md:w-1/2">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-gray-600 mt-10">Loading documents...</div>
          )}

          {/* Download Table/List */}
          {!loading && filteredDownloads.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-red-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">File Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDownloads.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-2">
                        <FileText className="text-red-500 w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                        {/* Optional: Show thumbnail if picture exists */}
                        {item.picture && (
                          <img
                            src={`${API_BASE_URL}/uploads/${item.picture}`}
                            alt="Thumbnail"
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => { e.target.style.display = 'none'; }} // Hide if 404
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handlePreview(item.file, item.name, item._id)}
                          className="inline-flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                          title="Preview File"
                        >
                          <EyeIcon className="w-3 h-3" /> Preview
                        </button>
                        <button
                          onClick={() => handleDownload(item._id, item.name)} // ✅ FIXED: Pass ID and name to API endpoint
                          className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                          title="Download File"
                        >
                          <DownloadIcon className="w-4 h-4" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-600 mt-10">
                No documents found. {searchTerm && "Try searching again."}
              </p>
            )
          )}
        </section>
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
                title="File Preview"
              />
              <p className="text-sm text-gray-500 mt-2">
                If the file doesn't load (non-PDF), use the download button below.
              </p>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              {/* ✅ FIXED: Modal download uses API endpoint for forced save */}
              <button
                onClick={() => handleDownload(previewModal.id, previewModal.fileName)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Download
              </button>
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
      <Footer />
    </>
  );
}