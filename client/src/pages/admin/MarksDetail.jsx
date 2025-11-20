import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function MarksDetail() {
  const { id } = useParams(); // ✅ Get student ID from route
  const navigate = useNavigate();

  const [student, setStudent] = useState(null); // ✅ Real student data
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error state

  // ✅ Fetch student data (with marks and files)
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/students/${id}`);
      if (!response.ok) throw new Error("Failed to fetch student");
      const studentData = await response.json();
      const fetchedStudent = studentData.data || studentData; // Handle flat/nested response
      setStudent(fetchedStudent);
      console.log("🔍 Loaded student for marks detail:", fetchedStudent); // ✅ Debug log
    } catch (err) {
      setError(err.message);
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ✅ NEW: Calculate total percentage/grade (matches PDF logic)
  const calculateGrade = () => {
    if (!student?.marks || !Array.isArray(student.marks) || student.marks.length === 0) {
      return { percentage: 0, grade: 'Not Applicable' };
    }

    const fullTotal = student.marks.reduce((sum, m) => sum + (Number(m.fullMarks) || 0), 0);
    const obtainedTotal = student.marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
    const percentage = fullTotal > 0 ? Math.round((obtainedTotal / fullTotal) * 100) : 0;

    let grade = percentage >= 33 ? 'Pass' : 'Fail';
    if (percentage >= 33) {
      if (percentage >= 80) grade += ' - A';
      else if (percentage >= 70) grade += ' - B';
      else if (percentage >= 60) grade += ' - C';
      else if (percentage >= 50) grade += ' - D';
      else grade += ' - E';
    }
    grade += ` (${percentage}%)`;

    return { percentage, grade };
  };

  const { percentage, grade } = calculateGrade();

  // ✅ Photo/File Error Handler - Matches UpdateMarks.jsx
  const handleFileError = (e, filename, type) => {
    console.error(`❌ ${type} load failed for ${filename}: 404 - File not found at /uploads/${filename}`);
    setTimeout(() => {
      if (e?.target && e.target.parentElement?.querySelector('.file-placeholder')) {
        e.target.style.display = "none";
        e.target.parentElement.querySelector('.file-placeholder').style.display = "flex";
      }
    }, 0);
  };

  // ✅ Render File Preview (Image or PDF Link) - Matches UpdateMarks.jsx
  const renderFilePreview = (filePath, type) => {
    if (!filePath) {
      return <p className="text-sm text-gray-500">No file uploaded yet.</p>;
    }

    const fullUrl = `${API_BASE_URL}/uploads/${filePath}`;
    const isImage = /\.(jpg|jpeg|png)$/i.test(filePath);
    const isPdf = /\.(pdf)$/i.test(filePath);

    if (isImage) {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer hover:opacity-80 transition-opacity"
          title={`Click to open ${type} in new tab`}
        >
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={fullUrl}
              alt={`${type} Preview`}
              className="w-16 h-16 rounded-md object-cover absolute inset-0"
              onError={(e) => handleFileError(e, filePath, type)}
              crossOrigin="anonymous"
            />
            <div className="file-placeholder w-16 h-16 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 absolute inset-0 hidden">
              No Preview
            </div>
          </div>
        </a>
      );
    } else if (isPdf) {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm"
        >
          📄 Download {type}
        </a>
      );
    } else {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Download {type}
        </a>
      );
    }
  };

  // Loading
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
              <button onClick={fetchData} className="ml-2 underline">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No student found
  if (!student) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">Student not found.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-6">
              View Marks Details
            </h2>

            {/* ✅ UPDATED: Student Info with Big Square Photo on RIGHT (indented, clickable) */}
            <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Left: Student Details */}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  {student.studentName || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {student.address || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <strong>Enrollment No:</strong> {student.enrollmentNo || 'N/A'}
                </p>
              </div>

              {/* Right: Student Photo (Big Square, Indented from Right Corner, Clickable) */}
              {student.studentPhoto ? (
                <div className="relative w-32 h-32 flex-shrink-0 mr-6">
                  <a
                    href={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer hover:opacity-80 transition-opacity"
                    title="Click to open full photo in new tab"
                  >
                    <img
                      src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                      alt="Student Photo"
                      className="w-32 h-32 rounded-md object-cover absolute inset-0"
                      onError={(e) => handleFileError(e, student.studentPhoto, "Student Photo")}
                      crossOrigin="anonymous"
                    />
                  </a>
                  <div className="file-placeholder w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500 absolute inset-0 hidden">
                    No Photo
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500 flex-shrink-0 mr-6">
                  No Photo
                </div>
              )}
            </div>

            {/* Marks Table */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Marks Details
            </h3>

            {student.marks && student.marks.length > 0 ? (
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border border-gray-300">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 border text-left">Subject</th>
                      <th className="p-3 border text-center">Full Marks</th>
                      <th className="p-3 border text-center">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.marks.map((mark, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border align-top w-2/5">
                          {mark.name || 'N/A'}
                        </td>
                        <td className="p-3 border text-center">
                          {mark.fullMarks || 'N/A'}
                        </td>
                        <td className="p-3 border text-center font-semibold text-blue-700">
                          {mark.obtained !== undefined && mark.obtained !== null ? mark.obtained : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* ✅ NEW: Total Percentage & Grade Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                  <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Total Percentage:</strong> {percentage}% | <strong>Grade:</strong> {grade}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6 mb-8">
                No marks available yet. Update marks first.
              </div>
            )}

            {/* Documents */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Documents
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Question Paper
                </label>
                {renderFilePreview(student.questionPaper, "Question Paper")}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Answer Sheet
                </label>
                {renderFilePreview(student.answerSheet, "Answer Sheet")}
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(-1)} // ✅ FIXED: Back to AllStudents
                className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                ← Back to Previous
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}