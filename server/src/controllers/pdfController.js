import PDFDocument from "pdfkit";
import Student from "../models/StudentManagementModel.js";
import fs from "fs";
import path from "path";

const uploadsPath = path.join(process.cwd(), "uploads");

// Helper: Embed student photo if exists (with better error handling)
const embedImage = (doc, imagePath, x, y, width, height) => {
  if (!imagePath) {
    // Draw placeholder rect if no photo
    doc.rect(x, y, width, height).stroke();
    doc.fontSize(10).text("Photo Not Available", x + 5, y + height / 2 - 5);
    return;
  }
  
  const fullPath = path.join(uploadsPath, imagePath);
  if (fs.existsSync(fullPath)) {
    try {
      doc.image(fullPath, x, y, { width, height });
      console.log(`✅ Embedded photo: ${imagePath}`);
    } catch (err) {
      console.error(`❌ Failed to embed photo ${imagePath}:`, err);
      doc.rect(x, y, width, height).stroke();
      doc.fontSize(10).text("Photo Load Error", x + 5, y + height / 2 - 5);
    }
  } else {
    console.warn(`⚠️ Photo not found: ${fullPath}`);
    doc.rect(x, y, width, height).stroke();
    doc.fontSize(10).text("Photo Not Available", x + 5, y + height / 2 - 5);
  }
};

/* ============================================================
   🪪  ADMIT CARD GENERATOR
============================================================ */
export const generateAdmitCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Generating Admit Card for student ID: ${id}`);

    const student = await Student.findById(id);
    if (!student) {
      console.warn(`⚠️ Student not found: ${id}`);
      return res.status(404).json({ error: "Student not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename="AdmitCard_${student.enrollmentNo || 'Unknown'}.pdf"`
    );
    doc.pipe(res);

    // Header (unchanged)
    doc.font("Helvetica-Bold").fontSize(16).text("ITVE (Information Technology and Vocational Education)", { align: "center" });
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(9).text(
      "Reg No: 2024/4/IV/814 | Regd. Under Trust Act 1882, Govt of INDIA NCT New Delhi NCT No: IN-DL52188359861807W",
      { align: "center" }
    );
    doc.text(
      "(An Autonomous Organization) | ISO 9001:2015 Certified | Accredited by IAF (International Accreditation Forum)",
      { align: "center" }
    );
    doc.moveDown(1);

    // Title
    doc.font("Helvetica-Bold").fontSize(20).text("ADMIT CARD", { align: "center" });
    doc.moveDown(0.5);

    // Student Info (null-safe)
    doc.fontSize(11);
    doc.text(`Roll No: ${student.rollNo || "TBD"}`);
    doc.text(`Enrollment No: ${student.enrollmentNo || "N/A"}`);
    doc.text(`Student Name: ${student.studentName || "N/A"}`);
    doc.text(`Father Name: ${student.fatherName || "N/A"}`);
    doc.text(`Date Of Birth: ${student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}`);
    doc.text(`Course: ${student.course || "N/A"}`);
    doc.text(`Exam Center: ${student.center || "N/A"}`);
    doc.text(`Exam Center Address: ${student.address || "N/A"}`);
    doc.moveDown(1);

    // Student Photo (Top-right)
    embedImage(doc, student.studentPhoto, 430, 120, 100, 110);
    doc.moveDown(1.5);

    // Subjects Table Header
    const tableY = 350;
    doc.font("Helvetica-Bold").fontSize(12).text("Sr. No.", 50, tableY);
    doc.text("Name of The Paper(s)", 120, tableY);
    doc.text("Exam Date & Time", 300, tableY);
    doc.text("Signature of Candidate", 430, tableY);
    doc.text("Signature of Invigilator", 520, tableY);
    doc.moveTo(50, tableY + 15).lineTo(650, tableY + 15).stroke();

    // Subjects Rows (null-safe)
    let y = tableY + 30;
    if (student.admitSubjects && Array.isArray(student.admitSubjects) && student.admitSubjects.length > 0) {
      student.admitSubjects.forEach((subj, index) => {
        doc.font("Helvetica").fontSize(10);
        doc.text(`${index + 1}`, 55, y);
        doc.text(`${subj.name || "N/A"}`, 120, y);
        const examDateTime = subj.examDate 
          ? `${new Date(subj.examDate).toLocaleDateString()} ${subj.examTime || ''}` 
          : "—";
        doc.text(`${examDateTime}`, 300, y);
        doc.rect(430, y - 5, 80, 15).stroke();
        doc.rect(520, y - 5, 80, 15).stroke();
        y += 25;
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      });
    } else {
      doc.fontSize(11).text("No subjects assigned.", 50, y);
    }

    // Footer Signatures (unchanged)
    doc.moveTo(y + 50, 670).lineTo(650, 670).stroke();
    doc.font("Helvetica-Bold").fontSize(12).text("Controller Of Examination", 100, 680);
    doc.font("Helvetica-Bold").fontSize(12).text("Authorised Signatory", 400, 680);

    // Bottom Info (unchanged)
    doc.moveDown(2);
    doc.fontSize(9).text(
      "Reg. Office: At House No.192, 1st Floor, Main Road, Khichripur, Village, Near By MCD SCHOOL, DELHI - 110091",
      { align: "center" }
    );
    doc.text("H.O: ITVE, KUMAR CHOWK, ROAD NO. 03, DUMRA, SITAMARHI, Bihar - 843301", { align: "center" });
    doc.text("Online Certificate Verification Available on www.itveindia.org", { align: "center" });

    doc.end();
    console.log(`✅ Admit Card generated for ${student.studentName} (${id})`);
  } catch (err) {
    console.error("❌ Admit Card Error:", err);
    res.status(500).json({ error: "Failed to generate admit card" });
  }
};

