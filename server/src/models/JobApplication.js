// src/models/JobApplication.js
import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    religion: { type: String, trim: true },
    category: { type: String, trim: true },
    qualification: { type: String, required: true, trim: true },
    jbceRoll: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    resume: { type: String, trim: true }, // file path or URL
    applyFor: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
    // Optional: track if admin reviewed
    reviewedByAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("JobApplication", JobApplicationSchema);
