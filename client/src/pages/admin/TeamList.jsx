import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTeamMembers,
  deleteTeamMember,
} from "../../services/teamService";

export default function TeamList() {
  const [search, setSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await getTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const filtered = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    navigate(`/edit-team/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTeamMember(id);
        Swal.fire("Deleted!", "Team member has been deleted.", "success");
        fetchTeamMembers(); // Refresh list
      } catch (error) {
        Swal.fire("Error", "Failed to delete team member.", "error");
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
                All Team Members
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => navigate("/add-team")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm table-auto">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-center w-20">Photo</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center w-28">Status</th>
                    <th className="border p-2 text-center w-36">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member, index) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="h-12 w-12 object-cover mx-auto rounded-full"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No Image</span>
                        )}
                      </td>
                      <td className="border p-2">{member.name}</td>
                      <td className="border p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            member.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="border p-2 text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(member._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 min-w-[70px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
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
                        colSpan="5"
                        className="text-center py-4 text-gray-500 italic"
                      >
                        No team members found.
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