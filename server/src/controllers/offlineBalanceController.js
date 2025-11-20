import OfflineBalance from "../models/OfflineBalance.js";

// ✅ Add Offline Balance (Admin)
export const addOfflineBalance = async (req, res) => {
  try {
    const { centre, centreWiseAmount, amount, reason, transactionType, status, paymentType } = req.body;

    // ✅ Validate required fields
    if (!centre || !centreWiseAmount || !amount || !transactionType || !paymentType) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // ✅ Validate amount logic
    if (Number(amount) > Number(centreWiseAmount)) {
      return res.status(400).json({ message: "Amount cannot exceed Centre-wise amount" });
    }

    // ✅ Handle photo upload
    const photo = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newBalance = await OfflineBalance.create({
      centre,
      centreWiseAmount,
      amount,
      reason,
      transactionType,
      status,
      paymentType,
      photo,
    });

    res.status(201).json({ message: "Offline Balance added successfully", data: newBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Offline Balances (Admin)
export const getAllOfflineBalances = async (req, res) => {
  try {
    const balances = await OfflineBalance.find().sort({ createdAt: -1 });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Offline Balance by ID (Admin/User)
export const getOfflineBalanceById = async (req, res) => {
  try {
    const balance = await OfflineBalance.findById(req.params.id);
    if (!balance) return res.status(404).json({ message: "Offline Balance not found" });
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Offline Balance (Admin)
export const updateOfflineBalance = async (req, res) => {
  try {
    const { centre, centreWiseAmount, amount, reason, transactionType, status, paymentType } = req.body;

    // ✅ Validate amount logic
    if (amount && centreWiseAmount && Number(amount) > Number(centreWiseAmount)) {
      return res.status(400).json({ message: "Amount cannot exceed Centre-wise amount" });
    }

    const photo = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

    const updatedBalance = await OfflineBalance.findByIdAndUpdate(
      req.params.id,
      {
        centre,
        centreWiseAmount,
        amount,
        reason,
        transactionType,
        status,
        paymentType,
        ...(photo && { photo }),
      },
      { new: true }
    );

    if (!updatedBalance) return res.status(404).json({ message: "Offline Balance not found" });

    res.json({ message: "Offline Balance updated successfully", data: updatedBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Offline Balance (Admin)
export const deleteOfflineBalance = async (req, res) => {
  try {
    const deletedBalance = await OfflineBalance.findByIdAndDelete(req.params.id);
    if (!deletedBalance) return res.status(404).json({ message: "Offline Balance not found" });
    res.json({ message: "Offline Balance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};