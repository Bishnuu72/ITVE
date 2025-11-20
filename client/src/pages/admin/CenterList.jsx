import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { FiMoreVertical } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CentreList() {
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [approvalLoading, setApprovalLoading] = useState({});
  const [passwordLoading, setPasswordLoading] = useState({}); // Per-row loading for send password
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch centres (includes online submissions from CenterApplyForm)
  const fetchCentres = async (searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE_URL}/api/centres${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCentres(data || []);
    } catch (err) {
      console.error("Error fetching centres:", err);
      setError("Failed to load centres. Please check the server or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCentres(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (id, action) => {
    setOpenMenu(null);
    switch (action) {
      case "view":
        navigate(`/view-centre/${id}`);
        break;
      case "viewEnquiry":
        navigate(`/centre-enquiry/${id}`);
        break;
      case "viewStaff":
        navigate(`/centre-staff/${id}`);
        break;
      case "subCentre":
        navigate(`/centre-subcentre/${id}`);
        break;
      case "students":
        navigate(`/centre-students/${id}`);
        break;
      case "update":
        navigate(`/update-centre/${id}`);
        break;
      case "id":
        navigate(`/centre-id/${id}`);
        break;
      case "certificate":
        navigate(`/centre-certificate/${id}`);
        break;
      case "renewalCertificate":
        navigate(`/centre-renewal-certificate/${id}`);
        break;
      case "viewRenewal": // NEW: Navigate to renewal details
        navigate(`/centre-renewal/${id}`);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this centre?")) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/centres/${id}/delete`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
              alert(data.message || "Centre deleted successfully");
              fetchCentres(search);
            } else {
              alert(data.error || "Error deleting centre");
            }
          } catch (err) {
            console.error("Delete error:", err);
            alert("Network error: " + err.message);
          }
        }
        break;
      case "approve":
      case "unapprove":
        // Toggle approval (integrated with column button)
        const centre = centres.find(c => c._id === id);
        if (centre) toggleApproval(id, centre.approved);
        break;
      case "sendPassword":
        // Send password via API
        setPasswordLoading((prev) => ({ ...prev, [id]: true }));
        try {
          const response = await fetch(`${API_BASE_URL}/api/centres/${id}/send-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });
          const data = await response.json();
          if (response.ok) {
            alert(data.message || "Password sent successfully");
          } else {
            alert(data.error || "Error sending password");
          }
        } catch (err) {
          console.error("Send password error:", err);
          alert("Network error: " + err.message);
        } finally {
          setPasswordLoading((prev) => ({ ...prev, [id]: false }));
        }
        break;
      default:
        break;
    }
  };

  // Toggle Approval
  const toggleApproval = async (id, currentApproved) => {
    setApprovalLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !currentApproved }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Approval updated");
        fetchCentres(search); // Refetch to update list
      } else {
        alert(data.error || "Error updating approval");
      }
    } catch (err) {
      console.error("Approval toggle error:", err);
      alert("Network error: " + err.message);
    } finally {
      setApprovalLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading centres...</p>
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
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
                <button onClick={() => fetchCentres(search)} className="ml-2 text-red-600 hover:underline">
                  Retry
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Training Centres
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search centres..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => fetchCentres(search)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-center")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New Centre
                </button>
              </div>
            </div>

            <div className="flex justify-start items-center gap-2 mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
                Export
              </button>
              <button
                onClick={() => navigate("/all-staff")}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
              >
                All Staff
              </button>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Centre Name</th>
                    <th className="border p-2 text-center">Source</th> {/* NEW: To show Online/Admin */}
                    <th className="border p-2 text-center">Code</th>
                    <th className="border p-2 text-center">Balance</th>
                    <th className="border p-2 text-center">Mobile No</th>
                    <th className="border p-2 text-center">Total Reg</th>
                    <th className="border p-2 text-center">Complete Reg</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center">Approved</th>
                    <th className="border p-2 text-center">Renewal Status</th> {/* NEW: Renewal Status Column */}
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {centres.length > 0 ? (
                    centres.map((c, index) => (
                      <tr key={c._id} className="hover:bg-gray-50 relative">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{c.name}</td>
                        <td className="border p-2 text-center">
                          <span className={c.source === 'online' ? 'text-blue-600 font-semibold' : 'text-green-600 font-semibold'}>
                            {c.source === 'online' ? 'Online' : 'Admin'}
                          </span>
                        </td>
                        <td className="border p-2 text-center">{c.code}</td>
                        <td className="border p-2 text-center">{c.balance?.toFixed(2) || 0}</td>
                        <td className="border p-2 text-center">{c.mobile}</td>
                        <td className="border p-2 text-center">{c.totalReg || 0}</td>
                        <td className="border p-2 text-center">{c.completeReg || 0}</td>
                        <td className="border p-2 text-center">{c.status}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => toggleApproval(c._id, c.approved)}
                            disabled={approvalLoading[c._id]}
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              c.approved
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            } disabled:opacity-50`}
                          >
                            {approvalLoading[c._id] ? '...' : c.approved ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="border p-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            c.renewalStatus === 'Active' ? 'bg-green-100 text-green-800' :
                            c.renewalStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            c.renewalStatus === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {c.renewalStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="border p-2 text-center relative" ref={openMenu === c._id ? menuRef : null}>
                          <button
                            onClick={() => setOpenMenu(openMenu === c._id ? null : c._id)}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <FiMoreVertical size={20} />
                          </button>

                          {openMenu === c._id && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
                              <ul className="py-1">
                                <li
                                  onClick={() => handleAction(c._id, "view")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  👁️ View
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "viewEnquiry")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  📄 View Enquiry
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "viewStaff")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🧑‍🏫 View Staff
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "subCentre")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🏢 Sub Centre
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "students")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🎓 Students
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "update")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  ✏️ Update
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "id")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🆔 ID
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "certificate")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  📄 Certificate
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "renewalCertificate")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  🔄 Renewal Certificate
                                </li>
                                <li // NEW: View Renewal option
                                  onClick={() => handleAction(c._id, "viewRenewal")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                                >
                                  🔄 View Renewal
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "delete")}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                                >
                                  🗑️ Delete
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, c.approved ? "unapprove" : "approve")}
                                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                    c.approved ? 'text-red-600' : 'text-green-600'
                                  }`}
                                  disabled={approvalLoading[c._id]}
                                >
                                  {approvalLoading[c._id] ? 'Updating...' : c.approved ? '❌ Unapprove' : '✅ Approve'}
                                </li>
                                <li
                                  onClick={() => handleAction(c._id, "sendPassword")}
                                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 ${
                                    passwordLoading[c._id] ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={passwordLoading[c._id]}
                                >
                                  🔑 {passwordLoading[c._id] ? 'Sending...' : 'Send Password'}
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center text-gray-500 py-4 italic"> {/* Updated for new Renewal Status column */}
                        {error ? error : "No centres found."}
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