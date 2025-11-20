import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAdminPages, deletePage } from "../../services/pageService";

export default function ManagePage() {
  const [search, setSearch] = useState("");
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // adjust based on your auth setup

  // ✅ Fetch pages on load
  useEffect(() => {
    getAdminPages(token)
      .then(setPages)
      .catch(() => {
        Swal.fire("Error", "Failed to load pages", "error");
      });
  }, [token]);

  const filtered = pages.filter((page) =>
    page.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => navigate(`/edit-page/${id}`);

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
        await deletePage(id, token);
        Swal.fire("Deleted!", "Page has been deleted.", "success");
        setPages(pages.filter((page) => page._id !== id));
      } catch {
        Swal.fire("Error", "Failed to delete page", "error");
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Pages
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => navigate("/add-page")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center w-36">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((page, index) => (
                    <tr key={page._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{page.name}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            page.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(page._id)}
                          className="bg-blue-600 text-white w-16 py-1 rounded hover:bg-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(page._id)}
                          className="bg-red-600 text-white w-16 py-1 rounded hover:bg-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No pages found.
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