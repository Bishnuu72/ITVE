import Student from "../models/StudentAdmission.js";
import fs from "fs";
import path from "path";

// ==========================
// Create new student (Public + Admin)
// ==========================
export const createStudent = async (req, res) => {
  try {
    const studentData = { ...req.body };

    // ✅ Handle uploaded files (flat structure, matches schema)
    if (req.files) {
      if (req.files.photo && req.files.photo[0])
        studentData.photo = req.files.photo[0].filename;
      if (req.files.idProof && req.files.idProof[0])
        studentData.idProof = req.files.idProof[0].filename;
      if (req.files.eduProof && req.files.eduProof[0])
        studentData.eduProof = req.files.eduProof[0].filename;
    }

    // ✅ Required field validation
    const requiredFields = [
      "center",
      "studentName",
      "fatherName",
      "motherName",
      "dob",
      "gender",
      "mobile",
      "address",
      "course",
    ];

    const missingFields = requiredFields.filter(
      (field) => !studentData[field] || studentData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // ✅ Mark if added by admin
    if (req.user?.role === "admin") {
      studentData.addedByAdmin = true;
    }

    // ✅ Create student in DB
    const student = await Student.create(studentData);

    return res.status(201).json({
      success: true,
      message:
        req.user?.role === "admin"
          ? "Student added successfully by admin."
          : "Student admission submitted successfully.",
      student,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating student.",
    });
  }
};

// ==========================
// Get all students (Admin)
// ==========================
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================
// Get single student by ID (Admin)
// ==========================
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    console.error("❌ Error fetching student by ID:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================
// Delete student (Admin)
// ==========================
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // ✅ Delete uploaded files if exist (photo, idProof, eduProof)
    const fileFields = ["photo", "idProof", "eduProof"];
    fileFields.forEach((field) => {
      if (student[field]) {
        const filePath = path.join("uploads", student[field]);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted file: ${filePath}`);
        }
      }
    });

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student.",
    });
  }
};
