import QRBalance from "../models/QRBalance.js";
import fs from "fs";
import path from "path";

// ✅ Add QR Balance
export const addQRBalance = async (req, res) => {
  try {
    const { centre, amount, transactionType, remarks } = req.body;

    // ✅ Save relative path instead of absolute
    const photo = req.file ? `uploads/gallery/${req.file.filename}` : null;

    const newQR = await QRBalance.create({
      centre,
      amount,
      transactionType,
      remarks,
      photo,
    });

    res.status(201).json({
      success: true,
      message: "QR Balance added successfully",
      data: newQR,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All QR Balances
export const getAllQRBalances = async (req, res) => {
  try {
    const qrBalances = await QRBalance.find().sort({ createdAt: -1 });
    res.json({ success: true, data: qrBalances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get QR Balance by ID
export const getQRBalanceById = async (req, res) => {
  try {
    const qrBalance = await QRBalance.findById(req.params.id);
    if (!qrBalance) {
      return res.status(404).json({ success: false, message: "QR Balance not found" });
    }
    res.json({ success: true, data: qrBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update QR Balance
export const updateQRBalance = async (req, res) => {
  try {
    const { centre, amount, transactionType, remarks } = req.body;
    const qrBalance = await QRBalance.findById(req.params.id);

    if (!qrBalance) {
      return res.status(404).json({ success: false, message: "QR Balance not found" });
    }

    // ✅ If new photo uploaded, delete old photo and save relative path
    if (req.file) {
      if (qrBalance.photo && fs.existsSync(qrBalance.photo)) {
        fs.unlinkSync(qrBalance.photo);
      }
      qrBalance.photo = `uploads/gallery/${req.file.filename}`;
    }

    qrBalance.centre = centre || qrBalance.centre;
    qrBalance.amount = amount || qrBalance.amount;
    qrBalance.transactionType = transactionType || qrBalance.transactionType;
    qrBalance.remarks = remarks || qrBalance.remarks;

    const updatedQR = await qrBalance.save();
    res.json({ success: true, message: "QR Balance updated successfully", data: updatedQR });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete QR Balance
export const deleteQRBalance = async (req, res) => {
  try {
    const qrBalance = await QRBalance.findById(req.params.id);
    if (!qrBalance) {
      return res.status(404).json({ success: false, message: "QR Balance not found" });
    }

    // ✅ Delete photo from server if exists
    if (qrBalance.photo && fs.existsSync(qrBalance.photo)) {
      fs.unlinkSync(qrBalance.photo);
    }

    await qrBalance.deleteOne();
    res.json({ success: true, message: "QR Balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};