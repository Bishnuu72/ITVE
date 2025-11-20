import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { getAllDeliveries } from "../../services/deliveryService";

export default function TrackDelivery() {
  const [search, setSearch] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        const data = await getAllDeliveries();
        setDeliveries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load delivery records");
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  // Handle tracking
  const handleTrack = (trackingLink) => {
    if (trackingLink && trackingLink.trim() !== "") {
      window.open(trackingLink.startsWith("http") ? trackingLink : `https://${trackingLink}`, "_blank");
    } else {
      alert("No tracking link available for this consignment");
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-blue-100 text-blue-800 border-blue-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
      "In Transit": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Returned: "bg-red-100 text-red-800 border-red-300",
    };
    const style = styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${style}`}>
        {status || "Unknown"}
      </span>
    );
  };

  // Filter + sort newest first
  const filteredDeliveries = deliveries
    .filter((d) =>
      d.consignmentId?.toLowerCase().includes(search.toLowerCase()) ||
      d.content?.toLowerCase().includes(search.toLowerCase()) ||
      d.through?.toLowerCase().includes(search.toLowerCase()) ||
      d.center?.toLowerCase().includes(search.toLowerCase()) ||
      d.status?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Track Delivery ({filteredDeliveries.length})
              </h2>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by AWB, Content, Courier, Centre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base focus:ring-4 focus:ring-blue-500 min-w-[350px]"
                />
                <button
                  onClick={() => {}}
                  className="bg-blue-600 text-white px-6 py-3.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                >
                  Search
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium text-center">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 text-gray-500 text-xl">Loading delivery records...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm table-auto">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-3 text-center w-12">No</th>
                      <th className="border p-3 text-left">Centre</th>
                      <th className="border p-3 text-left">AWB / Consignment ID</th>
                      <th className="border p-3 text-left">Content</th>
                      <th className="border p-3 text-left">Courier</th>
                      <th className="border p-3 text-center">Dispatch Date</th>
                      <th className="border p-3 text-center">Status</th>
                      <th className="border p-3 text-center">Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((d, index) => (
                        <tr key={d._id} className="hover:bg-gray-50 transition">
                          <td className="border p-3 text-center font-medium">{index + 1}</td>
                          <td className="border p-3 font-medium text-gray-700">{d.center || "-"}</td>
                          <td className="border p-3 font-mono text-blue-700 font-semibold">{d.consignmentId}</td>
                          <td className="border p-3">{d.content || "-"}</td>
                          <td className="border p-3">{d.through || "-"}</td>
                          <td className="border p-3 text-center">
                            {d.date ? new Date(d.date).toLocaleDateString("en-IN") : "-"}
                          </td>
                          <td className="border p-3 text-center">
                            {getStatusBadge(d.status)}
                          </td>
                          <td className="border p-3 text-center">
                            <button
                              onClick={() => handleTrack(d.trackingLink)}
                              className={`px-5 py-2 rounded-lg font-bold text-sm transition ${
                                d.trackingLink
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
                              }`}
                              disabled={!d.trackingLink}
                            >
                              {d.trackingLink ? "Track Now" : "No Link"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-16 text-gray-500 text-lg italic">
                          No delivery records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}