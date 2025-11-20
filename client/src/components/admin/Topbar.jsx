import React, { useState, useContext, useRef, useEffect } from "react";
import { FaBell, FaUserCircle, FaHome, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl px-8 py-5 text-white">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-3 hover:scale-110 transition-transform duration-300"
        >
          <FaHome className="text-3xl drop-shadow-md" />
          <span className="text-lg font-semibold tracking-wider">Home</span>
        </Link>

        <div className="hidden md:block">
          <h1 className="text-3xl font-bold tracking-wide drop-shadow-lg">
            Admin Dashboard
          </h1>
          <p className="text-sm opacity-90">Welcome back, {user?.name || "Admin"}!</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-7">

        {/* Notification Bell */}
        <button className="relative group">
          <FaBell className="text-3xl hover:scale-110 transition-transform duration-300 drop-shadow-md" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
            3
          </span>
        </button>

        {/* PROFILE BUTTON - NOW PERFECT COLOR & VISIBLE TEXT */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-4 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-800 hover:to-pink-800 
                       rounded-full px-6 py-3 shadow-2xl border-2 border-white border-opacity-30 
                       backdrop-blur-md hover:scale-105 transform transition-all duration-300 
                       font-bold tracking-wide"
          >
            <FaUserCircle className="text-4xl drop-shadow-lg" />
            <div className="text-left hidden lg:block">
              <p className="text-lg font-bold text-white drop-shadow">{user?.name || "Admin"}</p>
              <p className="text-xs opacity-90">Administrator</p>
            </div>
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200">
              <div className="bg-gradient-to-r from-purple-700 to-pink-700 p-6 text-white">
                <p className="text-xl font-bold">{user?.name || "Admin User"}</p>
                <p className="text-sm opacity-90">{user?.email || "admin@example.com"}</p>
              </div>

              <div className="p-3">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 rounded-lg transition"
                >
                  <FaUserCog className="text-xl text-purple-600" />
                  <span className="font-medium text-gray-800">My Profile</span>
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaHome className="text-xl text-indigo-600" />
                    <span className="font-medium text-gray-800">Admin Panel</span>
                  </Link>
                )}

                <hr className="my-3 border-gray-200" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 rounded-lg text-red-600 transition font-medium"
                >
                  <FaSignOutAlt className="text-xl" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}