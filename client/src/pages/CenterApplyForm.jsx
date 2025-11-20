import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import topImage from "../assets/images/Course9.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { submitCenterApplication, getNotices, getAllSettings } from "../services/centerApplyService";

function CenterApplyForm() {
  const [formData, setFormData] = useState({
    type: "",
    ownerName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    qualification: "",
    mobile: "",
    altMobile: "",
    email: "",
    gender: "",
    address: "",
    village: "",
    state: "",
    district: "",
    country: "",
    pincode: "",
    centreName: "",
    centreAddress: "",
    centreVillage: "",
    centreState: "",
    centreDistrict: "",
    centreCountry: "",
    centrePincode: "", // Maps to centrePin in backend
    franchiseType: "",
    oldAcademyName: "",
    academicLocation: "",
    totalArea: "",
    theoryRoom: "",
    practicalRoom: "",
    receptionRoom: "",
    internetConnection: "", // Maps to internet in backend
    printerScanner: "", // Maps to printer in backend
    numComputers: "", // Maps to computers in backend
    softwareCourses: "",
    hardwareCourses: "",
    vocationalCourses: "",
    panCardNo: "", // Maps to pan in backend
    aadhaarCardNo: "", // Maps to aadhaar in backend
    // Files - FIXED: Updated keys to match backend multer fields
    passportPhoto: null,
    educationProof: null,
    panCard: null,
    aadhaarCard: null,
    theoryRoomPhoto: null,  // FIXED: Changed from photoTheoryRoom
    practicalRoomPhoto: null,  // FIXED: Changed from photoPracticalRoom
    officeRoomPhoto: null,  // FIXED: Changed from photoOfficeRoom
    centreFrontPhoto: null,  // FIXED: Changed from photoCentreFront
    centreLogo: null,
    signature: null,  // FIXED: Changed from signatureStamp
  });
  const [loading, setLoading] = useState(false);
  const [centerApplyNotices, setCenterApplyNotices] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotices();
        const activeNotices = data
          .filter(n => n.status === "Active" && n.centerApplyNotice)
          .map(n => n.centerApplyNotice);
        setCenterApplyNotices(activeNotices);

        const settingsData = await getAllSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {  // FIXED: Updated to 5MB to match backend
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "File size must be under 5MB.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else if (type === "select-one" || type === "date") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    }
  };

  // FIXED: Enhanced validation to match backend rules (similar to AddCentre.jsx)
  const validateForm = () => {
    const errors = [];

    // Map fields for validation (mirroring backend mapping)
    const mappedData = {
      ...formData,
      education: formData.qualification,
      street: formData.address,
      town: formData.village,
      pin: formData.pincode,
      centrePin: formData.centrePincode,
      location: formData.academicLocation,
      area: formData.totalArea,
      internet: formData.internetConnection,
      printer: formData.printerScanner,
      computers: formData.numComputers,
      pan: formData.panCardNo,
      aadhaar: formData.aadhaarCardNo,
      oldAcademy: formData.oldAcademyName,
    };

    // Normalize enums (for Yes/No, etc.)
    const normalizedData = {
      ...mappedData,
      gender: formData.gender.toLowerCase() === 'male' ? 'Male' : formData.gender.toLowerCase() === 'female' ? 'Female' : formData.gender.toLowerCase() === 'other' ? 'Other' : formData.gender,
      theoryRoom: formData.theoryRoom.toLowerCase() === 'yes' ? 'Yes' : formData.theoryRoom.toLowerCase() === 'no' ? 'No' : formData.theoryRoom,
      practicalRoom: formData.practicalRoom.toLowerCase() === 'yes' ? 'Yes' : formData.practicalRoom.toLowerCase() === 'no' ? 'No' : formData.practicalRoom,
      receptionRoom: formData.receptionRoom.toLowerCase() === 'yes' ? 'Yes' : formData.receptionRoom.toLowerCase() === 'no' ? 'No' : formData.receptionRoom,
      internet: formData.internetConnection.toLowerCase() === 'yes' ? 'Yes' : formData.internetConnection.toLowerCase() === 'no' ? 'No' : formData.internetConnection,
      printer: formData.printerScanner.toLowerCase() === 'yes' ? 'Yes' : formData.printerScanner.toLowerCase() === 'no' ? 'No' : formData.printerScanner,
      softwareCourses: formData.softwareCourses.toLowerCase() === 'yes' ? 'Yes' : formData.softwareCourses.toLowerCase() === 'no' ? 'No' : formData.softwareCourses,
      hardwareCourses: formData.hardwareCourses.toLowerCase() === 'yes' ? 'Yes' : formData.hardwareCourses.toLowerCase() === 'no' ? 'No' : formData.hardwareCourses,
      vocationalCourses: formData.vocationalCourses.toLowerCase() === 'yes' ? 'Yes' : formData.vocationalCourses.toLowerCase() === 'no' ? 'No' : formData.vocationalCourses,
    };

    const requiredFields = [
      'type', 'ownerName', 'fatherName', 'motherName', 'dob', 'education',
      'mobile', 'email', 'gender', 'street', 'town', 'state', 'district',
      'country', 'pin',
      'centreName', 'centreAddress', 'centreVillage', 'centreState', 'centreDistrict', 'centreCountry', 'centrePin',
      'franchiseType', 'location',
      'area',
      'theoryRoom', 'practicalRoom', 'receptionRoom', 'internet',
      'printer',
      'computers',
      'softwareCourses', 'hardwareCourses', 'vocationalCourses',
      'pan', 'aadhaar'
    ];

    // Check missing required fields
    requiredFields.forEach((field) => {
      const value = normalizedData[field];
      const trimmed = value ? value.toString().trim() : '';
      if (!value || trimmed.length === 0) {
        errors.push(`Missing required field: ${field.replace(/([A-Z])/g, ' $1').trim()}`);
      }
    });

    // Enhanced validations matching backend
    const trimmedMobile = formData.mobile ? formData.mobile.trim() : '';
    if (trimmedMobile && trimmedMobile.length < 10) {
      errors.push("Mobile must be at least 10 digits.");
    }
    const trimmedPan = formData.panCardNo ? formData.panCardNo.trim() : '';
    if (trimmedPan && trimmedPan.length !== 10) {
      errors.push("PAN must be exactly 10 characters.");
    }
    const trimmedAadhaar = formData.aadhaarCardNo ? formData.aadhaarCardNo.trim() : '';
    if (trimmedAadhaar && trimmedAadhaar.length !== 12) {
      errors.push("Aadhaar must be exactly 12 digits.");
    }
    const trimmedPin = formData.pincode ? formData.pincode.trim() : '';
    if (trimmedPin && trimmedPin.length < 5) {
      errors.push("Pin code must be at least 5 digits (typically 6 for India).");
    }
    const trimmedCentrePin = formData.centrePincode ? formData.centrePincode.trim() : '';
    if (trimmedCentrePin && trimmedCentrePin.length < 5) {
      errors.push("Centre pin code must be at least 5 digits (typically 6 for India).");
    }
    const trimmedEmail = formData.email ? formData.email.trim() : '';
    if (trimmedEmail && !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      errors.push("Email must be valid.");
    }
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      if (isNaN(dobDate.getTime()) || dobDate >= new Date()) {
        errors.push("Date of Birth must be a valid past date.");
      }
    }
    const areaNum = parseFloat(formData.totalArea);
    if (formData.totalArea && (isNaN(areaNum) || areaNum < 0)) {
      errors.push("Total area must be a positive number.");
    }
    const computersNum = parseInt(formData.numComputers);
    if (formData.numComputers && (isNaN(computersNum) || computersNum < 0)) {
      errors.push("Number of computers must be a non-negative number.");
    }

    // Check if at least some files are selected (optional)
    const hasFiles = Object.values(formData).filter(f => f instanceof File && f).length > 0;
    if (!hasFiles) {
      const confirmed = Swal.fire({
        icon: "question",
        title: "No Files Selected",
        text: "Documents are optional, but recommended. Continue without uploading?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).isConfirmed;
      if (!confirmed) {
        errors.push("Please select at least one document or photo.");
        return false;
      }
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Errors",
        html: `<ul style="text-align: left;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
        confirmButtonColor: "#d33",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      // FIXED: Append all fields, trimming strings
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else {
          const trimmedValue = formData[key] ? formData[key].toString().trim() : "";
          data.append(key, trimmedValue);
        }
      });

      const result = await submitCenterApplication(data);

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        html: `
          <p>${result.message || "Your center affiliation application has been submitted successfully. It is now pending approval."}</p>
          <p><strong>Centre ID:</strong> ${result.centre?._id || 'N/A'}</p>
          <p><strong>Generated Login ID:</strong> ${result.generatedLoginId || 'N/A'}</p>
          <p><strong>Generated Password:</strong> ${result.generatedPassword || 'N/A'} (Change after login)</p>
          <p><strong>Next Steps:</strong> Admin will review and approve. You'll receive an email with login details.</p>
        `,
        confirmButtonColor: "#d33",
      });

      e.target.reset();
      setFormData({
        type: "",
        ownerName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        qualification: "",
        mobile: "",
        altMobile: "",
        email: "",
        gender: "",
        address: "",
        village: "",
        state: "",
        district: "",
        country: "",
        pincode: "",
        centreName: "",
        centreAddress: "",
        centreVillage: "",
        centreState: "",
        centreDistrict: "",
        centreCountry: "",
        centrePincode: "",
        franchiseType: "",
        oldAcademyName: "",
        academicLocation: "",
        totalArea: "",
        theoryRoom: "",
        practicalRoom: "",
        receptionRoom: "",
        internetConnection: "",
        printerScanner: "",
        numComputers: "",
        softwareCourses: "",
        hardwareCourses: "",
        vocationalCourses: "",
        panCardNo: "",
        aadhaarCardNo: "",
        passportPhoto: null,
        educationProof: null,
        panCard: null,
        aadhaarCard: null,
        theoryRoomPhoto: null,  // FIXED: Updated key
        practicalRoomPhoto: null,  // FIXED: Updated key
        officeRoomPhoto: null,  // FIXED: Updated key
        centreFrontPhoto: null,  // FIXED: Updated key
        centreLogo: null,
        signature: null,  // FIXED: Updated key
      });
      document.querySelectorAll('input[type="file"]').forEach(input => (input.value = ""));
    } catch (error) {
      // FIXED: Better error handling for Axios 400
      let errorMessage = "Server error while submitting application. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
      console.error("Submission error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of the JSX remains the same (form rendering)...
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Banner */}
        <div className="relative w-full h-64">
          <img src={topImage} alt="Affiliation Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Apply for Center Affiliation
            </h1>
            <p className="text-gray-200 mt-2">
              Information Technology & Vocational Education (ITVE)
            </p>
          </div>
        </div>

        {/* Scrolling Notice */}
        <div className="w-full py-2 overflow-hidden" style={{ backgroundColor: "#f7cd7f" }}>
          <div
            className="animate-marquee whitespace-nowrap font-bold text-lg md:text-xl hover:pause-marquee"
            style={{ color: "#000000", padding: "10px" }}
          >
            {centerApplyNotices.length > 0 ? (
              centerApplyNotices.map((text, index) => (
                <span key={index} className="mx-4">
                  {text}
                </span>
              ))
            ) : (
              <span>
                Welcome to <strong>ITVE</strong> — Note: Please fill this form in CAPITAL LETTERS only. Thank you! | An ISO 9001:2015 Certified Institute | The Best Institute of Information Technology Education & Development | Regd. Under Govt. of India.
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-6">
            Center Affiliation Application Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Applicant / Owner Details */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-2">
                Applicant / Owner Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-gray-700">Type *</label>
                  <select name="type" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>HEAD BRANCH</option>
                    <option>CENTER</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Centre Owner Name *</label>
                  <input name="ownerName" onChange={handleChange} placeholder="Enter Centre Owner Name" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Father's Name *</label>
                  <input name="fatherName" onChange={handleChange} placeholder="Enter Father's Name" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Mother's Name *</label>
                  <input name="motherName" onChange={handleChange} placeholder="Enter Mother's Name" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Date of Birth *</label>
                  <input type="date" name="dob" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Education Qualification *</label>
                  <input name="qualification" onChange={handleChange} placeholder="Enter Education Qualification" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Mobile No *</label>
                  <input name="mobile" onChange={handleChange} placeholder="Enter Mobile Number" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Alternate Mobile No</label>
                  <input name="altMobile" onChange={handleChange} placeholder="Enter Alternate Mobile Number" className="border rounded-md w-full px-4 py-2 mt-1" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email ID *</label>
                  <input type="email" name="email" onChange={handleChange} placeholder="Enter Email ID" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Gender *</label>
                  <select name="gender" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>MALE</option>
                    <option>FEMALE</option>
                    <option>OTHER</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700">Street Address *</label>
                  <input name="address" onChange={handleChange} placeholder="Enter Street Address" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Town / Village *</label>
                  <input name="village" onChange={handleChange} placeholder="Enter Town / Village" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">State *</label>
                  <select name="state" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>DELHI</option>
                    <option>MAHARASHTRA</option>
                    <option>TAMIL NADU</option>
                    <option>WEST BENGAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">District *</label>
                  <select name="district" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>NEW DELHI</option>
                    <option>MUMBAI</option>
                    <option>CHENNAI</option>
                    <option>KOLKATA</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Country *</label>
                  <select name="country" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>INDIA</option>
                    <option>NEPAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Pin Code *</label>
                  <input name="pincode" onChange={handleChange} placeholder="Enter Pin Code" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
              </div>
            </section>

            {/* Centre Details */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-2">
                Centre Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-gray-700">Centre Name *</label>
                  <input name="centreName" onChange={handleChange} placeholder="Enter Centre Name" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Street Address *</label>
                  <input name="centreAddress" onChange={handleChange} placeholder="Enter Centre Address" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Town / Village *</label>
                  <input name="centreVillage" onChange={handleChange} placeholder="Enter Town / Village" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">State *</label>
                  <select name="centreState" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>DELHI</option>
                    <option>MAHARASHTRA</option>
                    <option>TAMIL NADU</option>
                    <option>WEST BENGAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">District *</label>
                  <select name="centreDistrict" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>NEW DELHI</option>
                    <option>MUMBAI</option>
                    <option>CHENNAI</option>
                    <option>KOLKATA</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Country *</label>
                  <select name="centreCountry" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>INDIA</option>
                    <option>NEPAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Pin Code *</label>
                  <input name="centrePincode" onChange={handleChange} placeholder="Enter Pin Code" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Type of Franchise *</label>
                  <select name="franchiseType" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>HEAD BRANCH</option>
                    <option>CENTRE</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Old Academy Name (If Converted)</label>
                  <input name="oldAcademyName" onChange={handleChange} placeholder="Enter Old Academy Name (if converted)" className="border rounded-md w-full px-4 py-2 mt-1" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Academic Location *</label>
                  <select name="academicLocation" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>URBAN</option>
                    <option>RURAL</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Total Area (in sqft) *</label>
                  <input name="totalArea" onChange={handleChange} placeholder="Enter Total Area in sqft" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
              </div>
            </section>

            {/* Infrastructure */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-2">
                Infrastructure Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-gray-700">Theory Room? *</label>
                  <select name="theoryRoom" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Practical Room? *</label>
                  <select name="practicalRoom" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Reception Room? *</label>
                  <select name="receptionRoom" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Internet Connection? *</label>
                  <select name="internetConnection" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Printer & Scanner? *</label>
                  <select name="printerScanner" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Number of Computers? *</label>
                  <input name="numComputers" onChange={handleChange} placeholder="Enter Number of Computers" className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
              </div>
            </section>

            {/* Courses Interested */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-2">
                Courses Interested
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="font-medium text-gray-700">Software Courses? *</label>
                  <select name="softwareCourses" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Hardware Courses? *</label>
                  <select name="hardwareCourses" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Vocational Courses? *</label>
                  <select name="vocationalCourses" onChange={handleChange} className="border rounded-md w-full px-4 py-2 mt-1" required>
                    <option value="">Please Select</option>
                    <option>YES</option>
                    <option>NO</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Documents & Photos */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-2">
                Documents & Photos (Optional, Max 5MB each)  {/* FIXED: Updated size limit */}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium text-gray-700">PAN Card No. *</label>
                  <input name="panCardNo" onChange={handleChange} placeholder="Enter PAN Card No." className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Aadhaar Card No. *</label>
                  <input name="aadhaarCardNo" onChange={handleChange} placeholder="Enter Aadhaar Card No." className="border rounded-md w-full px-4 py-2 mt-1" required />
                </div>
                {[
                  ["passportPhoto", "Passport Size Photo"],
                  ["educationProof", "Education Proof"],
                  ["panCard", "Pan Card"],
                  ["aadhaarCard", "Aadhaar Card"],
                  ["theoryRoomPhoto", "Photo of Theory Room"],  // FIXED: Updated name to match backend
                  ["practicalRoomPhoto", "Photo of Practical Room"],  // FIXED: Updated name
                  ["officeRoomPhoto", "Photo of Office Room"],  // FIXED: Updated name
                  ["centreFrontPhoto", "Photo of Centre Front"],  // FIXED: Updated name
                  ["centreLogo", "Centre Logo"],
                  ["signature", "Signature with Stamp"],  // FIXED: Updated name to match backend
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="font-medium text-gray-700">{label}</label>
                    <input
                      type="file"
                      name={name}  // FIXED: Uses backend-matching name
                      onChange={handleChange}
                      accept="image/*,.pdf"
                      className="border rounded-md w-full px-4 py-2 mt-1"
                    />
                    {formData[name] && <p className="text-xs text-green-600 mt-1">Selected: {formData[name].name}</p>}
                  </div>
                ))}
              </div>

              {settings && (
                <p className="text-xl text-red-600 mt-4">
                  <strong>Head Branch Registration Fee:</strong> ₹{settings.headBranchRegFee || 0} <br />
                  <strong>Center Registration Fee:</strong> ₹{settings.centerRegFee || 0}
                </p>
              )}
            </section>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} text-white font-semibold px-10 py-3 rounded-md shadow-md transition`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CenterApplyForm;