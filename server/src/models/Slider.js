import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    link: { type: String },
    slNo: { type: Number },
    description: { type: String },
    photo: { type: String },
    logo: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
