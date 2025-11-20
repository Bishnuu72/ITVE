import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Notice", "Result", "Syllabus", "Certificate", "Admit Card", "Receipt", "Other"], // Matches dummy data; extend as needed
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
      required: true, // Relative path, e.g., "downloads/sample.pdf"
    },
    picture: {
      type: String, // Relative path, e.g., "downloads/picture-sample.jpg" (thumbnail)
      required: false, // Optional, but enforced in controller if form requires it
    },
    course: {
      type: String, // ✅ FIXED: Changed to String (store course name directly, e.g., "Multimedia")
      trim: true,
      required: false, // Optional
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Additional fields if needed (e.g., for admin/client visibility)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.model("Download", downloadSchema);