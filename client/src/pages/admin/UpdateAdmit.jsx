import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function UpdateAdmit() {
  const { id } = useParams(); // ✅ Get student ID from route
  const navigate = useNavigate();

  const [student, setStudent] = useState(null); // ✅ Real student data
  const [subjects, setSubjects] = useState([]); // ✅ Real subjects from course
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(""); // ✅ Error state
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Submit loading

  // ✅ UPDATED: Fetch student and their course subjects (with admitSubjects check)
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch student
      const studentResponse = await fetch(`${API_BASE}/students/${id}`);
      if (!studentResponse.ok) throw new Error("Failed to fetch student");
      const studentData = await studentResponse.json();
      const fetchedStudent = studentData.data || studentData; // Handle flat/nested response
      setStudent(fetchedStudent);

      // ✅ NEW: Check for existing admitSubjects first (load saved dates/times)
      if (fetchedStudent.admitSubjects && fetchedStudent.admitSubjects.length > 0) {
        // Use saved data, add 'id' for React mapping
        const subjectsWithIds = fetchedStudent.admitSubjects.map((subj, idx) => ({
          ...subj,
          id: idx + 1,
          // ✅ Format examDate for <input type="date"> (YYYY-MM-DD)
          examDate: subj.examDate ? new Date(subj.examDate).toISOString().split('T')[0] : "",
        }));
        setSubjects(subjectsWithIds);
        console.log("🔍 Loaded existing admitSubjects from DB:", subjectsWithIds); // ✅ Debug log
      } else if (fetchedStudent.course) {
        // Fallback: Fetch course subjects (assumes student.course is string name)
        const courseResponse = await fetch(`${API_BASE}/courses?search=${encodeURIComponent(fetchedStudent.course)}`);
        if (!courseResponse.ok) throw new Error("Failed to fetch course");
        const courseData = await courseResponse.json();
        const course = (courseData.data || [courseData]).find(c => c.name === fetchedStudent.course);
        if (course && course.subjects) {
          // Initialize with empty dates/times
          const subjectsWithDates = course.subjects.map((subj, idx) => ({
            id: idx + 1,
            name: subj.name,
            fullMarks: subj.fullMarks,
            examDate: "", // Empty for new
            examTime: "", // Empty for new
          }));
          setSubjects(subjectsWithDates);
          console.log("🔍 Initialized new subjects from course:", subjectsWithDates); // ✅ Debug log
        } else {
          setSubjects([]); // No subjects found
        }
      } else {
        setSubjects([]); // No course/subjects
      }
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err); // ✅ Better logging
      alert(`❌ Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // Handle subject field change
  const handleChange = (subjId, field, value) => {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.id === subjId ? { ...subj, [field]: value } : subj
      )
    );
  };

  // ✅ UPDATED: Handle Save (PUT update with admit details) - With validation
  const handleSave = async () => {
    if (!student || subjects.length === 0) {
      alert("No data to save. Please refresh the page.");
      return;
    }

    // ✅ NEW: Basic validation - Ensure at least one date/time is filled
    const hasChanges = subjects.some(subj => subj.examDate || subj.examTime);
    if (!hasChanges) {
      alert("Please enter at least one exam date or time before saving.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Prepare updated student data (only admitSubjects changes)
      const updatedStudent = {
        ...student,
        admitSubjects: subjects.map(subj => ({
          ...subj,
          // ✅ Ensure examDate is a valid date string (YYYY-MM-DD) for DB storage
          examDate: subj.examDate || "",
          // ✅ examTime is already a string (HH:MM)
          examTime: subj.examTime || "",
        })),
      };

      console.log("🔍 Saving admitSubjects to DB:", updatedStudent.admitSubjects); // ✅ Debug log

      // ✅ FIXED: Use dedicated /admit endpoint (JSON only, no files)
      const response = await fetch(`${API_BASE}/students/${id}/admit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admitSubjects: updatedStudent.admitSubjects }), // ✅ Send only admitSubjects
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Admit Card details (exam dates & times) have been updated and saved to database!");
        // ✅ Reload data immediately to reflect changes in UI
        await fetchData();
      } else {
        setError(result.message || "Failed to update admit details");
        console.error("Save error response:", result); // ✅ Better logging
        alert(`❌ Save failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Save error:", err); // ✅ Better logging
      alert(`❌ Network error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ NEW: Photo Error Handler - Matches DownloadAdmit.jsx
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
              <button onClick={fetchData} className="ml-2 underline">Retry</button> {/* ✅ Calls fetchData */}
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
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-6">
              Update Admit Card Details
            </h2>

            {/* ✅ UPDATED: Student Info with Big Square Photo on RIGHT (indented from right corner) */}
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
                <p className="text-gray-700">
                  <strong>Course:</strong> {student.course || 'N/A'}
                </p>
              </div>

              {/* Right: Student Photo (Big Square, Indented from Right Corner) */}
              {student.studentPhoto ? (
                <div className="relative w-32 h-32 flex-shrink-0 mr-6"> {/* Big: 128x128px, mr-6 for indentation */}
                  <img
                    src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                    alt="Student Photo"
                    className="w-32 h-32 rounded-md object-cover absolute inset-0" // ✅ Square: rounded-md
                    onError={(e) => handlePhotoError(e, student.studentPhoto)} // ✅ Error handling
                    crossOrigin="anonymous"
                  />
                  <div className="photo-placeholder w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500 absolute inset-0 hidden">
                    No Photo
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500 flex-shrink-0 mr-6">
                  No Photo
                </div>
              )}
            </div>

            {/* Admit Table */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Exam Schedule Details (Dates & Times will be used in Admit PDF)
            </h3>

            {subjects.length > 0 ? (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border border-gray-300">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 border text-left">Subject</th>
                      <th className="p-3 border text-center">Full Marks</th>
                      <th className="p-3 border text-center">Exam Date</th>
                      <th className="p-3 border text-center">Exam Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="p-3 border align-top w-2/5">
                          {subject.name}
                        </td>
                        <td className="p-3 border text-center">
                          {subject.fullMarks}
                        </td>
                        <td className="p-3 border text-center">
                          <input
                            type="date"
                            value={subject.examDate || ""} // ✅ Use saved value (already formatted)
                            onChange={(e) =>
                              handleChange(subject.id, "examDate", e.target.value)
                            }
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 border text-center">
                          <input
                            type="time"
                            value={subject.examTime || ""} // ✅ Use saved value
                            onChange={(e) =>
                              handleChange(subject.id, "examTime", e.target.value)
                            }
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6 mb-6">
                No subjects available for this course. Add subjects to the course first.
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => navigate(-1)} // ✅ FIXED: Back to DownloadAdmitList for context
                className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting || subjects.length === 0}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}