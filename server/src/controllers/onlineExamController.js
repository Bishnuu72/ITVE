import OnlineExam from "../models/OnlineExam.js";

// ✅ Get all exams
export const getAllExams = async (req, res) => {
  try {
    const exams = await OnlineExam.find()
    .populate("course", "name code")
    .sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await OnlineExam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create exam
export const createExam = async (req, res) => {
  try {
    const exam = await OnlineExam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update exam
export const updateExam = async (req, res) => {
  try {
    const exam = await OnlineExam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await OnlineExam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
