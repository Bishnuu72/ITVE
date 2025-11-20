// src/models/Book.js
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    course: { type: String, default: "", trim: true }, // Optional now
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    file: { type: String, required: true },     // filename only
    picture: { type: String, required: true },  // filename only
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);