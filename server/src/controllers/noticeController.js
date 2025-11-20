import Notice from "../models/Notice.js";

// Create a new notice
export const createNotice = async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }); // Optional: sort by latest
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single notice
export const getNoticeById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Notice ID is required" });

  try {
    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update notice
export const updateNotice = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Notice ID is required for update" });

  try {
    const notice = await Notice.findByIdAndUpdate(id, req.body, { new: true });
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete notice
export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Notice ID is required for deletion" });

  try {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};