import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Photo", "Video"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    slNo: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    photo: {
      type: String, // Stores image filename or URL
      default: null,
    },
    videoFile: {
      type: String, // Stores video filename or URL
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);