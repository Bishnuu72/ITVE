import React, { useState } from "react";
import Swal from "sweetalert2";
import topImage from "../assets/images/Course9.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

function CertificateVerify() {
  const [certificateNo, setCertificateNo] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [type, setType] = useState(""); // "certificate" or "marksheet"
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateNo.trim() || !enrollmentNo.trim() || !type) {
      Swal.fire("Error", "Please fill all fields and select document type", "warning");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/students/verify-document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateNo: certificateNo.trim().toUpperCase(),
          enrollmentNo: enrollmentNo.trim().toUpperCase(),
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Document not found");
      }

      setResult(data.data);

      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: `${type === "certificate" ? "Certificate" : "Marksheet"} is Genuine`,
        timer: 4000,
        toast: true,
        position: "top-end"
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Not Verified",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="relative w-full h-64">
          <img src={topImage} alt="Verification" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
              Certificate & Marksheet Verification
            </h1>
          </div>
        </div>

        {/* Form */}
        <section className="flex justify-center items-center py-16 px-4">
          <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
              Verify Document Authenticity
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {type === "certificate" ? "Certificate No *" : type === "marksheet" ? "Marksheet No *" : "Certificate / Marksheet No *"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. CERT-2025-001"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value.toUpperCase())}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg font-medium uppercase"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Enrollment No *</label>
                <input
                  type="text"
                  placeholder="e.g. ENR-2025-001"
                  value={enrollmentNo}
                  onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase())}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none text-lg font-medium uppercase"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="certificate"
                    checked={type === "certificate"}
                    onChange={(e) => setType(e.target.value)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-lg font-medium">Certificate</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="marksheet"
                    checked={type === "marksheet"}
                    onChange={(e) => setType(e.target.value)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-lg font-medium">Marksheet</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify Document"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Result Display */}
        {result && (
          <section className="max-w-2xl mx-auto px-4 pb-20">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-500">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-10 text-center">
                <h2 className="text-5xl font-bold">GENUINE DOCUMENT</h2>
                <p className="text-2xl mt-4">This {result.type === "certificate" ? "Certificate" : "Marksheet"} is 100% Authentic</p>
              </div>

              <div className="p-10">
                <div className="text-center mb-8">
                  {result.studentPhoto ? (
                    <img src={`${API_BASE_URL}/uploads/${result.studentPhoto}`} alt="Student" className="w-32 h-32 rounded-full mx-auto border-8 border-green-500 object-cover" />
                  ) : (
                    <div className="w-32 h-32 bg-green-100 rounded-full mx-auto flex items-center justify-center text-5xl font-bold text-green-700">
                      {result.studentName.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-3xl font-bold mt-6">{result.studentName}</h3>
                  <p className="text-xl text-gray-600">Roll No: {result.rollNo}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 text-lg font-medium">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-gray-600">Enrollment No</p>
                    <p className="text-2xl font-bold text-red-600">{result.enrollmentNo}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-gray-600">{result.type === "certificate" ? "Certificate No" : "Marksheet No"}</p>
                    <p className="text-2xl font-bold text-red-600">{result.type === "certificate" ? result.certificateNo : result.marksheetNo}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-gray-600">Course</p>
                    <p className="text-xl font-bold">{result.course}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-gray-600">Center</p>
                    <p className="text-xl font-bold">{result.center}</p>
                  </div>
                </div>

                <div className="mt-10 text-center">
                  <p className="text-3xl font-bold text-green-600">✓ VERIFIED & AUTHENTIC</p>
                  <p className="text-gray-600 mt-2">Issued by Official Authority</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CertificateVerify;