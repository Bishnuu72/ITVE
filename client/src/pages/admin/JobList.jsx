import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { getAllJobApplications, deleteJobApplication } from "../../services/jobApplyService";
import Swal from "sweetalert2";

export default function JobList() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all job applications
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobApplications();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        Swal.fire("Error", "Failed to fetch job applications.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Navigate to job details
  const handleView = (id) => {
    navigate(`/job-details/${id}`);
  };

  // Delete job application
  const handleDelete = async (id) => {
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
        await deleteJobApplication(id);
        Swal.fire("Deleted!", "The application has been deleted.", "success");
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        Swal.fire("Error!", "Could not delete the application.", "error");
      }
    }
  };

  // Filter jobs by search input
  const filtered = jobs.filter(
    (job) =>
      job.fullName.toLowerCase().includes(search.toLowerCase()) ||
      job.mobile.includes(search)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Job Applications
              </h2>
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center">Gender</th>
                    <th className="border p-2 text-left">Mobile</th>
                    <th className="border p-2 text-left">Apply For</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center w-40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500 italic">
                        No job applications found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((job, index) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{job.fullName}</td>
                        <td className="border p-2 text-center">{job.gender}</td>
                        <td className="border p-2">{job.mobile}</td>
                        <td className="border p-2">{job.applyFor}</td>
                        <td className="border p-2 text-center">{job.status}</td>
                        <td className="border p-2 text-center space-y-2 flex flex-col items-center">
                          <button
                            onClick={() => handleView(job._id)}
                            className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
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
