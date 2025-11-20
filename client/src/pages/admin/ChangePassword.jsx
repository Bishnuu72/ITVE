import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

export default function ChangePassword() {
  const { updatePassword } = useContext(AuthContext);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (passwords.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Call AuthContext API
      const res = await updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.message || "Password changed successfully!",
        confirmButtonColor: "#3085d6",
      });

      // Reset form
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1 mb-6">
              Change Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter new password"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 8 characters.
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && <p className="text-red-600 font-semibold">{error}</p>}

              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md font-semibold ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? "Updating..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
