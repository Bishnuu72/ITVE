import React, { useState, useEffect } from "react";
import topImage from "../assets/images/Course3.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Swal from "sweetalert2";
import { submitStudent } from "../services/studentAdmissionService";
import { getNotices } from "../services/noticeService";
import { getAllSettings } from "../services/settingService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function StudentAdmission() {
  const [formData, setFormData] = useState({
    // Mapped to admin schema + registrationType for online
    registrationType: "Online", // ✅ NEW: Set for online submissions
    center: "", // Holds _id internally; full label sent to backend
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    mobile: "",
    religion: "",
    category: "",
    address: "",
    pin: "", // ✅ CHANGED: Use 'pin' (matches admin schema)
    state: "",
    district: "",
    country: "India", // ✅ Default to match admin
    admissionDate: "",
    course: "", // Holds _id internally; full label sent to backend
    applyKit: false, // ✅ CHANGED: Map 'kit' to boolean (matches admin schema)
    totalFee: "", // NEW: Auto-calculated (course fee + 150 registration)
    // Hidden for dynamic totalFee calculation
    regFeeWithoutKit: "",
    regFeeWithKit: "",
    studentPhoto: null, // ✅ CHANGED: Rename for admin Multer
    idProof: null,
    eduProof: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    studentPhoto: null, // ✅ Renamed
    idProof: null,
    eduProof: null,
  });

  // ✅ NEW: Courses and Centres state (from backend, like AddStudent.jsx)
  const [courses, setCourses] = useState([]);
  const [centres, setCentres] = useState([]);

  const [admissionNotices, setAdmissionNotices] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ NEW: Loading state
  const [coursesLoading, setCoursesLoading] = useState(true); // ✅ NEW: For courses/centres fetch

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notices
        const notices = await getNotices();
        const activeNotices = notices
          .filter(notice => notice.status === "Active" && notice.admissionNotice)
          .map(notice => notice.admissionNotice);
        setAdmissionNotices(activeNotices);

        // Fetch settings
        const settingsData = await getAllSettings();
        setSettings(settingsData);

        // ✅ UPDATED: Fetch courses and centres from backend (like AddStudent.jsx)
        const [courseResponse, centreResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/courses`),
          fetch(`${API_BASE_URL}/api/centres`),
        ]);

        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        if (!centreResponse.ok) throw new Error("Failed to fetch centres");

        const { data: courseData } = await courseResponse.json(); // Courses: { data: [...] }
        const centreData = await centreResponse.json(); // Centres: direct array

        setCourses(courseData || []);
        setCentres(centreData || []);
        console.log("🔍 Fetched courses:", courseData);
        console.log("🔍 Fetched centres:", centreData); // Debug log like AddStudent
      } catch (error) {
        console.error("Failed to fetch data", error);
        setCourses([]);
        setCentres([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      setFilePreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "gender") {
      // Minor: Capitalize first letter for gender (select-based, limited options)
      const formattedGender = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      setFormData(prev => ({ ...prev, [name]: formattedGender }));
    } else {
      // FIXED: No automatic uppercase for any typed fields – use value as-is
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // NEW: Custom handler for course change (auto-set fees and totalFee)
  const handleCourseChange = (e) => {
    const selectedValue = e.target.value; // _id
    setFormData((prev) => ({ 
      ...prev, 
      course: selectedValue,
      totalFee: "",
      regFeeWithoutKit: "",
      regFeeWithKit: "",
    }));

    if (selectedValue) {
      const selectedCourse = courses.find((c) => c._id === selectedValue);
      if (selectedCourse) {
        const withoutKit = parseFloat(selectedCourse.regFeeWithoutKit) || 0;
        const withKit = parseFloat(selectedCourse.regFeeWithKit) || 0;
        const registrationFee = 150; // Fixed online registration charge
        const initialFee = formData.applyKit ? withKit : withoutKit;
        const initialTotal = initialFee + registrationFee;

        setFormData((prev) => ({ 
          ...prev,
          regFeeWithoutKit: withoutKit.toString(),
          regFeeWithKit: withKit.toString(),
          totalFee: initialTotal.toString(), // Initial: based on current applyKit + 150
        }));
        console.log(`🔍 Course selected: ${selectedCourse.name}, initial totalFee = ${initialTotal} (+150 registration)`);
      }
    }
  };

  // NEW: Dynamic totalFee update based on course + applyKit (+150 registration)
  useEffect(() => {
    if (formData.course && (formData.regFeeWithoutKit !== "" || formData.regFeeWithKit !== "")) {
      const withoutKit = parseFloat(formData.regFeeWithoutKit) || 0;
      const withKit = parseFloat(formData.regFeeWithKit) || 0;
      const registrationFee = 150; // Fixed online registration charge
      const feeToUse = formData.applyKit ? withKit : withoutKit;
      const total = feeToUse + registrationFee;
      setFormData((prev) => ({ ...prev, totalFee: total.toString() }));
      console.log(`🔍 Updated totalFee: ${formData.applyKit ? 'With Kit' : 'Without Kit'} + 150 = ${total}`);
    } else {
      setFormData((prev) => ({ ...prev, totalFee: "" }));
    }
  }, [formData.course, formData.applyKit, formData.regFeeWithoutKit, formData.regFeeWithKit]);

  // ✅ FIXED: Enhanced client-side validation (skips optional fields; checks center/course/totalFee)
  const validateForm = () => {
    const required = ["center", "studentName", "fatherName", "motherName", "dob", "gender", "mobile", "address", "state", "district", "pin", "admissionDate", "course", "totalFee"];
    const missing = required.filter(field => !formData[field] || formData[field].toString().trim() === "");
    if (missing.length > 0) {
      Swal.fire({ icon: "warning", title: "Incomplete Form", text: `Missing: ${missing.join(", ")}` });
      return false;
    }
    if (!formData.mobile.match(/^[0-9]{10}$/)) {
      Swal.fire({ icon: "error", title: "Invalid Mobile", text: "Enter a valid 10-digit mobile number." });
      return false;
    }
    // ✅ NEW: Warn if optional selects empty (but don't block)
    if (!formData.religion || formData.religion === "") {
      Swal.fire({ 
        icon: "info", 
        title: "Optional Field", 
        text: "Religion is optional but recommended.", 
        timer: 2000 
      });
    }
    if (!formData.category || formData.category === "") {
      Swal.fire({ 
        icon: "info", 
        title: "Optional Field", 
        text: "Category is optional but recommended.", 
        timer: 2000 
      });
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // NEW: Handle course and center - send full labels to backend (lookup by _id, like AddStudent)
    let courseNameToSend = formData.course; // Fallback
    let centerNameToSend = formData.center; // Fallback

    // Lookup course full label
    if (formData.course && courses.length > 0) {
      const selectedCourse = courses.find((c) => c._id === formData.course);
      if (selectedCourse) {
        courseNameToSend = `${selectedCourse.name} (${selectedCourse.code})`;
        console.log(`🔍 Sending course name to backend: "${courseNameToSend}" (ID: ${formData.course})`);
      } else {
        console.warn("🔍 Course lookup failed - sending raw value as fallback");
      }
    }

    // Lookup center full label
    if (formData.center && centres.length > 0) {
      const selectedCentre = centres.find((c) => c._id === formData.center);
      if (selectedCentre) {
        centerNameToSend = `${selectedCentre.name} (${selectedCentre.code})`;
        console.log(`🔍 Sending center name to backend: "${centerNameToSend}" (ID: ${formData.center})`);
      } else {
        console.warn("🔍 Centre lookup failed - sending raw value as fallback");
      }
    }

    // Update formData with labels before submitting (service uses formData)
    const submitData = { ...formData, course: courseNameToSend, center: centerNameToSend };

    try {
      const response = await submitStudent(submitData); // Now posts to /api/students with labels and totalFee

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Student admission submitted successfully",
          timer: 3000,
          showConfirmButton: true,
        });

        // Reset form
        setFormData({
          registrationType: "Online",
          center: "",
          studentName: "",
          fatherName: "",
          motherName: "",
          dob: "",
          gender: "",
          mobile: "",
          religion: "",
          category: "",
          address: "",
          pin: "",
          state: "",
          district: "",
          country: "India",
          admissionDate: "",
          course: "",
          applyKit: false,
          totalFee: "",
          regFeeWithoutKit: "",
          regFeeWithKit: "",
          studentPhoto: null,
          idProof: null,
          eduProof: null,
        });
        setFilePreviews({ studentPhoto: null, idProof: null, eduProof: null });
      }
    } catch (err) {
      console.error("Form submission error:", err.response || err);
      // ✅ FIXED: Show exact backend error
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to submit form. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Top Banner */}
        <div className="relative w-full h-64">
          <img
            src={topImage}
            alt="Admission Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome to ITVE (Information Technology and Vocational Education)
            </h1>
            <p className="text-white mt-2 max-w-2xl">
              Note: Please Fill This Form in CAPITAL LETTERS Only. Thank You!
            </p>
            <p className="text-yellow-300 font-semibold mt-1">
              An ISO 9001:2015 Certified Institute | Regd. Under Govt. of India
            </p>
          </div>
        </div>

        {/* Scrolling Admission Notices */}
        <div className="w-full py-2 overflow-hidden" style={{ backgroundColor: "#f7cd7f" }}>
          <div
            className="animate-marquee whitespace-nowrap font-bold text-lg md:text-xl hover:pause-marquee"
            style={{ color: "#000000", padding: "10px" }}
          >
            {admissionNotices.length > 0 ? (
              admissionNotices.map((text, index) => (
                <span key={index} className="mx-4">
                  {text}
                </span>
              ))
            ) : (
              <span>
                Welcome To <strong>ITVE</strong> – Admission updates will appear here.
              </span>
            )}
          </div>
        </div>

        {/* Admission Form */}
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 mb-12 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
            Student Online Admission Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
            {/* Registration Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
                Registration Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Select Center *</label>
                  <select
                    name="center"
                    value={formData.center}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2"
                    required
                    disabled={coursesLoading}
                  >
                    <option value="">
                      {coursesLoading ? "Loading Centres..." : "Select Center"}
                    </option>
                    {centres.length > 0 ? (
                      centres.map((centre) => (
                        <option key={centre._id} value={centre._id}>
                          {`${centre.name} (${centre.code})`}
                        </option>
                      ))
                    ) : !coursesLoading ? (
                      <option value="">No centres available</option>
                    ) : null}
                  </select>
                </div>
              </div>
            </section>

            {/* Student Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
                Student’s Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Student's Name *", name: "studentName" },
                  { label: "Father's Name *", name: "fatherName" },
                  { label: "Mother's Name *", name: "motherName" },
                  { label: "Date of Birth *", name: "dob", type: "date" },
                  { label: "Gender *", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
                  { label: "Mobile Number *", name: "mobile" },
                  { label: "Religion (Optional)", name: "religion", type: "select", options: ["Hindu", "Muslim", "Christian", "Sikh", "Other"] },
                  { label: "Category (Optional)", name: "category", type: "select", options: ["General", "OBC", "SC", "ST"] } // ✅ FIXED: Exact enum match
                ].map((field) => (
                  <div className="flex flex-col" key={field.name}>
                    <label className="font-medium mb-1">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required={field.label.includes("*")}
                      >
                        <option value="">{field.label.split(' (')[0]}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required={field.label.includes("*")}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Address Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
                Address Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: "Residential Address *", name: "address" },
                  { label: "Pin Code *", name: "pin" }, // ✅ CHANGED: 'pin' for schema
                  { label: "State *", name: "state" }, // ✅ FIXED: Text input (no dropdown)
                  { label: "District *", name: "district" }, // ✅ FIXED: Text input (no dropdown)
                  { label: "Country *", name: "country", type: "select", options: ["India"] }
                ].map((field) => (
                  <div className="flex flex-col" key={field.name}>
                    <label className="font-medium mb-1">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required={field.label.includes("*")}
                      >
                        <option value="">Select {field.label.split('*')[0]}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required={field.label.includes("*")}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Course Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
                Course Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Admission Date *</label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Select Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleCourseChange} // NEW: Custom handler for auto-totalFee
                    className="border rounded-md px-3 py-2"
                    required
                    disabled={coursesLoading}
                  >
                    <option value="">
                      {coursesLoading ? "Loading Courses..." : "Select Course"}
                    </option>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {`${course.name} (${course.code})`}
                        </option>
                      ))
                    ) : !coursesLoading ? (
                      <option value="">No courses available</option>
                    ) : null}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Apply for Kit? *</label>
                  <label className="flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      name="applyKit" 
                      checked={formData.applyKit} 
                      onChange={handleChange} 
                      className="mr-2" 
                    />
                    Yes
                  </label>
                  {/* NEW: Display dynamic totalFee (read-only) */}
                  {formData.totalFee && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      Total Fee: ₹{formData.totalFee} (incl. ₹150 registration)
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Documents & Photos */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">
                Documents & Photos
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "studentPhoto", label: "Student Photo *" },
                  { name: "idProof", label: "ID Proof *" },
                  { name: "eduProof", label: "Education Proof *" }
                ].map((field) => (
                  <div className="flex flex-col" key={field.name}>
                    <label className="font-medium mb-1">{field.label}</label>
                    <input
                      type="file"
                      name={field.name}
                      accept="image/*,.pdf"
                      onChange={handleChange}
                      className="border rounded-md px-2 py-1"
                      required={field.label.includes("*")}
                    />
                    {filePreviews[field.name] && (
                      <img
                        src={filePreviews[field.name]}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover border"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Registration Fee Note (now integrated into totalFee display) */}
              {formData.totalFee === "" && (
                <p className="text-sm text-gray-600 mt-2">
                  Select a course to see total fee (incl. ₹150 online registration).
                </p>
              )}
            </section>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !formData.totalFee} // NEW: Disable if no totalFee (no course)
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
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

export default StudentAdmission;