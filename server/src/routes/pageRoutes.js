import express from 'express';
import {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  getPublicPages,
  getPublicPageById,
} from '../controllers/pageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Multer fields for banner and featuredImage
const uploadFields = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'featuredImage', maxCount: 1 },
]);

// ✅ Admin routes (protected)
router.route('/')
  .get(protect, admin, getPages)
  .post(protect, admin, uploadFields, createPage);

router.route('/:id')
  .get(protect, admin, getPageById)
  .put(protect, admin, uploadFields, updatePage)
  .delete(protect, admin, deletePage);

// ✅ Public routes (unprotected)
router.route('/')
  .get(getPublicPages); // GET /api/pages/public

router.route('/:id')
  .get(getPublicPageById); // GET /api/pages/public/:id

export default router;