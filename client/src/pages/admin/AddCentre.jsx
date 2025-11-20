import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

// API Base URL (matches your backend port 4000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddCentre() {
  const [formData, setFormData] = useState({
    type: "",
    status: "",
    createBranch: "",
    commission: "",
    fees: "",
    ownerName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    education: "",
    mobile: "",
    altMobile: "",
    email: "",
    gender: "",
    street: "",
    town: "",
    state: "",
    district: "",
    country: "",
    pin: "",
    centreName: "",
    centreCode: "",
    loginId: "",
    password: "",
    centreStreet: "",
    centreTown: "",
    centreState: "",
    centreDistrict: "",
    centreCountry: "",
    centrePin: "",
    franchiseType: "",
    oldAcademy: "",
    location: "",
    area: "",
    theoryRoom: "",
    practicalRoom: "",
    receptionRoom: "",
    internet: "",
    printer: "",
    computers: "",
    softwareCourses: "",
    hardwareCourses: "",
    vocationalCourses: "",
    pan: "",
    aadhaar: "",
  });
  const [selectedFiles, setSelectedFiles] = useState({
    passportPhoto: null,
    educationProof: null,
    panCard: null,
    aadhaarCard: null,
    theoryRoomPhoto: null,
    practicalRoomPhoto: null,
    officeRoomPhoto: null,
    centreFrontPhoto: null,
    centreLogo: null,
    signature: null,
  });
  const [selectedFileObjects, setSelectedFileObjects] = useState({
    passportPhoto: null,
    educationProof: null,
    panCard: null,
    aadhaarCard: null,
    theoryRoomPhoto: null,
    practicalRoomPhoto: null,
    officeRoomPhoto: null,
    centreFrontPhoto: null,
    centreLogo: null,
    signature: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Optimized handleChange with useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  }, []);

  // Handle file selection with size validation
  const handleFileChange = useCallback((e, fieldName, maxSizeKB) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeBytes = maxSizeKB * 1024;
      if (file.size > maxSizeBytes) {
        alert(`❌ File size exceeds ${maxSizeKB} KB limit for ${fieldName}! Please choose a smaller file.`);
        e.target.value = ""; // Clear input
        return;
      }
      setSelectedFiles((prev) => ({ ...prev, [fieldName]: file.name }));
      setSelectedFileObjects((prev) => ({ ...prev, [fieldName]: file })); // Store actual File object
    }
  }, []);

  // Basic form validation
  const validateForm = () => {
    if (!formData.loginId || !formData.password) {
      setError("Login ID and Password are required.");
      return false;
    }
    if (!formData.centreName || !formData.centreCode || !formData.mobile || !formData.pan || !formData.aadhaar) {
      setError("Required fields (Centre Name, Code, Mobile, PAN, Aadhaar) are missing.");
      return false;
    }
    // Check if at least one file is selected (optional, but good UX)
    const hasFiles = Object.values(selectedFileObjects).some(file => file !== null);
    if (!hasFiles) {
      if (!window.confirm("No files selected. Continue anyway?")) {
        return false;
      }
    }
    return true;
  };

  // Submit handler with FormData for files
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Create FormData
    const formDataToSend = new FormData();
    // Append text fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key] || ""); // Empty strings for optional fields
    });
    // Append files (only if selected)
    Object.keys(selectedFileObjects).forEach((key) => {
      if (selectedFileObjects[key]) {
        formDataToSend.append(key, selectedFileObjects[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/admin/add`, {
        method: "POST",
        body: formDataToSend, // No Content-Type; browser sets multipart/form-data with boundary
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "✅ Centre details saved successfully");
        navigate(-1); // Redirect to CentreList
      } else {
        setError(data.error || "Error adding centre. Please check inputs and try again.");
        alert(data.error || "Error adding centre");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError("Network error: " + error.message + ". Ensure backend is running on port 4000.");
      alert("Network error: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [formData, selectedFileObjects, navigate]);

  // Reset form (clears everything, including files)
  const handleReset = useCallback(() => {
    setFormData({
      type: "",
      status: "",
      createBranch: "",
      commission: "",
      fees: "",
      ownerName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      education: "",
      mobile: "",
      altMobile: "",
      email: "",
      gender: "",
      street: "",
      town: "",
      state: "",
      district: "",
      country: "",
      pin: "",
      centreName: "",
      centreCode: "",
      loginId: "",
      password: "",
      centreStreet: "",
      centreTown: "",
      centreState: "",
      centreDistrict: "",
      centreCountry: "",
      centrePin: "",
      franchiseType: "",
      oldAcademy: "",
      location: "",
      area: "",
      theoryRoom: "",
      practicalRoom: "",
      receptionRoom: "",
      internet: "",
      printer: "",
      computers: "",
      softwareCourses: "",
      hardwareCourses: "",
      vocationalCourses: "",
      pan: "",
      aadhaar: "",
    });
    setSelectedFiles({
      passportPhoto: null,
      educationProof: null,
      panCard: null,
      aadhaarCard: null,
      theoryRoomPhoto: null,
      practicalRoomPhoto: null,
      officeRoomPhoto: null,
      centreFrontPhoto: null,
      centreLogo: null,
      signature: null,
    });
    setSelectedFileObjects({
      passportPhoto: null,
      educationProof: null,
      panCard: null,
      aadhaarCard: null,
      theoryRoomPhoto: null,
      practicalRoomPhoto: null,
      officeRoomPhoto: null,
      centreFrontPhoto: null,
      centreLogo: null,
      signature: null,
    });
    // Clear file inputs
    document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
    setError("");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-blue-600 inline-block pb-1">
              Add New Centre
            </h2>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* ---------- Manage Centre ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Manage Centre</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Type *</label>
                    <select
                      name="type"
                      onChange={handleChange}
                      value={formData.type}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Head Branch">Head Branch</option>
                      <option value="Centre">Centre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Status *</label>
                    <select
                      name="status"
                      onChange={handleChange}
                      value={formData.status}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Create Branch *</label>
                    <select
                      name="createBranch"
                      onChange={handleChange}
                      value={formData.createBranch}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Commission (%) *</label>
                    <input
                      type="number"
                      name="commission"
                      onChange={handleChange}
                      value={formData.commission}
                      className="w-full border rounded-md p-2"
                      placeholder="Enter commission percentage"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Centre Create Fees (Rs.) *</label>
                    <input
                      type="number"
                      name="fees"
                      onChange={handleChange}
                      value={formData.fees}
                      className="w-full border rounded-md p-2"
                      placeholder="Enter fees"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ---------- Owner Details ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Owner Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Owner Name *</label>
                    <input
                      name="ownerName"
                      onChange={handleChange}
                      value={formData.ownerName}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Father's Name *</label>
                    <input
                      name="fatherName"
                      onChange={handleChange}
                      value={formData.fatherName}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Mother's Name *</label>
                    <input
                      name="motherName"
                      onChange={handleChange}
                      value={formData.motherName}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Date of Birth *</label>
                    <input
                      type="date"
                      name="dob"
                      onChange={handleChange}
                      value={formData.dob}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Education Qualification *</label>
                    <input
                      name="education"
                      onChange={handleChange}
                      value={formData.education}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Mobile No *</label>
                    <input
                      type="tel"
                      name="mobile"
                      onChange={handleChange}
                      value={formData.mobile}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Alternate Mobile No</label>
                    <input
                      type="tel"
                      name="altMobile"
                      onChange={handleChange}
                      value={formData.altMobile}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Gender *</label>
                    <select
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ---------- Owner Address ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Owner Address</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Street Address *</label>
                    <input
                      name="street"
                      onChange={handleChange}
                      value={formData.street}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Town / Village *</label>
                    <input
                      name="town"
                      onChange={handleChange}
                      value={formData.town}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">State *</label>
                    <input
                      name="state"
                      onChange={handleChange}
                      value={formData.state}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">District *</label>
                    <input
                      name="district"
                      onChange={handleChange}
                      value={formData.district}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Country *</label>
                    <input
                      name="country"
                      onChange={handleChange}
                      value={formData.country}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pin Code *</label>
                    <input
                      name="pin"
                      onChange={handleChange}
                      value={formData.pin}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ---------- Centre Details ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Centre Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Centre Name *</label>
                    <input
                      name="centreName"
                      onChange={handleChange}
                      value={formData.centreName}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Centre Code *</label>
                    <input
                      name="centreCode"
                      onChange={handleChange}
                      value={formData.centreCode}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Login ID *</label>
                    <input
                      name="loginId"
                      onChange={handleChange}
                      value={formData.loginId}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Password *</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      value={formData.password}
                      className="w-full border p-2 rounded-md"
                      autoComplete="new-password"  // FIXED: Added autocomplete for best practice
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Street Address *</label>
                    <input
                      name="centreStreet"
                      onChange={handleChange}
                      value={formData.centreStreet}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Town / Village *</label>
                    <input
                      name="centreTown"
                      onChange={handleChange}
                      value={formData.centreTown}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">State *</label>
                    <input
                      name="centreState"
                      onChange={handleChange}
                      value={formData.centreState}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">District *</label>
                    <input
                      name="centreDistrict"
                      onChange={handleChange}
                      value={formData.centreDistrict}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Country *</label>
                    <input
                      name="centreCountry"
                      onChange={handleChange}
                      value={formData.centreCountry}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pin Code *</label>
                    <input
                      name="centrePin"
                      onChange={handleChange}
                      value={formData.centrePin}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ---------- Franchise & Facilities ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Franchise & Facilities</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Type of Franchise *</label>
                    <input
                      name="franchiseType"
                      onChange={handleChange}
                      value={formData.franchiseType}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Old Academy Name (If Converted)</label>
                    <input
                      name="oldAcademy"
                      onChange={handleChange}
                      value={formData.oldAcademy}
                      className="w-full border p-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Academic Location *</label>
                    <input
                      name="location"
                      onChange={handleChange}
                      value={formData.location}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Total Area (in sqft) *</label>
                    <input
                      type="number"
                      name="area"
                      onChange={handleChange}
                      value={formData.area}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Theory Room? *</label>
                    <select
                      name="theoryRoom"
                      onChange={handleChange}
                      value={formData.theoryRoom}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Practical Room? *</label>
                    <select
                      name="practicalRoom"
                      onChange={handleChange}
                      value={formData.practicalRoom}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Reception Room? *</label>
                    <select
                      name="receptionRoom"
                      onChange={handleChange}
                      value={formData.receptionRoom}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Internet Connection? *</label>
                    <select
                      name="internet"
                      onChange={handleChange}
                      value={formData.internet}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Printer & Scanner? *</label>
                    <select
                      name="printer"
                      onChange={handleChange}
                      value={formData.printer}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Number of Computers *</label>
                    <input
                      type="number"
                      name="computers"
                      onChange={handleChange}
                      value={formData.computers}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ---------- Courses Interested ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Courses Interested</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Software Courses? *</label>
                    <select
                      name="softwareCourses"
                      onChange={handleChange}
                      value={formData.softwareCourses}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Hardware Courses? *</label>
                    <select
                      name="hardwareCourses"
                      onChange={handleChange}
                      value={formData.hardwareCourses}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Vocational Courses? *</label>
                    <select
                      name="vocationalCourses"
                      onChange={handleChange}
                      value={formData.vocationalCourses}
                      className="w-full border p-2 rounded-md"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ---------- Documents Section ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Documents & Photos</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">PAN Card No. *</label>
                    <input
                      name="pan"
                      onChange={handleChange}
                      value={formData.pan}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Aadhaar Card No. *</label>
                    <input
                      name="aadhaar"
                      onChange={handleChange}
                      value={formData.aadhaar}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                  </div>
                  {/* File Uploads */}
                  <div>
                    <label className="block font-medium text-sm">Passport Size Photo (Max 100 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "passportPhoto", 100)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.passportPhoto || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Education Proof (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "educationProof", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.educationProof || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pan Card (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "panCard", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.panCard || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Aadhaar Card (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "aadhaarCard", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.aadhaarCard || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Theory Room (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "theoryRoomPhoto", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.theoryRoomPhoto || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Practical Room (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "practicalRoomPhoto", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.practicalRoomPhoto || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Office Room (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "officeRoomPhoto", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.officeRoomPhoto || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Centre Front (Max 200 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "centreFrontPhoto", 200)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.centreFrontPhoto || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Centre Logo (Max 100 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "centreLogo", 100)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.centreLogo || "No file chosen"}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Signature (Max 100 KB) *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "signature", 100)}
                      className="w-full border p-2 rounded-md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.signature || "No file chosen"}
                    </p>
                  </div>
                </div>
              </section>

              {/* ---------- Buttons ---------- */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}