import Slider from "../models/Slider.js";

// Get all sliders
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ slNo: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch sliders" });
  }
};

// Add new slider
export const addSlider = async (req, res) => {
  try {
    const { name, link, slNo, description, status } = req.body;
    const photo = req.files?.photo?.[0]?.filename || null;
    const logo = req.files?.logo?.[0]?.filename || null;

    const newSlider = new Slider({ name, link, slNo, description, photo, logo, status });
    await newSlider.save();
    res.status(201).json({ success: true, message: "Slider added successfully", slider: newSlider });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add slider" });
  }
};

// Delete slider
export const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    await Slider.findByIdAndDelete(id);
    res.json({ success: true, message: "Slider deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete slider" });
  }
};

// Update slider
export const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, slNo, description, status } = req.body;
    const photo = req.files?.photo?.[0]?.filename;
    const logo = req.files?.logo?.[0]?.filename;

    const updatedData = { name, link, slNo, description, status };
    if (photo) updatedData.photo = photo;
    if (logo) updatedData.logo = logo;

    const updatedSlider = await Slider.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ success: true, message: "Slider updated successfully", slider: updatedSlider });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update slider" });
  }
};