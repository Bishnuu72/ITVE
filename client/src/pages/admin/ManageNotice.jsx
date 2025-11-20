import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getNotices, deleteNotice } from "../../services/noticeService";

export default function ManageNotice() {
  const [search, setSearch] = useState("");
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNotices()
      .then((data) => {
        console.log("Fetched notices:", data); // Debug log
        setNotices(data);
      })
      .catch((err) => {
        Swal.fire({ icon: "error", title: "Error", text: err.message });
      });
  }, []);

  const filtered = notices.filter((notice) =>
    Object.values(notice).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleEdit = (id) => {
    navigate(`/edit-notice/${id}`);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.warn("Attempted to delete notice with undefined ID");
      Swal.fire({ icon: "error", title: "Error", text: "Invalid notice ID" });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteNotice(id);
        Swal.fire("Deleted!", "Notice has been deleted.", "success");
        setNotices(notices.filter((n) => n._id !== id)); // Use _id if that's the actual key
      } catch (err) {
        Swal.fire({ icon: "error", title: "Error", text: err.message });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                Manage Notices
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 flex-1"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-notice")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm min-w-[1000px]">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center">Sl No</th>
                    <th className="border p-2 text-left">Hero Notice</th>
                    <th className="border p-2 text-left">Board Notice</th>
                    <th className="border p-2 text-left">Admission Notice</th>
                    <th className="border p-2 text-left">Job Apply Notice</th>
                    <th className="border p-2 text-left">Thankful Notice</th>
                    <th className="border p-2 text-left">Center Apply Notice</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((notice, index) => (
                    <tr key={notice._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{notice.heroNotice}</td>
                      <td className="border p-2">{notice.boardNotice}</td>
                      <td className="border p-2">{notice.admissionNotice}</td>
                      <td className="border p-2">{notice.jobApplyNotice}</td>
                      <td className="border p-2">{notice.thankfulNotice}</td>
                      <td className="border p-2">{notice.centerApplyNotice}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            notice.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {notice.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(notice._id)}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-500 italic"
                      >
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