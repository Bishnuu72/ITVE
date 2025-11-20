import mongoose from 'mongoose';

const centreSchema = new mongoose.Schema({
  // Manage Centre
  type: { type: String, required: [true, 'Type is required'] },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending', 'Deleted'], default: 'Inactive' },
  createBranch: { type: String, required: [true, 'Create Branch is required'] },
  commission: { type: Number, required: [true, 'Commission is required'], min: 0 },
  fees: { type: Number, required: [true, 'Fees is required'], min: 0 },

  // Owner Details
  ownerName: { 
    type: String, 
    required: [true, 'Owner Name is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Owner Name cannot be empty'
    }
  },
  fatherName: { 
    type: String, 
    required: [true, 'Father\'s Name is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Father\'s Name cannot be empty'
    }
  },
  motherName: { 
    type: String, 
    required: [true, 'Mother\'s Name is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Mother\'s Name cannot be empty'
    }
  },
  dob: { type: Date, required: [true, 'Date of Birth is required'] },
  education: { 
    type: String, 
    required: [true, 'Education is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Education cannot be empty'
    }
  },
  mobile: { 
    type: String, 
    required: [true, 'Mobile is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 10;
      },
      message: 'Mobile must be at least 10 digits'
    }
  },
  altMobile: { type: String },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0 && /\S+@\S+\.\S+/.test(v);
      },
      message: 'Valid email is required'
    }
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other'
    }
  },

  // Owner Address
  street: { 
    type: String, 
    required: [true, 'Street Address is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Street Address cannot be empty'
    }
  },
  town: { 
    type: String, 
    required: [true, 'Town/Village is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Town/Village cannot be empty'
    }
  },
  state: { 
    type: String, 
    required: [true, 'State is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'State cannot be empty'
    }
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'District cannot be empty'
    }
  },
  country: { 
    type: String, 
    required: [true, 'Country is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Country cannot be empty'
    }
  },
  pin: { 
    type: String, 
    required: [true, 'Pin Code is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 5;
      },
      message: 'Pin Code must be at least 5 digits'
    }
  },

  // Centre Details
  centreName: { 
    type: String, 
    required: [true, 'Centre Name is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre Name cannot be empty'
    }
  },
  centreCode: { 
    type: String, 
    required: [true, 'Centre Code is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre Code cannot be empty'
    }
  },
  loginId: { 
    type: String, 
    required: [true, 'Login ID is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Login ID cannot be empty'
    }
  },
  password: { type: String, required: [true, 'Password is required'] },
  centreStreet: { 
    type: String, 
    required: [true, 'Centre Street Address is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre Street Address cannot be empty'
    }
  },
  centreTown: { 
    type: String, 
    required: [true, 'Centre Town/Village is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre Town/Village cannot be empty'
    }
  },
  centreState: { 
    type: String, 
    required: [true, 'Centre State is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre State cannot be empty'
    }
  },
  centreDistrict: { 
    type: String, 
    required: [true, 'Centre District is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre District cannot be empty'
    }
  },
  centreCountry: { 
    type: String, 
    required: [true, 'Centre Country is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Centre Country cannot be empty'
    }
  },
  centrePin: { 
    type: String, 
    required: [true, 'Centre Pin Code is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 5;
      },
      message: 'Centre Pin Code must be at least 5 digits'
    }
  },

  // Franchise & Facilities
  franchiseType: { 
    type: String, 
    required: [true, 'Franchise Type is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Franchise Type cannot be empty'
    }
  },
  oldAcademy: { type: String },
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Location cannot be empty'
    }
  },
  area: { type: Number, required: [true, 'Area is required'], min: 0 },
  theoryRoom: { 
    type: String, 
    required: [true, 'Theory Room is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Theory Room must be Yes or No'
    }
  },
  practicalRoom: { 
    type: String, 
    required: [true, 'Practical Room is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Practical Room must be Yes or No'
    }
  },
  receptionRoom: { 
    type: String, 
    required: [true, 'Reception Room is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Reception Room must be Yes or No'
    }
  },
  internet: { 
    type: String, 
    required: [true, 'Internet is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Internet must be Yes or No'
    }
  },
  printer: { 
    type: String, 
    required: [true, 'Printer is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Printer must be Yes or No'
    }
  },
  computers: { type: Number, required: [true, 'Computers is required'], min: 0 },

  // Courses
  softwareCourses: { 
    type: String, 
    required: [true, 'Software Courses is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Software Courses must be Yes or No'
    }
  },
  hardwareCourses: { 
    type: String, 
    required: [true, 'Hardware Courses is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Hardware Courses must be Yes or No'
    }
  },
  vocationalCourses: { 
    type: String, 
    required: [true, 'Vocational Courses is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Vocational Courses must be Yes or No'
    }
  },

  // Documents (Text)
  pan: { 
    type: String, 
    required: [true, 'PAN is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 10;
      },
      message: 'PAN must be at least 10 characters'
    }
  },
  aadhaar: { 
    type: String, 
    required: [true, 'Aadhaar is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length >= 12;
      },
      message: 'Aadhaar must be at least 12 digits'
    }
  },

  // Specific Document/Photo Paths (optional)
  passportPhoto: { type: String },
  educationProof: { type: String },
  panCard: { type: String },
  aadhaarCard: { type: String },
  theoryRoomPhoto: { type: String },
  practicalRoomPhoto: { type: String },
  officeRoomPhoto: { type: String },
  centreFrontPhoto: { type: String },
  centreLogo: { type: String },
  signature: { type: String },

  // Derived/List Fields
  name: { type: String },
  code: { type: String },
  balance: { type: Number, default: 0 },
  totalReg: { type: Number, default: 0 },
  completeReg: { type: Number, default: 0 },
  renewal: { type: String, default: 'N/A' },
  approved: { type: Boolean, default: false }, // Approval status

  // NEW: Renewal Fields
  renewalFrom: { type: Date },
  renewalTo: { type: Date },
  renewalStatus: { type: String, enum: ['Active', 'Pending', 'Expired'], default: 'Active' },
  renewedAt: { type: Date },

  // NEW: Soft Delete Field
  deletedAt: { type: Date },

  // Source
  source: { type: String, enum: ['admin', 'online'], required: [true, 'Source is required'] },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes (no duplicates)
centreSchema.index({ loginId: 1 }, { unique: true });
centreSchema.index({ centreCode: 1 }, { unique: true });

const Centre = mongoose.model('Centre', centreSchema);
export default Centre;