import React, { useState } from "react";
import Swal from "sweetalert2";
import topImage from "../assets/images/Course9.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE = import.meta.env.VITE_API_URL;

function DownloadAdmitCard() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!rollNo.trim() || !dob) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please enter both Roll Number and Date of Birth.",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE}/students/verify-download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rollNo: rollNo.trim().toUpperCase(),
        dob: dob,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Student not found");
    }

    const studentId = result.data._id;

    const pdfResponse = await fetch(`${API_BASE}/students/${studentId}/admit-pdf`);
    if (!pdfResponse.ok) {
      throw new Error("Admit Card not generated yet or server error");
    }

    const blob = await pdfResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Admit-Card_${result.data.rollNo}_${result.data.studentName || "Student"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Downloaded Successfully!",
      text: `Admit Card for ${result.data.studentName} (${result.data.rollNo})`,
      timer: 5000,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
    });

  } catch (err) {
    console.error("Download error:", err);
    Swal.fire({
      icon: "error",
      title: "Download Failed",
      text: err.message.includes("not found") || err.message.includes("No results")
        ? "No student found with this Roll No and DOB."
        : "Admit Card not ready or server error. Please contact admin.",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative w-full h-64">
          <img
            src={topImage}
            alt="Download Admit Card"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Download Admit Card
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <section className="flex justify-center items-center py-16 px-4">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-red-600 mb-8">
              Enter Details to Download Admit Card
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Roll Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ROLL-2025-001"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-red-200 focus:border-red-500 focus:outline-none uppercase text-lg font-medium"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-4 focus:ring-red-200 focus:border-red-500 focus:outline-none"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3.5 rounded-lg shadow-lg transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Admit Card...
                  </>
                ) : (
                  "Download Admit Card"
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default DownloadAdmitCard;