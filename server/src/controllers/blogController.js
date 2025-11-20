import Blog from "../models/Blog.js";

// Create a new blog with image
export const createBlog = async (req, res) => {
  try {
    const {
      metaTitle,
      metaDescription,
      metaKeyword,
      title,
      category,
      youtubeCode,
      tags,
      status,
      description,
    } = req.body;

    const image = req.file ? `/images/${req.file.filename}` : null;

    const blog = new Blog({
      metaTitle,
      metaDescription,
      metaKeyword,
      title,
      category,
      youtubeCode,
      tags: tags?.split(",").map((tag) => tag.trim()),
      image,
      status,
      description,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("category");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("category");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// Update blog with optional new image
export const updateBlog = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.image = `/images/${req.file.filename}`;
    }

    if (updates.tags) {
      updates.tags = updates.tags.split(",").map((tag) => tag.trim());
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};