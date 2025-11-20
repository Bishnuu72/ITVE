import Fee from "../models/Fee.js";

/**
 * @desc Add a new fee (Admin or Center)
 * @route POST /api/fees
 * @access Private/Admin or Center
 */
export const addFee = async (req, res) => {
  try {
    const { student, centre, amount, date, paymentMode, remarks } = req.body;

    if (!student || !centre || !amount || !date || !paymentMode) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const fee = new Fee({
      student,
      centre,
      amount,
      date,
      paymentMode,
      remarks,
      createdBy: req.user.id,
    });

    await fee.save();
    const populatedFee = await Fee.findById(fee._id).populate("createdBy", "name email");
    return res.status(201).json({ message: "Fee added successfully", fee: populatedFee });
  } catch (error) {
    console.error("Add fee error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all fees (Admin or Center)
 * @route GET /api/fees
 * @access Private/Admin or Center
 */
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    return res.status(200).json(fees);
  } catch (error) {
    console.error("Get fees error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get fee by ID (Admin, Center, or Creator)
 * @route GET /api/fees/:id
 * @access Private
 */
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate("createdBy", "name email");
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    // Auth check: Admin, Center, or Creator (by ID match)
    if (
      req.user.role !== "admin" &&
      req.user.role !== "center" &&
      fee.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to view this fee" });
    }

    return res.status(200).json(fee);
  } catch (error) {
    console.error("Get fee by ID error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update fee (Admin or Center)
 * @route PUT /api/fees/:id
 * @access Private/Admin or Center
 */
export const updateFee = async (req, res) => {
  try {
    // Role check first (redundant with middleware, but for safety)
    if (req.user.role !== "admin" && req.user.role !== "center") {
      return res.status(403).json({ message: "Not authorized to update this fee" });
    }

    const { student, centre, amount, date, paymentMode, remarks } = req.body;
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { student, centre, amount, date, paymentMode, remarks },
      { new: true }
    ).populate("createdBy", "name email");

    if (!fee) return res.status(404).json({ message: "Fee not found" });

    return res.status(200).json({ message: "Fee updated successfully", fee });
  } catch (error) {
    console.error("Update fee error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete fee (Admin or Center)
 * @route DELETE /api/fees/:id
 * @access Private/Admin or Center
 */
export const deleteFee = async (req, res) => {
  try {
    // Role check first (redundant with middleware, but for safety)
    if (req.user.role !== "admin" && req.user.role !== "center") {
      return res.status(403).json({ message: "Not authorized to delete this fee" });
    }

    // Find first to check existence and auth
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    // Now delete
    await Fee.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Fee deleted successfully" });
  } catch (error) {
    console.error("Delete fee error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};