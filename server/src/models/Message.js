import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    center: { type: String, required: true },
    student: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    attachment: { type: String }, // store filename or path
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
