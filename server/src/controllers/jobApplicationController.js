// src/controllers/jobApplicationController.js
import JobApplication from "../models/JobApplication.js";
import fs from "fs";
import path from "path";

// ==========================
// Submit a new job application (Public)
// ==========================
export const submitJobApplication = async (req, res, next) => {
  try {
    const {
      fullName,
      fatherName,
      motherName,
      dob,
      gender,
      state,
      district,
      city,
      address,
      pincode,
      religion,
      category,
      qualification,
      jbceRoll,
      email,
      mobile,
      applyFor,
    } = req.body;

    const requiredFields = ["fullName", "email", "mobile", "applyFor", "qualification"];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const jobData = {
      fullName,
      fatherName,
      motherName,
      dob,
      gender,
      state,
      district,
      city,
      address,
      pincode,
      religion,
      category,
      qualification,
      jbceRoll,
      email,
      mobile,
      applyFor,
    };

    // Store relative path for resume
    if (req.file) {
      jobData.resume = `resumes/${req.file.filename}`;
    }

    const jobApp = await JobApplication.create(jobData);

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      jobApplication: jobApp,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get all job applications (Admin)
// ==========================
export const getAllJobApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get single job application by ID (Admin)
// ==========================
export const getJobApplicationById = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// ==========================
// Admin: Update job application status only
// ==========================
export const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !["Pending", "Reviewed", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    application.status = status;
    application.reviewedByAdmin = true;

    await application.save();

    res.status(200).json({ success: true, jobApplication: application });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Delete job application (Admin)
// ==========================
export const deleteJobApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Job application not found" });
    }

    // Delete resume file if exists
    if (application.resume) {
      const filePath = path.join(process.cwd(), "uploads", application.resume);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete resume:", err);
        });
      }
    }

    await application.deleteOne();
    res.status(200).json({ message: "Job application deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Download resume file (Admin)
// ==========================
export const downloadResume = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filePath = path.join(process.cwd(), "uploads", application.resume);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File does not exist on server" });
    }

    res.download(filePath);
  } catch (error) {
    next(error);
  }
};
