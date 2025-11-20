import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP || "1d",
  });
};

// --------- Auth Methods ---------

// @desc    Register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || "user" // Default role if not provided
    });

    // Optional: email verification token (skipped for simplicity)
    // const verificationToken = user.getVerificationToken();
    // await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error during registration" });
  }
};

// @desc    Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log(`Login attempt failed: No user found for email ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login attempt failed: Password mismatch for user ${user._id}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`Login successful for user ${user._id} (${user.role})`);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Server error during login" });
  }
};

// @desc    Logout user
export const logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: "User logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: err.message || "Server error during logout" });
  }
};

// Forgot Password - generate token and send link in response
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Forgot password: No user found for ${email}`);
      return res.status(404).json({ message: "No user found with that email" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Direct reset link (use frontend URL)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    console.log("Reset Password Link:", resetUrl);

    res.status(200).json({
      success: true,
      message: `Password reset link generated for ${email}`,
      resetLink: resetUrl, // Send to frontend for dev/testing
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash token to match stored hash in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Reset password: Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`Password reset successful for user ${user._id}`);
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// @desc    Update logged-in user's password
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new passwords" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};