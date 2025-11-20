import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Swal from "sweetalert2";
import { addBook, updateBook, getBookById } from "../../services/bookService";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddBook() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courses, setCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    course: "",
    name: "",
    description: "",
    file: null,
    picture: null,
    currentFile: "",
    currentPicture: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/courses`);
        if (!res.ok) throw new Error("Failed to load courses");
        const result = await res.json();
        setCourses(result.data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBookById(id)
        .then((book) => {
          setFormData({
            type: book.type || "",
            course: book.course || "",
            name: book.name || "",
            description: book.description || "",
            file: null,
            picture: null,
            currentFile: book.file,
            currentPicture: book.picture,
          });
        })
        .catch(() => {
          Swal.fire("Error", "Failed to load book data", "error");
          navigate(-1);
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setError("");
  };

  const validateForm = () => {
    const required = ["type", "name", "description"];
    const missing = required.filter((field) => !formData[field]?.toString().trim());

    if (missing.length > 0) {
      setError(`Please fill all required fields: ${missing.join(", ")}`);
      return false;
    }
    if (!id && !formData.file) {
      setError("Please upload the file.");
      return false;
    }
    if (!id && !formData.picture) {
      setError("Please upload the picture.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const submitData = new FormData();
    submitData.append("type", formData.type);
    submitData.append("course", formData.course || "");
    submitData.append("name", formData.name.trim());
    submitData.append("description", formData.description.trim());
    if (formData.file) submitData.append("file", formData.file);
    if (formData.picture) submitData.append("picture", formData.picture);

    try {
      if (id) {
        await updateBook(id, submitData);
        Swal.fire("Success!", "Book updated successfully", "success");
      } else {
        await addBook(submitData);
        Swal.fire("Success!", "Book added successfully", "success");
      }
      navigate("/book-list");
    } catch (err) {
      console.error(err);
      setError("Failed to save book. Please try again.");
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
      currentFile: "",
      currentPicture: "",
    });
    setError("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 text-center text-xl">Loading...</div>
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
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-500 inline-block pb-2">
            {id ? "Edit Book / Download" : "Add New Book / Download"}
          </h1>

          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-10">

              <SectionTitle title="Download Details" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Type</option>
                    <option>Book</option>
                    <option>Notes</option>
                    <option>Other Files</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Choose Course</option>
                    {courses.length > 0 ? (
                      courses.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>{fetchingCourses ? "Loading courses..." : "No courses found"}</option>
                    )}
                  </select>
                </div>

                <TextField
                  label="Name *"
                  name="name"
                  value={formData.name}
                  handleChange={handleChange}
                />

                <TextField
                  label="Description *"
                  name="description"
                  value={formData.description}
                  handleChange={handleChange}
                  type="textarea"
                  rows={5}
                />
              </div>

              <SectionTitle title="File Uploads" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload File (PDF/DOC/Image) {!id ? "*" : "(Leave empty to keep existing)"}
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
                  />
                  {id && formData.currentFile && !formData.file && (
                    <p className="mt-2 text-sm text-green-600">
                      Current: {formData.currentFile}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Picture (Image) {!id ? "*" : "(Leave empty to keep existing)"}
                  </label>
                  <input
                    type="file"
                    name="picture"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700"
                  />
                  {id && formData.currentPicture && !formData.picture && (
                    <p className="mt-2 text-sm text-green-600">
                      Current: {formData.currentPicture}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-6 pt-8">
                <button
                  type="button"
                  onClick={() => navigate("/book-list")}
                  disabled={loading}
                  className="bg-gray-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all shadow disabled:opacity-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? "Saving..." : id ? "Update Book" : "Save Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Your original reusable components — untouched
function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-500 pl-3 mb-4">
      {title}
    </h2>
  );
}

function TextField({ label, name, value, handleChange, type = "text", rows }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={rows}
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