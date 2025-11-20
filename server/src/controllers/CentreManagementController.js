import Centre from '../models/CentreManagementModel.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto'; // For random password generation

// Suppress MaxListenersExceededWarning by increasing limit (adjust if needed)
process.setMaxListeners(20);

// Robust uploads path
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Controller: Created uploads directory:', uploadsDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter (only images and PDFs allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

// Multer instance for multiple fields with global limit
// FIXED: Increased global limit to 10MB for practicality
const uploadFields = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB global limit (generous for multiple files)
  }
}).fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'educationProof', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'theoryRoomPhoto', maxCount: 1 },     // Matches frontend/error
  { name: 'practicalRoomPhoto', maxCount: 1 },  // Matches frontend
  { name: 'officeRoomPhoto', maxCount: 1 },     // Matches frontend
  { name: 'centreFrontPhoto', maxCount: 1 },    // Matches frontend
  { name: 'centreLogo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }            // Matches frontend
]);

// Helper to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Custom file size validation - FIXED: Increased limits to 5MB for practicality
const validateFileSizes = (files) => {
  const sizeLimits = {
    passportPhoto: 5 * 1024 * 1024, // 5MB
    educationProof: 5 * 1024 * 1024,
    panCard: 5 * 1024 * 1024,
    aadhaarCard: 5 * 1024 * 1024,
    theoryRoomPhoto: 5 * 1024 * 1024, // FIXED: Increased from 100KB
    practicalRoomPhoto: 5 * 1024 * 1024,
    officeRoomPhoto: 5 * 1024 * 1024,
    centreFrontPhoto: 5 * 1024 * 1024,
    centreLogo: 5 * 1024 * 1024,
    signature: 5 * 1024 * 1024,
  };
  for (const [field, limit] of Object.entries(sizeLimits)) {
    if (files[field] && files[field][0].size > limit) {
      throw new Error(`${field} exceeds 5MB limit`);
    }
  }
  return true;
};

// Generate random password
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Normalize enum values from form (uppercase) to schema (title case)
const normalizeEnumValue = (value) => {
  if (!value) return value;
  const lower = value.toLowerCase();
  // Gender mapping
  if (lower === 'male') return 'Male';
  if (lower === 'female') return 'Female';
  if (lower === 'other') return 'Other';
  // Yes/No mapping
  if (lower === 'yes') return 'Yes';
  if (lower === 'no') return 'No';
  return value; // Fallback
};

