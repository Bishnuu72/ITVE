import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE = import.meta.env.VITE_API_URL;

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch course detail
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/courses/${id}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const { data } = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error || !course) return <div className="p-6 text-center text-red-500">Error: {error || "Course not found"}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                Course Detail
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/course-lists")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  ← Back
                </button>
                <button
                  onClick={() => navigate(`/course-pdf/${id}`)} // ✅ View PDF: Navigates to PDF details page
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  📄 View PDF
                </button>
              </div>
            </div>

            {/* Course Information */}
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800">
              <div>
                <p className="mb-2"><strong>Course Name:</strong> {course.name}</p>
                <p className="mb-2"><strong>Short Name:</strong> {course.shortName}</p>
                <p className="mb-2"><strong>Course Code:</strong> {course.code}</p>
                <p className="mb-2"><strong>Duration:</strong> {course.duration}</p>
                <p className="mb-2"><strong>Course Type:</strong> {course.type}</p>
                <p className="mb-2"><strong>Eligibility:</strong> {course.eligibility}</p>
                <p className="mb-2"><strong>Category:</strong> {course.categoryType?.name || "—"}</p>
              </div>

              <div>
                <p className="mb-2"><strong>Total Subjects:</strong> {course.totalSubjects}</p>
                <p className="mb-2"><strong>Reg Fee Without KIT:</strong> Rs. {course.regFeeWithoutKit}</p>
                <p className="mb-2"><strong>Reg Fee With KIT:</strong> Rs. {course.regFeeWithKit}</p>
                <p className="mb-2"><strong>Exam Question Papers:</strong> {course.examQuestionPapers}</p>
                <p className="mb-2"><strong>Semester ?:</strong> {course.semester}</p>
                <p className="mb-2"><strong>Semester Type:</strong> {course.semesterType}</p>
              </div>
            </div>

            {/* Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Details:</h3>
              <p className="text-gray-700">{course.details}</p>
            </div>

            {/* Subjects Section */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-red-500 inline-block mb-4">
                Subject Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2 text-center w-16">Sl No</th>
                      <th className="border p-2 text-left">Subject Name</th>
                      <th className="border p-2 text-center">Full Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.subjects?.map((s, index) => (
                      <tr key={s._id || index} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{s.name}</td>
                        <td className="border p-2 text-center">{s.fullMarks}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500 py-4">No subjects added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}