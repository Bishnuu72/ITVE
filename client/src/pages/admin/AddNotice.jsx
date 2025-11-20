import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createNotice, getNoticeById, updateNotice } from "../../services/noticeService";

export default function AddNotice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    heroNotice: "",
    boardNotice: "",
    admissionNotice: "",
    jobApplyNotice: "",
    thankfulNotice: "",
    centerApplyNotice: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEditMode) {
      getNoticeById(id)
        .then((data) => setFormData(data))
        .catch((err) => {
          Swal.fire({ icon: "error", title: "Error", text: err.message });
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      if (isEditMode) {
        await updateNotice(id, formData, token);
        Swal.fire({ icon: "success", title: "Notice Updated", text: "The notice has been successfully updated." });
      } else {
        await createNotice(formData, token);
        Swal.fire({ icon: "success", title: "Notice Added", text: "The notice has been successfully saved." });
      }
      navigate("/manage-notice");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Failed to save notice." });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              {isEditMode ? "Edit Notice" : "Add Notice"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["heroNotice", "boardNotice", "admissionNotice", "jobApplyNotice", "thankfulNotice", "centerApplyNotice"].map((name) => (
                <div key={name}>
                  <label className="block text-gray-700 font-medium mb-1">
                    {name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                  </label>
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    required={name === "heroNotice"}
                  ></textarea>
                </div>
              ))}

              <div>
                <label className="block text-gray-700 font-medium mb-1">Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/manage-notice")}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-500"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
