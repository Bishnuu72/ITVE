// AddLiveClass.jsx → FINAL 100% WORKING VERSION (Courses load perfectly)
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { addLiveClass, getLiveClassById, updateLiveClass } from "../../services/liveClassService";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;   // ← Same as AddStudent.jsx

export default function AddLiveClass() {
  const [form, setForm] = useState({
    course: "",
    liveClassName: "",
    startDate: "",
    endDate: "",
    description: "",
    youtubeLink: "",
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // EXACT SAME FETCH LOGIC AS AddStudent.jsx → 100% WORKING
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await fetch(`${API_BASE}/courses`);
        
        if (!response.ok) throw new Error("Failed to fetch courses");

        const result = await response.json();           // { success: true, data: [...] }
        console.log("Courses API Response:", result);   // ← Check this in browser console

        if (result.success && result.data) {
          setCourses(result.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
        Swal.fire("Error", "Failed to load courses. Is backend running?", "error");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load live class for edit
  useEffect(() => {
    if (!id) return;

    const loadLiveClass = async () => {
      setIsEditMode(true);
      try {
        const data = await getLiveClassById(id);
        setForm({
          course: data.course._id || data.course,
          liveClassName: data.liveClassName || "",
          startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : "",
          endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
          description: data.description || "",
          youtubeLink: data.youtubeLink || "",
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load live class", "error");
        navigate("/live-class-list");
      }
    };
    loadLiveClass();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course) {
      Swal.fire("Required", "Please select a course", "warning");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await updateLiveClass(id, form);
        Swal.fire("Success!", "Live class updated!", "success");
      } else {
        await addLiveClass(form);
        Swal.fire("Success!", "Live class created!", "success");
      }
      navigate("/live-class-list");
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to save", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-10">
              {isEditMode ? "Edit Live Class" : "Add New Live Class"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Course Dropdown */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  disabled={coursesLoading}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 text-base focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
                >
                  <option value="">
                    {coursesLoading ? "Loading courses..." : "-- Select a Course --"}
                  </option>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.code})
                      </option>
                    ))
                  ) : (
                    <option disabled>No courses found</option>
                  )}
                </select>
              </div>

              {/* Live Class Name */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Live Class Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="liveClassName"
                  value={form.liveClassName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Complete React JS Masterclass - Day 1"
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="What will students learn in this live class?"
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  YouTube Link (Live or Recorded) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="youtubeLink"
                  value={form.youtubeLink}
                  onChange={handleChange}
                  required
                  placeholder="https://youtube.com/live/xxxxxx or https://youtu.be/xxxxxx"
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3 focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-5 pt-8">
                <button
                  type="submit"
                  disabled={loading || coursesLoading}
                  className="bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : isEditMode ? "Update Live Class" : "Create Live Class"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/live-class-list")}
                  className="bg-gray-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-700 shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}