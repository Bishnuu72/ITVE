import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  heroNotice: { type: String, required: true },
  boardNotice: { type: String },
  admissionNotice: { type: String },
  jobApplyNotice: { type: String },
  thankfulNotice: { type: String },
  centerApplyNotice: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

export default mongoose.model("Notice", noticeSchema);