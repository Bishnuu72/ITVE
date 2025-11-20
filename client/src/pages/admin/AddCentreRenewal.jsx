import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddCentreRenewal() {
  const navigate = useNavigate();
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [centreId, setCentreId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch centres
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/centres`);
        if (!response.ok) throw new Error("Failed to fetch centres");
        const data = await response.json();
        setCentres(data);
      } catch (err) {
        console.error("Fetch centres error:", err);
        setError("Failed to load centres. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchCentres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(""); // Clear previous errors

    if (!centreId || !startDate || !endDate) {
      alert("Please fill all required fields!");
      setSubmitLoading(false);
      return;
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
    if (to <= from) {
      alert("To Date must be after From Date!");
      setSubmitLoading(false);
      return;
    }
    if (from <= new Date()) {
      alert("From Date must be in the future!");
      setSubmitLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${centreId}/renewal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromDate: startDate, toDate: endDate }),
      });
      const data = await response.json();
      if (response.ok) {
        const selectedCentre = centres.find(c => c._id === centreId);
        alert(`Centre Renewal for ${selectedCentre?.centreName || selectedCentre?.name} added successfully!`);
        navigate(-1);
      } else {
        alert(data.error || "Error adding renewal");
      }
    } catch (err) {
      console.error("Submit renewal error:", err);
      alert("Network error: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
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
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
                <button 
                  onClick={() => window.location.reload()} 
                  className="ml-2 text-red-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-red-600 pb-1">
              Add Centre Renewal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Centre Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Centre *
                </label>
                <select
                  value={centreId}
                  onChange={(e) => setCentreId(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">-- Select Centre --</option>
                  {centres.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centreName || c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
                  disabled={submitLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}