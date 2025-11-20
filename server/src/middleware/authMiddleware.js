import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 🔐 Protect routes - only logged-in users
 * Adds `req.user` with user data
 */
export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * ⚡ Admin only middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
};

/**
 * ⚡ Center only middleware (fixed message)
 */
export const center = (req, res, next) => {
  if (req.user && req.user.role === "center") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as center" }); // Fixed typo
  }
};

/**
 * ⚡ Generic role-based middleware
 * Usage: authorizeRoles("admin", "center", "owner")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role "${req.user.role}" is not authorized to access this route`,
      });
    }

    next();
  };
};