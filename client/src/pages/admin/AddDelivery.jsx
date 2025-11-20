import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useNavigate, useLocation } from "react-router-dom";
import { addDelivery, updateDelivery, getDeliveryById } from "../../services/deliveryService";
import Swal from "sweetalert2";

const API_BASE = import.meta.env.VITE_API_URL?.trim();

export default function AddDelivery() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id"); // Get ID from query param

  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(true);
  const [formData, setFormData] = useState({
    center: "",
    consignmentId: "",
    content: "",
    through: "",
    date: "",
    trackingLink: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Centres
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await fetch(`${API_BASE}/centres`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setCentres(list);
      } catch (err) {
        console.error("Failed to fetch centres:", err);
        setError("Could not load centres");
      } finally {
        setLoadingCentres(false);
      }
    };
    fetchCentres();
  }, []);

  // Fetch existing delivery when editing
  useEffect(() => {
    if (id) {
      const fetchDelivery = async () => {
        try {
          setLoading(true);
          const delivery = await getDeliveryById(id);
          setFormData({
            center: delivery.center?.split(" (")[0] || "", // Extract name only
            consignmentId: delivery.consignmentId || "",
            content: delivery.content || "",
            through: delivery.through || "",
            date: delivery.date ? new Date(delivery.date).toISOString().split("T")[0] : "",
            trackingLink: delivery.trackingLink || "",
            status: delivery.status || "Active",
          });
        } catch (err) {
        console.error(err);
        setError("Failed to load delivery data");
        } finally {
          setLoading(false);
        }
      };
      fetchDelivery();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.center) {
      setError("Please select a centre");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (id) {
        await updateDelivery(id, formData);
        Swal.fire("Success!", "Delivery updated successfully", "success");
      } else {
        await addDelivery(formData);
        Swal.fire("Success!", "Delivery added successfully", "success");
        // Reset form
        setFormData({
          center: "",
          consignmentId: "",
          content: "",
          through: "",
          date: "",
          trackingLink: "",
          status: "Active",
        });
      }
      navigate(-1);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save delivery";
      setError(msg);
      Swal.fire("Error!", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-10">

            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-10">
              {id ? "Edit Delivery" : "Add New Delivery"}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-medium border border-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">

              {/* Centre Dropdown */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Centre <span className="text-red-500">*</span>
                </label>
                <select
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  required
                  disabled={loadingCentres}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base font-medium focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">
                    {loadingCentres ? "Loading centres..." : "-- Select Centre --"}
                  </option>
                  {centres.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consignment ID */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Consignment ID / AWB No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="consignmentId"
                  value={formData.consignmentId}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Content / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="e.g. Certificates, Marksheets, Kit"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              {/* Through (Courier) */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Courier / Through <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="through"
                  value={formData.through}
                  onChange={handleChange}
                  placeholder="e.g. DTDC, Delhivery, India Post"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Dispatch Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              {/* Tracking Link */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Tracking Link (Optional)
                </label>
                <input
                  type="url"
                  name="trackingLink"
                  value={formData.trackingLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-5 py-3.5 text-base font-medium focus:ring-4 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Delivered">Delivered</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-10">
                <button
                  type="submit"
                  disabled={loading || loadingCentres}
                  className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg disabled:opacity-60"
                >
                  {loading ? "Saving..." : id ? "Update Delivery" : "Add Delivery"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition shadow-lg"
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