import TeamMember from "../models/TeamMember.js";
import path from "path";

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new member with image upload
export const createTeamMember = async (req, res) => {
  try {
    const { name, email, mobile, description, status } = req.body;

    const photo = req.file ? `/images/${req.file.filename}` : "";

    const newMember = new TeamMember({
      name,
      email,
      mobile,
      description,
      status,
      photo,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update member with optional image upload
export const updateTeamMember = async (req, res) => {
  try {
    const { name, email, mobile, description, status } = req.body;

    const updateData = {
      name,
      email,
      mobile,
      description,
      status,
    };

    if (req.file) {
      updateData.photo = `/images/${req.file.filename}`;
    }

    const updated = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete member
export const deleteTeamMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};