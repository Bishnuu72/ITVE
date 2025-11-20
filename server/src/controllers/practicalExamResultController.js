import PracticalExamResult from "../models/PracticalExamResult.js";

export const getPracticalResults = async (req, res) => {
  try {
    const results = await PracticalExamResult.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPracticalResult = async (req, res) => {
  try {
    const result = await PracticalExamResult.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePracticalResult = async (req, res) => {
  try {
    await PracticalExamResult.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
