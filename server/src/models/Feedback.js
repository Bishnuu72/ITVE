// src/models/Feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    read: { type: Boolean, default: false }, // NEW
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Feedback", FeedbackSchema);
