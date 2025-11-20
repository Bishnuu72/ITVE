import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function CourseList() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    duration: "",
    type: "",
    categoryType: "",
    eligibility: "",
    regFeeWithoutKit: "",
    regFeeWithKit: "",
    examQuestionPapers: "",
    semester: "",
    semesterType: "None",
    details: "",
  });

  const [editSubjects, setEditSubjects] = useState([{ name: "", fullMarks: "" }]);
  const [editPhoto, setEditPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");

  // Fetch courses
  const fetchCourses = async (query = "") => {
    setIsLoading(true);
    try {
      const url = `${API_BASE}/courses${query ? `?search=${encodeURIComponent(query)}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch courses");
      const { data } = await res.json();
      setCourses(data || []);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories for edit modal
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const { data } = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchCourses(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle Actions (View, Edit, PDF, Delete)
  const handleAction = async (id, action) => {
    switch (action) {
      case "view":
        navigate(`/course-detail/${id}`);
        break;
      case "update":
        openEditModal(id);
        break;
      case "pdf":
        navigate(`/course-pdf/${id}`);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this course? It will move to Deleted Courses.")) {
          try {
            const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            alert("Course moved to Deleted Courses!");
            fetchCourses(search);
          } catch (err) {
            alert("Error: " + err.message);
          }
        }
        break;
      default:
        break;
    }
  };

  // Open Edit Modal
  const openEditModal = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/courses/${id}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      const { data } = await res.json();

      setEditingCourseId(id);
      setExistingPhoto(data.photo || "");

      setEditFormData({
        name: data.name || "",
        duration: data.duration || "",
        type: data.type || "",
        categoryType: data.categoryType?._id || "",
        eligibility: data.eligibility || "",
        regFeeWithoutKit: data.regFeeWithoutKit?.toString() || "",
        regFeeWithKit: data.regFeeWithKit?.toString() || "",
        examQuestionPapers: data.examQuestionPapers?.toString() || "",
        semester: data.semester || "",
        semesterType: data.semesterType || "None",
        details: data.details || "",
      });

      setEditSubjects(
        data.subjects.length > 0
          ? data.subjects.map(s => ({ name: s.name, fullMarks: s.fullMarks.toString() }))
          : [{ name: "", fullMarks: "" }]
      );

      setShowEditModal(true);
    } catch (err) {
      alert("Error loading course: " + err.message);
    }
  };

  // Handle Edit Form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...editSubjects];
    updated[index][field] = value;
    setEditSubjects(updated);
  };

  const addSubject = () => setEditSubjects(prev => [...prev, { name: "", fullMarks: "" }]);
  const removeSubject = (index) => {
    if (editSubjects.length === 1) return;
    setEditSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const hasEmpty = editSubjects.some(s => !s.name.trim() || !s.fullMarks.trim());
    if (hasEmpty) return alert("Please fill all subject names and full marks!");

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(editFormData).forEach(([k, v]) => formData.append(k, v));

    const cleanSubjects = editSubjects
      .filter(s => s.name.trim())
      .map(s => ({ name: s.name.trim(), fullMarks: Number(s.fullMarks) }));

    formData.append("subjects", JSON.stringify(cleanSubjects));
    if (editPhoto) formData.append("photo", editPhoto);

    try {
      const res = await fetch(`${API_BASE}/courses/${editingCourseId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      alert("Course Updated Successfully!");
      setShowEditModal(false);
      fetchCourses(search);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoError = (e, path) => {
    e.target.style.display = "none";
    e.target.parentElement.innerHTML = '<div class="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 mx-auto">No Photo</div>';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Courses
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => fetchCourses(search)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-course")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm relative">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center w-16">Photo</th>
                    <th className="border p-2 text-left">Course Name</th>
                    <th className="border p-2 text-center">Duration</th>
                    <th className="border p-2 text-center">Type</th>
                    <th className="border p-2 text-center">Total Subjects</th>
                    <th className="border p-2 text-left">Subjects</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c, index) => (
                    <tr key={c._id} className="hover:bg-gray-50 relative">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {c.photo ? (
                          <img
                            src={`${API_BASE_URL}${c.photo}`}
                            alt="Course"
                            className="w-12 h-12 object-cover rounded-md mx-auto"
                            onError={(e) => handlePhotoError(e, c.photo)}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 mx-auto">
                            No Photo
                          </div>
                        )}
                      </td>
                      <td className="border p-2">{c.name}</td>
                      <td className="border p-2 text-center">{c.duration}</td>
                      <td className="border p-2 text-center">{c.type}</td>
                      <td className="border p-2 text-center font-bold">{c.totalSubjects}</td>
                      <td className="border p-2">
                        <div className="max-h-24 overflow-y-auto">
                          {c.subjects.map((sub, i) => (
                            <div key={i} className="text-xs py-1">
                              • {sub.name} ({sub.fullMarks} Marks)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border p-2 text-center">
                        <select
                          className="border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            handleAction(c._id, e.target.value);
                            e.target.selectedIndex = 0;
                          }}
                        >
                          <option value="">Action</option>
                          <option value="view">View Details</option>
                          <option value="update">Update</option>
                          <option value="pdf">View PDF</option>
                          <option value="delete">Delete</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-gray-500 py-4 italic">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL - Same as AddCourse style */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Course</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Name *" name="name" value={editFormData.name} onChange={handleEditChange} required />
                <Input label="Duration *" name="duration" value={editFormData.duration} onChange={handleEditChange} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select label="Type *" name="type" value={editFormData.type} onChange={handleEditChange}
                  options={["Certificate", "Diploma", "Advanced Diploma"]} required />
                <Select label="Category *" name="categoryType" value={editFormData.categoryType} onChange={handleEditChange}
                  options={categories.map(cat => ({ value: cat._id, label: cat.name }))} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Eligibility *" name="eligibility" value={editFormData.eligibility} onChange={handleEditChange} required />
                <Input label="Exam Papers *" type="number" name="examQuestionPapers" value={editFormData.examQuestionPapers} onChange={handleEditChange} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Fee (Without KIT) *" type="number" name="regFeeWithoutKit" value={editFormData.regFeeWithoutKit} onChange={handleEditChange} required />
                <Input label="Fee (With KIT) *" type="number" name="regFeeWithKit" value={editFormData.regFeeWithKit} onChange={handleEditChange} required />
              </div>

              {/* Dynamic Subjects */}
              <div className="border-t-4 border-blue-600 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold">Subjects</h4>
                  <button type="button" onClick={addSubject}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                    + Add Subject
                  </button>
                </div>
                {editSubjects.map((sub, i) => (
                  <div key={i} className="flex gap-4 items-end mb-3">
                    <Input label="Subject Name" value={sub.name}
                      onChange={(e) => handleSubjectChange(i, "name", e.target.value)} required />
                    <Input label="Full Marks" type="number" value={sub.fullMarks}
                      onChange={(e) => handleSubjectChange(i, "fullMarks", e.target.value)} required />
                    {editSubjects.length > 1 && (
                      <button type="button" onClick={() => removeSubject(i)}
                        className="text-red-600 hover:text-red-800 text-2xl mb-6">×</button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Details *</label>
                <textarea name="details" value={editFormData.details} onChange={handleEditChange}
                  className="w-full border rounded-md p-2 h-32 focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Photo (Optional)</label>
                {existingPhoto && (
                  <div className="mb-2">
                    <img src={`${API_BASE_URL}${existingPhoto}`} alt="Current" className="w-32 h-32 object-cover rounded-md" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => setEditPhoto(e.target.files[0])}
                  className="w-full border rounded-md p-2" />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Components (Same as before)
const Input = ({ label, ...props }) => (
  <div>
    <label classLabel className="block font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <select {...props} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500">
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);