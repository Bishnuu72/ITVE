// src/controllers/verificationController.js
import User from "../models/User.js";
import Student from "../models/StudentManagementModel.js";

// Keep your original functions exactly as they are
export const verifyStaff = async (req, res, next) => {
  // ... your existing code (unchanged)
};

export const verifyCenter = async (req, res, next) => {
  // ... your existing code (unchanged)
};

// YOUR ORIGINAL verifyStudent – 100% UNTOUCHED
export const verifyStudent = async (req, res, next) => {
  try {
    const { rollNo, dob } = req.body;

    if (!rollNo || !dob) {
      return res.status(400).json({ success: false, message: "rollNo and dob are required" });
    }

    let dobDate;
    try {
      dobDate = new Date(dob + 'T00:00:00.000Z');
      if (isNaN(dobDate.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid DOB format. Use YYYY-MM-DD." });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid DOB format." });
    }

    const student = await Student.findOne({
      rollNo: rollNo.trim().toUpperCase(),
      dob: dobDate,
    }).select('_id schemaVersion registrationType studentStatus admitIssued marksheetIssued certificateIssued semesterIssued updateMarks center enrollmentNo rollNo studentName fatherName motherName dob gender mobile religion category address state district country pin admissionDate course issueDate examDate examMode applyKit totalFee duration studentPhoto idProof eduProof sendingByMail orderStatus registrationFee isDeleted questionPaper answerSheet admitSubjects marks');

    if (!student) {
      console.log(`No student found for rollNo: "${rollNo.trim().toUpperCase()}", dob: "${dob}"`);
      return res.status(404).json({ 
        success: false, 
        message: "No results for this roll number and DOB" 
      });
    }

    const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : "N/A";

    return res.json({ 
      success: true, 
      message: "Student verified successfully",
      data: {
        schemaVersion: student.schemaVersion,
        registrationType: student.registrationType,
        studentStatus: student.studentStatus,
        admitIssued: student.admitIssued,
        marksheetIssued: student.marksheetIssued,
        certificateIssued: student.certificateIssued,
        semesterIssued: student.semesterIssued,
        updateMarks: student.updateMarks,
        center: student.center,
        enrollmentNo: student.enrollmentNo,
        rollNo: student.rollNo,
        studentName: student.studentName || "N/A",
        fatherName: student.fatherName || "N/A",
        motherName: student.motherName || "N/A",
        dob: formatDate(student.dob),
        gender: student.gender || "N/A",
        mobile: student.mobile || "N/A",
        religion: student.religion || "N/A",
        category: student.category || "N/A",
        address: student.address || "N/A",
        state: student.state || "N/A",
        district: student.district || "N/A",
        country: student.country || "N/A",
        pin: student.pin || "N/A",
        admissionDate: formatDate(student.admissionDate),
        course: student.course || "N/A",
        issueDate: formatDate(student.issueDate),
        examDate: formatDate(student.examDate),
        examMode: student.examMode || "N/A",
        applyKit: student.applyKit || false,
        totalFee: student.totalFee || "N/A",
        duration: student.duration || "N/A",
        studentPhoto: student.studentPhoto || "N/A",
        idProof: student.idProof || "N/A",
        eduProof: student.eduProof || "N/A",
        sendingByMail: student.sendingByMail || "N/A",
        orderStatus: student.orderStatus || "N/A",
        registrationFee: student.registrationFee || "N/A",
        isDeleted: student.isDeleted || false,
        questionPaper: student.questionPaper ? student.questionPaper.toString() : "N/A",
        answerSheet: student.answerSheet ? student.answerSheet.toString() : "N/A",
        admitSubjects: student.admitSubjects || [],
        marks: student.marks || [],
      }
    });
  } catch (err) {
    console.error("Student verification error:", err);
    return res.status(500).json({ success: false, message: "Server error during verification" });
  }
};

