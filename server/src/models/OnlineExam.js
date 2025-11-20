import mongoose from "mongoose";

const onlineExamSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    course: { type: String, required: true },
    courseName: { type: String },
    semesterType: { type: String, required: true },
    subject: { type: String, required: true },
    examTypes: { type: String, required: true },
    multipleSubjectTypes: { type: String, required: true },
    duration: { type: Number, required: true },
    totalMark: { type: Number, required: true },
    passMark: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("OnlineExam", onlineExamSchema);
