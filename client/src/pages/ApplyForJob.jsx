import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import topImage from "../assets/images/Course6.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { submitJobApplication } from "../services/jobApplyService";
import { getNotices } from "../services/noticeService";

function ApplyForJob() {
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
    religion: "",
    category: "",
    qualification: "",
    jbceRoll: "",
    email: "",
    mobile: "",
    resume: null,
    applyFor: "",
  });

  const [loading, setLoading] = useState(false);
  const [jobApplyNotices, setJobApplyNotices] = useState([]);
  const [thankfulNotices, setThankfulNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getNotices();
        const jobNotices = data
          .filter(n => n.status === "Active" && n.jobApplyNotice)
          .map(n => n.jobApplyNotice);
        const thanksNotices = data
          .filter(n => n.status === "Active" && n.thankfulNotice)
          .map(n => n.thankfulNotice);
        setJobApplyNotices(jobNotices);
        setThankfulNotices(thanksNotices);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      }
    };

    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await submitJobApplication(formData);
      Swal.fire({
        title: "✅ Application Submitted!",
        text: response.message || "Your job application has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      setFormData({
        fullName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "",
        state: "",
        district: "",
        city: "",
        address: "",
        pincode: "",
        religion: "",
        category: "",
        qualification: "",
        jbceRoll: "",
        email: "",
        mobile: "",
        resume: null,
        applyFor: "",
      });
    } catch (error) {
      console.error("Job submission error:", error);
      Swal.fire({
        title: "❌ Submission Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong! Please try again later.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* 🔹 Top Banner */}
        <div className="relative w-full h-64 md:h-80">
          <img
            src={topImage}
            alt="Apply for Job Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
              Apply For Job
            </h1>
          </div>
        </div>

        {/* 🔸 Job Apply Notice */}
        <div className="w-full py-2 overflow-hidden" style={{ backgroundColor: "#f7cd7f" }}>
          <div
            className="animate-marquee whitespace-nowrap font-bold text-lg md:text-xl"
            style={{ color: "#000000", padding: "10px" }}
          >
            {jobApplyNotices.length > 0 ? (
              jobApplyNotices.map((text, index) => (
                <span key={index} className="mx-4">
                  {text}
                </span>
              ))
            ) : (
              <span>
                🎓 Welcome to ITVE | Fill this form in CAPITAL letters only | Thank you!
              </span>
            )}
          </div>
        </div>


        {/* 🔹 Form Section */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl mt-10 p-6 md:p-10 mb-16">
          <p className="text-center text-gray-700 text-sm mb-6">
            <strong>
              Welcome to ITVE (Information Technology and Vocational Education)
            </strong>
            <br />
            Note: Please fill this form in CAPITAL letters only.
            <br />
            Thank You! An ISO 9001:2015 Certified Institute | The Best Institute
            of Information Technology Education & Development.
            <br />
            <span className="text-red-600">Regd. Under Govt. of India</span>
          </p>

          {/* 🧾 Job Application Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                * Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Father’s Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                * Father’s Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                placeholder="Enter Father Name"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Mother’s Name */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                * Mother’s Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                placeholder="Enter Mother Name"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-semibold mb-1">* D.O.B.</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Gender */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                * Gender
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    required
                  />{" "}
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />{" "}
                  Female
                </label>
              </div>
            </div>

            {/* Address Info */}
            <div>
              <label className="block text-sm font-semibold mb-1">* State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Please Select</option>
                <option>Uttar Pradesh</option>
                <option>Bihar</option>
                <option>Madhya Pradesh</option>
                <option>Delhi</option>
                <option>Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                * District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter District"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">* City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                * Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Pincode"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                * Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Full Address"
                className="w-full border p-2 rounded"
                required
              ></textarea>
            </div>

            {/* Religion & Category */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Religion (धर्म)
              </label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">--Select--</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Sikh</option>
                <option>Christian</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Category (वर्ग)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">--Select--</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </div>

            {/* Qualification */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                * Fully Qualification Details With Experience
              </label>
              <textarea
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter qualification and experience details"
                className="w-full border p-2 rounded"
                required
              ></textarea>
            </div>

            {/* Job Info */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                * JBCE Roll Number
              </label>
              <input
                type="text"
                name="jbceRoll"
                value={formData.jbceRoll}
                onChange={handleChange}
                placeholder="Enter JBCE Roll Number"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                * Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                * Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                * Upload Resume
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                * Apply For?
              </label>
              <select
                name="applyFor"
                value={formData.applyFor}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Please Select</option>
                <option>Teacher</option>
                <option>Call Center</option>
                <option>Data Entry</option>
                <option>Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-10 py-2 rounded-lg hover:bg-red-700 transition"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>

           {/* 🔹 Thankful Notice */}
        <div className="w-full py-2 mt-3 overflow-hidden" style={{ backgroundColor: "#f7cd7f" }}>
          <div
            className="animate-marquee whitespace-nowrap font-bold text-lg md:text-xl"
            style={{ color: "#000000", padding: "10px" }}
          >
            {thankfulNotices.length > 0 ? (
              thankfulNotices.map((text, index) => (
                <span key={index} className="mx-4">
                  {text}
                </span>
              ))
            ) : (
              <span>Thank you!! For Your Patience!! The Contents will be updated soon...</span>
            )}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ApplyForJob;
