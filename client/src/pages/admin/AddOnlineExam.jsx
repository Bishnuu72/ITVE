// AddOnlineExam.jsx → FINAL 100% PERFECT VERSION (SAVES COURSE NAME, NOT ID)
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createExam, getExamById, updateExam } from "../../services/onlineExamService";

const API_BASE = import.meta.env.VITE_API_URL; // Change if using .env

export default function AddOnlineExam() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [form, setForm] = useState({
    examName: "",
    course: "",           // Holds selected course ID temporarily
    courseName: "",       // This gets saved in DB → "Diploma in XYZ (CODE)"
    semesterType: "",
    subject: "",
    examTypes: "",
    multipleSubjectTypes: "",
    duration: "",
    totalMark: "",
    passMark: "",
    description: "",
  });

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await fetch(`${API_BASE}/courses`);
        const result = await res.json();
        if (result.success && result.data) {
          setCourses(result.data);
        }
      } catch (err) {
        console.error("Failed to load courses");
        Swal.fire("Error", "Could not load courses", "error");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Load existing exam on edit mode
  useEffect(() => {
    if (isEditMode) {
      getExamById(id)
        .then((data) => {
          // Find the course ID from saved courseName
          const matchedCourse = courses.find(c => 
            `${c.name} (${c.code})` === data.course
          );

          setForm({
            examName: data.examName || "",
            course: matchedCourse?._id || "",
            courseName: data.course || "",
            semesterType: data.semesterType || "",
            subject: data.subject || "",
            examTypes: data.examTypes || "",
            multipleSubjectTypes: data.multipleSubjectTypes || "",
            duration: data.duration || "",
            totalMark: data.totalMark || "",
            passMark: data.passMark || "",
            description: data.description || "",
          });
        })
        .catch(() => {
          Swal.fire("Error", "Failed to load exam", "error");
          navigate("/online-exam-list");
        });
    }
  }, [id, isEditMode, navigate, courses]);

  // Handle course selection → save full name
  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    const selectedCourse = courses.find(c => c._id === selectedId);
    
    setForm({
      ...form,
      course: selectedId,
      courseName: selectedCourse ? `${selectedCourse.name} (${selectedCourse.code})` : ""
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.examName || !form.courseName || !form.examTypes || !form.multipleSubjectTypes) {
      Swal.fire("Required", "Please fill all required fields", "warning");
      return;
    }

    const dataToSave = {
      examName: form.examName,
      course: form.courseName,  // ← SAVES FULL COURSE NAME + CODE IN DB
      semesterType: form.semesterType,
      subject: form.subject,
      examTypes: form.examTypes,
      multipleSubjectTypes: form.multipleSubjectTypes,
      duration: form.duration,
      totalMark: form.totalMark,
      passMark: form.passMark,
      description: form.description,
    };

    try {
      if (isEditMode) {
        await updateExam(id, dataToSave);
        Swal.fire("Success!", "Exam updated successfully!", "success");
      } else {
        await createExam(dataToSave);
        Swal.fire("Success!", "Exam created successfully!", "success");
      }
      navigate("/online-exam-list");
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to save exam", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-10">
              {isEditMode ? "Edit Online Exam" : "Add New Online Exam"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Exam Name */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Exam Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="examName"
                  value={form.examName}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
                  placeholder="e.g. First Semester Final Exam 2025"
                />
              </div>

              {/* Course Dropdown */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Select Course <span className="text-red-500">*</span></label>
                <select
                  value={form.course}
                  onChange={handleCourseChange}
                  required
                  disabled={loadingCourses}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
                >
                  <option value="">
                    {loadingCourses ? "Loading courses..." : "-- Select Course --"}
                  </option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Type */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Semester Type <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="semesterType"
                  value={form.semesterType}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  placeholder="e.g. Semester 1, Annual, Final"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                  placeholder="e.g. Computer Fundamentals"
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Exam Type <span className="text-red-500">*</span></label>
                <select
                  name="examTypes"
                  value={form.examTypes}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                >
                  <option value="">-- Select Exam Type --</option>
                  <option value="Main Exam">Main Exam</option>
                  <option value="Practical Exam">Practical Exam</option>
                </select>
              </div>

              {/* Multiple Subjects */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Multiple Subjects? <span className="text-red-500">*</span></label>
                <select
                  name="multipleSubjectTypes"
                  value={form.multipleSubjectTypes}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                >
                  <option value="">-- Select Option --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Duration, Total, Pass Marks */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">Duration (Minutes) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">Total Marks <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="totalMark"
                    value={form.totalMark}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">Pass Marks <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="passMark"
                    value={form.passMark}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300"
                    placeholder="40"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-4 text-lg focus:ring-4 focus:ring-blue-300 resize-none"
                  placeholder="Any instructions for students..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-8 pt-8">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-16 py-5 rounded-xl font-bold text-2xl shadow-2xl hover:bg-green-700 hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  {isEditMode ? "UPDATE EXAM" : "CREATE EXAM"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/online-exam-list")}
                  className="bg-gray-600 text-white px-16 py-5 rounded-xl font-bold text-2xl shadow-2xl hover:bg-gray-700 hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}