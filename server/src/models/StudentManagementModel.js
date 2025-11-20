import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // ✅ NEW: Schema version for detecting changes (bump on updates)
    schemaVersion: { type: Number, default: 1 },

    // ✅ NEW: Registration Type (Admin vs Online)
    registrationType: { 
      type: String, 
      enum: ["Admin", "Online"], 
      default: "Admin" 
    },

    // Admin Use Only (defaults ensure storage - matches frontend pre-fills)
    studentStatus: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Active" },
    admitIssued: { type: String, enum: ["Yes", "No"], default: "No" },
    marksheetIssued: { type: String, enum: ["Yes", "No"], default: "No" },
    certificateIssued: { type: String, enum: ["Yes", "No"], default: "No" },
    semesterIssued: {
      type: String,
      enum: ["None Semester", "Semester I", "Semester II", "Semester III", "Semester IV"],
      default: "None Semester",
    },
    updateMarks: { type: String, enum: ["Yes", "No"], default: "No" },
    
    // Registration Details (required - matches frontend)
    center: { type: String, required: true },
    enrollmentNo: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
    
    // Student's Details (required - matches frontend)
    studentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: Date, required: true }, // Frontend date input → YYYY-MM-DD storage
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    mobile: { type: String, required: true },
    religion: { type: String, required: true },
    category: { type: String, required: true, enum: ["General", "OBC", "SC", "ST"] },
    
    // Address Details (required, except country - matches frontend)
    address: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, default: "India" },
    pin: { type: String, required: true }, // Frontend 'pin' field
    pincode: { type: String }, // Optional alias (from admission merge)
    
    // Course Details (required, except optional - matches frontend)
    admissionDate: { type: Date, required: true }, // Frontend date input
    course: { type: String, required: true },
    issueDate: { type: Date },
    examDate: { type: Date },
    examMode: { type: String, enum: ["Online", "Offline"], default: "Online" }, // Frontend select
    applyKit: { type: Boolean, default: false }, // Frontend checkbox
    kit: { type: String }, // Optional (from admission merge)
    totalFee: { type: Number, required: true }, // Frontend number input
    duration: { type: String, required: true },
    
    // Document Paths (optional - matches frontend Multer)
    studentPhoto: { type: String },
    idProof: { type: String },
    eduProof: { type: String },
    
    // For AllStudents table (defaults ensure storage - matches frontend)
    sendingByMail: { type: String, enum: ["Yes", "No"], default: "No" },
    orderStatus: { 
      type: String, 
      enum: ["Certificate Not Print", "Certificate Print", "Certificate Sent"], 
      default: "Certificate Not Print" 
    },
    
    // Merged from admission (optional defaults)
    registrationFee: { type: Number, default: 150 },

    // ✅ FIXED: Soft delete flag (ensures it's here)
    isDeleted: { type: Boolean, default: false },

    // ✅ NEW: Admit Subjects Array (for UpdateAdmit.jsx)
    admitSubjects: [{
      name: { type: String, required: true },
      fullMarks: { type: Number, required: true },
      examDate: { type: Date }, // Optional
      examTime: { type: String }, // Optional (e.g., "10:00 AM")
    }],

    // ✅ NEW: Marks Array (for UpdateMarks.jsx)
    marks: [{
      name: { type: String, required: true },
      fullMarks: { type: Number, required: true },
      obtained: { type: Number }, // Optional (editable)
    }],

    // ✅ NEW: File Paths for Documents (for UpdateMarks.jsx)
    questionPaper: { type: String },
    answerSheet: { type: String },
  },
  { timestamps: true }
);

// ✅ FIXED: Enhanced pre-save hook for Dates: Robust string-to-Date parsing (handles invalid dates + arrays)
studentSchema.pre('save', function(next) {
  const parseDateSafely = (dateField) => {
    if (this[dateField] && typeof this[dateField] === 'string') {
      const parsed = new Date(this[dateField]);
      if (!isNaN(parsed.getTime())) { // Valid date
        this[dateField] = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
        console.log(`🔍 Pre-save parsed ${dateField}:`, this[dateField]);
      } else {
        console.error(`❌ Invalid ${dateField}:`, this[dateField]);
        next(new Error(`${dateField} is invalid date format`));
      }
    }
  };

  parseDateSafely('dob');
  parseDateSafely('admissionDate');
  // Optional dates
  ['issueDate', 'examDate'].forEach(parseDateSafely);

  // ✅ NEW: Parse examDate inside admitSubjects array
  if (this.admitSubjects && Array.isArray(this.admitSubjects)) {
    this.admitSubjects.forEach((subj, index) => {
      if (subj.examDate && typeof subj.examDate === 'string') {
        const parsed = new Date(subj.examDate);
        if (!isNaN(parsed.getTime())) {
          subj.examDate = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
          console.log(`🔍 Pre-save parsed admitSubjects[${index}].examDate:`, subj.examDate);
        } else {
          console.warn(`⚠️ Invalid admitSubjects[${index}].examDate: ${subj.examDate} → set to null`);
          subj.examDate = null;
        }
      }
    });
  }

  next();
});

// ✅ FIXED: Force clear cached model (TEMP for dev - remove after testing)
if (mongoose.models.Student) {
  delete mongoose.models.Student;
  console.log("🗑️ Cleared cached Student model - using fresh schema");
}

// Prevent model recompilation & force collection name for safety
export default mongoose.models.Student || mongoose.model("Student", studentSchema, "students");