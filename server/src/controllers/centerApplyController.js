import asyncHandler from "express-async-handler";
import CenterApply from "../models/CenterApply.js";

// ==============================
// @desc   Apply for Center Affiliation
// @route  POST /api/center-apply
// @access Public
// ==============================
export const applyForCenter = asyncHandler(async (req, res) => {
  try {
    const formData = { ...req.body };

    // 🖼️ Merge uploaded files paths into formData
    if (req.files) {
      for (const key in req.files) {
        if (Array.isArray(req.files[key]) && req.files[key][0]) {
          formData[key] = req.files[key][0].path;
        }
      }
    }

    // Normalize frontend field names to schema
    const mappedData = {
      ...formData,
      centrePincode: formData.centrePin || formData.centrePincode,
      internetConnection: formData.internet || formData.internetConnection,
      printerScanner: formData.printer || formData.printerScanner,
      panCardNo: formData.panNumber || formData.panCardNo,
      aadhaarCardNo: formData.aadhaarNumber || formData.aadhaarCardNo,
    };

    // Remove temporary frontend-only keys
    ["centrePin", "internet", "printer", "panNumber", "aadhaarNumber"].forEach(
      (key) => delete mappedData[key]
    );

    // Required fields (exclude file fields here because files are in req.files)
    const requiredFields = [
      "type", "ownerName", "fatherName", "motherName", "dob", "qualification",
      "mobile", "email", "gender", "address", "village", "state", "district",
      "country", "pincode", "centreName", "centreAddress", "centreVillage",
      "centreState", "centreDistrict", "centreCountry", "centrePincode",
      "franchiseType", "academicLocation", "totalArea", "theoryRoom",
      "practicalRoom", "receptionRoom", "internetConnection", "printerScanner",
      "numComputers", "softwareCourses", "hardwareCourses", "vocationalCourses",
      "panCardNo", "aadhaarCardNo"
    ];

    const missingFields = requiredFields.filter((field) => !mappedData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Save application
    const application = await CenterApply.create(mappedData);

    res.status(201).json({
      success: true,
      message: "Center application submitted successfully!",
      application,
    });
  } catch (err) {
    console.error("❌ Error in applyForCenter:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ==============================
// @desc   Get all Center Applications
// @route  GET /api/center-apply
// @access Admin
// ==============================
export const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await CenterApply.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: applications.length, applications });
});

// ==============================
// @desc   Get Single Application by ID
// @route  GET /api/center-apply/:id
// @access Admin
// ==============================
export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await CenterApply.findById(id);
  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found." });
  }
  res.status(200).json({ success: true, application });
});

// ==============================
// @desc   Update Application
// @route  PUT /api/center-apply/:id
// @access Admin
// ==============================
export const updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (req.files) {
    for (const key in req.files) {
      if (Array.isArray(req.files[key]) && req.files[key][0]) {
        updates[key] = req.files[key][0].path;
      }
    }
  }

  // Normalize frontend fields
  const normalizeFields = {
    centrePin: "centrePincode",
    internet: "internetConnection",
    printer: "printerScanner",
    panNumber: "panCardNo",
    aadhaarNumber: "aadhaarCardNo",
  };

  for (const [key, mappedKey] of Object.entries(normalizeFields)) {
    if (updates[key]) {
      updates[mappedKey] = updates[key];
      delete updates[key];
    }
  }

  const application = await CenterApply.findByIdAndUpdate(id, updates, { new: true });

  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found." });
  }

  res.status(200).json({
    success: true,
    message: "Application updated successfully!",
    application,
  });
});

// ==============================
// @desc   Delete Center Application
// @route  DELETE /api/center-apply/:id
// @access Admin
// ==============================
export const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await CenterApply.findByIdAndDelete(id);
  if (!application) {
    return res.status(404).json({ success: false, message: "Application not found." });
  }
  res.status(200).json({ success: true, message: "Application deleted successfully!" });
});
