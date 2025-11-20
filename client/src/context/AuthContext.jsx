import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // Register
  const register = async (formData) => {
    const res = await axios.post(`${API_URL}/auth/register`, formData);
    const { token, user } = res.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);

    return res.data;
  };

  // Login
  const login = async (formData) => {
    const res = await axios.post(`${API_URL}/auth/login`, formData);
    const { token, user } = res.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);

    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Update Password
  const updatePassword = async ({ currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
      throw new Error("Please provide current and new passwords");
    }

    const res = await axios.put(`${API_URL}/auth/updatepassword`, {
      currentPassword,
      newPassword,
    });

    const { token, user } = res.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);

    return res.data;
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await axios.post(`${API_URL}/auth/forgotpassword`, { email });
    return res.data;
  };

  // Reset Password
  const resetPassword = async ({ token, password, confirmPassword }) => {
    const res = await axios.put(`${API_URL}/auth/resetpassword`, {
      token,
      password,
      confirmPassword,
    });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updatePassword,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};