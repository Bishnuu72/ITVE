import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllBlogs, deleteBlog, uploadsUrl } from "../../services/blogService";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch blogs from backend
  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      Swal.fire("Error", "Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filtered = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBlog(id);
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        loadBlogs(); // Refresh list
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete blog", "error");
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Blogs
              </h2>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 flex-1 md:flex-none w-full md:w-auto"
                />
                <button
                  onClick={loadBlogs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 w-full md:w-auto"
                >
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/add-blog")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 w-full md:w-auto"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <p className="text-center text-gray-600 py-4">Loading blogs...</p>
              ) : (
                <table className="w-full border text-sm table-auto">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2 text-center w-12">Sl No</th>
                      <th className="border p-2 text-left min-w-[250px]">Blog Title</th>
                      <th className="border p-2 text-center w-28">Photo</th>
                      <th className="border p-2 text-center w-28">Status</th>
                      <th className="border p-2 text-center w-32">Created At</th>
                      <th className="border p-2 text-center w-36">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((blog, index) => (
                        <tr key={blog._id} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2">{blog.title}</td>
                          <td className="border p-2 text-center">
                            {blog.image ? (
                              <img
                                src={`${uploadsUrl}/${blog.image}`}
                                alt={blog.title}
                                className="h-12 w-24 object-cover mx-auto rounded"
                              />
                            ) : (
                              <span className="text-gray-400 italic">No Image</span>
                            )}
                          </td>
                          <td className="border p-2 text-center">
                            <span
                              className={`px-2 py-1 rounded text-sm font-semibold ${
                                blog.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {blog.status}
                            </span>
                          </td>
                          <td className="border p-2 text-center">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border p-2 text-center flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(blog._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-20"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-20"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                          No blogs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}