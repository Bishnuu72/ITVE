import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    center: { type: String, required: true },
    consignmentId: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    through: { type: String, required: true },
    date: { type: Date, required: true },
    trackingLink: { type: String, required: false },
    status: { type: String, enum: ["Active", "Delivered", "In Transit", "Returned"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);