/* ============================================================
   🎓  COURSE COMPLETION CERTIFICATE (with Dynamic Grade)
============================================================ */
export const generateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Generating Certificate for student ID: ${id}`);

    const student = await Student.findById(id);
    if (!student) {
      console.warn(`⚠️ Student not found: ${id}`);
      return res.status(404).json({ error: "Student not found" });
    }

    // ✅ FIXED: Calculate percentage and grade from marks array (null-safe)
    let grade = 'Not Applicable';
    let percentage = 0;
    if (student.marks && Array.isArray(student.marks) && student.marks.length > 0) {
      const fullTotal = student.marks.reduce((sum, m) => sum + (Number(m.fullMarks) || 0), 0);
      const obtainedTotal = student.marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
      percentage = fullTotal > 0 ? Math.round((obtainedTotal / fullTotal) * 100) : 0;

      // ✅ Grade Logic: Pass/Fail + Sub-grade
      if (percentage >= 33) {
        grade = 'Pass';
        if (percentage >= 80) grade += ' - A';
        else if (percentage >= 70) grade += ' - B';
        else if (percentage >= 60) grade += ' - C';
        else if (percentage >= 50) grade += ' - D';
        else grade += ' - E';
      } else {
        grade = 'Fail';
      }
      grade += ` (${percentage}%)`; // Append percentage
      console.log(`📊 Calculated grade for ${student.studentName}: ${grade}`);
    } else {
      console.log(`⚠️ No marks available for ${student.studentName} - using default grade`);
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename="Certificate_${student.enrollmentNo || 'Unknown'}.pdf"`
    );
    doc.pipe(res);

    // Header (unchanged)
    doc.font("Helvetica-Bold").fontSize(16).text("ITVE (Information Technology and Vocational Education)", { align: "center" });
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(9).text(
      "Reg No: 2024/4/IV/814 | Regd. Under Trust Act 1882, Govt of INDIA NCT New Delhi NCT No: IN-DL52188359861807W",
      { align: "center" }
    );
    doc.text(
      "(An Autonomous Organization) | ISO 9001:2015 Certified | Accredited by IAF (International Accreditation Forum)",
      { align: "center" }
    );
    doc.moveDown(1);

    // Title
    doc.font("Helvetica-Bold").fontSize(20).text("COURSE COMPLETION CERTIFICATE", { align: "center" });
    doc.moveDown(1);

    // Certificate Content (null-safe)
    doc.fontSize(12).text("This is to certify that", { align: "center" });
    doc.moveDown(0.3);
    doc.font("Helvetica-Bold").fontSize(16).text(
      `${student.studentName || "N/A"} S/o / D/o ${student.fatherName || "N/A"}`,
      { align: "center" }
    );
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(12).text(
      `has successfully completed the ${student.course || "N/A"}`,
      { align: "center" }
    );

    doc.moveDown(0.5);
    const startDate = student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "—";
    const endDate = student.issueDate ? new Date(student.issueDate).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(
      `held during ${startDate} to ${endDate} with "${grade}" at`,
      { align: "center" }
    );
    doc.font("Helvetica-Bold").text(`${student.center || "INSTITUTE OF COMPUTER MANAGEMENT"}`, { align: "center" });
    doc.font("Helvetica").text(`${student.address || "Address Not Provided"}`, { align: "center" });
    doc.moveDown(1);

    // Student Photo (bottom-left)
    embedImage(doc, student.studentPhoto, 50, 450, 100, 120);

    // Marks Summary (if available, next to photo)
    if (student.marks && Array.isArray(student.marks) && student.marks.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").text("Marks Obtained:", 200, 450);
      let marksY = 470;
      student.marks.forEach((mark, index) => {
        doc.fontSize(10).text(
          `${index + 1}. ${mark.name || 'N/A'}: ${Number(mark.obtained) || 'N/A'}/${Number(mark.fullMarks) || 'N/A'}`,
          200,
          marksY
        );
        marksY += 15;
        if (marksY > 650) {
          doc.addPage();
          marksY = 50;
        }
      });
    }

    // Footer Info (null-safe)
    doc.fontSize(11).text(`Certificate No: CERT-${student.enrollmentNo || 'Unknown'}     Place: ${student.district || "Delhi"}`);
    doc.text(
      `Date Of Issue: ${endDate}     Enrollment No: ${student.enrollmentNo || 'N/A'}`
    );

    // Signatures (unchanged)
    doc.moveDown(1.5);
    doc.moveTo(100, 670).lineTo(250, 670).stroke();
    doc.moveTo(400, 670).lineTo(550, 670).stroke();
    doc.font("Helvetica-Bold").fontSize(12).text("Controller Of Examination", 100, 680);
    doc.font("Helvetica-Bold").fontSize(12).text("Authorised Signatory", 400, 680);

    // Bottom Info (unchanged)
    doc.moveDown(2);
    doc.fontSize(9).text(
      "Reg. Office: At House No.192, 1st Floor, Main Road, Khichripur, Village, Near By MCD SCHOOL, DELHI - 110091",
      { align: "center" }
    );
    doc.text("H.O: ITVE, KUMAR CHOWK, ROAD NO. 03, DUMRA, SITAMARHI, Bihar - 843301", { align: "center" });
    doc.text("Online Certificate Verification Available on www.itveindia.org", { align: "center" });

    doc.end();
    console.log(`✅ Certificate generated for ${student.studentName} (${id}) with grade: ${grade}`);
  } catch (err) {
    console.error("❌ Certificate Error:", err);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
};

