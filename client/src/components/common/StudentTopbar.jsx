import React, { useState, useContext } from "react";
import { FaBell, FaUserCircle, FaHome } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useContext(AuthContext); // ✅ get user & logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-4">
      {/* Left: Home Link */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
        >
          <FaHome className="text-xl" />
          <span className="font-medium">Home</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Right: Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <button className="relative">
          <FaBell className="text-gray-600 text-2xl" />
          {/* Optional: notification badge */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2"
          >
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="hidden sm:inline text-gray-700 font-medium">
              {user ? user.name : "Guest"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              {user && user.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
