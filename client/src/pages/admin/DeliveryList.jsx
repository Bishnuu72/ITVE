import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import { getAllDeliveries, deleteDelivery } from "../../services/deliveryService";

export default function DeliveryList() {
  const [search, setSearch] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await getAllDeliveries();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery record?")) {
      try {
        await deleteDelivery(id);
        fetchDeliveries();
      } catch (err) {
        alert("Failed to delete delivery");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/add-delivery?id=${id}`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-blue-100 text-blue-800 border-blue-300",
      Delivered: "bg-green-100 text-green-800 border-green-300",
      "In Transit": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Returned: "bg-red-100 text-red-800 border-red-300",
    };
    const style = styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
        {status || "Unknown"}
      </span>
    );
  };

  const filtered = deliveries
    .filter((del) =>
      del.center?.toLowerCase().includes(search.toLowerCase()) ||
      del.consignmentId?.toLowerCase().includes(search.toLowerCase()) ||
      del.content?.toLowerCase().includes(search.toLowerCase()) ||
      del.through?.toLowerCase().includes(search.toLowerCase()) ||
      del.status?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                All Deliveries ({filtered.length})
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by centre, AWB, content, courier..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-5 py-3 text-base focus:ring-4 focus:ring-blue-500 min-w-[300px]"
                />
                <button
                  onClick={fetchDeliveries}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                >
                  Refresh
                </button>
                <button
                  onClick={() => navigate("/add-delivery")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                >
                  + Add Delivery
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500 text-lg">Loading deliveries...</div>
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
                      <th className="border p-3 text-center">Date</th>
                      <th className="border p-3 text-center">Status</th>
                      <th className="border p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((del, index) => (
                        <tr key={del._id} className="hover:bg-gray-50 transition">
                          <td className="border p-3 text-center font-medium">{index + 1}</td>
                          <td className="border p-3 font-medium">{del.center || "-"}</td>
                          <td className="border p-3 font-mono text-blue-700">{del.consignmentId}</td>
                          <td className="border p-3">{del.content || "-"}</td>
                          <td className="border p-3">{del.through || "-"}</td>
                          <td className="border p-3 text-center">
                            {del.date ? new Date(del.date).toLocaleDateString("en-IN") : "-"}
                          </td>
                          <td className="border p-3 text-center">
                            {getStatusBadge(del.status)}
                          </td>
                          <td className="border p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(del._id)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(del._id)}
                                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-12 text-gray-500 text-lg italic">
                          No deliveries found.
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