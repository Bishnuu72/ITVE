import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default BlogCategory;