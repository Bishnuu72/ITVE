import mongoose from "mongoose";

const mainExamResultSchema = new mongoose.Schema(
  {
    student: { type: String, required: true },
    courseName: { type: String, required: true },
    subjectName: { type: String, required: true },
    examName: { type: String, required: true },
    semesterType: { type: String, required: true },
    remark: { type: String, enum: ["Pass", "Fail"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("MainExamResult", mainExamResultSchema);
