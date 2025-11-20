import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UpdateCentre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [centre, setCentre] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [selectedFileObjects, setSelectedFileObjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Track touched fields for better validation UX
  const [touchedFields, setTouchedFields] = useState({});

  // Fetch centre on mount
  useEffect(() => {
    fetchCentre();
  }, [id]);

  const fetchCentre = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setCentre(data.centre);

      // Pre-fill formData with all fields from fetched data
      setFormData({
        type: data.centre.type || "",
        status: data.centre.status || "",
        createBranch: data.centre.createBranch || "",
        commission: data.centre.commission || "",
        fees: data.centre.fees || "",
        ownerName: data.centre.ownerName || "",
        fatherName: data.centre.fatherName || "",
        motherName: data.centre.motherName || "",
        dob: data.centre.dob ? new Date(data.centre.dob).toISOString().split('T')[0] : "",
        education: data.centre.education || "",
        mobile: data.centre.mobile || "",
        altMobile: data.centre.altMobile || "",
        email: data.centre.email || "",
        gender: data.centre.gender || "",
        street: data.centre.street || "",
        town: data.centre.town || "",
        state: data.centre.state || "",
        district: data.centre.district || "",
        country: data.centre.country || "",
        pin: data.centre.pin || "",
        centreName: data.centre.centreName || "",
        centreCode: data.centre.centreCode || "",
        loginId: data.centre.loginId || "",
        password: "", // Don't pre-fill password for security
        centreStreet: data.centre.centreStreet || "",
        centreTown: data.centre.centreTown || "",
        centreState: data.centre.centreState || "",
        centreDistrict: data.centre.centreDistrict || "",
        centreCountry: data.centre.centreCountry || "",
        centrePin: data.centre.centrePin || "",
        franchiseType: data.centre.franchiseType || "",
        oldAcademy: data.centre.oldAcademy || "",
        location: data.centre.location || "",
        area: data.centre.area || "",
        theoryRoom: data.centre.theoryRoom || "",
        practicalRoom: data.centre.practicalRoom || "",
        receptionRoom: data.centre.receptionRoom || "",
        internet: data.centre.internet || "",
        printer: data.centre.printer || "",
        computers: data.centre.computers || "",
        softwareCourses: data.centre.softwareCourses || "",
        hardwareCourses: data.centre.hardwareCourses || "",
        vocationalCourses: data.centre.vocationalCourses || "",
        pan: data.centre.pan || "",
        aadhaar: data.centre.aadhaar || "",
      });

      // Pre-fill selectedFiles with existing file names (for display)
      setSelectedFiles({
        passportPhoto: data.centre.passportPhoto ? data.centre.passportPhoto.split('/').pop() : null,
        educationProof: data.centre.educationProof ? data.centre.educationProof.split('/').pop() : null,
        panCard: data.centre.panCard ? data.centre.panCard.split('/').pop() : null,
        aadhaarCard: data.centre.aadhaarCard ? data.centre.aadhaarCard.split('/').pop() : null,
        theoryRoomPhoto: data.centre.theoryRoomPhoto ? data.centre.theoryRoomPhoto.split('/').pop() : null,
        practicalRoomPhoto: data.centre.practicalRoomPhoto ? data.centre.practicalRoomPhoto.split('/').pop() : null,
        officeRoomPhoto: data.centre.officeRoomPhoto ? data.centre.officeRoomPhoto.split('/').pop() : null,
        centreFrontPhoto: data.centre.centreFrontPhoto ? data.centre.centreFrontPhoto.split('/').pop() : null,
        centreLogo: data.centre.centreLogo ? data.centre.centreLogo.split('/').pop() : null,
        signature: data.centre.signature ? data.centre.signature.split('/').pop() : null,
      });

      // selectedFileObjects starts empty (no new files yet)
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

      // Reset touched fields
      setTouchedFields({});
    } catch (err) {
      console.error("Error fetching centre:", err);
      setError("Failed to load centre details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    setError("");
  }, []);

  const handleFileChange = useCallback((e, fieldName, maxSizeKB) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeBytes = maxSizeKB * 1024;
      if (file.size > maxSizeBytes) {
        alert(`File size exceeds ${maxSizeKB} KB limit for ${fieldName}!`);
        e.target.value = "";
        return;
      }
      setSelectedFiles((prev) => ({ ...prev, [fieldName]: file.name }));
      setSelectedFileObjects((prev) => ({ ...prev, [fieldName]: file }));
    }
  }, []);

  // Updated validation: Only validate touched/empty fields for partial updates
  const validateForm = () => {
    // Critical fields that must always be present (even if unchanged)
    const criticalFields = [
      'centreName', 'centreCode', 'loginId', 'mobile', 'email', 
      'ownerName', 'dob', 'gender', 'street', 'town', 'state', 'district', 
      'country', 'pin', 'centreStreet', 'centreTown', 'centreState', 
      'centreDistrict', 'centreCountry', 'centrePin', 'franchiseType', 
      'location', 'area', 'theoryRoom', 'practicalRoom', 'receptionRoom', 
      'internet', 'printer', 'computers', 'softwareCourses', 
      'hardwareCourses', 'vocationalCourses', 'pan', 'aadhaar'
    ];

    const errors = [];
    criticalFields.forEach((field) => {
      const value = formData[field];
      const trimmed = value ? value.toString().trim() : '';

      // Only validate if field is touched OR empty (allow unchanged pre-filled)
      if (touchedFields[field] || !value || trimmed === '') {
        if (!value || trimmed === '') {
          errors.push(field);
        } else if (field === 'dob') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`${field} must be a valid date`);
          }
        } else if (['area', 'computers', 'commission', 'fees'].includes(field)) {
          const num = parseFloat(trimmed);
          if (isNaN(num) || num < 0) {
            errors.push(`${field} must be a positive number`);
          }
        } else if (field === 'mobile' && trimmed.length < 10) {
          errors.push('Mobile must be at least 10 digits');
        } else if (['pan', 'aadhaar'].includes(field)) {
          if (trimmed.length < 10) errors.push(`${field.toUpperCase()} must be at least 10 characters`);
          if (field === 'aadhaar' && trimmed.length < 12) errors.push('Aadhaar must be at least 12 digits');
        } else if (field === 'email' && !/\S+@\S+\.\S+/.test(trimmed)) {
          errors.push('Email must be valid');
        }
      }
    });

    // Password optional, but validate length if provided
    if (formData.password && formData.password.length < 6) {
      errors.push('Password must be at least 6 characters if provided.');
    }

    if (errors.length > 0) {
      setError(`Please fix: ${errors.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitLoading) return;
    setSubmitLoading(true);
    setError("");

    if (!validateForm()) {
      setSubmitLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    // Append all form fields (including unchanged ones as empty strings if cleared)
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key] || "");
    });
    // Append only new files (backend will keep existing if not provided)
    Object.keys(selectedFileObjects).forEach((key) => {
      if (selectedFileObjects[key]) {
        formDataToSend.append(key, selectedFileObjects[key]);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/centres/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Centre updated successfully");
        // Optionally refetch to update local state, or navigate
        navigate(-1);
      } else {
        setError(data.error || "Error updating centre");
        alert(data.error || "Error updating centre");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Network error: " + error.message);
      alert("Network error: " + error.message);
    } finally {
      setSubmitLoading(false);
    }
  }, [formData, selectedFileObjects, id, navigate, submitLoading, touchedFields]);

  const handleReset = useCallback(() => {
    if (centre) {
      // Reset to original fetched data
      setFormData({
        type: centre.type || "",
        status: centre.status || "",
        createBranch: centre.createBranch || "",
        commission: centre.commission || "",
        fees: centre.fees || "",
        ownerName: centre.ownerName || "",
        fatherName: centre.fatherName || "",
        motherName: centre.motherName || "",
        dob: centre.dob ? new Date(centre.dob).toISOString().split('T')[0] : "",
        education: centre.education || "",
        mobile: centre.mobile || "",
        altMobile: centre.altMobile || "",
        email: centre.email || "",
        gender: centre.gender || "",
        street: centre.street || "",
        town: centre.town || "",
        state: centre.state || "",
        district: centre.district || "",
        country: centre.country || "",
        pin: centre.pin || "",
        centreName: centre.centreName || "",
        centreCode: centre.centreCode || "",
        loginId: centre.loginId || "",
        password: "", // Keep empty
        centreStreet: centre.centreStreet || "",
        centreTown: centre.centreTown || "",
        centreState: centre.centreState || "",
        centreDistrict: centre.centreDistrict || "",
        centreCountry: centre.centreCountry || "",
        centrePin: centre.centrePin || "",
        franchiseType: centre.franchiseType || "",
        oldAcademy: centre.oldAcademy || "",
        location: centre.location || "",
        area: centre.area || "",
        theoryRoom: centre.theoryRoom || "",
        practicalRoom: centre.practicalRoom || "",
        receptionRoom: centre.receptionRoom || "",
        internet: centre.internet || "",
        printer: centre.printer || "",
        computers: centre.computers || "",
        softwareCourses: centre.softwareCourses || "",
        hardwareCourses: centre.hardwareCourses || "",
        vocationalCourses: centre.vocationalCourses || "",
        pan: centre.pan || "",
        aadhaar: centre.aadhaar || "",
      });

      // Reset file displays to original (clear new selections)
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
      setSelectedFiles({
        passportPhoto: centre.passportPhoto ? centre.passportPhoto.split('/').pop() : null,
        educationProof: centre.educationProof ? centre.educationProof.split('/').pop() : null,
        panCard: centre.panCard ? centre.panCard.split('/').pop() : null,
        aadhaarCard: centre.aadhaarCard ? centre.aadhaarCard.split('/').pop() : null,
        theoryRoomPhoto: centre.theoryRoomPhoto ? centre.theoryRoomPhoto.split('/').pop() : null,
        practicalRoomPhoto: centre.practicalRoomPhoto ? centre.practicalRoomPhoto.split('/').pop() : null,
        officeRoomPhoto: centre.officeRoomPhoto ? centre.officeRoomPhoto.split('/').pop() : null,
        centreFrontPhoto: centre.centreFrontPhoto ? centre.centreFrontPhoto.split('/').pop() : null,
        centreLogo: centre.centreLogo ? centre.centreLogo.split('/').pop() : null,
        signature: centre.signature ? centre.signature.split('/').pop() : null,
      });

      // Clear file inputs
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = "");

      // Reset touched fields
      setTouchedFields({});
    }
    setError("");
  }, [centre]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !centre) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Topbar />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center py-8 text-red-600">
                <p>{error || "Centre not found."}</p>
                <button onClick={() => navigate(-1)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-4 border-yellow-600 inline-block pb-1">
              Update Centre: {centre.name}
            </h2>

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
                    <label className="block font-medium text-sm">Type</label>
                    <select name="type" onChange={handleChange} value={formData.type} className="w-full border rounded-md p-2">
                      <option value="">Select</option>
                      <option value="Head Branch">Head Branch</option>
                      <option value="Centre">Centre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Status</label>
                    <select name="status" onChange={handleChange} value={formData.status} className="w-full border rounded-md p-2">
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Create Branch</label>
                    <select name="createBranch" onChange={handleChange} value={formData.createBranch} className="w-full border rounded-md p-2">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Commission (%)</label>
                    <input type="number" name="commission" onChange={handleChange} value={formData.commission} className="w-full border rounded-md p-2" />
                  </div>

                  <div>
                    <label className="block font-medium text-sm">Centre Create Fees (Rs.)</label>
                    <input type="number" name="fees" onChange={handleChange} value={formData.fees} className="w-full border rounded-md p-2" />
                  </div>
                </div>
              </section>

              {/* ---------- Owner Details ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Owner Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Owner Name</label>
                    <input name="ownerName" onChange={handleChange} value={formData.ownerName} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Father's Name</label>
                    <input name="fatherName" onChange={handleChange} value={formData.fatherName} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Mother's Name</label>
                    <input name="motherName" onChange={handleChange} value={formData.motherName} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Date of Birth</label>
                    <input type="date" name="dob" onChange={handleChange} value={formData.dob} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Education Qualification</label>
                    <input name="education" onChange={handleChange} value={formData.education} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Mobile No</label>
                    <input type="tel" name="mobile" onChange={handleChange} value={formData.mobile} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Alternate Mobile No</label>
                    <input type="tel" name="altMobile" onChange={handleChange} value={formData.altMobile} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Email ID</label>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Gender</label>
                    <select name="gender" onChange={handleChange} value={formData.gender} className="w-full border p-2 rounded-md">
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
                    <label className="block font-medium text-sm">Street Address</label>
                    <input name="street" onChange={handleChange} value={formData.street} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Town / Village</label>
                    <input name="town" onChange={handleChange} value={formData.town} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">State</label>
                    <input name="state" onChange={handleChange} value={formData.state} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">District</label>
                    <input name="district" onChange={handleChange} value={formData.district} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Country</label>
                    <input name="country" onChange={handleChange} value={formData.country} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pin Code</label>
                    <input name="pin" onChange={handleChange} value={formData.pin} className="w-full border p-2 rounded-md" />
                  </div>
                </div>
              </section>

              {/* ---------- Centre Details ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Centre Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Centre Name</label>
                    <input name="centreName" onChange={handleChange} value={formData.centreName} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Centre Code</label>
                    <input name="centreCode" onChange={handleChange} value={formData.centreCode} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Login ID</label>
                    <input name="loginId" onChange={handleChange} value={formData.loginId} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">New Password (Leave blank to keep current)</label>
                    <input 
                      type="password" 
                      name="password" 
                      onChange={handleChange} 
                      value={formData.password} 
                      className="w-full border p-2 rounded-md" 
                      autocomplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Street Address</label>
                    <input name="centreStreet" onChange={handleChange} value={formData.centreStreet} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Town / Village</label>
                    <input name="centreTown" onChange={handleChange} value={formData.centreTown} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">State</label>
                    <input name="centreState" onChange={handleChange} value={formData.centreState} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">District</label>
                    <input name="centreDistrict" onChange={handleChange} value={formData.centreDistrict} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Country</label>
                    <input name="centreCountry" onChange={handleChange} value={formData.centreCountry} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pin Code</label>
                    <input name="centrePin" onChange={handleChange} value={formData.centrePin} className="w-full border p-2 rounded-md" />
                  </div>
                </div>
              </section>

              {/* ---------- Franchise & Facilities ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Franchise & Facilities</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Type of Franchise</label>
                    <input name="franchiseType" onChange={handleChange} value={formData.franchiseType} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Old Academy Name (If Converted)</label>
                    <input name="oldAcademy" onChange={handleChange} value={formData.oldAcademy} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Academic Location</label>
                    <input name="location" onChange={handleChange} value={formData.location} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Total Area (in sqft)</label>
                    <input type="number" name="area" onChange={handleChange} value={formData.area} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Theory Room?</label>
                    <select name="theoryRoom" onChange={handleChange} value={formData.theoryRoom} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Practical Room?</label>
                    <select name="practicalRoom" onChange={handleChange} value={formData.practicalRoom} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Reception Room?</label>
                    <select name="receptionRoom" onChange={handleChange} value={formData.receptionRoom} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Internet Connection?</label>
                    <select name="internet" onChange={handleChange} value={formData.internet} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Printer & Scanner?</label>
                    <select name="printer" onChange={handleChange} value={formData.printer} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Number of Computers</label>
                    <input type="number" name="computers" onChange={handleChange} value={formData.computers} className="w-full border p-2 rounded-md" />
                  </div>
                </div>
              </section>

              {/* ---------- Courses Interested ---------- */}
              <section>
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Courses Interested</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-sm">Software Courses?</label>
                    <select name="softwareCourses" onChange={handleChange} value={formData.softwareCourses} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Hardware Courses?</label>
                    <select name="hardwareCourses" onChange={handleChange} value={formData.hardwareCourses} className="w-full border p-2 rounded-md">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Vocational Courses?</label>
                    <select name="vocationalCourses" onChange={handleChange} value={formData.vocationalCourses} className="w-full border p-2 rounded-md">
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
                    <label className="block font-medium text-sm">PAN Card No.</label>
                    <input name="pan" onChange={handleChange} value={formData.pan} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Aadhaar Card No.</label>
                    <input name="aadhaar" onChange={handleChange} value={formData.aadhaar} className="w-full border p-2 rounded-md" />
                  </div>
                  {/* File Uploads with existing file display */}
                  <div>
                    <label className="block font-medium text-sm">Passport Size Photo (Max 100 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "passportPhoto", 100)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.passportPhoto ? selectedFiles.passportPhoto : (centre.passportPhoto ? <a href={`${API_BASE_URL}/${centre.passportPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Education Proof (Max 200 KB)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "educationProof", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.educationProof ? selectedFiles.educationProof : (centre.educationProof ? <a href={`${API_BASE_URL}/${centre.educationProof}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Pan Card (Max 200 KB)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "panCard", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.panCard ? selectedFiles.panCard : (centre.panCard ? <a href={`${API_BASE_URL}/${centre.panCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Aadhaar Card (Max 200 KB)</label>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, "aadhaarCard", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.aadhaarCard ? selectedFiles.aadhaarCard : (centre.aadhaarCard ? <a href={`${API_BASE_URL}/${centre.aadhaarCard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Theory Room (Max 200 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "theoryRoomPhoto", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.theoryRoomPhoto ? selectedFiles.theoryRoomPhoto : (centre.theoryRoomPhoto ? <a href={`${API_BASE_URL}/${centre.theoryRoomPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Practical Room (Max 200 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "practicalRoomPhoto", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.practicalRoomPhoto ? selectedFiles.practicalRoomPhoto : (centre.practicalRoomPhoto ? <a href={`${API_BASE_URL}/${centre.practicalRoomPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Office Room (Max 200 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "officeRoomPhoto", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.officeRoomPhoto ? selectedFiles.officeRoomPhoto : (centre.officeRoomPhoto ? <a href={`${API_BASE_URL}/${centre.officeRoomPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Photo of Centre Front (Max 200 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "centreFrontPhoto", 200)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.centreFrontPhoto ? selectedFiles.centreFrontPhoto : (centre.centreFrontPhoto ? <a href={`${API_BASE_URL}/${centre.centreFrontPhoto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Centre Logo (Max 100 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "centreLogo", 100)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.centreLogo ? selectedFiles.centreLogo : (centre.centreLogo ? <a href={`${API_BASE_URL}/${centre.centreLogo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium text-sm">Signature (Max 100 KB)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "signature", 100)} className="w-full border p-2 rounded-md" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedFiles.signature ? selectedFiles.signature : (centre.signature ? <a href={`${API_BASE_URL}/${centre.signature}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Current</a> : 'None')}
                    </p>
                  </div>
                </div>
              </section>

              {/* ---------- Buttons ---------- */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
                  disabled={submitLoading}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}