// Pre-validation for required fields (trims, checks empty/invalid) - For Admin - FIXED: Enhanced with length/DOB checks
const validateRequiredFields = (body) => {
  console.log('🔍 Validation: Full req.body keys:', Object.keys(body)); // Reduced verbosity

  const requiredFields = [
    'centreName', 'centreCode', 'loginId', 'password', 'ownerName', 'mobile', 'email', 'pan', 'aadhaar',
    'type', 'status', 'createBranch', 'dob', 'education', 'gender', 'street', 'town', 'state', 'district',
    'country', 'pin', 'centreStreet', 'centreTown', 'centreState', 'centreDistrict', 'centreCountry',
    'centrePin', 'franchiseType', 'location', 'area', 'theoryRoom', 'practicalRoom', 'receptionRoom',
    'internet', 'printer', 'computers', 'softwareCourses', 'hardwareCourses', 'vocationalCourses'
  ];

  const missingFields = [];
  const invalidFields = [];

  requiredFields.forEach((field) => {
    const value = body[field];
    const trimmed = value ? value.toString().trim() : '';

    if (!value || trimmed.length === 0) {
      missingFields.push(field);
    } else {
      // FIXED: Enhanced validations
      if (field === 'dob') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          invalidFields.push(`${field} must be a valid date`);
        } else if (date >= new Date()) { // FIXED: DOB must be in past
          invalidFields.push(`${field} must be a past date (not future)`);
        }
      } else if (['area', 'computers', 'commission', 'fees'].includes(field)) {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0) {
          invalidFields.push(`${field} must be a positive number`);
        }
      } else if (field === 'mobile' && trimmed.length < 10) {
        invalidFields.push('Mobile must be at least 10 digits');
      } else if (field === 'pan' && trimmed.length !== 10) { // FIXED: Exactly 10 chars
        invalidFields.push('PAN must be exactly 10 characters');
      } else if (field === 'aadhaar' && trimmed.length !== 12) { // FIXED: Exactly 12 digits
        invalidFields.push('Aadhaar must be exactly 12 digits');
      } else if (field === 'pin' && trimmed.length < 5) { // FIXED: Min 5 digits for pin
        invalidFields.push('Pin code must be at least 5 digits');
      } else if (field === 'centrePin' && trimmed.length < 5) {
        invalidFields.push('Centre pin code must be at least 5 digits');
      } else if (field === 'email' && !/\S+@\S+\.\S+/.test(trimmed)) {
        invalidFields.push('Email must be valid');
      }
    }
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join('; ')}`);
  }

  return true;
};

// Pre-validation for required fields (Online Form) - Adapted for online fields - FIXED: Enhanced with length/DOB checks
const validateOnlineRequiredFields = (body) => {
  console.log('🔍 Online Validation: Full req.body keys:', Object.keys(body));

  // Map online form fields to schema equivalents
  const mappedBody = {
    ...body,
    education: body.qualification,
    street: body.address,
    town: body.village,
    pin: body.pincode,
    centrePin: body.centrePincode,
    location: body.academicLocation,
    area: body.totalArea,
    internet: body.internetConnection,
    printer: body.printerScanner,
    computers: body.numComputers,
    pan: body.panCardNo,
    aadhaar: body.aadhaarCardNo,
    oldAcademy: body.oldAcademyName,
  };

  // Normalize enums for validation
  const normalizedBody = {
    ...mappedBody,
    gender: normalizeEnumValue(mappedBody.gender),
    theoryRoom: normalizeEnumValue(mappedBody.theoryRoom),
    practicalRoom: normalizeEnumValue(mappedBody.practicalRoom),
    receptionRoom: normalizeEnumValue(mappedBody.receptionRoom),
    internet: normalizeEnumValue(mappedBody.internet),
    printer: normalizeEnumValue(mappedBody.printer),
    softwareCourses: normalizeEnumValue(mappedBody.softwareCourses),
    hardwareCourses: normalizeEnumValue(mappedBody.hardwareCourses),
    vocationalCourses: normalizeEnumValue(mappedBody.vocationalCourses),
  };

  const requiredFields = [
    'type', 'ownerName', 'fatherName', 'motherName', 'dob', 'education', // qualification -> education
    'mobile', 'email', 'gender', 'street', 'town', 'state', 'district', // address -> street, village -> town
    'country', 'pin', // pincode -> pin
    'centreName', 'centreAddress', 'centreVillage', 'centreState', 'centreDistrict', 'centreCountry', 'centrePin', // centrePincode -> centrePin
    'franchiseType', 'location', // academicLocation -> location
    'area', // totalArea -> area
    'theoryRoom', 'practicalRoom', 'receptionRoom', 'internet', // internetConnection -> internet
    'printer', // printerScanner -> printer
    'computers', // numComputers -> computers
    'softwareCourses', 'hardwareCourses', 'vocationalCourses',
    'pan', 'aadhaar' // panCardNo -> pan, aadhaarCardNo -> aadhaar
  ];

  const missingFields = [];
  const invalidFields = [];

  requiredFields.forEach((field) => {
    const value = normalizedBody[field];
    const trimmed = value ? value.toString().trim() : '';

    if (!value || trimmed.length === 0) {
      missingFields.push(field);
    } else {
      // FIXED: Enhanced validations (same as admin)
      if (field === 'dob') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          invalidFields.push(`${field} must be a valid date`);
        } else if (date >= new Date()) {
          invalidFields.push(`${field} must be a past date (not future)`);
        }
      } else if (['area', 'computers'].includes(field)) {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < 0) {
          invalidFields.push(`${field} must be a positive number`);
        }
      } else if (field === 'mobile' && trimmed.length < 10) {
        invalidFields.push('Mobile must be at least 10 digits');
      } else if (field === 'pan' && trimmed.length !== 10) {
        invalidFields.push('PAN must be exactly 10 characters');
      } else if (field === 'aadhaar' && trimmed.length !== 12) {
        invalidFields.push('Aadhaar must be exactly 12 digits');
      } else if (field === 'pin' && trimmed.length < 5) {
        invalidFields.push('Pin code must be at least 5 digits');
      } else if (field === 'centrePin' && trimmed.length < 5) {
        invalidFields.push('Centre pin code must be at least 5 digits');
      } else if (field === 'email' && !/\S+@\S+\.\S+/.test(trimmed)) {
        invalidFields.push('Email must be valid');
      }
    }
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join('; ')}`);
  }

  return true;
};

// Helper to set initial renewal dates
const setInitialRenewal = () => {
  const now = new Date();
  const renewalTo = new Date(now);
  renewalTo.setFullYear(now.getFullYear() + 2); // 2-year validity
  return {
    renewalFrom: now,
    renewalTo: renewalTo,
    renewalStatus: 'Active',
    renewedAt: null,
  };
};

