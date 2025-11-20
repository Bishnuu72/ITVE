import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addQRBalance,
  getQRBalanceById,
  updateQRBalance,
  getImageUrl,
} from "../../services/qrBalanceService";

export default function AddQRBalance() {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [centre, setCentre] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("Credit");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.id || null;

  const centres = [
    "RAVI COMPUTER INSTITUTE",
    "SUPERVISION COMPUTER EDUCATION",
    "THE COMPUTER WORLD",
    "OASIS COMPUTER EDUCATION",
  ];

  // ✅ Fetch data if editing
  useEffect(() => {
    if (editId) {
      setLoading(true);
      (async () => {
        try {
          const { data } = await getQRBalanceById(editId);
          setCentre(data.centre);
          setAmount(data.amount);
          setTransactionType(data.transactionType);
          setRemarks(data.remarks);
          if (data.photo) {
            setPhotoPreview(getImageUrl(data.photo.split("/").pop()));
          }
        } catch (error) {
          Swal.fire("Error", "Failed to load QR Balance details", "error");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [editId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!centre || !amount || !transactionType) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    if (photoFile) formData.append("photo", photoFile);
    formData.append("centre", centre);
    formData.append("amount", amount);
    formData.append("transactionType", transactionType);
    formData.append("remarks", remarks);

    try {
      if (editId) {
        await updateQRBalance(editId, formData);
        Swal.fire("Success", "QR Balance updated successfully", "success");
      } else {
        await addQRBalance(formData);
        Swal.fire("Success", "QR Balance added successfully", "success");
      }
      navigate("/qr-balance-list");
    } catch (error) {
      Swal.fire("Error", error.response?.data.message || "Operation failed", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              {editId ? "Edit QR Balance" : "Upload QR & Add Balance"}
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* QR Photo */}
                <div>
                  <label className="block mb-2 font-semibold">QR Photo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="border rounded-md p-2 w-full"
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="QR Preview"
                      className="mt-2 w-32 h-32 object-contain border"
                    />
                  )}
                </div>

                {/* Remarks */}
                <div>
                  <label className="block mb-2 font-semibold">Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional remarks"
                    className="border rounded-md p-2 w-full text-sm"
                    rows={3}
                  />
                </div>

                {/* Centre */}
                <div>
                  <label className="block mb-1 font-semibold">Centre *</label>
                  <select
                    value={centre}
                    onChange={(e) => setCentre(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Centre</option>
                    {centres.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block mb-1 font-semibold">Amount (Rs.) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block mb-1 font-semibold">Transaction Type *</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Credit">Credit (+)</option>
                    <option value="Debit">Debit (-)</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
                  >
                    {editId ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/qr-balance-list")}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}