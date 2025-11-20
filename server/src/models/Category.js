import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  eligibility: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  photo: { type: String },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;