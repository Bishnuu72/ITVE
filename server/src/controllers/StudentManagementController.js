import Student from "../models/StudentManagementModel.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Trim all string fields in data
const trimStrings = (data) => {
  const trimmed = { ...data };
  Object.keys(trimmed).forEach((key) => {
    if (typeof trimmed[key] === "string") {
      trimmed[key] = trimmed[key].trim();
    }
  });
  return trimmed;
};

// Helper: Coerce types (totalFee to Number, applyKit to Boolean, etc.)
const coerceTypes = (data) => {
  const coerced = { ...data };
  if (coerced.totalFee !== undefined) {
    coerced.totalFee = Number(coerced.totalFee); // String → Number
  }
  // ✅ FIXED: Coerce applyKit (handles FormData string 'true'/'false')
  if (coerced.applyKit !== undefined) {
    if (typeof coerced.applyKit === 'string') {
      coerced.applyKit = coerced.applyKit.toLowerCase() === 'true';
      console.log("🔍 Coerced applyKit to boolean:", coerced.applyKit);
    }
    // else already boolean from checkbox
  }
  // Dates auto-handled by Mongoose
  return coerced;
};

// ✅ UPDATED: Helper to parse marks JSON (for FormData) - Now handles any JSON
const parseMarks = (data) => {
  if (data.marks && typeof data.marks === "string") {
    try {
      data.marks = JSON.parse(data.marks); // Parse JSON string to array
      console.log("🔍 Parsed marks array:", data.marks);
    } catch (err) {
      console.error("❌ Failed to parse marks JSON:", err);
      data.marks = []; // Fallback to empty array
    }
  }
  return data;
};

// ✅ NEW: Helper to parse admitSubjects JSON and dates inside array
const parseAdmitSubjects = (data) => {
  if (data.admitSubjects && typeof data.admitSubjects === "string") {
    try {
      data.admitSubjects = JSON.parse(data.admitSubjects); // Parse JSON string to array
      console.log("🔍 Parsed admitSubjects array:", data.admitSubjects);
    } catch (err) {
      console.error("❌ Failed to parse admitSubjects JSON:", err);
      data.admitSubjects = []; // Fallback
      return data;
    }
  }

  // ✅ NEW: Parse examDate strings to Date objects inside array (for schema)
  if (Array.isArray(data.admitSubjects)) {
    data.admitSubjects = data.admitSubjects.map((subj) => {
      if (subj.examDate && typeof subj.examDate === 'string') {
        const parsedDate = new Date(subj.examDate);
        if (!isNaN(parsedDate.getTime())) {
          subj.examDate = parsedDate; // String → Date
          console.log(`🔍 Parsed examDate for ${subj.name}:`, subj.examDate);
        } else {
          console.warn(`⚠️ Invalid examDate for ${subj.name}: ${subj.examDate} → set to null`);
          subj.examDate = null;
        }
      }
      return subj;
    });
  }

  return data;
};

// ✅ FIXED: Enhanced date parsing (handles empty strings for optional dates)
const parseDates = (data) => {
  const dateFields = {
    dob: true, // required
    admissionDate: true, // required
    issueDate: false, // optional
    examDate: false, // optional
  };

  Object.keys(dateFields).forEach((field) => {
    if (data[field] !== undefined) {
      if (typeof data[field] === 'string') {
        const trimmed = data[field].trim();
        if (trimmed === '') {
          if (dateFields[field]) {
            // Required empty → validation will catch later
            console.warn(`⚠️ Required date ${field} is empty string`);
          } else {
            // Optional empty → set to null
            data[field] = null;
            console.log(`🔍 Set optional ${field} to null (was empty)`);
          }
        } else {
          const parsed = new Date(trimmed);
          if (!isNaN(parsed.getTime())) {
            data[field] = parsed; // "YYYY-MM-DD" → Date
            console.log(`🔍 Parsed ${field}:`, data[field]);
          } else {
            if (dateFields[field]) {
              throw new Error(`${field} is invalid date format: ${trimmed}`);
            } else {
              data[field] = null;
              console.log(`🔍 Invalid optional ${field} set to null: ${trimmed}`);
            }
          }
        }
      }
    }
  });
  return data;
};

