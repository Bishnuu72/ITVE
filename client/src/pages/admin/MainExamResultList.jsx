import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

export default function MainExamResultList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Dummy main exam result data
  const results = [
    {
      id: 1,
      student: "Ram Prasad Mahato",
      courseName: "Computer Science",
      subjectName: "Data Structures",
      examName: "Final Exam",
      semesterType: "Semester 1",
      remark: "Pass",
    },
    {
      id: 2,
      student: "Sita Sharma",
      courseName: "IT",
      subjectName: "Networking",
      examName: "Mid Term",
      semesterType: "Semester 2",
      remark: "Fail",
    },
    {
      id: 3,
      student: "Raj Kumar",
      courseName: "Programming",
      subjectName: "Java",
      examName: "Final Exam",
      semesterType: "Semester 1",
      remark: "Pass",
    },
  ];

  const filtered = results.filter(
    (res) =>
      res.student.toLowerCase().includes(search.toLowerCase()) ||
      res.courseName.toLowerCase().includes(search.toLowerCase()) ||
      res.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-exam-result/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exam result?")) {
      alert(`Result with ID ${id} deleted (demo only)`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Online Exam Results
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by student, course, or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                  GO
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left w-48">Student</th>
                    <th className="border p-2 text-left w-48">Course Name</th>
                    <th className="border p-2 text-left w-48">Subject Name</th>
                    <th className="border p-2 text-left w-40">Exam</th>
                    <th className="border p-2 text-center w-32">Semester Type</th>
                    <th className="border p-2 text-center w-24">Remark</th>
                    <th className="border p-2 text-center w-36">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((res, index) => (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{res.student}</td>
                      <td className="border p-2">{res.courseName}</td>
                      <td className="border p-2">{res.subjectName}</td>
                      <td className="border p-2">{res.examName}</td>
                      <td className="border p-2 text-center">{res.semesterType}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            res.remark.toLowerCase() === "pass"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {res.remark}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(res.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 min-w-[70px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 min-w-[70px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No exam results found.
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