// Add Centre (Admin) - FIXED: Enhanced parsing and validation handling
export const addAdminCentre = async (req, res) => {
  try {
    // Debug logs (reduced verbosity)
    console.log('🔍 Admin add: centreName:', req.body.centreName);
    console.log('🔍 Admin add: centreCode:', req.body.centreCode);
    console.log('🔍 Admin add: req.files keys:', req.files ? Object.keys(req.files) : 'No files');

    // Check if req.body is empty (malformed FormData)
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No form data received. Please check the form submission.' });
    }

    const { loginId, password, centreName, centreCode, mobile, pan, aadhaar, ...data } = req.body;

    // Pre-validate required fields (now includes length/DOB checks)
    validateRequiredFields(req.body);

    // Check unique loginId and centreCode
    const trimmedLoginId = loginId.trim();
    const trimmedCentreCode = centreCode.trim();
    const existingLogin = await Centre.findOne({ loginId: trimmedLoginId });
    if (existingLogin) {
      return res.status(400).json({ error: 'Login ID must be unique and cannot match any existing centre (admin or online).' });
    }
    const existingCode = await Centre.findOne({ centreCode: trimmedCentreCode });
    if (existingCode) {
      return res.status(400).json({ error: 'Centre Code must be unique.' });
    }

    // FIXED: Parse numbers early with validation
    const parsedData = {
      ...data,
      commission: parseFloat(data.commission) || 0,
      fees: parseFloat(data.fees) || 0,
      area: parseInt(data.area) || 0,
      computers: parseInt(data.computers) || 0,
    };

    // Validate files (now with higher limits)
    const files = req.files || {};
    validateFileSizes(files);

    const hashedPassword = await hashPassword(password);

    // Trim and validate key fields
    const trimmedCentreName = centreName.trim();
    if (!trimmedCentreName || trimmedCentreName.length === 0) {
      return res.status(400).json({ error: 'Centre Name is required and cannot be empty.' });
    }
    if (!trimmedCentreCode || trimmedCentreCode.length === 0) {
      return res.status(400).json({ error: 'Centre Code is required and cannot be empty.' });
    }

    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: 'Date of Birth must be a valid date.' });
    }

    // Normalize enums for admin (in case form sends uppercase)
    const normalizedData = {
      ...parsedData,
      gender: normalizeEnumValue(parsedData.gender),
      theoryRoom: normalizeEnumValue(parsedData.theoryRoom),
      practicalRoom: normalizeEnumValue(parsedData.practicalRoom),
      receptionRoom: normalizeEnumValue(parsedData.receptionRoom),
      internet: normalizeEnumValue(parsedData.internet),
      printer: normalizeEnumValue(parsedData.printer),
      softwareCourses: normalizeEnumValue(parsedData.softwareCourses),
      hardwareCourses: normalizeEnumValue(parsedData.hardwareCourses),
      vocationalCourses: normalizeEnumValue(parsedData.vocationalCourses),
    };

    const centreData = {
      ...normalizedData,
      // FIXED: Explicitly set required schema fields (were missing due to destructuring)
      centreName: trimmedCentreName,
      centreCode: trimmedCentreCode,
      loginId: trimmedLoginId,
      password: hashedPassword,
      name: trimmedCentreName, // Derived
      code: trimmedCentreCode, // Derived
      mobile: mobile.trim(),
      pan: pan ? pan.trim() : '',
      aadhaar: aadhaar ? aadhaar.trim() : '',
      passportPhoto: files.passportPhoto ? files.passportPhoto[0].path : null,
      educationProof: files.educationProof ? files.educationProof[0].path : null,
      panCard: files.panCard ? files.panCard[0].path : null,
      aadhaarCard: files.aadhaarCard ? files.aadhaarCard[0].path : null,
      // FINAL FIXED: All photo fields match multer
      theoryRoomPhoto: files.theoryRoomPhoto ? files.theoryRoomPhoto[0].path : null,
      practicalRoomPhoto: files.practicalRoomPhoto ? files.practicalRoomPhoto[0].path : null,
      officeRoomPhoto: files.officeRoomPhoto ? files.officeRoomPhoto[0].path : null,
      centreFrontPhoto: files.centreFrontPhoto ? files.centreFrontPhoto[0].path : null,
      centreLogo: files.centreLogo ? files.centreLogo[0].path : null,
      signature: files.signature ? files.signature[0].path : null, // FINAL FIXED: Changed from signatureStamp
      source: 'admin',
      status: normalizedData.status ? normalizedData.status.trim() : 'Inactive',
      dob: dobDate,
      // Trim all other fields to prevent empty strings
      street: normalizedData.street ? normalizedData.street.trim() : '',
      town: normalizedData.town ? normalizedData.town.trim() : '',
      state: normalizedData.state ? normalizedData.state.trim() : '',
      district: normalizedData.district ? normalizedData.district.trim() : '',
      country: normalizedData.country ? normalizedData.country.trim() : '',
      pin: normalizedData.pin ? normalizedData.pin.trim() : '',
      centreStreet: normalizedData.centreStreet ? normalizedData.centreStreet.trim() : '',
      centreTown: normalizedData.centreTown ? normalizedData.centreTown.trim() : '',
      centreState: normalizedData.centreState ? normalizedData.centreState.trim() : '',
      centreDistrict: normalizedData.centreDistrict ? normalizedData.centreDistrict.trim() : '',
      centreCountry: normalizedData.centreCountry ? normalizedData.centreCountry.trim() : '',
      centrePin: normalizedData.centrePin ? normalizedData.centrePin.trim() : '',
      franchiseType: normalizedData.franchiseType ? normalizedData.franchiseType.trim() : '',
      oldAcademy: normalizedData.oldAcademy ? normalizedData.oldAcademy.trim() : '',
      location: normalizedData.location ? normalizedData.location.trim() : '',
      education: normalizedData.education ? normalizedData.education.trim() : '',
      ownerName: normalizedData.ownerName ? normalizedData.ownerName.trim() : '',
      fatherName: normalizedData.fatherName ? normalizedData.fatherName.trim() : '',
      motherName: normalizedData.motherName ? normalizedData.motherName.trim() : '',
      altMobile: normalizedData.altMobile ? normalizedData.altMobile.trim() : '',
      email: normalizedData.email ? normalizedData.email.trim() : '',
      gender: normalizedData.gender, // Already normalized
      type: normalizedData.type ? normalizedData.type.trim() : '',
      createBranch: normalizedData.createBranch ? normalizedData.createBranch.trim() : '',
      theoryRoom: normalizedData.theoryRoom, // Already normalized
      practicalRoom: normalizedData.practicalRoom, // Already normalized
      receptionRoom: normalizedData.receptionRoom, // Already normalized
      internet: normalizedData.internet, // Already normalized
      printer: normalizedData.printer, // Already normalized
      softwareCourses: normalizedData.softwareCourses, // Already normalized
      hardwareCourses: normalizedData.hardwareCourses, // Already normalized
      vocationalCourses: normalizedData.vocationalCourses, // Already normalized
      // NEW: Set initial renewal
      ...setInitialRenewal(),
    };

    // Save with validation error handling - FIXED: Better aggregation of Mongoose errors
    let newCentre;
    try {
      newCentre = new Centre(centreData);
      await newCentre.save();
      console.log('✅ Centre saved successfully:', newCentre._id); // Debug
    } catch (validationError) {
      console.error('Mongoose validation error:', validationError); // Debug
      const errors = {};
      if (validationError.errors) {
        Object.keys(validationError.errors).forEach((key) => {
          errors[key] = validationError.errors[key].message;
        });
      }
      // FIXED: Aggregate all errors into a single message
      const errorMessages = Object.values(errors).join('; ');
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        message: errorMessages || validationError.message || 'Please check the form fields and try again.',
      });
    }

    // Select only necessary fields for response (exclude password)
    const { password: _, ...safeCentre } = newCentre.toObject();

    res.status(201).json({ message: 'Centre added successfully', centre: safeCentre });
  } catch (error) {
    console.error('Add Admin Centre Error:', error);
    // FINAL FIXED: Better Multer error handling
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          error: `Unexpected file field: ${error.field}. Expected: passportPhoto, theoryRoomPhoto, signature, etc.` 
        });
      }
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'One or more files exceed size limits (5MB per file).' });
      }
      return res.status(400).json({ error: `Upload error: ${error.message}` });
    }
    if (error.message.includes('Only images and PDFs are allowed')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate centre code or login ID.' });
    }
    if (error.message.includes('required') || error.message.includes('cannot be empty') || error.message.includes('must be') || error.message.includes('exceeds')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
};

