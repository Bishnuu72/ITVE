import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export default function NoticeList() {
  const [notices, setNotices] = useState([
    { id: 1, centre: "RAVI COMPUTER INSTITUTE", notice: "New batch starts from 01/11/2025" },
    { id: 2, centre: "SUPERVISION COMPUTER EDUCATION", notice: "Holiday on 25/10/2025" },
    { id: 3, centre: "THE COMPUTER WORLD", notice: "Exam schedule released" },
    { id: 4, centre: "OASIS COMPUTER EDUCATION", notice: "Maintenance on 30/10/2025" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Notices
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Centre</th>
                    <th className="border p-2 text-left">Notice</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((n, index) => (
                    <tr key={n.id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{n.centre}</td>
                      <td className="border p-2">{n.notice}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {notices.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-500 py-4 italic">
                        No notices found.
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
