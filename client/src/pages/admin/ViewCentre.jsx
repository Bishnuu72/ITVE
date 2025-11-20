import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewCentre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [centre, setCentre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCentre();
  }, [id]);

  const fetchCentre = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setCentre(data.centre);
    } catch (err) {
      console.error("Error fetching centre:", err);
      setError("Failed to load centre details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading centre details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !centre) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center py-8 text-red-600">
                <p>{error || "Centre not found."}</p>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Back to List
                </button>
              </div>
            </div>
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

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 inline-block pb-1">
                View Centre: {centre.name}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/update-centre/${centre._id}`)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Back to List
                </button>
              </div>
            </div>

            <div className="space-y-10">
              {/* Manage Centre */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Manage Centre</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Type:</label> <p className="text-gray-600">{centre.type}</p></div>
                  <div><label className="block font-medium">Status:</label> <p className="text-gray-600">{centre.status}</p></div>
                  <div><label className="block font-medium">Create Branch:</label> <p className="text-gray-600">{centre.createBranch}</p></div>
                  <div><label className="block font-medium">Commission (%):</label> <p className="text-gray-600">{centre.commission}</p></div>
                  <div><label className="block font-medium">Fees (Rs.):</label> <p className="text-gray-600">{centre.fees}</p></div>
                </div>
              </section>

              {/* Owner Details */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Owner Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Owner Name:</label> <p className="text-gray-600">{centre.ownerName}</p></div>
                  <div><label className="block font-medium">Father's Name:</label> <p className="text-gray-600">{centre.fatherName}</p></div>
                  <div><label className="block font-medium">Mother's Name:</label> <p className="text-gray-600">{centre.motherName}</p></div>
                  <div><label className="block font-medium">DOB:</label> <p className="text-gray-600">{centre.dob ? new Date(centre.dob).toLocaleDateString() : 'N/A'}</p></div>
                  <div><label className="block font-medium">Education:</label> <p className="text-gray-600">{centre.education}</p></div>
                  <div><label className="block font-medium">Mobile:</label> <p className="text-gray-600">{centre.mobile}</p></div>
                  <div><label className="block font-medium">Alt Mobile:</label> <p className="text-gray-600">{centre.altMobile || 'N/A'}</p></div>
                  <div><label className="block font-medium">Email:</label> <p className="text-gray-600">{centre.email}</p></div>
                  <div><label className="block font-medium">Gender:</label> <p className="text-gray-600">{centre.gender}</p></div>
                </div>
              </section>

              {/* Owner Address */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Owner Address</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Street:</label> <p className="text-gray-600">{centre.street}</p></div>
                  <div><label className="block font-medium">Town/Village:</label> <p className="text-gray-600">{centre.town}</p></div>
                  <div><label className="block font-medium">State:</label> <p className="text-gray-600">{centre.state}</p></div>
                  <div><label className="block font-medium">District:</label> <p className="text-gray-600">{centre.district}</p></div>
                  <div><label className="block font-medium">Country:</label> <p className="text-gray-600">{centre.country}</p></div>
                  <div><label className="block font-medium">Pin Code:</label> <p className="text-gray-600">{centre.pin}</p></div>
                </div>
              </section>

              {/* Centre Details */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Centre Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Centre Name:</label> <p className="text-gray-600">{centre.centreName}</p></div>
                  <div><label className="block font-medium">Centre Code:</label> <p className="text-gray-600">{centre.centreCode}</p></div>
                  <div><label className="block font-medium">Login ID:</label> <p className="text-gray-600">{centre.loginId}</p></div>
                  <div><label className="block font-medium">Password:</label> <p className="text-gray-600">*** Hidden ***</p></div>
                  <div><label className="block font-medium">Street:</label> <p className="text-gray-600">{centre.centreStreet}</p></div>
                  <div><label className="block font-medium">Town/Village:</label> <p className="text-gray-600">{centre.centreTown}</p></div>
                  <div><label className="block font-medium">State:</label> <p className="text-gray-600">{centre.centreState}</p></div>
                  <div><label className="block font-medium">District:</label> <p className="text-gray-600">{centre.centreDistrict}</p></div>
                  <div><label className="block font-medium">Country:</label> <p className="text-gray-600">{centre.centreCountry}</p></div>
                  <div><label className="block font-medium">Pin Code:</label> <p className="text-gray-600">{centre.centrePin}</p></div>
                </div>
              </section>

              {/* Franchise & Facilities */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Franchise & Facilities</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Franchise Type:</label> <p className="text-gray-600">{centre.franchiseType}</p></div>
                  <div><label className="block font-medium">Old Academy:</label> <p className="text-gray-600">{centre.oldAcademy || 'N/A'}</p></div>
                  <div><label className="block font-medium">Location:</label> <p className="text-gray-600">{centre.location}</p></div>
                  <div><label className="block font-medium">Area (sqft):</label> <p className="text-gray-600">{centre.area}</p></div>
                  <div><label className="block font-medium">Theory Room:</label> <p className="text-gray-600">{centre.theoryRoom}</p></div>
                  <div><label className="block font-medium">Practical Room:</label> <p className="text-gray-600">{centre.practicalRoom}</p></div>
                  <div><label className="block font-medium">Reception Room:</label> <p className="text-gray-600">{centre.receptionRoom}</p></div>
                  <div><label className="block font-medium">Internet:</label> <p className="text-gray-600">{centre.internet}</p></div>
                  <div><label className="block font-medium">Printer/Scanner:</label> <p className="text-gray-600">{centre.printer}</p></div>
                  <div><label className="block font-medium">Computers:</label> <p className="text-gray-600">{centre.computers}</p></div>
                </div>
              </section>

              {/* Courses Interested */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Courses Interested</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Software Courses:</label> <p className="text-gray-600">{centre.softwareCourses}</p></div>
                  <div><label className="block font-medium">Hardware Courses:</label> <p className="text-gray-600">{centre.hardwareCourses}</p></div>
                  <div><label className="block font-medium">Vocational Courses:</label> <p className="text-gray-600">{centre.vocationalCourses}</p></div>
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Documents</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">PAN No:</label> <p className="text-gray-600">{centre.pan}</p></div>
                  <div><label className="block font-medium">Aadhaar No:</label> <p className="text-gray-600">{centre.aadhaar}</p></div>
                  <div><label className="block font-medium">PAN Card:</label> <p className="text-gray-600">{centre.panCard ? <a href={`${API_BASE_URL}/${centre.panCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a> : 'N/A'}</p></div>
                  <div><label className="block font-medium">Aadhaar Card:</label> <p className="text-gray-600">{centre.aadhaarCard ? <a href={`${API_BASE_URL}/${centre.aadhaarCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a> : 'N/A'}</p></div>
                  <div><label className="block font-medium">Passport Photo:</label> <p className="text-gray-600">{centre.passportPhoto ? <a href={`${API_BASE_URL}/${centre.passportPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a> : 'N/A'}</p></div>
                  <div><label className="block font-medium">Centre Logo:</label> <p className="text-gray-600">{centre.centreLogo ? <a href={`${API_BASE_URL}/${centre.centreLogo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a> : 'N/A'}</p></div>
                  {/* Add more file links as needed */}
                </div>
              </section>

              {/* Additional Info */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Additional Info</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block font-medium">Balance:</label> <p className="text-gray-600">₹{centre.balance?.toFixed(2) || 0}</p></div>
                  <div><label className="block font-medium">Total Registrations:</label> <p className="text-gray-600">{centre.totalReg || 0}</p></div>
                  <div><label className="block font-medium">Complete Registrations:</label> <p className="text-gray-600">{centre.completeReg || 0}</p></div>
                  <div><label className="block font-medium">Source:</label> <p className="text-gray-600">{centre.source}</p></div>
                  <div><label className="block font-medium">Created:</label> <p className="text-gray-600">{new Date(centre.createdAt).toLocaleDateString()}</p></div>
                  <div><label className="block font-medium">Approved:</label> <p className="text-gray-600">{centre.approved ? 'Yes' : 'No'}</p></div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}