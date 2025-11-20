import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullMarks: { type: Number, required: true },
});

// ✅ UPDATED: Clear any cached models before defining (fixes schema drift)
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}
if (mongoose.models.Course) {
  delete mongoose.models.Course;
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    photo: { type: String }, // Path to uploaded photo, e.g., "/uploads/category_123.jpg"
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete for consistency
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    duration: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "Certificate", "Diploma"
    categoryType: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    eligibility: { type: String, required: true },
    totalSubjects: { type: Number, required: true },
    regFeeWithoutKit: { type: Number, required: true },
    regFeeWithKit: { type: Number, required: true },
    examQuestionPapers: { type: String, required: true },
    semester: { type: String, default: "No" },
    semesterType: { type: String, enum: ["Half Yearly", "Yearly", "None"], default: "None" },
    details: { type: String, required: true },
    photo: { type: String }, // Path to uploaded photo
    subjects: [subjectSchema], // Array of subjects
    deleted: { type: Boolean, default: false }, // Note: Using 'deleted' as in your original
  },
  { timestamps: true }
);

// Indexes for search
courseSchema.index({ name: "text", shortName: "text" });
categorySchema.index({ name: "text" });

// ✅ UPDATED: Force new model definition (no conditional caching)
export const Category = mongoose.model("Category", categorySchema);
export const Course = mongoose.model("Course", courseSchema);