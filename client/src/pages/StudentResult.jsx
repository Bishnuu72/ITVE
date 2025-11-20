import React, { useState } from "react";
import Swal from "sweetalert2";
import topImage from "../assets/images/Course7.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

function StudentResult() {
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !dob) {
      Swal.fire("Error", "Please fill both fields", "warning");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/students/verify-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNo: rollNo.trim().toUpperCase(),
          dob,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Student not found");
      }

      setResult(data);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Not Found",
        text: err.message.includes("not found") || err.message.includes("Student not found")
          ? "No student found with this Roll No and DOB"
          : err.message,
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
          <img src={topImage} alt="Result" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
              Student Result
            </h1>
          </div>
        </div>

        {/* Form */}
        <section className="flex justify-center items-center py-16 px-4">
          <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
              Check Your Result
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-red-500 outline-none text-lg uppercase"
                required
                disabled={loading}
              />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-red-500 outline-none"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 rounded-xl shadow-xl transition-all hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? "Searching..." : "Check Result"}
              </button>
            </form>
          </div>
        </section>

        {/* Result Display */}
        {result && result.resultStatus === "NOT_PUBLISHED" && (
          <section className="max-w-2xl mx-auto px-4 pb-20">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-10 text-center">
              <h2 className="text-4xl font-bold text-yellow-800 mb-4">Result Not Published Yet</h2>
              <p className="text-xl text-yellow-700">Dear {result.data.studentName},</p>
              <p className="text-lg text-yellow-600 mt-4">Your result is being processed. Please check back later.</p>
            </div>
          </section>
        )}

        {result && result.resultStatus === "PUBLISHED" && (
          <section className="max-w-5xl mx-auto px-4 pb-20">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className={`p-8 text-center text-white ${result.data.resultStatus === "PASS" ? "bg-gradient-to-r from-green-600 to-green-800" : "bg-gradient-to-r from-red-600 to-red-800"}`}>
                <h2 className="text-5xl font-bold">RESULT</h2>
                <p className="text-3xl mt-4">
                  {result.data.resultStatus === "PASS" ? "🎉 CONGRATULATIONS!" : "Better Luck Next Time"}
                </p>
                <p className="text-6xl font-bold mt-6">{result.data.resultStatus}</p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    {result.data.studentPhoto ? (
                      <img src={`${API_BASE_URL}/uploads/${result.data.studentPhoto}`} alt="Student" className="w-40 h-40 rounded-full mx-auto border-8 border-gray-300 object-cover" />
                    ) : (
                      <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-6xl font-bold text-gray-600">
                        {result.data.studentName.charAt(0)}
                      </div>
                    )}
                    <h3 className="text-3xl font-bold mt-6">{result.data.studentName}</h3>
                    <p className="text-xl text-gray-600">Roll No: {result.data.rollNo}</p>
                  </div>

                  <div className="space-y-6 text-xl">
                    <div className="flex justify-between"><span className="font-bold">Course:</span> {result.data.course}</div>
                    <div className="flex justify-between"><span className="font-bold">Center:</span> {result.data.center}</div>
                    <div className="flex justify-between"><span className="font-bold">Percentage:</span> <span className="text-4xl font-bold text-red-600">{result.data.percentage}%</span></div>
                    <div className="flex justify-between"><span className="font-bold">Grade:</span> <span className="text-4xl font-bold">{result.data.grade}</span></div>
                  </div>
                </div>

                <div className="overflow-x-auto mt-10">
                  <table className="w-full border-collapse text-lg">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border p-4 text-left">Subject</th>
                        <th className="border p-4">Theory</th>
                        <th className="border p-4">Practical</th>
                        <th className="border p-4">Total</th>
                        <th className="border p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.subjects.map((sub, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="border p-4 font-medium">{sub.subjectName}</td>
                          <td className="border p-4 text-center">{sub.theoryObtained}/{sub.theoryMax}</td>
                          <td className="border p-4 text-center">{sub.practicalMax > 0 ? `${sub.practicalObtained}/${sub.practicalMax}` : "-"}</td>
                          <td className="border p-4 text-center font-bold">{sub.totalObtained}/{sub.totalMax}</td>
                          <td className="border p-4 text-center">
                            <span className={`px-4 py-2 rounded-full font-bold ${sub.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {sub.passed ? "PASS" : "FAIL"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-900 text-white font-bold text-xl">
                        <td colSpan="3" className="p-5 text-right">Grand Total</td>
                        <td className="p-5 text-center">{result.data.obtainedMarks}/{result.data.totalMarks}</td>
                        <td className="p-5 text-center">
                          <span className={`px-6 py-3 rounded-full text-xl ${result.data.resultStatus === "PASS" ? "bg-green-600" : "bg-red-600"}`}>
                            {result.data.resultStatus}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default StudentResult;