// Add Centre (Online) - FIXED: Enhanced parsing and validation handling (mirrors admin fixes)
export const addOnlineCentre = async (req, res) => {
  try {
    console.log('Online add request received');
    console.log('🔍 Online add: centreName:', req.body.centreName);
    console.log('🔍 Online add: centreCode:', req.body.centreCode);
    console.log('🔍 Online add: req.files keys:', req.files ? Object.keys(req.files) : 'No files');

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No form data received. Please check the form submission.' });
    }

    // Map form fields to schema
    const mappedBody = {
      ...req.body,
      education: req.body.qualification,
      street: req.body.address,
      town: req.body.village,
      pin: req.body.pincode,
      centrePin: req.body.centrePincode,
      location: req.body.academicLocation,
      area: req.body.totalArea,
      internet: req.body.internetConnection,
      printer: req.body.printerScanner,
      computers: req.body.numComputers,
      pan: req.body.panCardNo,
      aadhaar: req.body.aadhaarCardNo,
      oldAcademy: req.body.oldAcademyName,
    };

    // FIXED: Generate loginId and password if not provided - More unique generation with retry
    let loginId = mappedBody.loginId?.trim();
    let password = mappedBody.password;
    let attempts = 0;
    const maxAttempts = 3;

    if (!loginId) {
      do {
        const mobileSuffix = mappedBody.mobile?.slice(-6) || '000000';
        const uniqueSuffix = `${Date.now() % 1000000}${Math.floor(Math.random() * 100)}`; // Timestamp + random for uniqueness
        loginId = `centre_${mobileSuffix}_${uniqueSuffix}`;
        attempts++;
        const existingLogin = await Centre.findOne({ loginId: loginId.trim() });
        if (!existingLogin) break; // Unique, exit loop
      } while (attempts < maxAttempts);
      
      if (attempts >= maxAttempts) {
        return res.status(400).json({ error: 'Unable to generate unique Login ID. Please contact support or try a different mobile number.' });
      }
    }

    if (!password) {
      password = generatePassword(); // Random 8-char
    }

    const { centreName, centreCode, mobile, pan, aadhaar, ...data } = mappedBody;

    // Pre-validate required fields for online (now includes length/DOB checks)
    validateOnlineRequiredFields(mappedBody);

    // FIXED: Generate centreCode with retry if missing/undefined
    let trimmedCentreCode;
    if (!centreCode || centreCode.trim() === '') {
      attempts = 0;
      do {
        const timestampCode = `ONL${Date.now()}${Math.floor(Math.random() * 10000)}`.slice(-8); // Longer unique code
        trimmedCentreCode = timestampCode;
        attempts++;
        const existingCode = await Centre.findOne({ centreCode: trimmedCentreCode });
        if (!existingCode) break;
      } while (attempts < maxAttempts);
      
      if (attempts >= maxAttempts) {
        return res.status(400).json({ error: 'Unable to generate unique Centre Code. Please try again later.' });
      }
    } else {
      trimmedCentreCode = centreCode.trim();
    }

    // Check unique loginId and centreCode (now with generated values)
    const trimmedLoginId = loginId.trim();
    const existingLogin = await Centre.findOne({ loginId: trimmedLoginId });
    if (existingLogin) {
      return res.status(400).json({ error: 'Generated Login ID conflicts. Please try again.' }); // Keep for fallback, but retry should prevent
    }
    const existingCode = await Centre.findOne({ centreCode: trimmedCentreCode });
    if (existingCode) {
      return res.status(400).json({ error: 'Generated Centre Code conflicts. Please try again.' }); // Keep for fallback
    }

    // FIXED: Parse numbers early with validation
    const parsedData = {
      ...data,
      commission: 0, // Default for online
      fees: 0, // Default for online
      area: parseInt(data.area) || 0,
      computers: parseInt(data.computers) || 0,
    };

    // Validate files (now with higher limits)
    const files = req.files || {};
    validateFileSizes(files);

    const hashedPassword = await hashPassword(password);

    // Trim and validate key fields
    const trimmedCentreName = centreName.trim();
    if (!trimmedCentreName || trimmedCentreName.length === 0) {
      return res.status(400).json({ error: 'Centre Name is required and cannot be empty.' });
    }
    if (!trimmedCentreCode || trimmedCentreCode.length === 0) {
      return res.status(400).json({ error: 'Centre Code is required and cannot be empty.' });
    }

    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: 'Date of Birth must be a valid date.' });
    }

    // Normalize enums before creating centreData
    const normalizedData = {
      ...parsedData,
      gender: normalizeEnumValue(parsedData.gender),
      theoryRoom: normalizeEnumValue(parsedData.theoryRoom),
      practicalRoom: normalizeEnumValue(parsedData.practicalRoom),
      receptionRoom: normalizeEnumValue(parsedData.receptionRoom),
      internet: normalizeEnumValue(parsedData.internet),
      printer: normalizeEnumValue(parsedData.printer),
      softwareCourses: normalizeEnumValue(parsedData.softwareCourses),
      hardwareCourses: normalizeEnumValue(parsedData.hardwareCourses),
      vocationalCourses: normalizeEnumValue(parsedData.vocationalCourses),
    };

    const centreData = {
      ...normalizedData,
      // FIXED: Explicitly set required schema fields (were missing due to destructuring)
      centreName: trimmedCentreName,
      centreCode: trimmedCentreCode,
      loginId: trimmedLoginId,
      password: hashedPassword,
      name: trimmedCentreName, // Derived
      code: trimmedCentreCode, // Derived
      mobile: mobile.trim(),
      pan: pan ? pan.trim() : '',
      aadhaar: aadhaar ? aadhaar.trim() : '',
      passportPhoto: files.passportPhoto ? files.passportPhoto[0].path : null,
      educationProof: files.educationProof ? files.educationProof[0].path : null,
      panCard: files.panCard ? files.panCard[0].path : null,
      aadhaarCard: files.aadhaarCard ? files.aadhaarCard[0].path : null,
      // FINAL FIXED: All photo fields match multer
      theoryRoomPhoto: files.theoryRoomPhoto ? files.theoryRoomPhoto[0].path : null,
      practicalRoomPhoto: files.practicalRoomPhoto ? files.practicalRoomPhoto[0].path : null,
      officeRoomPhoto: files.officeRoomPhoto ? files.officeRoomPhoto[0].path : null,
      centreFrontPhoto: files.centreFrontPhoto ? files.centreFrontPhoto[0].path : null,
      centreLogo: files.centreLogo ? files.centreLogo[0].path : null,
      signature: files.signature ? files.signature[0].path : null, // FINAL FIXED: Changed from signatureStamp
      source: 'online',
      status: 'Pending', // Default for online
      dob: dobDate,
      // Trim all other fields to prevent empty strings
      street: normalizedData.street ? normalizedData.street.trim() : '',
      town: normalizedData.town ? normalizedData.town.trim() : '',
      state: normalizedData.state ? normalizedData.state.trim() : '',
      district: normalizedData.district ? normalizedData.district.trim() : '',
      country: normalizedData.country ? normalizedData.country.trim() : '',
      pin: normalizedData.pin ? normalizedData.pin.trim() : '',
      centreStreet: normalizedData.centreAddress ? normalizedData.centreAddress.trim() : '', // Map from form
      centreTown: normalizedData.centreVillage ? normalizedData.centreVillage.trim() : '',
      centreState: normalizedData.centreState ? normalizedData.centreState.trim() : '',
      centreDistrict: normalizedData.centreDistrict ? normalizedData.centreDistrict.trim() : '',
      centreCountry: normalizedData.centreCountry ? normalizedData.centreCountry.trim() : '',
      centrePin: normalizedData.centrePin ? normalizedData.centrePin.trim() : '',
      franchiseType: normalizedData.franchiseType ? normalizedData.franchiseType.trim() : '',
      oldAcademy: normalizedData.oldAcademy ? normalizedData.oldAcademy.trim() : '',
      location: normalizedData.location ? normalizedData.location.trim() : '',
      education: normalizedData.education ? normalizedData.education.trim() : '',
      ownerName: normalizedData.ownerName ? normalizedData.ownerName.trim() : '',
      fatherName: normalizedData.fatherName ? normalizedData.fatherName.trim() : '',
      motherName: normalizedData.motherName ? normalizedData.motherName.trim() : '',
      altMobile: normalizedData.altMobile ? normalizedData.altMobile.trim() : '',
      email: normalizedData.email ? normalizedData.email.trim() : '',
      gender: normalizedData.gender, // Already normalized
      type: normalizedData.type ? normalizedData.type.trim() : '',
      createBranch: normalizedData.createBranch || 'No', // Default for online
      theoryRoom: normalizedData.theoryRoom, // Already normalized
      practicalRoom: normalizedData.practicalRoom, // Already normalized
      receptionRoom: normalizedData.receptionRoom, // Already normalized
      internet: normalizedData.internet, // Already normalized
      printer: normalizedData.printer, // Already normalized
      softwareCourses: normalizedData.softwareCourses, // Already normalized
      hardwareCourses: normalizedData.hardwareCourses, // Already normalized
      vocationalCourses: normalizedData.vocationalCourses, // Already normalized
      // NEW: Set initial renewal
      ...setInitialRenewal(),
    };

    // Save with validation error handling - FIXED: Better aggregation of Mongoose errors
    let newCentre;
    try {
      newCentre = new Centre(centreData);
      await newCentre.save();
      console.log('✅ Online centre saved successfully:', newCentre._id); // Debug
    } catch (validationError) {
      console.error('Mongoose validation error:', validationError); // Debug
      const errors = {};
      if (validationError.errors) {
        Object.keys(validationError.errors).forEach((key) => {
          errors[key] = validationError.errors[key].message;
        });
      }
      // FIXED: Aggregate all errors into a single message
      const errorMessages = Object.values(errors).join('; ');
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        message: errorMessages || validationError.message || 'Please check the form fields and try again.',
      });
    }

    // Select only necessary fields for response (exclude password)
    const { password: _, ...safeCentre } = newCentre.toObject();

    res.status(201).json({ 
      message: 'Online centre registered successfully', 
      centre: safeCentre,
      generatedLoginId: trimmedLoginId,
      generatedPassword: password 
    });
  } catch (error) {
    console.error('Add Online Centre Error:', error);
    // FINAL FIXED: Better Multer error handling
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          error: `Unexpected file field: ${error.field}. Expected: passportPhoto, theoryRoomPhoto, signature, etc.` 
        });
      }
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'One or more files exceed size limits (5MB per file).' });
      }
      return res.status(400).json({ error: `Upload error: ${error.message}` });
    }
    if (error.message.includes('Only images and PDFs are allowed')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate centre code or login ID.' });
    }
    if (error.message.includes('required') || error.message.includes('cannot be empty') || error.message.includes('must be') || error.message.includes('exceeds')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
};