// NEW FUNCTION – ONLY FOR DOWNLOAD PAGES (Admit Card, Certificate, etc.)
export const verifyStudentForDownload = async (req, res) => {
  try {
    const { rollNo, dob } = req.body;

    if (!rollNo || !dob) {
      return res.status(400).json({ success: false, message: "Roll No and DOB required" });
    }

    const dobDate = new Date(dob + 'T00:00:00.000Z');
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid DOB" });
    }

    const student = await Student.findOne({
      rollNo: rollNo.trim().toUpperCase(),
      dob: dobDate,
      isDeleted: { $ne: true }
    })
    .select('_id studentName rollNo enrollmentNo course center examDate studentPhoto')
    .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.json({
      success: true,
      data: {
        _id: student._id.toString(),           // 100% guaranteed
        studentName: student.studentName,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo || "N/A",
        course: student.course || "N/A",
        center: student.center || "N/A",
        examDate: student.examDate ? new Date(student.examDate).toISOString().split('T')[0] : "N/A",
        studentPhoto: student.studentPhoto || null,
      }
    });

  } catch (err) {
    console.error("Download verification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW: Verify Student Result - Smart Logic (Add this in verificationController.js)
export const verifyStudentResult = async (req, res) => {
  try {
    const { rollNo, dob } = req.body;

    if (!rollNo || !dob) {
      return res.status(400).json({ success: false, message: "Roll No and DOB required" });
    }

    const dobDate = new Date(dob + 'T00:00:00.000Z');
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid DOB" });
    }

    const student = await Student.findOne({
      rollNo: rollNo.trim().toUpperCase(),
      dob: dobDate,
      isDeleted: { $ne: true }
    })
    .select('studentName rollNo enrollmentNo course center marks examDate examMode studentPhoto')
    .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // If no marks array or empty → Result not published
    if (!student.marks || student.marks.length === 0) {
      return res.json({
        success: true,
        resultStatus: "NOT_PUBLISHED",
        message: "Result Not Published Yet",
        data: {
          studentName: student.studentName,
          rollNo: student.rollNo,
          enrollmentNo: student.enrollmentNo || "N/A",
          course: student.course || "N/A",
          center: student.center || "N/A",
          studentPhoto: student.studentPhoto || null,
        }
      });
    }

    let totalMarks = 0;
    let obtainedMarks = 0;
    let allPassed = true;

    const subjects = student.marks.map(sub => {
      const theoryMax = sub.theoryMax || 100;
      const practicalMax = sub.practicalMax || 0;
      const totalMax = theoryMax + practicalMax;

      const theoryObtained = sub.theoryObtained || 0;
      const practicalObtained = sub.practicalObtained || 0;
      const totalObtained = theoryObtained + practicalObtained;

      totalMarks += totalMax;
      obtainedMarks += totalObtained;

      // Subject pass: 33% in theory AND practical (if applicable)
      const theoryPass = theoryMax > 0 ? theoryObtained >= 33 : true;
      const practicalPass = practicalMax > 0 ? practicalObtained >= 33 : true;
      const subjectPassed = theoryPass && practicalPass;

      if (!subjectPassed) allPassed = false;

      return {
        subjectName: sub.subjectName || "Unknown Subject",
        theoryMax,
        theoryObtained,
        practicalMax,
        practicalObtained,
        totalMax,
        totalObtained,
        passed: subjectPassed
      };
    });

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const finalResult = allPassed ? "PASS" : "FAIL";

    const grade = percentage >= 90 ? "A+" :
                  percentage >= 80 ? "A" :
                  percentage >= 70 ? "B+" :
                  percentage >= 60 ? "B" :
                  percentage >= 50 ? "C" :
                  percentage >= 33 ? "D" : "F";

    return res.json({
      success: true,
      resultStatus: "PUBLISHED",
      data: {
        studentName: student.studentName,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo || "N/A",
        course: student.course || "N/A",
        center: student.center || "N/A",
        examDate: student.examDate ? new Date(student.examDate).toISOString().split('T')[0] : "N/A",
        examMode: student.examMode || "N/A",
        studentPhoto: student.studentPhoto || null,
        subjects,
        totalMarks,
        obtainedMarks,
        percentage: percentage.toFixed(2),
        resultStatus: finalResult,
        grade
      }
    });

  } catch (err) {
    console.error("Result verification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW: Verify Certificate or Marksheet by Certificate No + Enrollment No
export const verifyDocument = async (req, res) => {
  try {
    const { certificateNo, enrollmentNo, type } = req.body;

    if (!certificateNo || !enrollmentNo || !type) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!["certificate", "marksheet"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid document type" });
    }

    // Find student by enrollmentNo (exact match, case-insensitive)
    const student = await Student.findOne({
      enrollmentNo: enrollmentNo.trim().toUpperCase(),
      isDeleted: { $ne: true }
    })
    .select('studentName rollNo enrollmentNo course center studentPhoto certificateNo marksheetNo certificateIssued marksheetIssued')
    .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found with this Enrollment No" });
    }

    // Check Certificate No match
    const certField = type === "certificate" ? "certificateNo" : "marksheetNo";
    const issuedField = type === "certificate" ? "certificateIssued" : "marksheetIssued";

    if (!student[certField] || student[certField].trim().toUpperCase() !== certificateNo.trim().toUpperCase()) {
      return res.status(404).json({ 
        success: false, 
        message: type === "certificate" ? "Invalid Certificate Number" : "Invalid Marksheet Number" 
      });
    }

    if (student[issuedField] !== "Yes") {
      return res.status(400).json({ 
        success: false, 
        message: type === "certificate" ? "Certificate not issued yet" : "Marksheet not issued yet" 
      });
    }

    return res.json({
      success: true,
      message: `${type === "certificate" ? "Certificate" : "Marksheet"} verified successfully`,
      data: {
        studentName: student.studentName,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo,
        course: student.course || "N/A",
        center: student.center || "N/A",
        studentPhoto: student.studentPhoto || null,
        certificateNo: student.certificateNo || "N/A",
        marksheetNo: student.marksheetNo || "N/A",
        type: type
      }
    });

  } catch (err) {
    console.error("Document verification error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
