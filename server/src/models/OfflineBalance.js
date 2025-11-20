// models/OfflineBalance.js
import mongoose from "mongoose";

const offlineBalanceSchema = new mongoose.Schema({
  centre: { type: String, required: true },
  centreWiseAmount: { type: Number, required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
  transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
  status: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" },
  paymentType: { type: String, required: true },
  photo: { type: String }, // file path or URL
}, { timestamps: true });

export default mongoose.model("OfflineBalance", offlineBalanceSchema);