import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddDownload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    course: "",
    name: "",
    description: "",
    file: null,
    picture: null,
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch courses like in AddStudent.jsx
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/courses`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const { data } = await response.json();
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setError("");
  };

  // Enhanced validation like in AddStudent.jsx
  const validateForm = () => {
    const requiredFields = ["type", "name", "description"];
    const missingFields = [];
    for (const field of requiredFields) {
      const value = formData[field]?.toString().trim();
      if (!value || value === "") {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field =>
        field.replace(/([A-Z])/g, " $1").replace(/\b\w/g, l => l.toUpperCase()).trim()
      ).join(", ");
      const errMsg = `Please fill in all required fields - Missing: ${fieldNames}`;
      setError(errMsg);
      console.error("🔍 Validation failed - Missing fields:", missingFields);
      return false;
    }
    if (!formData.file) {
      setError("Please upload the main file.");
      return false;
    }
    if (!formData.picture) {
      setError("Please upload the picture.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "file" && key !== "picture") {
        const value = formData[key];
        if (typeof value === "string") {
          submitData.append(key, value.trim());
        } else {
          submitData.append(key, value);
        }
      }
    });
    if (formData.file) submitData.append("file", formData.file);
    if (formData.picture) submitData.append("picture", formData.picture);

    // Log for debug
    console.log("🔍 Submitting FormData - Keys:", Array.from(submitData.keys()));
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value.name ? `File (${value.name})` : `"${value}"`);
    }

    try {
      const response = await fetch(`${API_BASE}/downloads`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message} (ID: ${result.data._id})`);
        handleReset();
        navigate("/download-list?refetch=true");
      } else {
        console.error("Backend Error Response:", result);
        setError(result.error || `Failed to save download. Status: ${response.status}`);
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      type: "",
      course: "",
      name: "",
      description: "",
      file: null,
      picture: null,
    });
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-500 inline-block pb-2">
            Manage Download
          </h1>

          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Download Details */}
              <SectionTitle title="Download Details" />
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField
                  field={{ name: "type", label: "Type *", options: ["Notice", "Result", "Syllabus", "Certificate", "Admit Card", "Receipt", "Other"] }}
                  formData={formData}
                  handleChange={handleChange}
                />
                <SelectField
                  field={{
                    name: "course",
                    label: "Course",
                    options: courses.length > 0 ? courses.map(c => c.name) : ["No courses available"],
                  }}
                  formData={formData}
                  handleChange={handleChange}
                />
                <TextField label="Name *" name="name" value={formData.name} handleChange={handleChange} />
                <TextField
                  label="Description *"
                  name="description"
                  value={formData.description}
                  handleChange={handleChange}
                  type="textarea"
                  rows={5}
                />
              </div>

              {/* File Uploads */}
              <SectionTitle title="File Uploads" />
              <div className="grid md:grid-cols-2 gap-6">
                <FileField label="Upload File (PDF/Doc/Image, Max 10MB) *" name="file" handleChange={handleChange} />
                <FileField label="Upload Picture (Image, Max 10MB) *" name="picture" handleChange={handleChange} />
              </div>

              {/* Error Display */}
              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="bg-gray-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all shadow disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable components (copied/adapted from AddStudent.jsx for consistency)
function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-500 pl-3 mb-4">{title}</h2>
  );
}

function TextField({ label, name, handleChange, value, type = "text", rows }) {
  const isTextarea = type === "textarea";
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={rows || 3}
          required
          className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      )}
    </div>
  );
}

function SelectField({ field, formData, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
      <select
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select {field.label}</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileField({ label, name, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type="file"
        name={name}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
      />
    </div>
  );
}