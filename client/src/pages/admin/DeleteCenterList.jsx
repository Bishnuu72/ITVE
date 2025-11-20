import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DeletedCentreList() {
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvalLoading, setApprovalLoading] = useState({}); // Per-row loading for approval toggle
  const navigate = useNavigate();

  // Fetch deleted centres
  const fetchCentres = async (searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE_URL}/api/centres/deleted${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCentres(data || []);
    } catch (err) {
      console.error("Error fetching deleted centres:", err);
      setError("Failed to load deleted centres. Please check the server or try again.");
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

  // Restore Centre
  const handleRestore = async (id) => {
    if (window.confirm("Are you sure you want to restore this centre? It will be set to 'Active' status.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/centres/${id}/restore`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Active" }), // Explicit status (backend defaults to this anyway)
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || "Centre restored successfully");
          fetchCentres(search); // Refresh list
        } else {
          alert(data.error || "Error restoring centre");
        }
      } catch (err) {
        console.error("Restore error:", err);
        alert("Network error: " + err.message);
      }
    }
  };

  // Toggle Approval (same as CentreList.jsx)
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
        fetchCentres(search); // Refetch
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
                <p className="mt-2 text-gray-600">Loading deleted centres...</p>
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
                All Deleted Centres
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search deleted centres..."
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
                  onClick={() => navigate("/centre-lists")}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
                >
                  ← Back to Centres
                </button>
              </div>
            </div>

            <div className="overflow-x-auto relative">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Centre Name</th>
                    <th className="border p-2 text-left">Owner Name</th> {/* Added for better info */}
                    <th className="border p-2 text-center">Code</th>
                    <th className="border p-2 text-center">Balance</th>
                    <th className="border p-2 text-center">Mobile No</th>
                    <th className="border p-2 text-center">Total Reg</th>
                    <th className="border p-2 text-center">Complete Reg</th>
                    <th className="border p-2 text-center">Status</th>
                    <th className="border p-2 text-center">Renewal</th>
                    <th className="border p-2 text-center">Approved</th> {/* Added like CentreList */}
                    <th className="border p-2 text-center">Created At</th> {/* Added for info */}
                    <th className="border p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {centres.length > 0 ? (
                    centres.map((c, index) => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{c.name || c.centreName}</td> {/* Fallback to centreName */}
                        <td className="border p-2">{c.ownerName}</td>
                        <td className="border p-2 text-center">{c.code}</td>
                        <td className="border p-2 text-center">{c.balance?.toFixed(2) || 0}</td>
                        <td className="border p-2 text-center">{c.mobile}</td>
                        <td className="border p-2 text-center">{c.totalReg || 0}</td>
                        <td className="border p-2 text-center">{c.completeReg || 0}</td>
                        <td className="border p-2 text-center">{c.status}</td>
                        <td className="border p-2 text-center">{c.renewal || 'N/A'}</td>
                        <td className="border p-2 text-center">
                          {/* Approval Toggle (same as CentreList) */}
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
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleView(c._id)}
                              className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-700"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handleRestore(c._id)}
                              className="bg-green-600 text-white px-2 py-1 rounded-md text-sm hover:bg-green-700"
                            >
                              🔄 Restore
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center text-gray-500 py-4 italic"> {/* colSpan=13 for new columns */}
                        {error ? error : "No deleted centres found."}
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