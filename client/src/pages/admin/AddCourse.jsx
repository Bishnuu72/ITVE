import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;
export default function AddCourse() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    code: "",
    duration: "",
    type: "",
    categoryType: "",
    eligibility: "",
    totalSubjects: "",        // ← Ye ab string rahega input mein
    regFeeWithoutKit: "",
    regFeeWithKit: "",
    examQuestionPapers: "",
    semester: "",
    semesterType: "None",
    details: "",
  });

  const [subjects, setSubjects] = useState([{ name: "", fullMarks: "" }]);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses/categories`);
      const { data } = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);

    // Auto update totalSubjects when subjects change
    if (field === "name" && value.trim() !== "") {
      const filledSubjects = updated.filter(s => s.name.trim() !== "");
      setFormData(prev => ({ ...prev, totalSubjects: filledSubjects.length.toString() }));
    }
  };

  const addSubjectRow = () => {
    setSubjects(prev => [...prev, { name: "", fullMarks: "" }]);
  };

  const removeSubjectRow = (index) => {
    if (subjects.length === 1) return;
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
    setFormData(prev => ({ ...prev, totalSubjects: updated.filter(s => s.name.trim()).length.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const hasEmptySubject = subjects.some(s => !s.name.trim() || !s.fullMarks.trim());
    if (hasEmptySubject) return alert("Please fill all subject names and full marks!");

    if (!formData.totalSubjects || isNaN(formData.totalSubjects) || Number(formData.totalSubjects) <= 0) {
      return alert("Total Subjects must be a valid number greater than 0!");
    }

    setIsSubmitting(true);
    setError(null);

    const submitData = new FormData();

    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Convert subjects to proper format and send
    const cleanSubjects = subjects
      .filter(s => s.name.trim() !== "")
      .map(s => ({
        name: s.name.trim(),
        fullMarks: Number(s.fullMarks)
      }));

    submitData.append("subjects", JSON.stringify(cleanSubjects));
    if (photo) submitData.append("photo", photo);

    try {
      const response = await fetch(`${API_BASE}/courses`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add course");
      }

      alert("Course added successfully!");
      navigate("/course-lists");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-blue-600 inline-block pb-2">
              Add New Course
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Course Name *" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Short Name *" name="shortName" value={formData.shortName} onChange={handleChange} required />
             </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Course Code *" name="code" value={formData.code} onChange={handleChange} required />
                <Input label="Duration *" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 6 Months" required />
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-2 gap-6">
                <Select label="Type *" name="type" value={formData.type} onChange={handleChange}
                  options={["Certificate", "Diploma", "Advanced Diploma"]} required />
                <Select label="Category *" name="categoryType" value={formData.categoryType} onChange={handleChange}
                  options={categories.map(c => ({ value: c._id, label: c.name }))} required />
              </div>

              {/* Row 4 */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Eligibility *" name="eligibility" value={formData.eligibility} onChange={handleChange} required />
                <Input label="Exam Question Papers *" name="examQuestionPapers" type="number" value={formData.examQuestionPapers} onChange={handleChange} required />
              </div>

              {/* Fees */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Reg Fee (Without KIT) *" type="number" name="regFeeWithoutKit" value={formData.regFeeWithoutKit} onChange={handleChange} required />
                <Input label="Reg Fee (With KIT) *" type="number" name="regFeeWithKit" value={formData.regFeeWithKit} onChange={handleChange} required />
              </div>

              {/* Semester */}
              <div className="grid md:grid-cols-3 gap-6">
                <Input label="No. of Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="e.g., 2" />
                <Select label="Semester Type" name="semesterType" value={formData.semesterType} onChange={handleChange}
                  options={["Half Yearly", "Yearly", "None"]} />
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Course Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* SUBJECTS - DYNAMIC */}
              <div className="border-t-4 border-blue-600 pt-8 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Course Subjects</h3>
                  <button type="button" onClick={addSubjectRow}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                    + Add Subject
                  </button>
                </div>

                <div className="space-y-4">
                  {subjects.map((sub, idx) => (
                    <div key={idx} className="flex gap-4 items-end bg-gray-50 p-5 rounded-xl border">
                      <div className="flex-1">
                        <Input label="Subject Name" value={sub.name}
                          onChange={(e) => handleSubjectChange(idx, "name", e.target.value)}
                          placeholder="e.g., Computer Fundamentals" required />
                      </div>
                      <div className="w-48">
                        <Input label="Full Marks" type="number" value={sub.fullMarks}
                          onChange={(e) => handleSubjectChange(idx, "fullMarks", e.target.value)}
                          placeholder="100" min="1" required />
                      </div>
                      {subjects.length > 1 && (
                        <button type="button" onClick={() => removeSubjectRow(idx)}
                          className="text-red-600 hover:text-red-800 text-3xl mb-2">×</button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Auto-filled Total Subjects */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-blue-800">
                    Total Subjects: <span className="text-2xl">{subjects.filter(s => s.name.trim()).length}</span>
                  </p>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block font-bold text-gray-800 mb-2 text-lg">Course Details *</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full border-2 rounded-xl p-5 h-40 focus:ring-4 focus:ring-blue-300"
                  placeholder="Write complete course description..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-8 pt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-green-700 disabled:opacity-50 shadow-xl"
                >
                  {isSubmitting ? "Saving Course..." : "Save Course"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/course-lists")}
                  className="bg-gray-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-gray-700 shadow-xl"
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

// Reusable Components
const Input = ({ label, ...props }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <select {...props} className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500">
      <option value="">Select</option>
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);