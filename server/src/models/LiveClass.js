// models/LiveClass.js
import mongoose from "mongoose";

const liveClassSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseName: { type: String, required: true }, // For display & search (populated from Course)

  liveClassName: { type: String, required: true },

  startDate: { type: Date, required: true }, // Full datetime
  endDate: { type: Date, required: true },   // Full datetime

  description: { type: String, required: true },
  youtubeLink: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

const LiveClass = mongoose.model("LiveClass", liveClassSchema);
export default LiveClass;