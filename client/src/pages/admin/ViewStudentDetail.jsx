import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch student from backend on mount
  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`);
      const data = await response.json();
      console.log("🔍 Fetched student data:", data); // ✅ NEW: Debug log
      if (response.ok) {
        setStudent(data.data); // ✅ FIXED: Use data.data to match controller response
      } else {
        setError(data.error || "Failed to fetch student");
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // ✅ FIXED: Photo Error Handler (null-safe + timeout for React events)
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

  // ✅ FIXED: Document Click Handler (with error handling)
  const handleDocumentClick = (filename) => {
    if (!filename) {
      console.warn("No document file available");
      return;
    }
    const url = `${API_BASE_URL}/uploads/${filename}`;
    console.log(`📄 Opening document: ${url}`);
    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      alert("Failed to open document. Please check if the file exists.");
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
            <p className="text-lg text-gray-600">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !student) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-300 text-center">
              {error || "Student not found."}
              <button onClick={fetchStudent} className="ml-2 underline">Retry</button>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {student.studentName}
                </h2>
                <p className="text-gray-600 mt-1">
                  <span className="font-semibold">Centre:</span> {student.center}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                {student.studentPhoto ? (
                  <div className="relative w-28 h-28"> {/* ✅ Wrapper */}
                    <img
                      src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                      alt="Student Photo"
                      className="w-28 h-28 rounded-lg border border-gray-300 object-cover absolute inset-0"
                      onError={(e) => handlePhotoError(e, student.studentPhoto)} // ✅ Fixed
                      crossOrigin="anonymous"
                    />
                    <div className="photo-placeholder w-28 h-28 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 absolute inset-0 hidden">
                      No Photo
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                    No Photo
                  </div>
                )}
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-8">
              {/* Admin Details */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                  Admin Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <Detail label="Student Status" value={student.studentStatus} />
                  <Detail label="Admit Issued" value={student.admitIssued} />
                  <Detail label="Marksheet Issued" value={student.marksheetIssued} />
                  <Detail label="Certificate Issued" value={student.certificateIssued} />
                  <Detail label="Semester Issued" value={student.semesterIssued} />
                  <Detail label="Update Marks" value={student.updateMarks} />
                  <Detail label="Sending By Mail" value={student.sendingByMail} />
                  <Detail label="Order Status" value={student.orderStatus} />
                </div>
              </section>

              {/* Academic Info */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                  Academic Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <Detail label="Roll No" value={student.rollNo} />
                  <Detail label="Enrollment No" value={student.enrollmentNo} />
                  <Detail label="Course" value={student.course} />
                  <Detail label="Admission Date" value={formatDate(student.admissionDate)} />
                  <Detail label="Issue Date" value={formatDate(student.issueDate)} />
                  <Detail label="Exam Date" value={formatDate(student.examDate)} />
                  <Detail label="Exam Mode" value={student.examMode} />
                  <Detail label="Apply for Kit?" value={student.applyKit ? "Yes" : "No"} />
                  <Detail label="Total Fee (Rs.)" value={student.totalFee ? `Rs. ${student.totalFee}` : "N/A"} />
                  <Detail label="Course Duration" value={student.duration} />
                </div>
              </section>

              {/* Personal Info */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <Detail label="Father's Name" value={student.fatherName} />
                  <Detail label="Mother's Name" value={student.motherName} />
                  <Detail label="Date of Birth" value={formatDate(student.dob)} />
                  <Detail label="Gender" value={student.gender} />
                  <Detail label="Mobile No" value={student.mobile} />
                  <Detail label="Religion (धर्म)" value={student.religion} />
                  <Detail label="Category (वर्ग)" value={student.category} />
                  <Detail label="Address" value={student.address} full />
                  <Detail label="State" value={student.state} full={false} />
                  <Detail label="District" value={student.district} full={false} />
                  <Detail label="Country" value={student.country} full={false} />
                  <Detail label="Pin Code" value={student.pin} full={false} />
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">
                  Uploaded Documents
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <Document label="Student Photo" file={student.studentPhoto} onClick={() => handleDocumentClick(student.studentPhoto)} />
                  <Document label="Identity Proof" file={student.idProof} onClick={() => handleDocumentClick(student.idProof)} />
                  <Document label="Education Proof" file={student.eduProof} onClick={() => handleDocumentClick(student.eduProof)} />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧩 Reusable Components
const Detail = ({ label, value, full = false }) => (
  <div className={`${full ? "md:col-span-2" : ""}`}>
    <p className="text-gray-600">
      <span className="font-medium text-gray-800">{label}:</span>{" "}
      <span className="text-gray-700">{value || "N/A"}</span>
    </p>
  </div>
);

const Document = ({ label, file, onClick }) => (
  <div>
    <p className="font-medium text-gray-800 mb-2">{label}:</p>
    {file ? (
      <button
        onClick={onClick}
        className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
      >
        View Document
      </button>
    ) : (
      <p className="text-gray-500 italic">No file uploaded</p>
    )}
  </div>
);