/* ============================================================
   🪪  ID CARD GENERATOR
============================================================ */
export const generateIDCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Generating ID Card for student ID: ${id}`);

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const doc = new PDFDocument({ size: [300, 200], margin: 10 }); // Card size (customize!)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename="IDCard_${student.enrollmentNo || 'Unknown'}.pdf"`
    );
    doc.pipe(res);

    // Header
    doc.font("Helvetica-Bold").fontSize(12).text("ITVE ID CARD", { align: "center" });
    doc.moveDown(0.2);

    // Student Photo (left)
    embedImage(doc, student.studentPhoto, 10, 30, 80, 100);

    // Student Info (right)
    doc.fontSize(10).text(`Name: ${student.studentName || "N/A"}`, 100, 30);
    doc.text(`Roll No: ${student.rollNo || "N/A"}`, 100, 45);
    doc.text(`Enrollment: ${student.enrollmentNo || "N/A"}`, 100, 60);
    doc.text(`Course: ${student.course || "N/A"}`, 100, 75);
    doc.text(`Center: ${student.center || "N/A"}`, 100, 90);
    doc.text(`Valid Till: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}`, 100, 105);

    // Footer
    doc.moveDown(1.5);
    doc.fontSize(8).text("ITVE (Information Technology and Vocational Education)", { align: "center" });
    doc.text("Reg No: 2024/4/IV/814", { align: "center" });

    doc.end();
    console.log(`✅ ID Card generated for ${student.studentName} (${id})`);
  } catch (err) {
    console.error("❌ ID Card Error:", err);
    res.status(500).json({ error: "Failed to generate ID card" });
  }
};

// For "New ID Card" (variant with "NEW" watermark)
export const generateNewIDCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Generating NEW ID Card for student ID: ${id}`);

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const doc = new PDFDocument({ size: [300, 200], margin: 10 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `attachment; filename="NewIDCard_${student.enrollmentNo || 'Unknown'}.pdf"`
    );
    doc.pipe(res);

    // Header with "NEW" watermark
    doc.font("Helvetica-Bold").fontSize(12).text("ITVE NEW ID CARD", { align: "center" });
    doc.opacity(0.3).fontSize(40).text("NEW", { align: "center" }); // Watermark
    doc.opacity(1.0);
    doc.moveDown(0.2);

    // Rest same as generateIDCard
    embedImage(doc, student.studentPhoto, 10, 30, 80, 100);
    doc.fontSize(10).text(`Name: ${student.studentName || "N/A"}`, 100, 30);
    doc.text(`Roll No: ${student.rollNo || "N/A"}`, 100, 45);
    doc.text(`Enrollment: ${student.enrollmentNo || "N/A"}`, 100, 60);
    doc.text(`Course: ${student.course || "N/A"}`, 100, 75);
    doc.text(`Center: ${student.center || "N/A"}`, 100, 90);
    doc.text(`Valid Till: ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}`, 100, 105);

    doc.moveDown(1.5);
    doc.fontSize(8).text("ITVE (Information Technology and Vocational Education)", { align: "center" });
    doc.text("Reg No: 2024/4/IV/814", { align: "center" });

    doc.end();
    console.log(`✅ NEW ID Card generated for ${student.studentName} (${id})`);
  } catch (err) {
    console.error("❌ NEW ID Card Error:", err);
    res.status(500).json({ error: "Failed to generate new ID card" });
  }
};