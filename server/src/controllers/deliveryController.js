import Delivery from "../models/Delivery.js";

// Add delivery
export const addDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    const savedDelivery = await delivery.save();
    res.status(201).json(savedDelivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all deliveries
export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Track a delivery by consignment ID
export const trackDelivery = async (req, res) => {
  try {
    const { consignmentId } = req.params;
    const delivery = await Delivery.findOne({ consignmentId });
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update delivery
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDelivery) return res.status(404).json({ error: "Delivery not found" });
    res.json(updatedDelivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete delivery
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Delivery.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Delivery not found" });
    res.json({ message: "Delivery deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
