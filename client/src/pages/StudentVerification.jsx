import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"; // For popup on "not found"
import topImage from "../assets/images/Course9.JPG"; // replace with your banner image
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE = import.meta.env.VITE_API_URL;

function StudentVerification() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [verifiedData, setVerifiedData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const popupShownRef = useRef(false); // NEW: Ref to prevent multiple popups

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setVerifiedData(null); // Clear previous results
    popupShownRef.current = false; // NEW: Reset popup flag on new submit

    // Basic validation
    if (!rollNo.trim() || !dob) {
      setError("Please enter both Roll Number and Date of Birth.");
      return;
    }

    setIsVerifying(true);

    try {
      // POST to /api/students/verify with JSON body
      const response = await fetch(`${API_BASE}/students/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNo: rollNo.trim().toUpperCase(), // Uppercase for exact backend match
          dob: dob,
        }),
      });

      console.log("🔍 Response status:", response.status); // Debug: Check status

      // FIXED: Read body ONCE with text() for non-ok responses (avoids stream error)
      let responseData;
      if (response.ok) {
        // OK: Parse as JSON
        responseData = await response.json();
      } else {
        // Not OK: Read as text first, then try JSON (handles HTML 404)
        const responseText = await response.text();
        console.error("🔍 Non-OK response body:", responseText.substring(0, 200)); // Log snippet for debug

        try {
          // Try parsing as JSON (backend error)
          responseData = JSON.parse(responseText);
          setError(responseData.message || responseData.error || `Server error: ${response.status}`);
        } catch (parseErr) {
          // Not JSON (e.g., HTML 404 page)
          if (response.status === 404) {
            setError("Verification endpoint not found (404). Check if backend routes are mounted correctly.");
          } else {
            setError(`Server error: ${response.status}. Please try again.`);
          }
        }
        setVerifiedData({ status: "Not Found" }); // Default for errors
        setIsVerifying(false);
        return; // Exit early for non-ok
      }

      // Parse successful JSON response
      console.log("🔍 Backend verification response:", responseData); // Debug log

      if (responseData.success && responseData.data) {
        // Success: Set verified data (removed email)
        setVerifiedData({
          name: responseData.data.studentName || responseData.data.name || "N/A",
          course: responseData.data.course || "N/A",
          center: responseData.data.center || "N/A",
          status: responseData.data.studentStatus || responseData.data.status || "Verified",
          enrollmentNo: responseData.data.enrollmentNo || "N/A",
          rollNo: responseData.data.rollNo || rollNo,
          dob: responseData.data.dob || dob,
          // FIXED: Removed email from mapping
        });
      } else {
        // Backend error (e.g., no match)
        setVerifiedData({ status: "Not Found" });
        setError(""); // FIXED: No inline error for backend no-match – only popup
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Network error. Please check if server is running and try again.");
      setVerifiedData({ status: "Not Found" });
    } finally {
      setIsVerifying(false);
    }
  };

  // FIXED: Show SweetAlert2 popup only ONCE when status changes to "Not Found" (not on every render)
  useEffect(() => {
    if (verifiedData && verifiedData.status === "Not Found" && !popupShownRef.current) {
      popupShownRef.current = true; // Prevent re-trigger
      Swal.fire({
        icon: "warning",
        title: "No Results Found",
        text: "No results for this roll number and DOB. Please check and try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
        timer: 5000, // Auto-close after 5s
        toast: false, // Full popup, not toast
      });
    }
  }, [verifiedData]); // Trigger only when verifiedData changes

  // SweetAlert2 popup function (unchanged)
  const showNotFoundPopup = () => {
    Swal.fire({
      icon: "warning",
      title: "No Results Found",
      text: "No results for this roll number and DOB. Please check and try again.",
      confirmButtonText: "OK",
      confirmButtonColor: "#ef4444",
      timer: 5000, // Auto-close after 5s
      toast: false, // Full popup, not toast
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* 🔹 Banner Section */}
        <div className="relative w-full h-64">
          <img
            src={topImage}
            alt="Verification Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Student Registration Verification
            </h1>
            <p className="text-white/90 mt-2">
              Verify your enrollment details with ITVE
            </p>
          </div>
        </div>

        {/* 🔹 Verification Form */}
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-6">
            Registration Verification
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Roll Number *
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())} // Uppercase for exact backend match
                placeholder="Enter Roll No (e.g. ITVE1001)"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none uppercase"
                required
                disabled={isVerifying}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
                disabled={isVerifying}
              />
            </div>

            {/* FIXED: Error Display (only for validation/network errors; no inline for backend "not found") */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isVerifying}
                  className="ml-2 text-blue-600 underline text-xs hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify Student"}
            </button>
          </form>

          {/* 🔹 Verification Result (no inline "not found" – handled by useEffect popup) */}
          {verifiedData && verifiedData.status !== "Not Found" && (
            <div className="mt-8 p-4 rounded-md border border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ✅ Student Verified
                </h3>
                <p><strong>Name:</strong> {verifiedData.name}</p>
                <p><strong>Course:</strong> {verifiedData.course}</p>
                <p><strong>Center:</strong> {verifiedData.center}</p>
                <p><strong>Enrollment No:</strong> {verifiedData.enrollmentNo}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-semibold ${
                      verifiedData.status === "Verified" || verifiedData.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {verifiedData.status}
                  </span>
                </p>
                <p><strong>Roll No:</strong> {verifiedData.rollNo}</p>
                <p><strong>DOB:</strong> {verifiedData.dob}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentVerification;