import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AddStudent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // For potential future use
  const [formData, setFormData] = useState({
    registrationType: "Admin",
    studentStatus: "Active",
    admitIssued: "No",
    marksheetIssued: "No",
    certificateIssued: "No",
    semesterIssued: "None Semester",
    updateMarks: "No",
    sendingByMail: "No",
    orderStatus: "Certificate Not Print",
    center: "", // Holds _id internally; name sent to backend
    enrollmentNo: `ENR-${new Date().getFullYear()}-001`, // Pre-filled unique enrollment
    rollNo: `ROLL-${new Date().getFullYear()}-001`, // Pre-filled unique roll number
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    mobile: "",
    religion: "",
    category: "",
    address: "",
    state: "",
    district: "",
    country: "India",
    pin: "",
    admissionDate: "",
    course: "", // Holds _id internally; name sent to backend
    issueDate: "",
    examDate: "",
    examMode: "Online",
    applyKit: false, // Checkbox for kit
    totalFee: "", // Auto-set dynamically based on course + applyKit
    duration: "", // Auto-set from course
    // Store both fees from course (hidden, for dynamic totalFee calculation)
    regFeeWithoutKit: "",
    regFeeWithKit: "",
    studentPhoto: null,
    idProof: null,
    eduProof: null,
  });

  const [courses, setCourses] = useState([]);
  const [centres, setCentres] = useState([]); // For centre dropdown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch courses and centres on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, centreResponse] = await Promise.all([
          fetch(`${API_BASE}/courses`),
          fetch(`${API_BASE}/centres`), // Matches CentreList.jsx endpoint
        ]);

        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        if (!centreResponse.ok) throw new Error("Failed to fetch centres");

        const { data: courseData } = await courseResponse.json(); // Courses: { data: [...] }
        const centreData = await centreResponse.json(); // Centres: direct array

        setCourses(courseData || []);
        setCentres(centreData || []);
        console.log("🔍 Fetched centres:", centreData); // Debug: Check console for array
      } catch (err) {
        console.error("Error fetching data:", err);
        setCourses([]);
        setCentres([]);
        setError("Failed to load courses or centres. Please refresh.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
    setError("");
  };

  // Handle course selection - auto-set duration, fees (both without/with kit) using _id
  const handleCourseChange = (e) => {
    const selectedValue = e.target.value; // _id
    setFormData((prev) => ({ 
      ...prev, 
      course: selectedValue,
      duration: "",
      totalFee: "", // Will be set by useEffect
      regFeeWithoutKit: "",
      regFeeWithKit: "",
    }));

    // Find selected course by _id and set duration + both fees
    if (selectedValue) {
      const selectedCourse = courses.find((c) => c._id === selectedValue);
      if (selectedCourse) {
        setFormData((prev) => ({ 
          ...prev,
          duration: selectedCourse.duration || "",
          regFeeWithoutKit: selectedCourse.regFeeWithoutKit || "0",
          regFeeWithKit: selectedCourse.regFeeWithKit || "0",
          // Initial totalFee: without kit (applyKit defaults to false)
          totalFee: selectedCourse.regFeeWithoutKit || "0",
        }));
      }
    }
  };

  // Dynamic totalFee update based on course + applyKit (uses _id for lookup)
  useEffect(() => {
    if (formData.course && (formData.regFeeWithoutKit !== "" || formData.regFeeWithKit !== "")) {
      const feeToUse = formData.applyKit ? formData.regFeeWithKit : formData.regFeeWithoutKit;
      setFormData((prev) => ({ ...prev, totalFee: feeToUse }));
      console.log(`🔍 Updated totalFee: ${formData.applyKit ? 'With Kit' : 'Without Kit'} = ${feeToUse}`);
    } else {
      setFormData((prev) => ({ ...prev, totalFee: "" }));
    }
  }, [formData.course, formData.applyKit, formData.regFeeWithoutKit, formData.regFeeWithKit]);

  // Enhanced validation (checks _id presence internally)
  const validateForm = () => {
    const requiredFields = [
      "center", "enrollmentNo", "rollNo", "studentName", "fatherName", "motherName",
      "dob", "gender", "mobile", "religion", "category", "address", "state",
      "district", "pin", "admissionDate", "course", "totalFee", "duration"
    ];
    const missingFields = [];
    for (const field of requiredFields) {
      const value = formData[field]?.toString().trim();
      if (!value || value === "") {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field =>
        field.replace(/([A-Z])/g, " $1").replace(/\b\w/g, l => l.toUpperCase()).trim()
      ).join(", ");
      const errMsg = `Please fill in all required fields - Missing: ${fieldNames}`;
      setError(errMsg);
      console.error("🔍 Validation failed - Missing fields:", missingFields);
      return false;
    }
    if (!formData.studentPhoto && !formData.idProof && !formData.eduProof) {
      console.warn("No files uploaded - optional but recommended");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const submitData = new FormData();

    // NEW: Handle course and center - send names/labels to backend (lookup by _id)
    let courseNameToSend = formData.course; // Fallback to _id if lookup fails
    let centerNameToSend = formData.center; // Fallback to _id if lookup fails

    // Lookup course name/label
    if (formData.course) {
      const selectedCourse = courses.find((c) => c._id === formData.course);
      if (selectedCourse) {
        courseNameToSend = `${selectedCourse.name} (${selectedCourse.code})`; // Full label as "filled in field"
        console.log(`🔍 Sending course name to backend: "${courseNameToSend}" (ID: ${formData.course})`);
      } else {
        console.warn("🔍 Course lookup failed - sending raw ID as fallback");
      }
    }

    // Lookup centre name/label
    if (formData.center) {
      const selectedCentre = centres.find((c) => c._id === formData.center);
      if (selectedCentre) {
        centerNameToSend = `${selectedCentre.name} (${selectedCentre.code})`; // Full label as "filled in field"
        console.log(`🔍 Sending center name to backend: "${centerNameToSend}" (ID: ${formData.center})`);
      } else {
        console.warn("🔍 Centre lookup failed - sending raw ID as fallback");
      }
    }

    // Append non-file fields (skip hidden fees; use names for course/center)
    Object.keys(formData).forEach((key) => {
      if (key !== "studentPhoto" && key !== "idProof" && key !== "eduProof" && 
          key !== "regFeeWithoutKit" && key !== "regFeeWithKit" && 
          key !== "course" && key !== "center") { // Skip original course/center _ids
        const value = formData[key];
        if (typeof value === "string") {
          submitData.append(key, value.trim());
        } else {
          submitData.append(key, value);
        }
      }
    });

    // Append course and center as names/labels
    submitData.append("course", courseNameToSend);
    submitData.append("center", centerNameToSend);

    // Append files
    if (formData.studentPhoto) submitData.append("studentPhoto", formData.studentPhoto);
    if (formData.idProof) submitData.append("idProof", formData.idProof);
    if (formData.eduProof) submitData.append("eduProof", formData.eduProof);

    // Log for debug (shows names sent)
    console.log("🔍 Submitting FormData - Keys:", Array.from(submitData.keys()));
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value.name ? `File (${value.name})` : `"${value}"`);
    }

    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message} (ID: ${result.data._id})`);
        handleReset();
        navigate("/all-students?refetch=true");
      } else {
        console.error("Backend Error Response:", result);
        setError(result.error || `Failed to save student. Status: ${response.status}`);
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      registrationType: "Admin",
      studentStatus: "Active",
      admitIssued: "No",
      marksheetIssued: "No",
      certificateIssued: "No",
      semesterIssued: "None Semester",
      updateMarks: "No",
      sendingByMail: "No",
      orderStatus: "Certificate Not Print",
      center: "",
      enrollmentNo: `ENR-${new Date().getFullYear()}-001`,
      rollNo: `ROLL-${new Date().getFullYear()}-001`,
      studentName: "",
      fatherName: "",
      motherName: "",
      dob: "",
      gender: "",
      mobile: "",
      religion: "",
      category: "",
      address: "",
      state: "",
      district: "",
      country: "India",
      pin: "",
      admissionDate: "",
      course: "",
      issueDate: "",
      examDate: "",
      examMode: "Online",
      applyKit: false,
      totalFee: "",
      duration: "",
      regFeeWithoutKit: "",
      regFeeWithKit: "",
      studentPhoto: null,
      idProof: null,
      eduProof: null,
    });
    setError("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-red-500 inline-block pb-2">
            Manage Student
          </h1>

          <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Admin Use Only */}
              <SectionTitle title="Admin Use Only" />
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "studentStatus", label: "Student Status", options: ["Active", "Inactive"] },
                  { name: "admitIssued", label: "Admit Issued", options: ["Yes", "No"] },
                  { name: "marksheetIssued", label: "Marksheet Issued", options: ["Yes", "No"] },
                  { name: "certificateIssued", label: "Certificate Issued", options: ["Yes", "No"] },
                  {
                    name: "semesterIssued",
                    label: "Student Semester",
                    options: ["None Semester", "Semester I", "Semester II", "Semester III", "Semester IV"],
                  },
                  { name: "updateMarks", label: "Update Marks", options: ["Yes", "No"] },
                  { name: "sendingByMail", label: "Sending By Mail", options: ["Yes", "No"] },
                  { 
                    name: "orderStatus", 
                    label: "Order Status", 
                    options: ["Certificate Not Print", "Certificate Print", "Certificate Sent"] 
                  },
                ].map((field) => (
                  <SelectField key={field.name} field={field} formData={formData} handleChange={handleChange} />
                ))}
              </div>

              {/* Registration Details */}
              <SectionTitle title="Registration Details" />
              <div className="grid md:grid-cols-3 gap-6">
                {/* Centre Dropdown (value=_id internally; name sent to backend) */}
                <SelectField 
                  field={{ 
                    name: "center", 
                    label: "Centre *", 
                    options: centres.length > 0 
                      ? centres.map(c => ({ value: c._id, label: `${c.name} (${c.code})` })) 
                      : [{ value: "", label: centres.length === 0 && error ? "No centres available" : "Loading centres..." }] 
                  }} 
                  formData={formData} 
                  handleChange={handleChange} 
                />
                <TextField label="Enrollment No *" name="enrollmentNo" value={formData.enrollmentNo} handleChange={handleChange} />
                <TextField label="Roll No *" name="rollNo" value={formData.rollNo} handleChange={handleChange} />
              </div>

              {/* Student's Details */}
              <SectionTitle title="Student's Details" />
              <div className="grid md:grid-cols-2 gap-6">
                <TextField label="Student's Name *" name="studentName" value={formData.studentName} handleChange={handleChange} />
                <TextField label="Father's Name *" name="fatherName" value={formData.fatherName} handleChange={handleChange} />
                <TextField label="Mother's Name *" name="motherName" value={formData.motherName} handleChange={handleChange} />
                <DateField label="Date of Birth *" name="dob" value={formData.dob} handleChange={handleChange} />
                <SelectField field={{ name: "gender", label: "Gender *", options: ["Male", "Female", "Other"] }} formData={formData} handleChange={handleChange} />
                <TextField label="Mobile No *" name="mobile" value={formData.mobile} handleChange={handleChange} />
                <SelectField field={{ name: "religion", label: "Religion (धर्म) *", options: ["Hindu", "Muslim", "Christian", "Sikh", "Other"] }} formData={formData} handleChange={handleChange} />
                <SelectField field={{ name: "category", label: "Category (वर्ग) *", options: ["General", "OBC", "SC", "ST"] }} formData={formData} handleChange={handleChange} />
              </div>

              {/* Address Details */}
              <SectionTitle title="Address Details" />
              <div className="grid md:grid-cols-2 gap-6">
                <TextField label="Residential Address *" name="address" value={formData.address} handleChange={handleChange} />
                <TextField label="State *" name="state" value={formData.state} handleChange={handleChange} />
                <TextField label="District *" name="district" value={formData.district} handleChange={handleChange} />
                <TextField label="Country *" name="country" value={formData.country} handleChange={handleChange} />
                <TextField label="Pin Code *" name="pin" value={formData.pin} handleChange={handleChange} />
              </div>

              {/* Course Details */}
              <SectionTitle title="Course Details" />
              <div className="grid md:grid-cols-2 gap-6">
                <DateField label="Date Of Admission *" name="admissionDate" value={formData.admissionDate} handleChange={handleChange} />
                {/* Course Select (value=_id internally; name sent to backend) */}
                <SelectField 
                  field={{ 
                    name: "course", 
                    label: "Select Course *", 
                    options: courses.length > 0 ? courses.map(c => ({ value: c._id, label: `${c.name} (${c.code})` })) : [{ value: "", label: "No courses available" }] 
                  }} 
                  formData={formData} 
                  handleChange={handleCourseChange} // Custom handler
                />
                <DateField label="Date of Issue *" name="issueDate" value={formData.issueDate} handleChange={handleChange} />
                <DateField label="Exam Date *" name="examDate" value={formData.examDate} handleChange={handleChange} />
                <SelectField field={{ name: "examMode", label: "Exam Mode", options: ["Online", "Offline"] }} formData={formData} handleChange={handleChange} />
                
                <label className="flex items-center gap-3 font-medium text-gray-700">
                  <input type="checkbox" name="applyKit" checked={formData.applyKit} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                  Apply for Kit? {/* Toggles totalFee dynamically */}
                </label>

                <TextField label="Total Fee (Rs.) *" name="totalFee" type="number" value={formData.totalFee} handleChange={handleChange} />
                <TextField label="Course Duration *" name="duration" value={formData.duration} handleChange={handleChange} />
              </div>

              {/* Document Upload */}
              <SectionTitle title="Documents Upload" />
              <div className="grid md:grid-cols-3 gap-6">
                <FileField label="Upload Student Photo (Max 300 KB)" name="studentPhoto" handleChange={handleChange} />
                <FileField label="Upload Identity Proof (Max 300 KB)" name="idProof" handleChange={handleChange} />
                <FileField label="Upload Education Proof (Max 300 KB)" name="eduProof" handleChange={handleChange} />
              </div>

              {/* Error Display */}
              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md border border-red-300">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-all shadow disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button 
                  type="button" 
                  onClick={handleReset} 
                  disabled={loading}
                  className="bg-gray-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow disabled:opacity-50"
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

// Reusable components (unchanged)
function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-500 pl-3 mb-4">{title}</h2>
  );
}

function TextField({ label, name, handleChange, value, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function SelectField({ field, formData, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
      <select
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        required={field.label.includes("*")}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select</option>
        {field.options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({ label, name, handleChange, value }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function FileField({ label, name, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <input
        type="file"
        name={name}
        accept="image/*,.pdf"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
      />
    </div>
  );
}