// models/Setting.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    seoTitle: { type: String, required: true },
    seoKeyword: { type: String, required: true },
    seoDescription: { type: String, required: true },

    adminMobile: { type: String, required: true },
    franchiseEnquiry: { type: String, required: true },
    helpline: { type: String, required: true },
    adminEmail: { type: String, required: true },
    address: { type: String, required: true },

    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    whatsapp: { type: String },

    studentRegFee: { type: Number, default: 0 },
    headBranchRegFee: { type: Number, default: 0 },
    centerRegFee: { type: Number, default: 0 },

    logo: { type: String },
    qrCode: { type: String },
    signature: { type: String },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
