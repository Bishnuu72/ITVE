// src/controllers/contactController.js
import Contact from "../models/Contact.js";

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const contact = await Contact.create({ name, email, phone, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark contact message as read/unread
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markContactRead = async (req, res, next) => {
  try {
    const { read } = req.body; // true or false
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    contact.read = read;
    await contact.save();
    res.json({ success: true, message: "Message status updated", data: contact });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    await contact.deleteOne();
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    next(err);
  }
};
