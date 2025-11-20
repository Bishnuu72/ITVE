import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeyword: { type: String, default: "" },
    title: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    youtubeCode: { type: String, default: "" },
    tags: { type: [String], default: [] },
    image: { type: String, default: null },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;