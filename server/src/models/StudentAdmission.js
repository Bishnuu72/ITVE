// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // 🔹 Center Information
    center: {
      type: String,
      required: [true, "Center name is required"],
      trim: true,
    },

    // 🔹 Personal Information
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Mother's name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    religion: { type: String, trim: true },
    category: { type: String, trim: true },

    // 🔹 Contact Information
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Enter a valid email address",
      ],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    pincode: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    country: { type: String, default: "India", trim: true },

    // 🔹 Admission Information
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    course: {
      type: String,
      required: [true, "Course selection is required"],
      trim: true,
    },
    kit: { type: String, trim: true },
    registrationFee: {
      type: Number,
      default: 150,
      min: [0, "Registration fee cannot be negative"],
    },

    // 🔹 Uploaded Documents (Flattened for easy frontend access)
    photo: { type: String, trim: true },
    idProof: { type: String, trim: true },
    eduProof: { type: String, trim: true },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// Optional: Create index for faster search by name or mobile
studentSchema.index({ studentName: 1, mobile: 1 });

export default mongoose.model("Student", studentSchema);
