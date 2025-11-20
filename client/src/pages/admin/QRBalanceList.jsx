import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getAllQRBalances,
  deleteQRBalance,
  getImageUrl,
} from "../../services/qrBalanceService";

export default function QRCodeList() {
  const [search, setSearch] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch QR Codes from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllQRBalances();
        setQrCodes(data.data || []);
      } catch (error) {
        Swal.fire("Error", error.response?.data.message || "Failed to load QR Codes", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredQRCodes = qrCodes.filter(
    (q) =>
      q.centre.toLowerCase().includes(search.toLowerCase()) ||
      q._id.toString().includes(search)
  );

  const handleAction = async (id, action) => {
    switch (action) {
      case "update":
        navigate("/add-qr-balance", { state: { id } });
        break;
      case "delete":
        Swal.fire({
          title: "Are you sure?",
          text: "This QR Code will be permanently deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteQRBalance(id);
              setQrCodes((prev) => prev.filter((q) => q._id !== id));
              Swal.fire("Deleted!", "QR Code has been deleted.", "success");
            } catch (error) {
              Swal.fire("Error", error.response?.data.message || "Failed to delete QR Code", "error");
            }
          }
        });
        break;
      default:
        break;
    }
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
                All QR Codes
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by Centre or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => navigate("/add-qr-balance")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  + Add QR & Balance
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-center text-gray-500 py-4">Loading QR Codes...</p>
            ) : (
              <div className="overflow-x-auto relative">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2 text-center w-12">Sl No</th>
                      <th className="border p-2 text-center">Photo</th>
                      <th className="border p-2 text-center">Centre</th>
                      <th className="border p-2 text-center">Amount</th>
                      <th className="border p-2 text-center">Type</th>
                      <th className="border p-2 text-center">Remarks</th>
                      <th className="border p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQRCodes.map((q, index) => (
                      <tr key={q._id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2 text-center">
                          {q.photo ? (
                            <img
                              src={getImageUrl(q.photo.split("/").pop())}
                              alt="QR Code"
                              className="w-20 h-20 object-contain mx-auto"
                            />
                          ) : (
                            <span className="text-gray-400">No Photo</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">{q.centre}</td>
                        <td className="border p-2 text-center">Rs. {q.amount}</td>
                        <td className="border p-2 text-center">{q.transactionType}</td>
                        <td className="border p-2 text-center">{q.remarks || "-"}</td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAction(q._id, "update")}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAction(q._id, "delete")}
                              className="bg-red-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredQRCodes.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-gray-500 py-4 italic">
                          No QR Codes found.
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