import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addOfflineBalance,
  getOfflineBalanceById,
  updateOfflineBalance,
  getImageUrl,
} from "../../services/offlineBalanceService";

export default function AddOfflineBalance() {
  const navigate = useNavigate();
  const { id } = useParams(); // If ID exists, it's edit mode
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    centre: "",
    centreWiseAmount: "",
    amount: "",
    reason: "",
    transactionType: "Credit",
    status: "Paid",
    paymentType: "",
    photo: null,
  });

  // ✅ Fetch data for edit mode
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getOfflineBalanceById(id);
          setFormData({
            ...data,
            photo: null, // Reset photo for new upload
          });
          if (data.photo) {
            setPreview(getImageUrl(data.photo.split("/").pop())); // Show existing image
          }
        } catch (error) {
          Swal.fire("Error", error.message || "Failed to fetch data", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setPreview(URL.createObjectURL(file)); // ✅ Show preview for new image
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      setLoading(true);
      if (id) {
        await updateOfflineBalance(id, formDataObj);
        Swal.fire("Updated!", "Offline balance updated successfully", "success");
      } else {
        await addOfflineBalance(formDataObj);
        Swal.fire("Added!", "Offline balance added successfully", "success");
      }
      navigate("/offline-balance-list");
    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
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
              {id ? "Edit Offline Balance" : "Add Offline Balance"}
            </h2>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Centre */}
                <div>
                  <label className="block font-medium mb-1">Centre *</label>
                  <input
                    type="text"
                    name="centre"
                    value={formData.centre}
                    onChange={handleChange}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* Centre Wise Amount */}
                <div>
                  <label className="block font-medium mb-1">
                    Center Wise Amount (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="centreWiseAmount"
                    value={formData.centreWiseAmount}
                    onChange={handleChange}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-medium mb-1">Amount (Rs.) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block font-medium mb-1">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block font-medium mb-1">
                    Transaction Type *
                  </label>
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                    required
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="Credit">Credit (+)</option>
                    <option value="Debit">Debit (-)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                {/* Type of Payment */}
                <div>
                  <label className="block font-medium mb-1">Type Of Payment *</label>
                  <input
                    type="text"
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>

                {/* Photo */}
                <div>
                  <label className="block font-medium mb-1">Photo</label>
                  <input
                    type="file"
                    name="photo"
                    onChange={handleChange}
                    className="border rounded-md p-2 w-full"
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-3 w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700"
                  >
                    {id ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/offline-balance-list")}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
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