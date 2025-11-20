// src/pages/admin/OnlineRegisteredStudent.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt, FaPrint, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OnlineRegisteredStudent() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]); // Only Online students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Added error state
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const navigate = useNavigate();

  // Fetch ONLY Online students from backend (?type=online)
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (debug = false) => {
    try {
      setLoading(true);
      setError("");
      setSelectedStudents([]); // Clear selection
      console.log("🔍 Fetching Online students..."); // Debug
      const url = `${API_BASE_URL}/api/students?type=online`; // ✅ Filter for Online only
      console.log("🔍 Fetching from URL:", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log("🔍 Fetched Online students data:", data); // Debug
      if (response.ok) {
        const studentList = data.data || []; // Match controller response
        console.log(`📊 Loaded ${studentList.length} Online students`);
        setStudents(studentList);
        if (debug) Swal.fire(`✅ Debug: Fetched ${studentList.length} Online students!`);
      } else {
        setError(data.error || "Failed to fetch Online students");
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter students by search input (client-side)
  const filteredStudents = students.filter((student) =>
    student.studentName?.toLowerCase().includes(search.toLowerCase())
  );

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

  // Navigate to view student detail page
  const handleView = (id) => {
    navigate(`/view-student/${id}`); // ✅ Relative path (matches AdminRoutes)
  };

  // ✅ Soft Delete student (moves to DeletedStudents)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will move the student to Deleted Students (soft delete).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
          method: "DELETE", // ✅ Soft delete endpoint
        });
        const resData = await response.json();
        if (response.ok) {
          setStudents(students.filter((s) => s._id !== id)); // Remove from list
          Swal.fire("Deleted!", resData.message || "Student moved to Deleted Students.", "success");
        } else {
          throw new Error(resData.error || "Delete failed");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete student.", "error");
      }
    }
  };

  // ✅ Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      Swal.fire("No Selection", "Please select students to delete.", "warning");
      return;
    }
    const result = await Swal.fire({
      title: "Delete Selected?",
      text: `Move ${selectedStudents.length} students to Deleted?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    });
    if (result.isConfirmed) {
      // Simple loop (batch in future)
      let successCount = 0;
      for (const id of selectedStudents) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: "DELETE" });
          if (response.ok) successCount++;
        } catch (err) {
          console.error("Bulk delete error:", err);
        }
      }
      if (successCount > 0) {
        fetchStudents(); // Refetch
        Swal.fire("Success", `${successCount} students moved to Deleted.`, "success");
      }
    }
  };

  // ✅ Export Excel
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      Swal.fire("No Data", "No students to export.", "info");
      return;
    }
    const wsData = filteredStudents.map((s) => ({
      "Student Name": s.studentName,
      "Mobile": s.mobile,
      "Course": s.course,
      "Center": s.center,
      "Admission Date": s.admissionDate ? new Date(s.admissionDate).toISOString().split("T")[0] : "N/A",
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Online Students");
    XLSX.writeFile(wb, `online-students-${new Date().toISOString().split("T")[0]}.xlsx`);
    Swal.fire("Exported!", "Downloaded to Excel.", "success");
  };

  // Photo Error Handler
  const handlePhotoError = (e, filename) => {
    console.error(`❌ Photo load failed for ${filename}`);
    setTimeout(() => {
      if (e?.target) {
        e.target.style.display = "none";
        e.target.parentElement.querySelector(".photo-placeholder")?.style.setProperty("display", "flex");
      }
    }, 0);
  };

  // Format Date
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading Online students...</p>
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
              <button onClick={() => fetchStudents()} className="ml-2 underline">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 inline-block pb-2">
                Online Registered Students ({filteredStudents.length} / {students.length} Total)
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button 
                  onClick={fetchStudents} // Manual refresh
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
                >
                  <FaSyncAlt /> Refresh
                </button>
                <button 
                  onClick={() => fetchStudents(true)} // Debug fetch
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  🔍 Debug
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <div className="flex gap-3 mb-4 p-3 bg-yellow-50 rounded">
                <span className="text-sm text-yellow-800">Selected: {selectedStudents.length}</span>
                <button 
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete Selected
                </button>
              </div>
            )}

            {/* Export Button */}
            <div className="mb-4">
              <button 
                onClick={handleExportExcel}
                disabled={filteredStudents.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                <FaDownload /> Export Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white text-left">
                  <tr>
                    <th className="p-3 border text-center w-12">
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 border">Photo</th>
                    <th className="p-3 border">Student Name</th>
                    <th className="p-3 border">Mobile No</th>
                    <th className="p-3 border">Course</th>
                    <th className="p-3 border">Centre</th>
                    <th className="p-3 border">D.O.A</th>
                    <th className="p-3 border text-center w-40">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-100 transition border-b">
                        <td className="p-3 border text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => handleSelectStudent(student._id)}
                          />
                        </td>
                        <td className="p-3 border text-center">
                          {student.studentPhoto ? (
                            <div className="relative w-10 h-10 mx-auto">
                              <img
                                src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                                alt="Student Photo"
                                className="w-10 h-10 rounded-full object-cover absolute inset-0"
                                onError={(e) => handlePhotoError(e, student.studentPhoto)}
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
                        <td className="p-3 border">{student.mobile || 'N/A'}</td>
                        <td className="p-3 border">{student.course || 'N/A'}</td>
                        <td className="p-3 border">{student.center || 'N/A'}</td>
                        <td className="p-3 border">
                          {formatDate(student.admissionDate)}
                        </td>

                        <td className="p-3 border text-center space-x-2">
                          <button
                            onClick={() => handleView(student._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-500 italic">
                        {students.length === 0 
                          ? "No Online registered students yet. Check online registration form." 
                          : "No Online students found matching search."
                        }
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