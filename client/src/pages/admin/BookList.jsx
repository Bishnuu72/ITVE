import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getBooks, deleteBook } from "../../services/bookService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function BookList() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Preview Modal
  const [previewModal, setPreviewModal] = useState({
    open: false,
    fileUrl: "",
    fileName: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load downloads", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = books.filter((book) => {
    const query = search.toLowerCase();
    return (
      book.name.toLowerCase().includes(query) ||
      book.type.toLowerCase().includes(query) ||
      (book.course && book.course.toLowerCase().includes(query))
    );
  });

  // FIXED FILE URL — This is the only line you may need to change
  const FILE_URL = `${API_BASE}/uploads/files`;

  const handleDownload = (filename) => {
    window.open(`${FILE_URL}/${filename}`, "_blank");
  };

  const handlePreview = (filename, name) => {
    const url = `${FILE_URL}/${filename}`;
    setPreviewModal({
      open: true,
      fileUrl: url,
      fileName: name || filename,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the file!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteBook(id);
      Swal.fire("Deleted!", "Download removed successfully.", "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", "Failed to delete.", "error");
    }
  };

  const closeModal = () => {
    setPreviewModal({ open: false, fileUrl: "", fileName: "" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-10 text-center text-xl text-gray-600">
            Loading downloads...
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

            {/* Header - EXACT SAME AS YOUR ORIGINAL */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Downloads
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name, type or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                />
                <button
                  onClick={() => navigate("/add-book")}   // ← YOUR CORRECT ROUTE
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table - EXACT SAME AS YOUR ORIGINAL */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-3 text-center w-16">Sl No</th>
                    <th className="border p-3">Type</th>
                    <th className="border p-3">Course</th>
                    <th className="border p-3">Name</th>
                    <th className="border p-3">File</th>
                    <th className="border p-3 text-center w-48">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                        {search ? "No match found" : "No downloads yet"}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((book, index) => (
                      <tr key={book._id} className="hover:bg-gray-50 transition">
                        <td className="border p-3 text-center">{index + 1}</td>
                        <td className="border p-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {book.type}
                          </span>
                        </td>
                        <td className="border p-3 text-gray-700">
                          {book.course || <em className="text-gray-400">All Courses</em>}
                        </td>
                        <td className="border p-3 font-medium">{book.name}</td>
                        <td className="border p-3">
                          <span
                            onClick={() => handleDownload(book.file)}
                            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                          >
                            {book.file.length > 30 ? book.file.slice(0, 30) + "..." : book.file}
                          </span>
                        </td>
                        <td className="border p-3 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handlePreview(book.file, book.name)}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition"
                            >
                              Preview
                            </button>

                            <button
                              onClick={() => handleDownload(book.file)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
                            >
                              Download
                            </button>

                            <button
                              onClick={() => navigate(`/add-book/${book._id}`)}   // ← EDIT WORKS
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(book._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right text-sm text-gray-600 italic">
              Showing <strong>{filtered.length}</strong> of <strong>{books.length}</strong> downloads
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal - SAME AS YOUR DownloadList.jsx */}
      {previewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Preview: {previewModal.fileName}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewModal.fileUrl.endsWith(".pdf") ? (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(previewModal.fileUrl)}&embedded=true`}
                  width="100%"
                  height="600"
                  className="border"
                  title="PDF Preview"
                />
              ) : (
                <iframe
                  src={previewModal.fileUrl}
                  width="100%"
                  height="600"
                  className="border"
                  title="File Preview"
                />
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <a
                href={previewModal.fileUrl}
                download
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