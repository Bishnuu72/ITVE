// src/components/LoginPage.jsx
import React, { useState, useContext } from "react";
import { Lock } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter both email and password!",
      });
      return;
    }

    try {
      setLoading(true);

      // Call backend login via AuthContext
      const loggedInUser = await login({ email, password });

      // FIX: Store token in localStorage with exact key 'token' (resolves "Token present: false" and 401 errors)
      if (loggedInUser?.token) {
        localStorage.setItem("token", loggedInUser.token);
        console.log(`✅ Token stored successfully (length: ${loggedInUser.token.length}). User: ${loggedInUser?.user?.name || loggedInUser?.name} (${loggedInUser?.user?.role || loggedInUser?.role})`);
      } else {
        console.warn("⚠️ No token in login response – check AuthContext.");
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome ${loggedInUser?.name || ""}`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect user based on role from backend
      setTimeout(() => {
        if (loggedInUser?.role === "admin") {
          navigate("/admin-dashboard");
        } else if (loggedInUser?.role === "center") {
          navigate("/center-dashboard");
        } else {
          navigate("/");
        }
      }, 2000);

    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Invalid credentials or server error. Please try again.",
      });
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

          <h1 className="text-3xl font-bold text-gray-800 mb-2">ITVE Login</h1>
          <p className="text-gray-600 mb-6">
            Information Technology & Vocational Education
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="current-password" // FIX: Resolves autocomplete warning
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 accent-red-500"
                />
                Remember Me
              </label>

              <a
                href="/forgot-password"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-md shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* <p className="text-sm text-gray-600 text-center mt-4">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Register
              </a>
            </p> */}
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;