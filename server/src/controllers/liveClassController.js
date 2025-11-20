// src/controllers/liveClassController.js
import LiveClass from "../models/LiveClass.js";
import mongoose from "mongoose";

// GET ALL LIVE CLASSES (Public + Admin)
export const getAllLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate("course", "name code")
      .sort({ startDate: -1 });

    const formatted = liveClasses.map((lc) => ({
      ...lc._doc,
      courseName: lc.course ? `${lc.course.name} (${lc.course.code})` : "N/A",
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET SINGLE LIVE CLASS
export const getLiveClassById = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id).populate("course", "name code");
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }

    const formatted = {
      ...liveClass._doc,
      courseName: liveClass.course ? `${liveClass.course.name} (${liveClass.course.code})` : "N/A",
    };

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE LIVE CLASS
export const createLiveClass = async (req, res) => {
  const { course, liveClassName, startDate, endDate, description, youtubeLink } = req.body;

  try {
    const courseDoc = await mongoose.model("Course").findById(course);
    if (!courseDoc) {
      return res.status(400).json({ success: false, message: "Invalid course selected" });
    }

    const newClass = new LiveClass({
      course,
      courseName: `${courseDoc.name} (${courseDoc.code})`,
      liveClassName,
      startDate,
      endDate,
      description,
      youtubeLink,
    });

    await newClass.save();

    const populated = await LiveClass.findById(newClass._id).populate("course", "name code");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE LIVE CLASS
export const updateLiveClass = async (req, res) => {
  try {
    const { course } = req.body;
    let updateData = { ...req.body };

    if (course) {
      const courseDoc = await mongoose.model("Course").findById(course);
      if (!courseDoc) {
        return res.status(400).json({ success: false, message: "Invalid course" });
      }
      updateData.courseName = `${courseDoc.name} (${courseDoc.code})`;
    }

    const updatedClass = await LiveClass.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("course", "name code");

    if (!updatedClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }

    res.status(200).json({ success: true, data: updatedClass });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE LIVE CLASS
export const deleteLiveClass = async (req, res) => {
  try {
    const deletedClass = await LiveClass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }
    res.status(200).json({ success: true, message: "Live class deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};