// OrderList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OrderList() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch only students with Certificate Print or Sent
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/students`);
      const result = await response.json();

      if (response.ok) {
        const filtered = (result.data || []).filter(student =>
          ["Certificate Print", "Certificate Sent"].includes(student.orderStatus)
        );
        // Sort by latest first
        const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setStudents(sorted);
        console.log("Fetched Order Students:", sorted.length);
      } else {
        setError(result.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Network error. Is backend running on port 4000?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Search filter (Roll No, Name, Mobile, Enrollment No)
  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students;

    const lowerSearch = search.toLowerCase();
    return students.filter((s) =>
      (s.rollNo || "").toLowerCase().includes(lowerSearch) ||
      (s.studentName || "").toLowerCase().includes(lowerSearch) ||
      (s.mobile || "").includes(search) ||
      (s.enrollmentNo || "").toLowerCase().includes(lowerSearch)
    );
  }, [students, search]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-300 text-center">
              {error}
              <button onClick={fetchOrders} className="ml-2 underline hover:text-red-800">
                Retry
              </button>
            </div>
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
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Certificate Orders ({filteredStudents.length})
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute top-3 left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by Roll No, Name, Mobile..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
                  />
                </div>
                <button
                  onClick={fetchOrders}
                  className="bg-gray-600 text-white p-2.5 rounded hover:bg-gray-700 transition"
                  title="Refresh"
                >
                  <FaSyncAlt />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white text-left">
                  <tr>
                    <th className="p-3 border text-center">Sl No</th>
                    <th className="p-3 border">Order No (Roll No)</th>
                    <th className="p-3 border">Student Name</th>
                    <th className="p-3 border">Mobile</th>
                    <th className="p-3 border">Course</th>
                    <th className="p-3 border">Centre</th>
                    <th className="p-3 border">Amount Paid</th>
                    <th className="p-3 border">Order Status</th>
                    <th className="p-3 border">Admission Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition">
                      <td className="p-3 border text-center">{index + 1}</td>
                      <td className="p-3 border font-semibold text-blue-700">
                        {student.rollNo || "N/A"}
                      </td>
                      <td className="p-3 border font-medium">{student.studentName}</td>
                      <td className="p-3 border">{student.mobile}</td>
                      <td className="p-3 border">{student.course}</td>
                      <td className="p-3 border">{student.center}</td>
                      <td className="p-3 border text-center font-semibold text-green-600">
                        ₹{student.totalFee || 0}
                      </td>
                      <td className="p-3 border text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            student.orderStatus === "Certificate Sent"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        {student.admissionDate
                          ? new Date(student.admissionDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  {students.length === 0
                    ? "No certificate orders yet."
                    : "No orders match your search."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}