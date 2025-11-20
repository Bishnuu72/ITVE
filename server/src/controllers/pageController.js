import Page from '../models/Page.js';

// ✅ Create a new page (admin)
export const createPage = async (req, res) => {
  try {
    const {
      name,
      metaTitle,
      metaKeyword,
      metaDescription,
      shortDescription,
      longDescription,
      status,
    } = req.body;

    const banner = req.files?.banner?.[0]?.filename || null;
    const featuredImage = req.files?.featuredImage?.[0]?.filename || null;

    const page = new Page({
      name,
      metaTitle,
      metaKeyword,
      metaDescription,
      shortDescription,
      longDescription,
      status,
      banner: banner ? `/images/${banner}` : null,
      featuredImage: featuredImage ? `/images/${featuredImage}` : null,
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all pages (admin)
export const getPages = async (req, res) => {
  try {
    const keyword = req.query.search || '';
    const pages = await Page.find({
      name: { $regex: keyword, $options: 'i' },
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single page by ID (admin)
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update page (admin)
export const updatePage = async (req, res) => {
  try {
    const {
      name,
      metaTitle,
      metaKeyword,
      metaDescription,
      shortDescription,
      longDescription,
      status,
    } = req.body;

    const banner = req.files?.banner?.[0]?.filename;
    const featuredImage = req.files?.featuredImage?.[0]?.filename;

    const updatedFields = {
      name,
      metaTitle,
      metaKeyword,
      metaDescription,
      shortDescription,
      longDescription,
      status,
    };

    if (banner) updatedFields.banner = `/images/${banner}`;
    if (featuredImage) updatedFields.featuredImage = `/images/${featuredImage}`;

    const page = await Page.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete page (admin)
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all active pages (public)
export const getPublicPages = async (req, res) => {
  try {
    const pages = await Page.find({ status: 'Active' }).select('-__v');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single active page by ID (public)
export const getPublicPageById = async (req, res) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, status: 'Active' });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};