import Message from "../models/Message.js";
import path from "path";
import fs from "fs";

// ✅ Add a new message
export const addMessage = async (req, res) => {
  try {
    const { center, student, subject, message } = req.body;

    let attachment = null;
    if (req.file) {
      attachment = `center-apply/${req.file.filename}`; // store relative path
    }

    const newMessage = new Message({ center, student, subject, message, attachment });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get message by ID
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Handle attachment replacement
    if (req.file) {
      updatedData.attachment = `center-apply/${req.file.filename}`;

      // Optionally remove old attachment file if exists
      const oldMessage = await Message.findById(id);
      if (oldMessage && oldMessage.attachment) {
        const oldFilePath = path.join(process.cwd(), "uploads", oldMessage.attachment);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
    }

    const updatedMessage = await Message.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedMessage) return res.status(404).json({ error: "Message not found" });

    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Delete attachment if exists
    if (message.attachment) {
      const filePath = path.join(process.cwd(), "uploads", message.attachment);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
