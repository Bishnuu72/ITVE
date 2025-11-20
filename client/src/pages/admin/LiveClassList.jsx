// LiveClassList.jsx → FINAL 100% COMPLETE VERSION (WITH ADD BUTTON + CLEAN UI + LARGE EDIT MODAL)
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getLiveClasses, updateLiveClass, deleteLiveClass } from "../../services/liveClassService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LiveClassList() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  
  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({
    course: "", liveClassName: "", startDate: "", endDate: "", description: "", youtubeLink: ""
  });

  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const result = await res.json();
        if (result.success) setCourses(result.data);
      } catch (err) { console.error("Failed to load courses"); }
    };
    fetchCourses();
  }, []);

  // Fetch live classes
  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const response = await getLiveClasses();
      setLiveClasses(response.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to load live classes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (cls) => {
    setEditingClass(cls);
    setEditForm({
      course: cls.course._id || cls.course,
      liveClassName: cls.liveClassName || "",
      startDate: cls.startDate ? new Date(cls.startDate).toISOString().slice(0, 16) : "",
      endDate: cls.endDate ? new Date(cls.endDate).toISOString().slice(0, 16) : "",
      description: cls.description || "",
      youtubeLink: cls.youtubeLink || "",
    });
    setShowEditModal(true);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editForm.course || !editForm.liveClassName || !editForm.startDate || !editForm.endDate || !editForm.youtubeLink) {
      Swal.fire("Required", "Please fill all fields!", "warning");
      return;
    }
    try {
      await updateLiveClass(editingClass._id, editForm);
      Swal.fire("Success!", "Live class updated successfully!", "success");
      setShowEditModal(false);
      fetchLiveClasses();
    } catch (error) {
      Swal.fire("Error", error.message || "Update failed", "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Live Class?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteLiveClass(id);
        Swal.fire("Deleted!", "Live class removed.", "success");
        fetchLiveClasses();
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const filtered = liveClasses.filter(cls =>
    cls.liveClassName?.toLowerCase().includes(search.toLowerCase()) ||
    cls.courseName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">

            {/* Header with Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                All Live Classes
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by title or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg px-5 py-3 w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={fetchLiveClasses}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow transition"
                >
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/add-live-class")}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg transition text-lg"
                >
                  + Add New Class
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">S.No.</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Course Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Class Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Class Link</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Start Time</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">End Time</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Created</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length > 0 ? (
                    filtered.map((cls, index) => (
                      <tr key={cls._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-center font-medium text-gray-700">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{cls.courseName || "N/A"}</td>
                        <td className="px-6 py-4 text-gray-700">{cls.liveClassName}</td>
                        <td className="px-6 py-4">
                          <a href={cls.youtubeLink} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all">
                            {cls.youtubeLink}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700 font-medium">
                          {formatDateTime(cls.startDate)}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700 font-medium">
                          {formatDateTime(cls.endDate)}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {new Date(cls.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => openEditModal(cls)}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cls._id)}
                              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 shadow transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-16 text-gray-500 text-xl">
                        {loading ? "Loading live classes..." : "No live classes found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CLEAN & LARGE EDIT MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto border border-gray-300">
              <div className="bg-blue-600 text-white p-8 rounded-t-2xl">
                <h2 className="text-3xl font-bold text-center">Edit Live Class</h2>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Select Course *</label>
                    <select
                      value={editForm.course}
                      onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Live Class Title *</label>
                    <input
                      type="text"
                      value={editForm.liveClassName}
                      onChange={(e) => setEditForm({ ...editForm, liveClassName: e.target.value })}
                      className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter class title"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={editForm.startDate}
                      onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                      className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">End Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={editForm.endDate}
                      onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                      className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows="5"
                    className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">YouTube Link *</label>
                  <input
                    type="url"
                    value={editForm.youtubeLink}
                    onChange={(e) => setEditForm({ ...editForm, youtubeLink: e.target.value })}
                    className="w-full border border-gray-400 rounded-lg px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="https://youtube.com/live/..."
                  />
                </div>

                <div className="flex justify-center gap-6 pt-8">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-green-700 shadow-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-600 text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-700 shadow-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}