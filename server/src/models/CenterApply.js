import mongoose from "mongoose";

const centerApplySchema = new mongoose.Schema(
  {
    // 🧍 Applicant / Owner Details
    type: { type: String, required: [true, "Application type is required"] },
    ownerName: { type: String, required: [true, "Owner name is required"] },
    fatherName: { type: String, required: [true, "Father name is required"] },
    motherName: { type: String, required: [true, "Mother name is required"] },
    dob: { type: String, required: [true, "Date of birth is required"] },
    qualification: { type: String, required: [true, "Qualification is required"] },
    mobile: { type: String, required: [true, "Mobile number is required"] },
    altMobile: { type: String },
    email: { type: String, required: [true, "Email is required"] },
    gender: { type: String, required: [true, "Gender is required"] },
    address: { type: String, required: [true, "Address is required"] },
    village: { type: String, required: [true, "Village is required"] },
    state: { type: String, required: [true, "State is required"] },
    district: { type: String, required: [true, "District is required"] },
    country: { type: String, required: [true, "Country is required"] },
    pincode: { type: String, required: [true, "Pincode is required"] },

    // 🏫 Centre Details
    centreName: { type: String, required: [true, "Centre name is required"] },
    centreAddress: { type: String, required: [true, "Centre address is required"] },
    centreVillage: { type: String, required: [true, "Centre village is required"] },
    centreState: { type: String, required: [true, "Centre state is required"] },
    centreDistrict: { type: String, required: [true, "Centre district is required"] },
    centreCountry: { type: String, required: [true, "Centre country is required"] },
    centrePincode: { type: String, required: [true, "Centre pincode is required"] },

    franchiseType: { type: String, required: [true, "Franchise type is required"] },
    oldAcademyName: { type: String },
    academicLocation: { type: String, required: [true, "Academic location is required"] },
    totalArea: { type: String, required: [true, "Total area is required"] },

    // 🧱 Infrastructure
    theoryRoom: { type: String, required: [true, "Theory room info is required"] },
    practicalRoom: { type: String, required: [true, "Practical room info is required"] },
    receptionRoom: { type: String, required: [true, "Reception room info is required"] },
    internetConnection: { type: String, required: [true, "Internet connection info is required"] },
    printerScanner: { type: String, required: [true, "Printer/Scanner info is required"] },
    numComputers: { type: String, required: [true, "Number of computers is required"] },

    // 📚 Courses Interested
    softwareCourses: { type: String, required: [true, "Software courses field is required"] },
    hardwareCourses: { type: String, required: [true, "Hardware courses field is required"] },
    vocationalCourses: { type: String, required: [true, "Vocational courses field is required"] },

    // 📄 Documents
    panCardNo: { type: String, required: [true, "PAN card number is required"] },
    aadhaarCardNo: { type: String, required: [true, "Aadhaar card number is required"] },
    passportPhoto: { type: String },
    educationProof: { type: String },
    panCard: { type: String },
    aadhaarCard: { type: String },
    photoTheoryRoom: { type: String },
    photoPracticalRoom: { type: String },
    photoOfficeRoom: { type: String },
    photoCentreFront: { type: String },
    centreLogo: { type: String },
    signatureStamp: { type: String },
  },
  { timestamps: true }
);

// ✅ Use a clear model name
const CenterApply = mongoose.model("CenterApply", centerApplySchema);
export default CenterApply;
