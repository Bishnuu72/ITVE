import Gallery from "../models/Gallery.js";

// ➤ Add Gallery
export const addGallery = async (req, res) => {
  try {
    const { type, name, link, slNo, description, status } = req.body;

    // ✅ Handle uploaded files
    const photo = req.files && req.files.photo ? req.files.photo[0].filename : null;
    const videoFile = req.files && req.files.videoFile ? req.files.videoFile[0].filename : null;

    const gallery = new Gallery({
      type,
      name,
      link,
      slNo,
      description,
      status,
      photo,
      videoFile,
    });

    await gallery.save();
    res.status(201).json({ success: true, message: "Gallery added successfully", gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding gallery", error: error.message });
  }
};

// ➤ Get All Galleries
export const getGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ slNo: 1 });
    res.json({ success: true, data: galleries }); // ✅ Changed key to "data"
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching galleries",
      error: error.message,
    });
  }
};

// ➤ Get Single Gallery
export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery)
      return res.status(404).json({ success: false, message: "Gallery not found" });
    res.json({ success: true, data: gallery }); // ✅ Changed key to "data"
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gallery",
      error: error.message,
    });
  }
};
// ➤ Update Gallery
export const updateGallery = async (req, res) => {
  try {
    const { type, name, link, slNo, description, status } = req.body;

    // ✅ Handle uploaded files (optional)
    const photo = req.files && req.files.photo ? req.files.photo[0].filename : null;
    const videoFile = req.files && req.files.videoFile ? req.files.videoFile[0].filename : null;

    // ✅ Build update object dynamically
    const updateData = {
      type,
      name,
      link,
      slNo,
      description,
      status,
    };

    if (photo) {
      updateData.photo = photo;
      updateData.videoFile = null; // Remove old video if new photo uploaded
    }
    if (videoFile) {
      updateData.videoFile = videoFile;
      updateData.photo = null; // Remove old photo if new video uploaded
    }

    const gallery = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found" });

    res.json({ success: true, message: "Gallery updated successfully", gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating gallery", error: error.message });
  }
};

// ➤ Delete Gallery
export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) return res.status(404).json({ success: false, message: "Gallery not found" });
    res.json({ success: true, message: "Gallery deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting gallery", error: error.message });
  }
};