// Get All Centres (for CentreList.jsx) - Updated with renewal fields
export const getAllCentres = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: { $ne: 'Deleted' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { centreName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    const centres = await Centre.find(query)
      .select('name code balance mobile totalReg completeReg status approved centreName ownerName createdAt source renewalFrom renewalTo renewalStatus renewedAt')
      .sort({ createdAt: -1 });

    res.json(centres);
  } catch (error) {
    console.error('Get All Centres Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Online Registered Centres (for OnlineRegisteredCentres.jsx) - Updated with renewal fields
export const getOnlineCentres = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { source: 'online', status: { $ne: 'Deleted' } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { centreName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    const centres = await Centre.find(query)
      .select('name code balance mobile totalReg completeReg status approved centreName ownerName createdAt renewalFrom renewalTo renewalStatus renewedAt')
      .sort({ createdAt: -1 });

    res.json(centres);
  } catch (error) {
    console.error('Get Online Centres Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Deleted Centres (for DeletedCentreList.jsx) - Updated with renewal fields
export const getDeletedCentres = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'Deleted' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { centreName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    const centres = await Centre.find(query)
      .select('name code balance mobile totalReg completeReg status renewal approved centreName ownerName createdAt renewalFrom renewalTo renewalStatus renewedAt')
      .sort({ createdAt: -1 });

    res.json(centres);
  } catch (error) {
    console.error('Get Deleted Centres Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Centre by ID (for View/Update)
export const getCentreById = async (req, res) => {
  try {
    const { id } = req.params;
    const centre = await Centre.findById(id);
    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    // Exclude password
    const { password: _, ...safeCentre } = centre.toObject();

    res.json({ message: 'Centre fetched successfully', centre: safeCentre });
  } catch (error) {
    console.error('Get Centre by ID Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Centre (full update like add, but for existing) - Preserve renewal fields, FIXED: Enhanced validation and file handling
export const updateCentre = async (req, res) => {
  try {
    console.log('Update request received. Body keys:', Object.keys(req.body || {}));

    const { id } = req.params;
    const existingCentre = await Centre.findById(id);
    if (!existingCentre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    // Pre-validate (same as add, now enhanced)
    validateRequiredFields(req.body);

    // Check unique (exclude current ID)
    const { loginId, centreCode } = req.body;
    const trimmedLoginId = loginId.trim();
    const trimmedCentreCode = centreCode.trim();
    const existingLogin = await Centre.findOne({ loginId: trimmedLoginId, _id: { $ne: id } });
    if (existingLogin) {
      return res.status(400).json({ error: 'Login ID must be unique.' });
    }
    const existingCode = await Centre.findOne({ centreCode: trimmedCentreCode, _id: { $ne: id } });
    if (existingCode) {
      return res.status(400).json({ error: 'Centre Code must be unique.' });
    }

    // Parse numbers
    const parsedData = {
      ...req.body,
      commission: parseFloat(req.body.commission) || 0,
      fees: parseFloat(req.body.fees) || 0,
      area: parseInt(req.body.area) || 0,
      computers: parseInt(req.body.computers) || 0,
    };

    // Files (replace existing if new uploaded) - FIXED: Uses new size limits
    const files = req.files || {};
    validateFileSizes(files);

    const hashedPassword = req.body.password ? await hashPassword(req.body.password) : existingCentre.password;

    const trimmedCentreName = req.body.centreName.trim();
    const dobDate = new Date(req.body.dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ error: 'Date of Birth must be a valid date.' });
    }

    // Normalize enums for update
    const normalizedData = {
      ...parsedData,
      gender: normalizeEnumValue(parsedData.gender),
      theoryRoom: normalizeEnumValue(parsedData.theoryRoom),
      practicalRoom: normalizeEnumValue(parsedData.practicalRoom),
      receptionRoom: normalizeEnumValue(parsedData.receptionRoom),
      internet: normalizeEnumValue(parsedData.internet),
      printer: normalizeEnumValue(parsedData.printer),
      softwareCourses: normalizeEnumValue(parsedData.softwareCourses),
      hardwareCourses: normalizeEnumValue(parsedData.hardwareCourses),
      vocationalCourses: normalizeEnumValue(parsedData.vocationalCourses),
    };

    const updateData = {
      ...normalizedData,
      centreName: trimmedCentreName,
      centreCode: trimmedCentreCode,
      name: trimmedCentreName,
      code: trimmedCentreCode,
      loginId: trimmedLoginId,
      password: hashedPassword,
      mobile: req.body.mobile.trim(),
      pan: req.body.pan ? req.body.pan.trim() : existingCentre.pan,
      aadhaar: req.body.aadhaar ? req.body.aadhaar.trim() : existingCentre.aadhaar,
      // FINAL FIXED: All photo fields match multer, use new files or existing
      passportPhoto: files.passportPhoto ? files.passportPhoto[0].path : existingCentre.passportPhoto,
      educationProof: files.educationProof ? files.educationProof[0].path : existingCentre.educationProof,
      panCard: files.panCard ? files.panCard[0].path : existingCentre.panCard,
      aadhaarCard: files.aadhaarCard ? files.aadhaarCard[0].path : existingCentre.aadhaarCard,
      theoryRoomPhoto: files.theoryRoomPhoto ? files.theoryRoomPhoto[0].path : existingCentre.theoryRoomPhoto,
      practicalRoomPhoto: files.practicalRoomPhoto ? files.practicalRoomPhoto[0].path : existingCentre.practicalRoomPhoto,
      officeRoomPhoto: files.officeRoomPhoto ? files.officeRoomPhoto[0].path : existingCentre.officeRoomPhoto,
      centreFrontPhoto: files.centreFrontPhoto ? files.centreFrontPhoto[0].path : existingCentre.centreFrontPhoto,
      centreLogo: files.centreLogo ? files.centreLogo[0].path : existingCentre.centreLogo,
      signature: files.signature ? files.signature[0].path : existingCentre.signature, // FINAL FIXED: Changed from signatureStamp
      source: existingCentre.source,
      status: normalizedData.status ? normalizedData.status.trim() : existingCentre.status,
      dob: dobDate,
      updatedAt: new Date(),
      // Trim all other fields (same as add, fallback to existing)
      street: normalizedData.street ? normalizedData.street.trim() : existingCentre.street,
      town: normalizedData.town ? normalizedData.town.trim() : existingCentre.town,
      state: normalizedData.state ? normalizedData.state.trim() : existingCentre.state,
      district: normalizedData.district ? normalizedData.district.trim() : existingCentre.district,
      country: normalizedData.country ? normalizedData.country.trim() : existingCentre.country,
      pin: normalizedData.pin ? normalizedData.pin.trim() : existingCentre.pin,
      centreStreet: normalizedData.centreStreet ? normalizedData.centreStreet.trim() : existingCentre.centreStreet,
      centreTown: normalizedData.centreTown ? normalizedData.centreTown.trim() : existingCentre.centreTown,
      centreState: normalizedData.centreState ? normalizedData.centreState.trim() : existingCentre.centreState,
      centreDistrict: normalizedData.centreDistrict ? normalizedData.centreDistrict.trim() : existingCentre.centreDistrict,
      centreCountry: normalizedData.centreCountry ? normalizedData.centreCountry.trim() : existingCentre.centreCountry,
      centrePin: normalizedData.centrePin ? normalizedData.centrePin.trim() : existingCentre.centrePin,
      franchiseType: normalizedData.franchiseType ? normalizedData.franchiseType.trim() : existingCentre.franchiseType,
      oldAcademy: normalizedData.oldAcademy ? normalizedData.oldAcademy.trim() : existingCentre.oldAcademy,
      location: normalizedData.location ? normalizedData.location.trim() : existingCentre.location,
      education: normalizedData.education ? normalizedData.education.trim() : existingCentre.education,
      ownerName: normalizedData.ownerName ? normalizedData.ownerName.trim() : existingCentre.ownerName,
      fatherName: normalizedData.fatherName ? normalizedData.fatherName.trim() : existingCentre.fatherName,
      motherName: normalizedData.motherName ? normalizedData.motherName.trim() : existingCentre.motherName,
      altMobile: normalizedData.altMobile ? normalizedData.altMobile.trim() : existingCentre.altMobile,
      email: normalizedData.email ? normalizedData.email.trim() : existingCentre.email,
      gender: normalizedData.gender, // Already normalized
      type: normalizedData.type ? normalizedData.type.trim() : existingCentre.type,
      createBranch: normalizedData.createBranch ? normalizedData.createBranch.trim() : existingCentre.createBranch,
      theoryRoom: normalizedData.theoryRoom, // Already normalized
      practicalRoom: normalizedData.practicalRoom, // Already normalized
      receptionRoom: normalizedData.receptionRoom, // Already normalized
      internet: normalizedData.internet, // Already normalized
      printer: normalizedData.printer, // Already normalized
      softwareCourses: normalizedData.softwareCourses, // Already normalized
      hardwareCourses: normalizedData.hardwareCourses, // Already normalized
      vocationalCourses: normalizedData.vocationalCourses, // Already normalized
      // Preserve existing renewal fields (don't overwrite)
      renewalFrom: existingCentre.renewalFrom,
      renewalTo: existingCentre.renewalTo,
      renewalStatus: existingCentre.renewalStatus,
      renewedAt: existingCentre.renewedAt,
    };

    let updatedCentre;
    try {
      updatedCentre = await Centre.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (validationError) {
      console.error('Update validation error:', validationError);
      const errors = {};
      if (validationError.errors) {
        Object.keys(validationError.errors).forEach((key) => {
          errors[key] = validationError.errors[key].message;
        });
      }
      // FIXED: Aggregate all errors into a single message
      const errorMessages = Object.values(errors).join('; ');
      return res.status(400).json({
        error: 'Validation failed during update',
        details: errors,
        message: errorMessages || validationError.message || 'Please check the form fields.',
      });
    }

    const { password: _, ...safeCentre } = updatedCentre.toObject();

    res.json({ message: 'Centre updated successfully', centre: safeCentre });
  } catch (error) {
    console.error('Update Centre Error:', error);
    // FINAL FIXED: Better Multer error handling
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          error: `Unexpected file field: ${error.field}. Expected: passportPhoto, theoryRoomPhoto, signature, etc.` 
        });
      }
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'One or more files exceed size limits (5MB per file).' });
      }
      return res.status(400).json({ error: `Upload error: ${error.message}` });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate login ID or centre code.' });
    }
    if (error.message.includes('required') || error.message.includes('cannot be empty') || error.message.includes('must be') || error.message.includes('exceeds')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

// Toggle Approval (Yes/No)
export const toggleApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body; // { approved: true/false }

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'Approved must be true or false.' });
    }

    const centre = await Centre.findByIdAndUpdate(
      id,
      { approved, updatedAt: new Date() },
      { new: true }
    );

    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const { password: _, ...safeCentre } = centre.toObject();

    res.json({ message: `Centre ${approved ? 'approved' : 'unapproved'} successfully`, centre: safeCentre });
  } catch (error) {
    console.error('Toggle Approval Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Centre (Soft delete: Set status to 'Deleted')
export const deleteCentre = async (req, res) => {
  try {
    const { id } = req.params;

    const centre = await Centre.findByIdAndUpdate(
      id,
      { 
        status: 'Deleted',
        deletedAt: new Date(), // Optional: Track deletion time
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const { password: _, ...safeCentre } = centre.toObject();

    res.json({ message: 'Centre deleted successfully', centre: safeCentre });
  } catch (error) {
    console.error('Delete Centre Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Restore Centre (Set status back to 'Active' or original status)
export const restoreCentre = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Optional: Specify status to restore to (e.g., 'Active', 'Pending')

    const restoreStatus = status || 'Active'; // Default to 'Active'

    const centre = await Centre.findByIdAndUpdate(
      id,
      { 
        status: restoreStatus,
        deletedAt: null, // Clear deletion timestamp
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const { password: _, ...safeCentre } = centre.toObject();

    res.json({ message: `Centre restored successfully with status: ${restoreStatus}`, centre: safeCentre });
  } catch (error) {
    console.error('Restore Centre Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Add/Update Renewal for a Centre
export const addRenewal = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'From Date and To Date are required' });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: 'Invalid dates provided' });
    }

    if (to <= from) {
      return res.status(400).json({ error: 'To Date must be after From Date' });
    }

    if (from <= new Date()) {
      return res.status(400).json({ error: 'From Date must be in the future' });
    }

    const centre = await Centre.findById(id);
    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const updatedCentre = await Centre.findByIdAndUpdate(
      id,
      {
        renewalFrom: from,
        renewalTo: to,
        renewalStatus: 'Active',
        renewedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    const { password: _, ...safeCentre } = updatedCentre.toObject();
    res.json({ message: 'Renewal added successfully', centre: safeCentre });
  } catch (error) {
    console.error('Add Renewal Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Renew Centre (extend by 2 years)
export const renewCentre = async (req, res) => {
  try {
    const { id } = req.params;

    const centre = await Centre.findById(id);
    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const now = new Date(centre.renewalTo);
    now.setFullYear(now.getFullYear() + 2); // Extend by 2 years

    const updatedCentre = await Centre.findByIdAndUpdate(
      id,
      {
        renewalTo: now,
        renewalStatus: 'Active',
        renewedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    const { password: _, ...safeCentre } = updatedCentre.toObject();
    res.json({ message: 'Centre renewed successfully', centre: safeCentre });
  } catch (error) {
    console.error('Renew Centre Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Expire Renewal
export const expireRenewal = async (req, res) => {
  try {
    const { id } = req.params;

    const centre = await Centre.findById(id);
    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    const updatedCentre = await Centre.findByIdAndUpdate(
      id,
      {
        renewalStatus: 'Expired',
        updatedAt: new Date(),
      },
      { new: true }
    );

    const { password: _, ...safeCentre } = updatedCentre.toObject();
    res.json({ message: 'Renewal expired successfully', centre: safeCentre });
  } catch (error) {
    console.error('Expire Renewal Error:', error);
    res.status(500).json({ error: error.message });
  }
};


// ADD THIS FUNCTION AT THE BOTTOM OF YOUR CONTROLLER
export const getPublicCentres = async (req, res) => {
  try {
    const centres = await Centre.find({ 
      approved: true, 
      status: "Active",
      renewalStatus: "Active"
    })
    .select('centreName centreCode centreStreet centreTown centreDistrict centreState centrePin')
    .sort({ centreCode: 1 })
    .lean();

    res.json(centres);
  } catch (error) {
    console.error("Get Public Centres Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ADD THIS FUNCTION
export const verifyCentreByLoginId = async (req, res) => {
  try {
    const { loginId } = req.body;

    if (!loginId) {
      return res.status(400).json({ success: false, message: "Login ID is required" });
    }

    const centre = await Centre.findOne({ 
      loginId: loginId.trim(),
      approved: true,
      status: "Active"
    })
    .select('centreName centreCode loginId ownerName mobile email centreStreet centreTown centreDistrict centreState centrePin centreLogo')
    .lean();

    if (!centre) {
      return res.status(404).json({ success: false, message: "Centre not found or not approved" });
    }

    res.json({
      success: true,
      message: "Centre verified successfully",
      centre
    });

  } catch (error) {
    console.error("Verify Centre Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const centreLogin = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) return res.status(400).json({ success: false, message: "Login ID & Password required" });

    const centre = await Centre.findOne({ loginId: loginId.trim() }).select("+password");
    if (!centre || centre.status !== "Active" || !centre.approved) {
      return res.status(401).json({ success: false, message: "Invalid credentials or centre not approved" });
    }

    const isMatch = await bcrypt.compare(password, centre.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: centre._id, role: "center" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      centre: {
        _id: centre._id,
        centreName: centre.centreName,
        centreCode: centre.centreCode,
        loginId: centre.loginId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Export multer instance
export { uploadFields };