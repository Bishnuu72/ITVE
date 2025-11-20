import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAllOfflineBalances,
  deleteOfflineBalance,
  getImageUrl,
} from "../../services/offlineBalanceService";

export default function OfflineBalanceList() {
  const [search, setSearch] = useState("");
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all offline balances
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const data = await getAllOfflineBalances();
        setBalances(data);
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to fetch balances", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, []);

  const filteredBalances = balances.filter((b) =>
    b.centre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOfflineBalance(id);
          setBalances(balances.filter((b) => b._id !== id));
          Swal.fire("Deleted!", "Offline balance has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", error.message || "Failed to delete record", "error");
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                All Offline Balance
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
                  onClick={() => navigate("/add-offline-balance")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="overflow-x-auto relative">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2 text-center w-12">Sl No</th>
                      <th className="border p-2 text-left">Center Name</th>
                      <th className="border p-2 text-center">Photo</th>
                      <th className="border p-2 text-center">Amount (Rs.)</th>
                      <th className="border p-2 text-center">Reason</th>
                      <th className="border p-2 text-center">Date</th>
                      <th className="border p-2 text-center">Status</th>
                      <th className="border p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBalances.map((b, index) => (
                      <tr key={b._id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">{b.centre}</td>
                        <td className="border p-2 text-center">
                          {b.photo ? (
                            <img
                              src={getImageUrl(b.photo.split("/").pop())}
                              alt="Centre"
                              className="w-16 h-16 object-cover mx-auto rounded-md"
                            />
                          ) : (
                            <span className="text-gray-400">No Photo</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">{b.amount.toFixed(2)}</td>
                        <td className="border p-2 text-center">{b.reason || "-"}</td>
                        <td className="border p-2 text-center">
                          {new Date(b.createdAt).toLocaleString()}
                        </td>
                        <td className="border p-2 text-center">{b.status}</td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => navigate(`/edit-offline-balance/${b._id}`)}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(b._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredBalances.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-gray-500 py-4 italic">
                          No offline balance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-600">
              Make Payment by Clicking On QR Code
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}