import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createTeamMember,
  getTeamMemberById,
  updateTeamMember,
} from "../../services/teamService";

export default function AddTeam() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    description: "",
    photo: null,
    status: "Active",
  });

  const [preview, setPreview] = useState(null);

  // Fetch existing data if editing
  useEffect(() => {
    if (id) {
      getTeamMemberById(id).then((data) => {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          description: data.description || "",
          photo: null,
          status: data.status || "Active",
        });
        setPreview(data.photoUrl || null);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("mobile", formData.mobile);
    payload.append("description", formData.description);
    payload.append("status", formData.status);
    if (formData.photo) {
      payload.append("image", formData.photo);
    }

    try {
      if (id) {
        await updateTeamMember(id, payload);
        Swal.fire("Updated!", "Team member updated successfully.", "success");
      } else {
        await createTeamMember(payload);
        Swal.fire("Added!", "Team member added successfully.", "success");
      }
      navigate("/team-list");
    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
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
              {id ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-medium mb-1">Name :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium mb-1">Email :</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block font-medium mb-1">Mobile :</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  pattern="[0-9]{10}"
                  title="Enter a valid 10-digit mobile number"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">Description :</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block font-medium mb-1">Photo :</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  className="text-sm"
                  accept="image/*"
                />
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium mb-1">Status :</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-500"
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