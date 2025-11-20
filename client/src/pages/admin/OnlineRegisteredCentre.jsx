import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OnlineRegisteredCentres() {
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvalLoading, setApprovalLoading] = useState({});
  const navigate = useNavigate();

  // Fetch online centres (includes submissions from CenterApplyForm)
  const fetchCentres = async (searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE_URL}/api/centres/online${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCentres(data || []);
    } catch (err) {
      console.error("Error fetching online centres:", err);
      setError("Failed to load online centres. Please check the server or try again.");
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
        alert(data.message || "Approval updated successfully");
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

  // View Centre
  const handleView = (id) => {
    navigate(`/view-centre/${id}`);
  };

  // Delete (Soft-delete)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this centre? This action cannot be undone.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/centres/${id}/delete`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || "Centre deleted successfully");
          fetchCentres(search); // Refetch to remove from list
        } else {
          alert(data.error || "Error deleting centre");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Network error: " + err.message);
      }
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
                <p className="mt-2 text-gray-600">Loading online centres...</p>
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
                <button 
                  onClick={() => fetchCentres(search)} 
                  className="ml-2 text-red-600 hover:underline font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Online Registered Centres
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search online centres by name, code, or owner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => fetchCentres(search)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                >
                  GO
                </button>
                <button
                  onClick={() => navigate("/centre-list")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors"
                >
                  ← All Centres
                </button>
              </div>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2 text-center w-12">Sl No</th>
                    <th className="border border-gray-300 p-2 text-left">Centre Name</th>
                    <th className="border border-gray-300 p-2 text-left">Owner Name</th>
                    <th className="border border-gray-300 p-2 text-center">Code</th>
                    <th className="border border-gray-300 p-2 text-center">Balance</th>
                    <th className="border border-gray-300 p-2 text-center">Mobile No</th>
                    <th className="border border-gray-300 p-2 text-center">Total Reg</th>
                    <th className="border border-gray-300 p-2 text-center">Complete Reg</th>
                    <th className="border border-gray-300 p-2 text-center">Status</th>
                    <th className="border border-gray-300 p-2 text-center">Approved</th>
                    <th className="border border-gray-300 p-2 text-center">Created At</th>
                    <th className="border border-gray-300 p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {centres.length > 0 ? (
                    centres.map((c, index) => (
                      <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 p-2 text-center font-medium">{index + 1}</td>
                        <td className="border border-gray-300 p-2">{c.name || c.centreName || 'N/A'}</td>
                        <td className="border border-gray-300 p-2">{c.ownerName || 'N/A'}</td>
                        <td className="border border-gray-300 p-2 text-center font-semibold">{c.code}</td>
                        <td className="border border-gray-300 p-2 text-center font-mono">{c.balance?.toFixed(2) || 0}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.mobile || 'N/A'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.totalReg || 0}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.completeReg || 0}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            c.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                            c.status === 'Active' ? 'bg-green-200 text-green-800' :
                            c.status === 'Inactive' ? 'bg-gray-200 text-gray-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            onClick={() => toggleApproval(c._id, c.approved)}
                            disabled={approvalLoading[c._id]}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              c.approved
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {approvalLoading[c._id] ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                              </span>
                            ) : c.approved ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-xs">
                          {new Date(c.createdAt).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleView(c._id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center text-gray-500 py-8 italic border border-gray-300">
                        {error ? (
                          <>
                            {error}
                            <br />
                            <button 
                              onClick={() => fetchCentres(search)} 
                              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Retry Fetch
                            </button>
                          </>
                        ) : "No online registered centres found. Submit via the public form to add one."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            {centres.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <strong>{centres.length}</strong> online centres. New submissions from the public form appear here with "Pending" status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}