// ✅ FIXED: Safety filter - Skip non-primitive fields to avoid cast errors (NOW ALLOWS admitSubjects)
const filterPrimitives = (data) => {
  const filtered = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
      filtered[key] = value;
    } else if (Array.isArray(value) || (value && typeof value === "object")) {
      // ✅ FIXED: Allow 'marks' and 'admitSubjects' (parsed arrays) explicitly
      if (key === "marks" || key === "admitSubjects") {
        filtered[key] = value;
        console.log(`✅ Allowed ${key} (parsed array)`);
      } else {
        console.log(`⏭️ Skipped ${key} (non-primitive: ${typeof value})`);
      }
    }
  });
  return filtered;
};

// ✅ UPDATED: Create a New Student (enhanced validation & logging) - NOW HANDLES PUBLIC/ONLINE
export const createStudent = async (req, res) => {
  try {
    const { files } = req;

    let studentData = { ...req.body };

    console.log("🔍 Received req.body:", studentData); // Debug: Raw input
    console.log("🔍 Received files:", files);

    // ✅ FIXED: Use registrationType FROM req.body (sent by frontend) - No more req.user override
    // Validate it must be "Admin" or "Online"
    if (!studentData.registrationType || !["Admin", "Online"].includes(studentData.registrationType)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid registrationType. Must be 'Admin' or 'Online'." 
      });
    }
    console.log(`🔍 Using registrationType from body: ${studentData.registrationType}`);

    // ✅ FIXED: Auto-generate for Online ONLY (if not provided)
    if (studentData.registrationType === "Online") {
      if (!studentData.enrollmentNo || !studentData.rollNo) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        studentData.enrollmentNo = `ONL-${timestamp}-${random}`;
        studentData.rollNo = `ONL-${timestamp}-${random + 1}`;
        console.log(`🔍 Auto-generated for Online: enrollmentNo=${studentData.enrollmentNo}, rollNo=${studentData.rollNo}`);
      }
      if (!studentData.totalFee) studentData.totalFee = 150; // Default registration fee
      if (!studentData.duration) studentData.duration = "6 Months"; // Default for online
    }

    // Process data (after type validation & auto-gen)
    studentData = trimStrings(studentData);
    studentData = coerceTypes(studentData);
    studentData = parseDates(studentData);
    studentData = parseMarks(studentData);
    studentData = parseAdmitSubjects(studentData); // ✅ NEW: Parse admitSubjects if present

    // Explicitly set defaults
    if (!studentData.isDeleted) studentData.isDeleted = false;

    // ✅ UPDATED: Enhanced logging after processing
    console.log("🔍 Processed studentData (key fields):", {
      registrationType: studentData.registrationType,
      enrollmentNo: studentData.enrollmentNo,
      rollNo: studentData.rollNo,
      studentName: studentData.studentName,
      totalFee: studentData.totalFee,
      dob: studentData.dob,
      admissionDate: studentData.admissionDate,
      applyKit: studentData.applyKit,
    });

    // ✅ FIXED: Conditional validation based on registrationType (AFTER auto-gen)
    const adminRequiredFields = ["center", "enrollmentNo", "rollNo", "studentName", "fatherName", "motherName", "dob", "gender", "mobile", "religion", "category", "address", "state", "district", "pin", "admissionDate", "course", "totalFee", "duration"];
    const onlineRequiredFields = ["center", "studentName", "fatherName", "motherName", "dob", "gender", "mobile", "address", "state", "district", "pin", "admissionDate", "course"]; // ✅ FIXED: Removed religion/category (optional for online)

    const requiredFields = studentData.registrationType === "Online" ? onlineRequiredFields : adminRequiredFields;

    // ✅ NEW: Log required fields for debug
    console.log(`🔍 Validating ${studentData.registrationType} fields:`, requiredFields);

    const missingFields = [];
    for (const field of requiredFields) {
      const value = studentData[field];
      let isInvalid = false;
      if (field === "totalFee") {
        // Special handling for number: Catch null, empty, 0, or <=0
        isInvalid = value == null || value <= 0 || isNaN(value);
      } else {
        // For strings/dates: Catch falsy or empty after trim
        const strValue = (typeof value === "string") ? value.trim() : value;
        isInvalid = !strValue || strValue === "";
      }
      if (isInvalid) {
        missingFields.push(field);
        console.error(`❌ Validation failed: ${field} is invalid (value: ${value})`); // ✅ NEW: Per-field log
      }
    }

    if (missingFields.length > 0) {
      console.error(`❌ Missing fields for ${studentData.registrationType}:`, missingFields); // ✅ NEW: Detailed log
      const fieldNames = missingFields.map(field =>
        field.replace(/([A-Z])/g, " $1").replace(/\b\w/g, l => l.toUpperCase()).trim()
      ).join(", ");
      return res.status(400).json({ 
        success: false, // ✅ For public response
        error: `Please fill in all required fields - Missing: ${fieldNames}` 
      });
    }

    // Specific checks for unique fields (skip for Online - auto-generated)
    if (studentData.registrationType === "Admin") {
      if (!studentData.enrollmentNo || studentData.enrollmentNo.trim().length < 3) {
        return res.status(400).json({ 
          success: false,
          error: "Enrollment No must be at least 3 characters!" 
        });
      }
      if (!studentData.rollNo || studentData.rollNo.trim().length < 3) {
        return res.status(400).json({ 
          success: false,
          error: "Roll No must be at least 3 characters!" 
        });
      }
    }

    // Handle files (unchanged)
    const processFile = (fileField, file) => {
      if (file) return file.filename;
      return null;
    };

    studentData.studentPhoto = processFile("studentPhoto", files?.studentPhoto?.[0]);
    studentData.idProof = processFile("idProof", files?.idProof?.[0]);
    studentData.eduProof = processFile("eduProof", files?.eduProof?.[0]);
    studentData.questionPaper = processFile("questionPaper", files?.questionPaper?.[0]);
    studentData.answerSheet = processFile("answerSheet", files?.answerSheet?.[0]);

    // ✅ NEW: Final log before save
    console.log("💾 Final studentData before save (key fields):", {
      registrationType: studentData.registrationType,
      enrollmentNo: studentData.enrollmentNo,
      rollNo: studentData.rollNo,
      totalFee: studentData.totalFee,
    });

    const newStudent = new Student(studentData);
    console.log("🔍 Running Mongoose validation...");
    await newStudent.validate();
    console.log("✅ Mongoose validation passed!");

    const savedStudent = await newStudent.save();
    console.log("✅ Student saved with ID:", savedStudent._id);
    console.log("🔍 Saved data (key fields):", {
      registrationType: savedStudent.registrationType,
      enrollmentNo: savedStudent.enrollmentNo,
      rollNo: savedStudent.rollNo,
      totalFee: savedStudent.totalFee,
    }); // ✅ NEW: Log saved values for debug

    // ✅ UPDATED: Response with success flag (matches public form)
    res.status(201).json({ 
      success: true,
      message: studentData.registrationType === "Online" 
        ? "✅ Student admission submitted successfully!" 
        : "✅ Student added successfully!", 
      data: savedStudent 
    });
  } catch (error) {
    console.error("❌ Create Student Error Details:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
      const fieldErrors = Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`);
      console.error("Field errors:", fieldErrors);
      return res.status(400).json({ 
        success: false, // ✅ For public
        error: `Validation failed: ${error.message}. Details: ${fieldErrors.join(', ')}` 
      });
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error(`Duplicate key error on ${field}`);
      return res.status(400).json({ 
        success: false,
        error: `${field} already exists! Please use a unique value.` 
      });
    } else {
      console.error("Full error stack:", error.stack);
      res.status(500).json({ 
        success: false,
        error: `Server error: ${error.message}` 
      });
    }
  }
};

// ✅ Get Single Student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    console.log(`👁️ Fetched student ID: ${student._id} (with marks/files)`);
    res.status(200).json({ data: student }); // ✅ UPDATED: Consistent { data: student }
  } catch (error) {
    console.error("❌ Get Student By ID Error:", error);
    res.status(500).json({ error: "Invalid ID format or server error" });
  }
};

// ✅ NEW: Dedicated Admit Update (JSON only, no files)
export const updateAdmit = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    console.log("🔍 Received admit updates:", updates); // Debug

    // Process only admitSubjects (trim, parse dates in array)
    updates = trimStrings(updates);
    updates = parseAdmitSubjects(updates); // ✅ Parse JSON and dates in array

    // Basic validation: Ensure admitSubjects is array with data
    if (!updates.admitSubjects || !Array.isArray(updates.admitSubjects) || updates.admitSubjects.length === 0) {
      return res.status(400).json({ error: "admitSubjects array is required and cannot be empty" });
    }

    // Check for at least one date/time
    const hasChanges = updates.admitSubjects.some(subj => subj.examDate || subj.examTime);
    if (!hasChanges) {
      return res.status(400).json({ error: "At least one exam date or time must be provided" });
    }

    // Filter (now allows admitSubjects)
    const admitUpdates = filterPrimitives(updates);
    console.log("🔍 Final admit updates:", admitUpdates);

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { admitSubjects: admitUpdates.admitSubjects } }, // ✅ Target only admitSubjects
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("✅ Admit updated for student ID:", updatedStudent._id);
    console.log("🔍 Saved admitSubjects:", updatedStudent.admitSubjects); // Debug

    res.status(200).json({ 
      success: true,
      message: "✅ Admit details updated successfully!", 
      data: updatedStudent 
    });
  } catch (error) {
    console.error("❌ Update Admit Error:", error);
    if (error.name === 'ValidationError') {
      const fieldErrors = Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`);
      return res.status(400).json({ error: `Validation failed: ${fieldErrors.join(', ')}` });
    }
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update Student Details (with optional file uploads) - Existing general update
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };
    const { files } = req;

    // ✅ Log received updates
    console.log("🔍 Received updates:", updates);
    console.log("🔍 Received files for update:", files);

    // ✅ Trim strings, coerce types, parse dates, and parse marks/admit
    updates = trimStrings(updates);
    updates = coerceTypes(updates);
    updates = parseDates(updates); // ✅ FIXED: Parse dates in update too
    updates = parseMarks(updates); // ✅ NEW: Parse marks JSON from FormData
    updates = parseAdmitSubjects(updates); // ✅ NEW: Parse admitSubjects if present

    // ✅ UPDATED: Safety filter - Skip non-primitive fields to avoid cast errors
    const primitiveUpdates = filterPrimitives(updates);
    console.log("🔍 Primitive updates after filter:", primitiveUpdates);

    // ✅ Explicit validation if updating critical fields
    if (primitiveUpdates.studentName === "" || primitiveUpdates.enrollmentNo === "" || primitiveUpdates.rollNo === "") {
      return res.status(400).json({ error: "Student name, enrollment number, and roll number cannot be empty!" });
    }

    // Process files if uploaded (preserve existing if not)
    const processFile = (fileField, file) => {
      if (file) return file.filename;
      return undefined; // Skip to keep existing
    };

    if (files?.studentPhoto?.[0]) primitiveUpdates.studentPhoto = processFile("studentPhoto", files.studentPhoto[0]);
    if (files?.idProof?.[0]) primitiveUpdates.idProof = processFile("idProof", files.idProof[0]);
    if (files?.eduProof?.[0]) primitiveUpdates.eduProof = processFile("eduProof", files.eduProof[0]);
    // ✅ NEW: Handle questionPaper and answerSheet
    if (files?.questionPaper?.[0]) {
      primitiveUpdates.questionPaper = processFile("questionPaper", files.questionPaper[0]);
      console.log("📄 Updated questionPaper:", primitiveUpdates.questionPaper);
    }
    if (files?.answerSheet?.[0]) {
      primitiveUpdates.answerSheet = processFile("answerSheet", files.answerSheet[0]);
      console.log("📄 Updated answerSheet:", primitiveUpdates.answerSheet);
    }

    // ✅ Log final updates
    console.log("💾 Updating with:", primitiveUpdates);

    const updatedStudent = await Student.findByIdAndUpdate(id, primitiveUpdates, {
      new: true, // Return updated document
      runValidators: true, // Re-validate required fields/enums
    });

    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
    console.log("✅ Student updated ID:", updatedStudent._id);
    res.status(200).json({ message: "✅ Student updated!", data: updatedStudent });
  } catch (error) {
    console.error("❌ Update Student Error:", error);
    // ✅ FIXED: Handle unique constraint errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists! Please use a unique value.` });
    }
    // ✅ NEW: Handle validation errors in update too
    if (error.name === 'ValidationError') {
      const fieldErrors = Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`);
      return res.status(400).json({ error: `Update validation failed: ${fieldErrors.join(', ')}` });
    }
    res.status(400).json({ error: error.message });
  }
};

// ✅ UPDATED: Get All Students (only non-deleted, with optional type filter) - NOW RETURNS { data: students }
export const getAllStudents = async (req, res) => {
  try {
    const { type, certificateIssued } = req.query; // e.g., ?type=online or ?certificateIssued=Yes
    let query = { isDeleted: false };
    if (type === "online") {
      query.registrationType = "Online";
    }
    if (certificateIssued === "Yes") {
      query.certificateIssued = "Yes"; // ✅ NEW: Support for CertificateIssuedList
    }
    console.log("🔍 getAllStudents query:", query); // ✅ FIXED: Log query for debug
    const students = await Student.find(query).sort({ createdAt: -1 }); // ✅ Only active (or filtered)
    console.log(`📊 Fetched ${students.length} ${type || certificateIssued ? `${type || ''} certificate-issued` : 'active'} students`); // ✅ Enhanced log
    console.log("🔍 First student (if any):", students[0] ? { _id: students[0]._id, enrollmentNo: students[0].enrollmentNo, rollNo: students[0].rollNo } : "None");
    res.status(200).json({ data: students }); // ✅ FIXED: Consistent { data: students }
  } catch (error) {
    console.error("❌ Get All Students Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATED: Soft Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true }, // ✅ Soft delete
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
    console.log("🗑️ Soft deleted student ID:", id, "Enrollment:", updatedStudent.enrollmentNo); // ✅ Enhanced log
    res.status(200).json({ message: "✅ Student moved to deleted list!" });
  } catch (error) {
    console.error("❌ Delete Student Error:", error);
    res.status(500).json({ error: "Invalid ID format or server error" });
  }
};

// ✅ NEW: Get Deleted Students (with debug logging)
export const getDeletedStudents = async (req, res) => {
  try {
    console.log("🔍 Fetching deleted students..."); // ✅ Debug
    const deletedStudents = await Student.find({ isDeleted: true }).sort({ createdAt: -1 });
    console.log(`📊 Fetched ${deletedStudents.length} deleted students`); // ✅ Enhanced log
    res.status(200).json({ data: deletedStudents }); // ✅ UPDATED: Consistent { data: [...] }
  } catch (error) {
    console.error("❌ Get Deleted Students Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: Restore Student
export const restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: false }, // ✅ Restore
      { new: true }
    );
    if (!restoredStudent) return res.status(404).json({ message: "Student not found" });
    console.log("🔄 Restored student ID:", id, "Enrollment:", restoredStudent.enrollmentNo); // ✅ Enhanced log
    res.status(200).json({ message: "✅ Student restored successfully!", data: restoredStudent });
  } catch (error) {
    console.error("❌ Restore Student Error:", error);
    res.status(500).json({ error: "Invalid ID format or server error" });
  }
};

// ✅ NEW: Dynamic Status Update (PUT /api/students/:id/status)
export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., { "status": "Active" }

    // Validate status enum
    if (!["Active", "Inactive", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status! Must be 'Active', 'Inactive', or 'Pending'." });
    }

    // Update only status (safe, no files needed)
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { studentStatus: status },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(`🔄 Status updated for student ${id}: ${status}`);
    res.status(200).json({ 
      message: `✅ Student status updated to "${status}"!`, 
      data: updatedStudent 
    });
  } catch (error) {
    console.error("❌ Update Status Error:", error);
    res.status(400).json({ error: error.message });
  }
};


// StudentManagementController.js mein ye function daal do (purana delete kar do)
export const studentLogin = async (req, res) => {
  try {
    console.log("Student login attempt:", req.body);

    const { rollNo, dob } = req.body;

    if (!rollNo || !dob) {
      return res.status(400).json({ 
        success: false, 
        message: "Roll No aur DOB dono bharo bhai!" 
      });
    }

    // YE HAI SABSE BADA FIX — DOB ko EXACTLY MongoDB jaisa banao
    const dobParts = dob.split("-"); // "2025-01-15" → ["2025", "01", "15"]
    const dobDate = new Date(Date.UTC(
      parseInt(dobParts[0]), 
      parseInt(dobParts[1]) - 1,  // Month 0-based hota hai
      parseInt(dobParts[2])
    ));

    console.log("Searching student with:", { 
      rollNo: rollNo.trim().toUpperCase(), 
      dob: dobDate 
    });

    const student = await Student.findOne({
      rollNo: rollNo.trim().toUpperCase(),
      dob: dobDate,
      isDeleted: { $ne: true }
    });

    if (!student) {
      console.log("Student not found with this Roll No & DOB");
      return res.status(401).json({ 
        success: false, 
        message: "Galat Roll No ya Date of Birth!" 
      });
    }

    // Token generate karo
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("Student login successful:", student.studentName);

    res.json({
      success: true,
      token,
      student: {
        _id: student._id,
        studentName: student.studentName,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo || "N/A",
        course: student.course,
        center: student.center,
      },
    });

  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ success: false, message: "Server error bhai" });
  }
};