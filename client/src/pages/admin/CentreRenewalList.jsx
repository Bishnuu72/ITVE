import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CentreRenewalList() {
  const [search, setSearch] = useState("");
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  // Fetch renewals (centres with renewal info)
  const fetchRenewals = async (searchTerm = "") => {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE_URL}/api/centres${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Filter only centres with renewal info (renewalStatus exists and not 'Pending')
      const filtered = data.filter(c => c.renewalStatus && c.renewalStatus !== 'Pending');
      setRenewals(filtered);
    } catch (err) {
      console.error("Error fetching renewals:", err);
      setError("Failed to load renewals. Please check the server or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRenewals(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  // Format created to DD/MM/YYYY HH:MM am/pm
  const formatCreated = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    }).replace(',', '');
  };

  // FIXED: Check eligibility based on To Date (future vs expired/past)
  const isEligibleForRenewal = (renewalTo) => {
    if (!renewalTo) return false;
    const toDate = new Date(renewalTo);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to start of day for accurate comparison
    toDate.setHours(0, 0, 0, 0);
    return toDate > currentDate; // Eligible if To Date is in the future
  };

  // Handle Renew
  const handleRenew = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'renew' }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}/renew`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Renewed successfully");
        fetchRenewals(search);
      } else {
        alert(data.error || "Error renewing");
      }
    } catch (err) {
      console.error("Renew error:", err);
      alert("Network error: " + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle Expire
  const handleExpire = async (id) => {
    if (!window.confirm("Expire this renewal?")) return;
    setActionLoading((prev) => ({ ...prev, [id]: 'expire' }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}/expire-renewal`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Expired successfully");
        fetchRenewals(search);
      } else {
        alert(data.error || "Error expiring");
      }
    } catch (err) {
      console.error("Expire error:", err);
      alert("Network error: " + err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
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
                <p className="mt-2 text-gray-600">Loading renewals...</p>
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
                <button onClick={() => fetchRenewals(search)} className="ml-2 text-red-600 hover:underline">
                  Retry
                </button>
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Centres Renewal
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => fetchRenewals(search)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                >
                  GO
                </button>
                <button
                  onClick={() => navigate("/add-center-renewal")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add New
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="border p-2 text-center w-12">Sl No</th>
                    <th className="border p-2 text-left">Centre Name (Code)</th>
                    <th className="border p-2 text-center">From Date</th>
                    <th className="border p-2 text-center">To Date</th>
                    <th className="border p-2 text-center">Created</th>
                    <th className="border p-2 text-center">Renewal Action</th> {/* NEW COLUMN */}
                  </tr>
                </thead>
                <tbody>
                  {renewals.map((r, index) => (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{`${r.centreName || r.name} (${r.code})`}</td>
                      <td className="border p-2 text-center">{formatDate(r.renewalFrom)}</td>
                      <td className="border p-2 text-center">{formatDate(r.renewalTo)}</td>
                      <td className="border p-2 text-center">{formatCreated(r.createdAt)}</td>
                      <td className="border p-2 text-center">
                        {isEligibleForRenewal(r.renewalTo) ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleRenew(r._id)}
                              disabled={actionLoading[r._id] === 'renew'}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                            >
                              {actionLoading[r._id] === 'renew' ? '...' : '✅ Renew'}
                            </button>
                            <button
                              onClick={() => handleExpire(r._id)}
                              disabled={actionLoading[r._id] === 'expire'}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                            >
                              {actionLoading[r._id] === 'expire' ? '...' : '❌ Expire'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Not Eligible</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {renewals.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-4 italic">
                        No renewal records found.
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