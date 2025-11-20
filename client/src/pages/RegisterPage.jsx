import React, { useState, useContext } from "react";
import Swal from "sweetalert2"; // ✅ SweetAlert2
import { UserPlus, UserCog, UserCheck, GraduationCap, Users } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register } = useContext(AuthContext);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
    };

    try {
      setLoading(true);
      await register(userData);

      // ✅ SweetAlert success
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Your ${role.toUpperCase()} account has been created.`,
        confirmButtonText: "Go to Login",
      });

      navigate("/login"); // Redirect to login

    } catch (error) {
      console.error("Registration failed:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Please try again.",
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
            <UserPlus className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Register Account</h1>
          <p className="text-gray-600 mb-6">
            Information Technology & Vocational Education
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Admin", icon: <UserCog className="w-5 h-5" />, value: "admin" },
              { label: "Staff", icon: <Users className="w-5 h-5" />, value: "staff" },
              { label: "Center", icon: <UserCheck className="w-5 h-5" />, value: "center" },
              { label: "Student", icon: <GraduationCap className="w-5 h-5" />, value: "student" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition ${
                  role === r.value
                    ? "bg-red-500 text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              {loading ? "Registering..." : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
