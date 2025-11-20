// src/controllers/bookController.js
import Book from "../models/Book.js";
import fs from "fs";
import path from "path";

const filesPath = path.join(process.cwd(), "uploads", "files");
const picturesPath = path.join(process.cwd(), "uploads", "pictures");

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create book
export const createBook = async (req, res) => {
  try {
    const { type, course, name, description } = req.body;
    const file = req.files.file[0].filename;
    const picture = req.files.picture[0].filename;

    const book = await Book.create({
      type,
      course: course || "",
      name,
      description,
      file,
      picture,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Update book
export const updateBook = async (req, res) => {
  try {
    const { type, course, name, description } = req.body;
    const updateData = { type, course: course || "", name, description };

    if (req.files?.file) updateData.file = req.files.file[0].filename;
    if (req.files?.picture) updateData.picture = req.files.picture[0].filename;

    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Safely delete files
    if (book.file) {
      try { fs.unlinkSync(path.join(filesPath, book.file)); } catch (err) {}
    }
    if (book.picture) {
      try { fs.unlinkSync(path.join(picturesPath, book.picture)); } catch (err) {}
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};