import React, { useState, useContext } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { AuthContext } from "../context/AuthContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("⚠️ Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend forgot password API
      const data = await forgotPassword(email);

      alert(`🔗 Password reset link generated for ${email}`);
      console.log("Reset Link (for testing only):", data.resetLink);

      // Auto-redirect to reset-password page after 3 seconds (for dev/testing)
      setTimeout(() => {
        // Assuming the backend returns a token in resetLink like: /reset-password/<token>
        const url = new URL(data.resetLink);
        const token = url.pathname.split("/").pop();
        navigate(`/reset-password/${token}`);
      }, 3000);

      setEmail(""); // Clear input
    } catch (error) {
      console.error("Forgot password error:", error);
      alert(
        error.response?.data?.message ||
          "❌ Failed to generate reset link. Please try again."
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
            <Mail className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600 mb-6">
            Enter your registered email address to receive a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Remember your password?{" "}
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

export default ForgotPassword;
