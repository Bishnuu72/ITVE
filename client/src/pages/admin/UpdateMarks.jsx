import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function UpdateMarks() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questionPaper, setQuestionPaper] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [existingQuestionPaper, setExistingQuestionPaper] = useState("");
  const [existingAnswerSheet, setExistingAnswerSheet] = useState("");

  useEffect(() => {
    fetchStudentAndSubjects();
  }, [id]);

  const fetchStudentAndSubjects = async () => {
    try {
      setLoading(true);

      const studentRes = await fetch(`${API_BASE}/students/${id}`);
      if (!studentRes.ok) throw new Error("Student not found");
      const { data: stu } = await studentRes.json();

      setStudent(stu);
      setExistingQuestionPaper(stu.questionPaper || "");
      setExistingAnswerSheet(stu.answerSheet || "");

      // Saved marks
      if (stu.marks && stu.marks.length > 0) {
        setSubjects(stu.marks.map((m, i) => ({
          id: i + 1,
          name: m.name,
          fullMarks: m.fullMarks,
          obtained: m.obtained?.toString() || "",
        })));
      }
      // Load from course
      else if (stu.course) {
        const courseName = typeof stu.course === "string" ? stu.course : stu.course.name || "";
        const cleanName = courseName.replace(/\s*\([^)]*\)/g, "").trim();

        const searchRes = await fetch(`${API_BASE}/courses`);
        const { data: allCourses } = await searchRes.json();

        const matchedCourse = allCourses.find(c => {
          const dbName = c.name.toLowerCase().trim();
          const cleanDbName = dbName.replace(/\s*\([^)]*\)/g, "").trim();
          return cleanDbName === cleanName.toLowerCase() || dbName.includes(cleanName.toLowerCase());
        });

        if (matchedCourse?.subjects?.length > 0) {
          setSubjects(matchedCourse.subjects.map((s, i) => ({
            id: i + 1,
            name: s.name,
            fullMarks: s.fullMarks,
            obtained: "",
          })));
        }
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, value) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, obtained: value } : s));
  };

  const handleSave = async () => {
    if (subjects.length === 0) return alert("No subjects to save");

    setIsSubmitting(true);
    const formData = new FormData();

    const marksToSave = subjects.map(({ name, fullMarks, obtained }) => ({
      name,
      fullMarks: Number(fullMarks),
      obtained: obtained === "" ? null : Number(obtained),
    }));

    formData.append("marks", JSON.stringify(marksToSave));
    if (questionPaper) formData.append("questionPaper", questionPaper);
    if (answerSheet) formData.append("answerSheet", answerSheet);

    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Marks & files saved successfully!");
      fetchStudentAndSubjects(); // Refresh to show new files
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PERFECT FILE PREVIEW FUNCTION
  const renderFilePreview = (filePath, label) => {
    if (!filePath) return null;

    const url = `${API_BASE_URL}/uploads/${filePath}`;
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(filePath);

    return (
      <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-300">
        <p className="font-bold text-green-700 mb-2">Current {label}:</p>
        {isImage ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="block">
            <img src={url} alt={label} className="w-48 h-48 object-cover rounded-lg shadow-lg border-4 border-white" />
          </a>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
          >
            View {label} (PDF)
          </a>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-2xl font-bold text-blue-600 animate-pulse">Loading Student Data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8">

            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-8">
              Update Marks - {student?.studentName}
            </h2>

            {/* Student Info */}
            <div className="grid md:grid-cols-2 gap-10 mb-10 bg-gray-50 p-8 rounded-xl border-2 border-gray-300">
              <div className="space-y-4">
                <p className="text-xl"><strong>Enrollment No:</strong> <span className="font-bold text-blue-700">{student?.enrollmentNo}</span></p>
                <p className="text-xl"><strong>Roll No:</strong> <span className="font-bold text-blue-700">{student?.rollNo}</span></p>
                <p className="text-xl"><strong>Course:</strong> <span className="font-bold text-green-700">{student?.course}</span></p>
              </div>
              <div className="flex justify-end">
                {student?.studentPhoto ? (
                  <img
                    src={`${API_BASE_URL}/uploads/${student.studentPhoto}`}
                    alt="Student"
                    className="w-40 h-40 rounded-2xl object-cover shadow-2xl border-8 border-white"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-300 rounded-2xl flex items-center justify-center text-gray-600 font-bold">
                    No Photo
                  </div>
                )}
              </div>
            </div>

            {/* Marks Table */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter Obtained Marks</h3>
              {subjects.length > 0 ? (
                <div className="border-4 border-gray-300 rounded-xl overflow-hidden shadow-2xl">
                  <table className="w-full text-lg">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <tr>
                        <th className="p-6 text-left">Subject</th>
                        <th className="p-6 text-center">Full Marks</th>
                        <th className="p-6 text-center">Obtained Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="border-b hover:bg-gray-50">
                          <td className="p-6 font-medium text-gray-800">{sub.name}</td>
                          <td className="p-6 text-center font-semibold">{sub.fullMarks}</td>
                          <td className="p-6 text-center">
                            <input
                              type="number"
                              value={sub.obtained || ""}
                              onChange={(e) => handleChange(sub.id, e.target.value)}
                              className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 font-medium"
                              placeholder="0"
                              min="0"
                              max={sub.fullMarks}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-red-50 rounded-xl border-4 border-red-300">
                  <p className="text-3xl font-bold text-red-600">No subjects found for this course!</p>
                </div>
              )}
            </div>

            {/* Documents Upload - WITH PERFECT PREVIEW */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-3xl border-4 border-blue-300 shadow-xl">
                <label className="block text-2xl font-bold mb-6 text-blue-900">
                  {existingQuestionPaper ? "Replace Question Paper" : "Upload Question Paper"}
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setQuestionPaper(e.target.files[0])}
                  className="w-full file:mr-6 file:py-4 file:px-8 file:rounded-xl file:bg-blue-700 file:text-white text-lg"
                />
                {existingQuestionPaper && renderFilePreview(existingQuestionPaper, "Question Paper")}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-3xl border-4 border-green-300 shadow-xl">
                <label className="block text-2xl font-bold mb-6 text-green-900">
                  {existingAnswerSheet ? "Replace Answer Sheet" : "Upload Answer Sheet"}
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setAnswerSheet(e.target.files[0])}
                  className="w-full file:mr-6 file:py-4 file:px-8 file:rounded-xl file:bg-green-700 file:text-white text-lg"
                />
                {existingAnswerSheet && renderFilePreview(existingAnswerSheet, "Answer Sheet")}
              </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
              <button
                onClick={handleSave}
                disabled={isSubmitting || subjects.length === 0}
                className="px-20 py-8 bg-green-600 text-white text-4xl font-bold rounded-3xl hover:bg-green-700 disabled:opacity-50 shadow-3xl transform hover:scale-105 transition duration-300"
              >
                {isSubmitting ? "SAVING..." : "SAVE MARKS & FILES"}
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 font-bold text-xl underline"
              >
                ← Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}