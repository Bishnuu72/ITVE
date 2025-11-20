import MainExamResult from "../models/MainExamResult.js";

export const getMainResults = async (req, res) => {
  try {
    const results = await MainExamResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMainResult = async (req, res) => {
  try {
    const result = await MainExamResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMainResult = async (req, res) => {
  try {
    await MainExamResult.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
