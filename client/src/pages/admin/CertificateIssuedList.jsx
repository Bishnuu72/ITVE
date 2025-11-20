import React, { useState, useEffect, useMemo } from "react"; // ✅ NEW: Added useMemo import
import { FaSearch } from "react-icons/fa"; // ✅ NEW: Use FaSearch for consistency
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function CertificateIssuedList() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]); // ✅ Real data from DB
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error state
  const navigate = useNavigate();

  // ✅ Fetch students with certificateIssued: "Yes" (excludes "No")
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      // ✅ FIXED: Query param for backend filtering (certificateIssued=Yes)
      const response = await fetch(`${API_BASE}/students?certificateIssued=Yes`);
      const data = await response.json();
      console.log("🔍 Fetched certificate-issued students:", data); // ✅ Debug log
      if (response.ok) {
        setStudents(data.data || []); // ✅ FIXED: Extract nested 'data' array (matches backend)
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

  // 🔍 Filter Students (client-side for search)
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return []; // ✅ Guard against non-array
    return students.filter((student) =>
      student.studentName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]); // ✅ Memoized for performance

  // 🔗 Navigate Logic (FIXED: Consistent paths without /admin/)
  const handleAction = (action, id) => {
    if (action === "view") {
      navigate(`/view-student/${id}`); // ✅ FIXED: Consistent with other lists
    } else if (action === "downloadCertificate") {
      navigate(`/download-certificate/${id}`); // ✅ Assuming PDF detail/download page
    }
  };

  // ✅ NEW: Photo Error Handler - Matches other lists
  const handlePhotoError = (e, filename) => {
    console.error(`❌ Photo load failed for ${filename}: 404 - File not found at /uploads/${filename}`);
    // ✅ Use setTimeout to avoid synthetic event detachment
    setTimeout(() => {
      if (e?.target && e.target.parentElement?.querySelector('.photo-placeholder')) {
        e.target.style.display = "none";
        e.target.parentElement.querySelector('.photo-placeholder').style.display = "flex";
      }
    }, 0);
  };

  // Loading - Matches other lists
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error - Matches other lists
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        <Topbar />

        {/* Page Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Certificate Issued ({filteredStudents.length})
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  GO
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white text-left">
                  <tr>
                    <th className="p-3 border text-center">#</th>
                    <th className="p-3 border">Photo</th>
                    <th className="p-3 border">Student Name</th>
                    <th className="p-3 border">Mobile No</th>
                    <th className="p-3 border">Course</th>
                    <th className="p-3 border">D.O.A</th>
                    <th className="p-3 border text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id} // ✅ Use _id from DB
                      className="hover:bg-gray-100 transition border-b"
                    >
                      <td className="p-3 border text-center">{index + 1}</td>
                      <td className="p-3 border text-center">
                        {student.studentPhoto ? (
                          <div className="relative w-10 h-10 mx-auto"> {/* ✅ Consistent size */}
                            <img
                              src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                              alt="Student Photo"
                              className="w-10 h-10 rounded-full object-cover absolute inset-0"
                              onError={(e) => handlePhotoError(e, student.studentPhoto)} // ✅ Error handling
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
                        {student.studentName || 'N/A'}
                      </td>
                      <td className="p-3 border">{student.mobile || 'N/A'}</td>
                      <td className="p-3 border">{student.course || 'N/A'}</td>
                      <td className="p-3 border">
                        {student.admissionDate 
                          ? new Date(student.admissionDate).toISOString().split('T')[0] 
                          : 'N/A'
                        }
                      </td>

                      {/* Action Dropdown */}
                      <td className="p-3 border text-center">
                        <select
                          defaultValue=""
                          onChange={(e) =>
                            handleAction(e.target.value, student._id) // ✅ Use _id
                          }
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Action</option>
                          <option value="view">👁️ View</option>
                          <option value="downloadCertificate">🧾 Download Certificate</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* No Data Found */}
              {filteredStudents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  {students.length === 0 ? "No certificate-issued students in database." : "No students found matching search."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}