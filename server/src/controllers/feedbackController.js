// src/controllers/feedbackController.js
import Feedback from "../models/Feedback.js";

// Submit feedback (public)
export const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!name || !email || !rating || !message) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const feedback = await Feedback.create({ name, email, rating, message });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    next(err);
  }
};

// Get all feedbacks (admin only)
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (err) {
    next(err);
  }
};

// Get feedback by ID (admin only)
export const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

// Mark feedback as read/unread (admin only)
export const markFeedbackRead = async (req, res, next) => {
  try {
    const { read } = req.body; // true or false
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: `Feedback marked as ${read ? "read" : "unread"}`, feedback });
  } catch (err) {
    next(err);
  }
};

// Delete feedback (admin only)
export const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (err) {
    next(err);
  }
};
