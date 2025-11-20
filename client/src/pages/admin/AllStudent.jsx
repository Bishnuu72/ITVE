import React, { useState, useEffect, useMemo } from "react"; // ✅ NEW: Added useMemo for filtering
import { FaSearch, FaPrint, FaDownload, FaSyncAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as XLSX from 'xlsx';
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AllStudents() {
  const [searchParams] = useSearchParams(); // Detect refetch param
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch on mount OR when refetch param changes
  useEffect(() => {
    fetchStudents();
  }, [searchParams.get("refetch")]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/api/students`);
      const data = await response.json();
      console.log("🔍 Fetched students data:", data);
      if (response.ok) {
        setStudents(data.data || []);
        console.log("✅ Loaded", data.data?.length || 0, "students");
      } else {
        setError(data.error || "Failed to fetch students");
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter Students - Memoized for performance
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    return students.filter((student) =>
      student.studentName.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

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

  // ✅ UPDATED: Handle Action Select Changes (FIXED: marksDetail navigates to /marks/${id})
  const handleActionChange = (e, id) => {
    const action = e.target.value;
    if (!action) return;
    e.target.value = ""; // Reset dropdown

    switch (action) {
      case "view":
        navigate(`/view-student/${id}`);
        break;
      case "update":
        navigate(`/update-student/${id}`);
        break;
      case "delete":
        handleDelete(id);
        break;
      case "admit":
        handleDownloadAdmit(id);
        break;
      case "marksDetail":
        navigate(`/marks-detail/${id}`); // ✅ FIXED: Navigate to MarksDetail page
        break;
      case "certificate":
        handleDownloadCertificate(id);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };

  // ✅ NEW: Soft Delete Student (moves to DeletedStudents)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This student will be moved to Deleted Students.")) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ Student deleted! Check Deleted Students to restore.");
        fetchStudents(); // Refetch active list
        setSelectedStudents((prev) => prev.filter((sid) => sid !== id)); // Deselect
      } else {
        alert(`❌ ${result.error || "Delete failed"}`);
      }
    } catch (err) {
      alert("Delete failed. Check console.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Download Admit Card PDF
  const handleDownloadAdmit = async (id) => {
    try {
      setIsDownloading(true);
      const response = await fetch(`${API_BASE}/api/students/${id}/admit-pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admit-card-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download admit card.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ NEW: Download Certificate PDF
  const handleDownloadCertificate = async (id) => {
    try {
      setIsDownloading(true);
      const response = await fetch(`${API_BASE}/api/students/${id}/certificate-pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download certificate.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ UPDATED: Bulk Print ID Card (downloads PDFs for selected)
  const handlePrintIDCard = async (isNew = false) => {
    if (selectedStudents.length === 0) {
      alert("No students selected!");
      return;
    }
    if (selectedStudents.length > 10) {
      if (!window.confirm(`Download ${selectedStudents.length} PDFs? This may take time.`)) return;
    }
    setIsDownloading(true);
    let successCount = 0;
    try {
      for (const id of selectedStudents) {
        const endpoint = isNew ? "/new-id-card-pdf" : "/id-card-pdf";
        const response = await fetch(`${API_BASE}/api/students/${id}${endpoint}`);
        if (!response.ok) {
          console.error(`Failed for ${id}`);
          continue;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${isNew ? "new-" : ""}id-card-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        successCount++;
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to avoid overload
      }
      alert(`✅ Downloaded ${successCount} ID card(s)!`);
    } catch (err) {
      alert("Some downloads failed.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ UPDATED: Export to Excel (using XLSX)
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      alert("No students to export!");
      return;
    }
    const wsData = filteredStudents.map((s) => ({
      "Student Name": s.studentName,
      "Roll No": s.rollNo,
      "Enrollment No": s.enrollmentNo,
      "Mobile": s.mobile,
      "Course": s.course,
      "Centre": s.center,
      "Admission Date": s.admissionDate ? new Date(s.admissionDate).toISOString().split("T")[0] : "N/A",
      "Status": s.studentStatus,
      "Sending By Mail": s.sendingByMail,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `students-${new Date().toISOString().split("T")[0]}.xlsx`);
    alert("✅ Exported to Excel!");
  };

  // ✅ NEW: Update Order Status (for table select)
  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (response.ok) {
        fetchStudents(); // Refetch to update table
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      console.error("Update order status error:", err);
    }
  };

  // Photo Error Handler
  const handlePhotoError = (e, filename) => {
    console.error(`❌ Photo load failed for ${filename}`);
    setTimeout(() => {
      if (e?.target && e.target.parentElement?.querySelector(".photo-placeholder")) {
        e.target.style.display = "none";
        e.target.parentElement.querySelector(".photo-placeholder").style.display = "flex";
      }
    }, 0);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-300 text-center">
              {error}
              <button onClick={fetchStudents} className="ml-2 underline">Retry</button>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Manage All Students ({filteredStudents.length}) | Selected: {selectedStudents.length}
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={fetchStudents}
                  disabled={loading}
                  className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
                  title="Refresh List"
                >
                  <FaSyncAlt />
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  GO
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => handlePrintIDCard(false)}
                disabled={isDownloading || loading || selectedStudents.length === 0}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                <FaPrint /> Print ID Card
              </button>
              <button
                onClick={() => handlePrintIDCard(true)}
                disabled={isDownloading || loading || selectedStudents.length === 0}
                className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
              >
                <FaPrint /> Print New ID Card
              </button>
              <button
                onClick={handleExportExcel}
                disabled={isDownloading || loading || filteredStudents.length === 0}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
              >
                <FaDownload /> Export
              </button>
            </div>

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
                    <th className="p-3 border">Roll No</th>
                    <th className="p-3 border">Mobile No</th>
                    <th className="p-3 border">Course</th>
                    <th className="p-3 border">Centre</th>
                    <th className="p-3 border">D.O.A</th>
                    <th className="p-3 border">Sending By Mail</th>
                    <th className="p-3 border">Status</th>
                    <th className="p-3 border">Order Status</th>
                    <th className="p-3 border text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((student) => (
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
                                src={`${API_BASE}/uploads/${student.studentPhoto}`}
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
                        <td className="p-3 border font-semibold text-gray-700">{student.studentName}</td>
                        <td className="p-3 border">{student.rollNo || "N/A"}</td>
                        <td className="p-3 border">{student.mobile || "N/A"}</td>
                        <td className="p-3 border">{student.course || "N/A"}</td>
                        <td className="p-3 border">{student.center || "N/A"}</td>
                        <td className="p-3 border">
                          {student.admissionDate
                            ? new Date(student.admissionDate).toISOString().split("T")[0]
                            : "N/A"}
                        </td>
                        <td className="p-3 border text-center">{student.sendingByMail || "No"}</td>

                        <td className="p-3 border text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              student.studentStatus === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.studentStatus || "N/A"}
                          </span>
                        </td>

                        <td className="p-3 border">
                          <select
                            value={student.orderStatus || "Certificate Not Print"} // Use value for controlled
                            onChange={(e) => updateOrderStatus(student._id, e.target.value)}
                            className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 w-full"
                          >
                            <option>Certificate Not Print</option>
                            <option>Certificate Print</option>
                            <option>Certificate Sent</option>
                          </select>
                        </td>

                        <td className="p-3 border text-center">
                          <select
                            className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 w-full"
                            onChange={(e) => handleActionChange(e, student._id)}
                            disabled={isDownloading || loading}
                          >
                            <option value="">Select Action</option>
                            <option value="view">👁️ View</option>
                            <option value="update">✏️ Update</option>
                            <option value="delete">🗑️ Delete</option>
                            <option value="admit">📄 Download Admit Card</option>
                            <option value="marksDetail">📊 View Marksheet</option>
                            <option value="certificate">🎓 Download Certificate</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  {students.length === 0 ? "No students in database. Add one?" : "No students found matching search."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}