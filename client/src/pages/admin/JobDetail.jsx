import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobApplicationById, updateJobStatus } from "../../services/jobApplyService";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Swal from "sweetalert2";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getJobApplicationById(id);
        const appData = data.application || data;
        setApplication(appData);
        setStatus(appData.status); // initial status
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (!application)
    return <p className="p-6 text-center text-red-500">Application not found.</p>;

  // Permanent resume URL
  const resumeUrl = application.resume
    ? `${import.meta.env.VITE_APP_UPLOADS_URL}/${application.resume.replace(/^resumes[\\/]/, "resumes/")}`
    : null;

  // Handle status update
  const handleStatusUpdate = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Update status to "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        await updateJobStatus(id, status);
        Swal.fire("Updated!", "The status has been updated.", "success");
        setApplication({ ...application, status });
      } catch (err) {
        Swal.fire("Error!", "Failed to update status.", "error");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <p><strong>Full Name:</strong> {application.fullName}</p>
              <p><strong>Father's Name:</strong> {application.fatherName}</p>
              <p><strong>Mother's Name:</strong> {application.motherName}</p>
              <p><strong>DOB:</strong> {new Date(application.dob).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {application.gender}</p>
              <p><strong>State:</strong> {application.state}</p>
              <p><strong>District:</strong> {application.district}</p>
              <p><strong>City:</strong> {application.city}</p>
              <p><strong>Pincode:</strong> {application.pincode}</p>
              <p><strong>Address:</strong> {application.address}</p>
              <p><strong>Religion:</strong> {application.religion}</p>
              <p><strong>Category:</strong> {application.category}</p>
              <p><strong>Qualification:</strong> {application.qualification}</p>
              <p><strong>JBCE Roll:</strong> {application.jbceRoll}</p>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Mobile:</strong> {application.mobile}</p>
              <p><strong>Apply For:</strong> {application.applyFor}</p>
            </div>

            {resumeUrl && (
              <div className="mt-4">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View / Download Resume
                </a>
              </div>
            )}

            {/* Admin Status Update */}
            <div className="mt-6 flex items-center gap-3">
              <label className="font-semibold">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
