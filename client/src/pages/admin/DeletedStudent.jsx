import React, { useState, useEffect } from "react";
import { FaSearch, FaUndo, FaSyncAlt } from "react-icons/fa"; // ✅ NEW: Refresh icon
import { useNavigate } from "react-router-dom"; // Optional: For navigation after restore
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DeletedStudents() {
  const [search, setSearch] = useState("");
  const [deletedStudents, setDeletedStudents] = useState([]); // Real data from DB
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [selectedStudents, setSelectedStudents] = useState([]); // Track selected for bulk restore
  const navigate = useNavigate(); // Optional: Navigate after restore

  // Fetch deleted students on mount
  useEffect(() => {
    fetchDeletedStudents();
  }, []);

  const fetchDeletedStudents = async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedStudents([]); // Clear selection on refresh
      const response = await fetch(`${API_BASE_URL}/api/students/deleted`);
      const data = await response.json();
      console.log("🔍 Fetched deleted students data:", data); // Debug log
      if (response.ok) {
        setDeletedStudents(data.data || []); // ✅ FIXED: Match controller response { data: [...] }
      } else {
        setError(data.error || "Failed to fetch deleted students");
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter Deleted Students (client-side search)
  const filteredStudents = deletedStudents.filter((student) =>
    student.studentName.toLowerCase().includes(search.toLowerCase())
  );

  // Handle checkbox selection
  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s._id));
    }
  };

  // Handle Single Restore
  const handleRestore = async (id) => {
    if (!window.confirm("Are you sure you want to restore this student?")) return;
    await performRestore([id]);
  };

  // Handle Bulk Restore
  const handleBulkRestore = async () => {
    if (selectedStudents.length === 0) {
      alert("No students selected for restore!");
      return;
    }
    if (!window.confirm(`Restore ${selectedStudents.length} selected students?`)) return;
    await performRestore(selectedStudents);
  };

  // Shared Restore Logic
  const performRestore = async (studentIds) => {
    try {
      // For simplicity, restore one-by-one (could batch in future)
      let successCount = 0;
      for (const id of studentIds) {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}/restore`, {
          method: "PUT",
        });
        const result = await response.json();
        if (response.ok) {
          successCount++;
        } else {
          console.error(`Restore failed for ${id}:`, result);
        }
      }
      if (successCount > 0) {
        alert(`✅ Restored ${successCount} student(s)!`);
        fetchDeletedStudents(); // Refresh list
        // Optional: Navigate to All Students after restore
        if (window.confirm("View restored students in All Students?")) {
          navigate("/all-students");
        }
      } else {
        alert("❌ No students were restored. Try again.");
      }
    } catch (err) {
      alert("Restore failed. Try again.");
      console.error("Restore error:", err);
    }
  };

  // Format date to YYYY-MM-DD (matches AllStudents)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Photo Error Handler (copied from AllStudents.jsx for consistency)
  const handlePhotoError = (e, filename) => {
    console.error(`❌ Photo load failed for ${filename}: 404 - File not found at /uploads/${filename}`);
    setTimeout(() => {
      if (e?.target && e.target.parentElement?.querySelector('.photo-placeholder')) {
        e.target.style.display = "none";
        e.target.parentElement.querySelector('.photo-placeholder').style.display = "flex";
      }
    }, 0);
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading deleted students...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-300 text-center">
              {error}
              <button onClick={fetchDeletedStudents} className="ml-2 underline">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Deleted Students ({filteredStudents.length}) | Selected: {selectedStudents.length}
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button 
                  onClick={fetchDeletedStudents} // ✅ NEW: Manual refresh
                  disabled={loading}
                  className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
                  title="Refresh List"
                >
                  <FaSyncAlt />
                </button>
                <button 
                  onClick={handleBulkRestore}
                  disabled={selectedStudents.length === 0 || loading}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaUndo /> Restore Selected
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white text-left">
                  <tr>
                    <th className="p-3 border text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 border">Photo</th>
                    <th className="p-3 border">Student Name</th>
                    <th className="p-3 border">Enrollment No</th>
                    <th className="p-3 border">Mobile No</th>
                    <th className="p-3 border">Course</th>
                    <th className="p-3 border">Centre</th>
                    <th className="p-3 border">D.O.A</th>
                    <th className="p-3 border text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-100 transition border-b"
                    >
                      <td className="p-3 border text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => handleSelectStudent(student._id)}
                        />
                      </td>

                      <td className="p-3 border text-center">
                        {student.studentPhoto ? (
                          <div className="relative w-10 h-10 mx-auto"> {/* ✅ Wrapper for error handling */}
                            <img
                              src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                              alt="Student Photo"
                              className="w-10 h-10 rounded-full object-cover absolute inset-0"
                              onError={(e) => handlePhotoError(e, student.studentPhoto)} // ✅ Fixed error handler
                              crossOrigin="anonymous"
                            />
                            <div className="photo-placeholder w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-500 absolute inset-0 hidden">
                              No Photo
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-xs text-gray-500">
                            No Photo
                          </div>
                        )}
                      </td>

                      <td className="p-3 border font-semibold text-gray-700">
                        {student.studentName}
                      </td>
                      <td className="p-3 border">{student.enrollmentNo || 'N/A'}</td>
                      <td className="p-3 border">{student.mobile || 'N/A'}</td>
                      <td className="p-3 border">{student.course || 'N/A'}</td>
                      <td className="p-3 border">{student.center || 'N/A'}</td>
                      <td className="p-3 border">
                        {formatDate(student.admissionDate)}
                      </td>

                      {/* Action Button (Single Restore) */}
                      <td className="p-3 border text-center">
                        <button 
                          onClick={() => handleRestore(student._id)}
                          disabled={loading}
                          className="flex items-center gap-2 mx-auto bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                        >
                          <FaUndo /> Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* No Data */}
              {filteredStudents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  {deletedStudents.length === 0 
                    ? "No deleted students. All active!" 
                    : "No deleted students found matching search."
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}