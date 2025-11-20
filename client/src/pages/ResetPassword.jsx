import React, { useState, useContext, useEffect } from "react";
import { Lock } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { AuthContext } from "../context/AuthContext";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams(); // ✅ token from URL

  useEffect(() => {
    if (!token) {
      alert("❌ Invalid or missing token.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      alert("⚠️ Please fill in both fields.");
      return;
    }

    if (password !== confirm) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // ✅ Call resetPassword with object
      const res = await resetPassword({ token, password, confirmPassword: confirm });

      alert(res.message || "✅ Password Reset Successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "❌ Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-6">Enter and confirm your new password.</p>

          <form onSubmit={handleReset} className="space-y-4 text-left">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-md shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              <a
                href="/login"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Back to Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
