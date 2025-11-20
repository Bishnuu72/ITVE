import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function UpdateStudent() {
  const { id } = useParams(); // Get student ID from URL
  const navigate = useNavigate();

  // Form state (pre-filled with fetched data)
  const [formData, setFormData] = useState({
    // Admin fields
    studentStatus: "Active",
    admitIssued: "No",
    marksheetIssued: "No",
    certificateIssued: "No",
    semesterIssued: "None Semester",
    updateMarks: "No",
    sendingByMail: "No",
    orderStatus: "Certificate Not Print",
    
    // Registration
    center: "", // Will hold _id or name
    enrollmentNo: "",
    rollNo: "",
    
    // Student Details
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    mobile: "",
    religion: "",
    category: "",
    
    // Address
    address: "",
    state: "",
    district: "",
    country: "India",
    pin: "",
    
    // Course
    admissionDate: "",
    course: "", // Will hold _id or name
    issueDate: "",
    examDate: "",
    examMode: "Online",
    applyKit: false,
    totalFee: "",
    duration: "",
    // Hidden for dynamic fees
    regFeeWithoutKit: "",
    regFeeWithKit: "",
    
    // Files (existing paths or new)
    studentPhoto: null,
    idProof: null,
    eduProof: null,
  });

  // Store original data for reset
  const [originalData, setOriginalData] = useState(null);

  // Lists for dropdowns
  const [courses, setCourses] = useState([]);
  const [centres, setCentres] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch courses, centres, and student on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch courses and centres first
        const [courseResponse, centreResponse] = await Promise.all([
          fetch(`${API_BASE}/courses`),
          fetch(`${API_BASE}/centres`),
        ]);

        if (!courseResponse.ok) throw new Error("Failed to fetch courses");
        if (!centreResponse.ok) throw new Error("Failed to fetch centres");

        const { data: courseData } = await courseResponse.json();
        const centreData = await centreResponse.json(); // Direct array

        setCourses(courseData || []);
        setCentres(centreData || []);
        console.log("🔍 Fetched centres for update:", centreData);

        // Then fetch student
        if (id) {
          await fetchStudent(courseData, centreData); // Pass lists for matching
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load courses, centres, or student. Please refresh.");
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  // Fetch and pre-fill student data (with course/center matching)
  const fetchStudent = async (fetchedCourses = [], fetchedCentres = []) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE}/students/${id}`);
      const data = await response.json();
      console.log("🔍 Fetched student:", data);

      if (response.ok && data.data) {
        const student = data.data;
        let updatedFormData = {
          studentStatus: student.studentStatus || "Active",
          admitIssued: student.admitIssued || "No",
          marksheetIssued: student.marksheetIssued || "No",
          certificateIssued: student.certificateIssued || "No",
          semesterIssued: student.semesterIssued || "None Semester",
          updateMarks: student.updateMarks || "No",
          sendingByMail: student.sendingByMail || "No",
          orderStatus: student.orderStatus || "Certificate Not Print",
          center: student.center || "",
          enrollmentNo: student.enrollmentNo || "",
          rollNo: student.rollNo || "",
          studentName: student.studentName || "",
          fatherName: student.fatherName || "",
          motherName: student.motherName || "",
          dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
          gender: student.gender || "",
          mobile: student.mobile || "",
          religion: student.religion || "",
          category: student.category || "",
          address: student.address || "",
          state: student.state || "",
          district: student.district || "",
          country: student.country || "India",
          pin: student.pin || "",
          admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : "",
          course: student.course || "",
          issueDate: student.issueDate ? new Date(student.issueDate).toISOString().split('T')[0] : "",
          examDate: student.examDate ? new Date(student.examDate).toISOString().split('T')[0] : "",
          examMode: student.examMode || "Online",
          applyKit: student.applyKit === true || student.applyKit === "true", // Boolean conversion
          totalFee: student.totalFee || "",
          duration: student.duration || "",
          regFeeWithoutKit: "",
          regFeeWithKit: "",
          studentPhoto: student.studentPhoto || null, // Existing path
          idProof: student.idProof || null,
          eduProof: student.eduProof || null,
        };

        // NEW: Match course name to _id and auto-set fees/duration
        if (student.course && fetchedCourses.length > 0) {
          const fullLabel = student.course; // e.g., "Diploma in IT (IT101)"
          const matchedCourse = fetchedCourses.find(c => `${c.name} (${c.code})` === fullLabel);
          if (matchedCourse) {
            updatedFormData.course = matchedCourse._id;
            updatedFormData.duration = matchedCourse.duration || "";
            updatedFormData.regFeeWithoutKit = matchedCourse.regFeeWithoutKit || "0";
            updatedFormData.regFeeWithKit = matchedCourse.regFeeWithKit || "0";
            // Set initial totalFee based on applyKit
            updatedFormData.totalFee = updatedFormData.applyKit 
              ? updatedFormData.regFeeWithKit 
              : updatedFormData.regFeeWithoutKit;
            console.log(`🔍 Matched course _id: ${matchedCourse._id}, fees set`);
          } else {
            console.warn(`🔍 Course match failed for "${fullLabel}" - using stored name`);
            // Keep as name; user can re-select
          }
        }

        // NEW: Match center name to _id
        if (student.center && fetchedCentres.length > 0) {
          const fullLabel = student.center; // e.g., "Delhi Centre (DEL)"
          const matchedCentre = fetchedCentres.find(c => `${c.name} (${c.code})` === fullLabel);
          if (matchedCentre) {
            updatedFormData.center = matchedCentre._id;
            console.log(`🔍 Matched centre _id: ${matchedCentre._id}`);
          } else {
            console.warn(`🔍 Centre match failed for "${fullLabel}" - using stored name`);
            // Keep as name; user can re-select
          }
        }

        setFormData(updatedFormData);
        setOriginalData(updatedFormData); // For reset
      } else {
        setError(data.error || "Failed to fetch student");
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Fetch error:", err);
      // Reset to defaults on error
      setFormData({
        // ... defaults as in initial state
        studentStatus: "Active",
        admitIssued: "No",
        marksheetIssued: "No",
        certificateIssued: "No",
        semesterIssued: "None Semester",
        updateMarks: "No",
        sendingByMail: "No",
        orderStatus: "Certificate Not Print",
        center: "",
        enrollmentNo: "",
        rollNo: "",
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0] || prev[name] // Preserve existing path if no new file
          : value,
    }));
    setError("");
  };

  // Handle course change (auto-set duration/fees)
  const handleCourseChange = (e) => {
    const selectedValue = e.target.value; // _id
    setFormData((prev) => ({ 
      ...prev, 
      course: selectedValue,
      duration: "",
      totalFee: "",
      regFeeWithoutKit: "",
      regFeeWithKit: "",
    }));

    if (selectedValue) {
      const selectedCourse = courses.find((c) => c._id === selectedValue);
      if (selectedCourse) {
        setFormData((prev) => ({ 
          ...prev,
          duration: selectedCourse.duration || "",
          regFeeWithoutKit: selectedCourse.regFeeWithoutKit || "0",
          regFeeWithKit: selectedCourse.regFeeWithKit || "0",
          totalFee: selectedCourse.regFeeWithoutKit || "0", // Initial: without kit
        }));
      }
    }
  };

  // Dynamic totalFee based on applyKit
  useEffect(() => {
    if (formData.course && (formData.regFeeWithoutKit !== "" || formData.regFeeWithKit !== "")) {
      const feeToUse = formData.applyKit ? formData.regFeeWithKit : formData.regFeeWithoutKit;
      setFormData((prev) => ({ ...prev, totalFee: feeToUse }));
      console.log(`🔍 Updated totalFee (update): ${formData.applyKit ? 'With Kit' : 'Without Kit'} = ${feeToUse}`);
    } else {
      setFormData((prev) => ({ ...prev, totalFee: formData.totalFee || "" })); // Preserve if no course
    }
  }, [formData.course, formData.applyKit, formData.regFeeWithoutKit, formData.regFeeWithKit]);

  // Validation (same as AddStudent)
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const submitData = new FormData();

    // Handle course and center - send names/labels
    let courseNameToSend = formData.course; // Fallback
    let centerNameToSend = formData.center; // Fallback

    // Lookup course
    if (formData.course) {
      const isId = formData.course.length > 10; // Rough check: _id vs name
      if (isId) {
        const selectedCourse = courses.find((c) => c._id === formData.course);
        if (selectedCourse) {
          courseNameToSend = `${selectedCourse.name} (${selectedCourse.code})`;
          console.log(`🔍 Sending course name (update): "${courseNameToSend}" (ID: ${formData.course})`);
        }
      } else {
        courseNameToSend = formData.course; // Already name
      }
    }

    // Lookup center
    if (formData.center) {
      const isId = formData.center.length > 10;
      if (isId) {
        const selectedCentre = centres.find((c) => c._id === formData.center);
        if (selectedCentre) {
          centerNameToSend = `${selectedCentre.name} (${selectedCentre.code})`;
          console.log(`🔍 Sending center name (update): "${centerNameToSend}" (ID: ${formData.center})`);
        }
      } else {
        centerNameToSend = formData.center; // Already name
      }
    }

    // Append non-file fields (skip hidden/original course/center)
    Object.keys(formData).forEach((key) => {
      if (key !== "studentPhoto" && key !== "idProof" && key !== "eduProof" && 
          key !== "regFeeWithoutKit" && key !== "regFeeWithKit" && 
          key !== "course" && key !== "center") {
        const value = formData[key];
        if (typeof value === "string") {
          submitData.append(key, value.trim());
        } else {
          submitData.append(key, value);
        }
      }
    });

    // Append course/center as names
    submitData.append("course", courseNameToSend);
    submitData.append("center", centerNameToSend);

    // Append new files only
    if (formData.studentPhoto && formData.studentPhoto instanceof File) {
      submitData.append("studentPhoto", formData.studentPhoto);
      console.log("📸 Appending new studentPhoto:", formData.studentPhoto.name);
    } else if (formData.studentPhoto) {
      console.log("📸 Keeping existing studentPhoto:", formData.studentPhoto);
    }

    if (formData.idProof && formData.idProof instanceof File) {
      submitData.append("idProof", formData.idProof);
      console.log("📄 Appending new idProof:", formData.idProof.name);
    } else if (formData.idProof) {
      console.log("📄 Keeping existing idProof:", formData.idProof);
    }

    if (formData.eduProof && formData.eduProof instanceof File) {
      submitData.append("eduProof", formData.eduProof);
      console.log("📄 Appending new eduProof:", formData.eduProof.name);
    } else if (formData.eduProof) {
      console.log("📄 Keeping existing eduProof:", formData.eduProof);
    }

    // Log FormData
    console.log("🔍 Updating FormData - Keys:", Array.from(submitData.keys()));
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value.name ? `File (${value.name})` : `"${value}"`);
    }

    try {
      const response = await fetch(`${API_BASE}/students/${id}`, {
        method: "PUT",
        body: submitData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${result.message} (ID: ${result.data._id})`);
        fetchStudent(courses, centres); // Refresh with lists for re-matching
        navigate("/all-students");
      } else {
        console.error("Backend Error Response:", result);
        setError(result.error || `Failed to update student. Status: ${response.status}`);
      }
    } catch (err) {
      setError("Network error. Check if server is running on port 4000.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
    } else {
      fetchStudent(courses, centres);
    }
    setError("");
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-300 text-center">
              {error}
              <button onClick={() => fetchStudent(courses, centres)} className="ml-2 underline">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-blue-600 inline-block pb-2">
            Update Student Details
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
                {/* Centre Dropdown (populated, _id internal, name sent) */}
                <SelectField 
                  field={{ 
                    name: "center", 
                    label: "Centre *", 
                    options: centres.length > 0 
                      ? centres.map(c => ({ value: c._id, label: `${c.name} (${c.code})` })) 
                      : [{ value: "", label: "No centres available" }] 
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
                {/* Course Dropdown (populated, auto-set on change) */}
                <SelectField 
                  field={{ 
                    name: "course", 
                    label: "Select Course *", 
                    options: courses.length > 0 ? courses.map(c => ({ value: c._id, label: `${c.name} (${c.code})` })) : [{ value: "", label: "No courses available" }] 
                  }} 
                  formData={formData} 
                  handleChange={handleCourseChange} // Custom for auto-set
                />
                <DateField label="Date of Issue" name="issueDate" value={formData.issueDate} handleChange={handleChange} />
                <DateField label="Exam Date" name="examDate" value={formData.examDate} handleChange={handleChange} />
                <SelectField field={{ name: "examMode", label: "Exam Mode", options: ["Online", "Offline"] }} formData={formData} handleChange={handleChange} />
                
                <label className="flex items-center gap-3 font-medium text-gray-700">
                  <input type="checkbox" name="applyKit" checked={formData.applyKit} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                  Apply for Kit? {/* Toggles totalFee dynamically */}
                </label>

                <TextField label="Total Fee (Rs.) *" name="totalFee" type="number" value={formData.totalFee} handleChange={handleChange} min="0" />
                <TextField label="Course Duration *" name="duration" value={formData.duration} handleChange={handleChange} />
              </div>

              {/* Document Upload */}
              <SectionTitle title="Documents Upload" />
              <div className="grid md:grid-cols-3 gap-6">
                <FileField label="Upload Student Photo (Max 300 KB)" name="studentPhoto" handleChange={handleChange} currentFile={formData.studentPhoto} />
                <FileField label="Upload Identity Proof (Max 300 KB)" name="idProof" handleChange={handleChange} currentFile={formData.idProof} />
                <FileField label="Upload Education Proof (Max 300 KB)" name="eduProof" handleChange={handleChange} currentFile={formData.eduProof} />
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
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Student"}
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

// Reusable Components (Updated SelectField for label/value objects)
function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-3 mb-4">{title}</h2>
  );
}

function TextField({ label, name, handleChange, value, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={handleChange}
        required={required}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

function DateField({ label, name, handleChange, value, required = false }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type="date"
        name={name}
        value={value || ""}
        onChange={handleChange}
        required={required}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FileField({ label, name, handleChange, currentFile }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      {currentFile && typeof currentFile === "string" && (
        <div className="mb-2 text-sm text-blue-600">
          Current: <a href={`${API_BASE_URL}${currentFile}`} target="_blank" rel="noreferrer">View</a>
        </div>
      )}
      <input
        type="file"
        name={name}
        accept="image/*,.pdf"
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />
    </div>
  );
}