// OnlineExamList.jsx → FINAL 100% PERFECT VERSION
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllExams, deleteExam } from "../../services/onlineExamService";

export default function OnlineExamList() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const response = await getAllExams();
      // response.data or direct array
      setExams(response.data || response || []);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch exams", "error");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-online-exam/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteExam(id);
        Swal.fire("Deleted!", "Exam has been deleted.", "success");
        fetchExams();
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete exam", "error");
      }
    }
  };

  const filtered = exams.filter((exam) =>
    exam.examName?.toLowerCase().includes(search.toLowerCase()) ||
    exam.course?.toLowerCase().includes(search.toLowerCase()) ||
    exam.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">

            {/* Header - Your Original Beautiful Design */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Online Exams
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by course or exam..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={fetchExams}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-online-exam")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add Exam
                </button>
              </div>
            </div>

            {/* Table - Clean & Professional */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left w-80">Course Name</th>
                    <th className="border p-2 text-left w-80">Exam Name</th>
                    <th className="border p-2 text-left w-60">Subject</th>
                    <th className="border p-2 text-center w-40">Exam Type</th>
                    <th className="border p-2 text-center w-40">Multiple Subjects</th>
                    <th className="border p-2 text-center w-32">Duration</th>
                    <th className="border p-2 text-center w-40">Total / Pass</th>
                    <th className="border p-2 text-center w-48">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((exam, index) => (
                      <tr key={exam._id} className="hover:bg-gray-50 transition">
                        <td className="border p-2 text-center font-medium">{index + 1}</td>
                        <td className="border p-2 font-semibold text-gray-800">
                          {exam.course || "N/A"}
                        </td>
                        <td className="border p-2 text-gray-700">{exam.examName}</td>
                        <td className="border p-2 text-gray-600">{exam.subject}</td>
                        <td className="border p-2 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            exam.examTypes === "Main Exam" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {exam.examTypes}
                          </span>
                        </td>
                        <td className="border p-2 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            exam.multipleSubjectTypes === "Yes" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {exam.multipleSubjectTypes}
                          </span>
                        </td>
                        <td className="border p-2 text-center text-gray-700">
                          {exam.duration} mins
                        </td>
                        <td className="border p-2 text-center">
                          <span className="font-bold text-lg text-gray-800">{exam.totalMark}</span>
                          <span className="text-gray-500 mx-2">/</span>
                          <span className="font-bold text-green-600">{exam.passMark}</span>
                        </td>
                        <td className="border p-2 text-center space-x-2">
                          <button
                            onClick={() => handleEdit(exam._id)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 font-medium text-sm w-20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exam._id)}
                            className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 font-medium text-sm w-20"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-gray-500 italic text-lg">
                        No exams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}