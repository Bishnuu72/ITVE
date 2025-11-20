import express from 'express';
import { 
  addAdminCentre, 
  addOnlineCentre, 
  getAllCentres, 
  getOnlineCentres, 
  getDeletedCentres, 
  deleteCentre, 
  restoreCentre, 
  getCentreById, 
  updateCentre, 
  toggleApproval, 
  addRenewal, 
  renewCentre, 
  expireRenewal, 
  uploadFields, 
  getPublicCentres,
  verifyCentreByLoginId,
  centreLogin
} from '../controllers/CentreManagementController.js';

const router = express.Router();

router.get("/public", getPublicCentres);

// Admin Add with multer
router.post('/admin/add', uploadFields, addAdminCentre);

// Online Add with multer
router.post('/online/add', uploadFields, addOnlineCentre);

// Get All (CentreList)
router.get('/', getAllCentres);

// Get Online (OnlineRegisteredCentres)
router.get('/online', getOnlineCentres);

// Get Deleted (DeletedCentreList)
router.get('/deleted', getDeletedCentres);


// Get by ID (for View/Update)
router.get('/:id', getCentreById);

// Update Centre
router.put('/:id', uploadFields, updateCentre);

// Delete
router.put('/:id/delete', deleteCentre);

// Restore
router.put('/:id/restore', restoreCentre);

// Toggle Approval
router.put('/:id/approve', toggleApproval);

// NEW: Renewal Routes
// Add/Update Renewal (for AddCentreRenewal.jsx)
router.post('/:id/renewal', addRenewal);

// Renew Centre (extend by 2 years, for tick button in CentreRenewalList.jsx)
router.put('/:id/renew', renewCentre);

// Expire Renewal (for cross button in CentreRenewalList.jsx)
router.put('/:id/expire-renewal', expireRenewal);

router.post("/verify-login", verifyCentreByLoginId);

router.post("/login", centreLogin);


export default router;