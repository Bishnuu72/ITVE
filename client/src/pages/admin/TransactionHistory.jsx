import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import {
  getAllOfflineBalances,
  deleteOfflineBalance,
  getImageUrl as getOfflineImageUrl,
} from "../../services/offlineBalanceService";
import {
  getAllQRBalances,
  deleteQRBalance,
  getImageUrl as getQRImageUrl,
} from "../../services/qrBalanceService";

export default function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [offlineTransactions, setOfflineTransactions] = useState([]);
  const [qrTransactions, setQRTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Offline");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fetch both Offline and QR transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [offlineData, qrData] = await Promise.all([
          getAllOfflineBalances(),
          getAllQRBalances(),
        ]);

        setOfflineTransactions(Array.isArray(offlineData) ? offlineData : offlineData?.data || []);
        setQRTransactions(Array.isArray(qrData) ? qrData : qrData?.data || []);
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to load transactions", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter based on search and date range
  const filterData = (data) =>
    data.filter((t) => {
      const matchesSearch =
        t.centre?.toLowerCase().includes(search.toLowerCase()) ||
        t.reason?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());

      const transactionDate = t.createdAt ? new Date(t.createdAt) : null;
      const matchesDate =
        (!startDate || transactionDate >= new Date(startDate)) &&
        (!endDate || transactionDate <= new Date(endDate));

      return matchesSearch && matchesDate;
    });

  const handleDelete = async (id, type) => {
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
          if (type === "Offline") {
            await deleteOfflineBalance(id);
            setOfflineTransactions(offlineTransactions.filter((t) => t._id !== id));
          } else {
            await deleteQRBalance(id);
            setQRTransactions(qrTransactions.filter((t) => t._id !== id));
          }
          Swal.fire("Deleted!", "Transaction removed successfully.", "success");
        } catch (error) {
          Swal.fire("Error", error.message || "Failed to delete record", "error");
        }
      }
    });
  };

  const currentData = activeTab === "Offline" ? filterData(offlineTransactions) : filterData(qrTransactions);

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(currentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeTab} Transactions`);
    XLSX.writeFile(workbook, `${activeTab}_Transactions.xlsx`);
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
                Transaction History
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                />
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setActiveTab("Offline")}
                className={`px-4 py-2 rounded-md font-semibold ${
                  activeTab === "Offline" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Offline Transactions
              </button>
              <button
                onClick={() => setActiveTab("QR")}
                className={`px-4 py-2 rounded-md font-semibold ${
                  activeTab === "QR" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                QR Transactions
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="border p-2">#</th>
                      <th className="border p-2">Centre</th>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Payment Type</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Photo</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((t, index) => (
                      <tr key={t._id || index} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2 text-center">{t.centre || "-"}</td>
                        <td className="border p-2 text-center">{t.amount}</td>
                        <td className="border p-2 text-center">{t.paymentType || "-"}</td>
                        <td className="border p-2 text-center">{t.status || "-"}</td>
                        <td className="border p-2 text-center">
                          {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
                        </td>
                        <td className="border p-2 text-center">
                          {t.photo ? (
                            <img
                              src={
                                activeTab === "Offline"
                                  ? getOfflineImageUrl(t.photo.split("/").pop())
                                  : getQRImageUrl(t.photo.split("/").pop())
                              }
                              alt="Proof"
                              className="w-16 h-16 object-cover mx-auto rounded-md"
                            />
                          ) : (
                            <span className="text-gray-400">No Photo</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleDelete(t._id, activeTab)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentData.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-gray-500 py-4 italic">
                          No transactions found.
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
