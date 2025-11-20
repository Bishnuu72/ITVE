// models/QRBalance.js
import mongoose from "mongoose";

const qrBalanceSchema = new mongoose.Schema({
  photo: { type: String }, // store file path or URL
  remarks: { type: String },
  centre: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
}, { timestamps: true });

export default mongoose.model("QRBalance", qrBalanceSchema);