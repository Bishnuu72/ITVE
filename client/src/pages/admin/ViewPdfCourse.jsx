import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import jsPDF from "jspdf"; // For PDF generation (install: npm install jspdf)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api`;

export default function ViewPdfCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false); // ✅ NEW: Loading for PDF
  const navigate = useNavigate();

  // Fetch course detail
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/courses/${id}`);
        if (!response.ok) throw new Error("Failed to fetch course");
        const { data } = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
        alert(`❌ Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // ✅ UPDATED: Generate and download PDF (with photo & table)
  const downloadPDF = async () => {
    if (!course) return;
    setGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      let y = 20;

      // Header
      doc.setFontSize(20);
      doc.text("Course Details", 20, y);
      y += 20;

      // Photo (if exists)
      if (course.photo) {
        try {
          const photoResponse = await fetch(`${API_BASE_URL}${course.photo}`);
          const photoBlob = await photoResponse.blob();
          const photoUrl = URL.createObjectURL(photoBlob);
          doc.addImage(photoUrl, 'JPEG', 20, y, 50, 50); // Embed photo
          URL.revokeObjectURL(photoUrl);
          y += 60;
        } catch (imgErr) {
          console.warn("⚠️ Could not embed photo in PDF:", imgErr);
          y += 10; // Skip space
        }
      }

      // Course info (2-column layout)
      doc.setFontSize(12);
      const info = [
        `Course Name: ${course.name}`,
        `Short Name: ${course.shortName}`,
        `Course Code: ${course.code}`,
        `Duration: ${course.duration}`,
        `Course Type: ${course.type}`,
        `Eligibility: ${course.eligibility}`,
        `Category: ${course.categoryType?.name || 'N/A'}`,
        `Total Subjects: ${course.totalSubjects}`,
        `Reg Fee Without KIT: Rs. ${course.regFeeWithoutKit}`,
        `Reg Fee With KIT: Rs. ${course.regFeeWithKit}`,
        `Exam Question Papers: ${course.examQuestionPapers}`,
        `Semester: ${course.semester}`,
        `Semester Type: ${course.semesterType}`,
      ];
      info.forEach((text, idx) => {
        const col = idx % 2 === 0 ? 20 : 110; // 2 columns
        const row = Math.floor(idx / 2);
        doc.text(text, col, y + (row * 10));
      });
      y += Math.ceil(info.length / 2) * 10 + 10;

      // Details
      doc.text("Details:", 20, y);
      y += 10;
      const detailsLines = doc.splitTextToSize(course.details, 170);
      doc.text(detailsLines, 20, y);
      y += detailsLines.length * 5 + 10;

      // Subjects Table
      if (course.subjects && course.subjects.length > 0) {
        doc.text("Subject Details", 20, y);
        y += 10;

        // Table headers
        doc.setFont("helvetica", "bold");
        doc.text("Sl No", 20, y);
        doc.text("Subject Name", 40, y);
        doc.text("Full Marks", 140, y);
        y += 10;

        // Table borders (simple)
        doc.line(20, y - 5, 190, y - 5); // Top line
        doc.line(20, y - 5, 20, y + (course.subjects.length * 7)); // Left
        doc.line(40, y - 5, 40, y + (course.subjects.length * 7)); // Subject col
        doc.line(140, y - 5, 140, y + (course.subjects.length * 7)); // Marks col
        doc.line(190, y - 5, 190, y + (course.subjects.length * 7)); // Right

        // Table rows
        doc.setFont("helvetica", "normal");
        course.subjects.forEach((s, idx) => {
          if (y > 270) { // Page break
            doc.addPage();
            y = 20;
          }
          doc.text(`${idx + 1}`, 25, y);
          const subjectLines = doc.splitTextToSize(s.name, 90);
          doc.text(subjectLines, 45, y);
          doc.text(`${s.fullMarks}`, 145, y);
          y += 7;
        });

        // Bottom border
        doc.line(20, y - 2, 190, y - 2);
        y += 10;
      }

      // Footer
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y);

      doc.save(`${course.name}_details.pdf`);
    } catch (err) {
      alert(`❌ PDF generation failed: ${err.message}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Print page
  const printPDF = () => {
    window.print();
  };

  // ✅ NEW: Photo Error Handler (for screen preview)
  const handlePhotoError = (e) => {
    e.target.style.display = "none";
    const parent = e.target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="w-48 h-48 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-500">No Photo</div>';
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error || !course) return <div className="p-6 text-center text-red-500">Error: {error || "Course not found"}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl border border-gray-200 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-1">
                Course PDF - {course.name}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={printPDF}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={generatingPDF}
                >
                  🖨️ Print
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                  disabled={generatingPDF}
                >
                  {generatingPDF ? "Generating..." : "📥 Download PDF"}
                </button>
                <button
                  onClick={() => navigate(-1)} // ✅ UPDATED: Explicit back to detail
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Print-Friendly Content (Hidden on screen, shown on print) */}
            <div className="print:hidden mb-6 flex justify-center gap-2">
              <p className="text-sm text-gray-600">Use Print or Download for PDF.</p>
            </div>

            {/* ✅ NEW: Photo Preview (Screen Only) */}
            {course.photo && (
              <div className="mb-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Course Photo:</h3>
                <img
                  src={`${API_BASE_URL}${course.photo}`}
                  alt="Course Photo"
                  className="w-48 h-48 object-cover rounded-md mx-auto shadow-md"
                  onError={handlePhotoError}
                />
              </div>
            )}

            {/* A4 Print Layout */}
            <div className="print-content hidden print:block print:w-[210mm] print:h-[297mm] print:mx-auto print:bg-white print:shadow-none print:border-none print:p-0">
              <div className="print:p-20 print:text-left">
                <h1 className="print:text-3xl print:font-bold print:text-center print:mb-8 print:border-b print:pb-4">Course Details</h1>
                
                <div className="print:grid print:grid-cols-2 print:gap-8 print:text-sm">
                  <div>
                    <p><strong>Course Name:</strong> {course.name}</p>
                    <p><strong>Short Name:</strong> {course.shortName}</p>
                    <p><strong>Course Code:</strong> {course.code}</p>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Course Type:</strong> {course.type}</p>
                    <p><strong>Eligibility:</strong> {course.eligibility}</p>
                    <p><strong>Category:</strong> {course.categoryType?.name || "—"}</p>
                  </div>

                  <div>
                    <p><strong>Total Subjects:</strong> {course.totalSubjects}</p>
                    <p><strong>Reg Fee Without KIT:</strong> Rs. {course.regFeeWithoutKit}</p>
                    <p><strong>Reg Fee With KIT:</strong> Rs. {course.regFeeWithKit}</p>
                    <p><strong>Exam Question Papers:</strong> {course.examQuestionPapers}</p>
                    <p><strong>Semester ?:</strong> {course.semester}</p>
                    <p><strong>Semester Type:</strong> {course.semesterType}</p>
                  </div>
                </div>

                <div className="print:mt-8 print:mb-6">
                  <h3 className="print:text-xl print:font-semibold print:mb-4 print:border-b print:pb-2">Details:</h3>
                  <p className="print:text-gray-700 print:whitespace-pre-wrap">{course.details}</p>
                </div>

                {/* Subjects Table */}
                <div className="print:mt-10">
                  <h3 className="print:text-xl print:font-semibold print:mb-4 print:border-b print:pb-2">Subject Details</h3>
                  <table className="print:w-full print:border-collapse print:border print:text-sm">
                    <thead className="print:bg-gray-800 print:text-white">
                      <tr>
                        <th className="print:p-2 print:border print:text-center print:w-16">Sl No</th>
                        <th className="print:p-2 print:border print:text-left">Subject Name</th>
                        <th className="print:p-2 print:border print:text-center">Full Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.subjects?.map((s, index) => (
                        <tr key={s._id || index} className="print:hover:bg-gray-50">
                          <td className="print:p-2 print:border print:text-center">{index + 1}</td>
                          <td className="print:p-2 print:border">{s.name}</td>
                          <td className="print:p-2 print:border print:text-center">{s.fullMarks}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="3" className="print:p-2 print:border print:text-center print:text-gray-500">No subjects added.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="print:mt-8 print:text-center print:text-sm print:text-gray-500">
                  <p>Generated on: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Screen View (Same as CourseDetail for consistency) */}
            <div className="screen-content print:hidden">
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-800 mb-8">
                <div>
                  <p className="mb-2"><strong>Course Name:</strong> {course.name}</p>
                  <p className="mb-2"><strong>Short Name:</strong> {course.shortName}</p>
                  <p className="mb-2"><strong>Course Code:</strong> {course.code}</p>
                  <p className="mb-2"><strong>Duration:</strong> {course.duration}</p>
                  <p className="mb-2"><strong>Course Type:</strong> {course.type}</p>
                  <p className="mb-2"><strong>Eligibility:</strong> {course.eligibility}</p>
                  <p className="mb-2"><strong>Category:</strong> {course.categoryType?.name || "—"}</p>
                </div>

                <div>
                  <p className="mb-2"><strong>Total Subjects:</strong> {course.totalSubjects}</p>
                  <p className="mb-2"><strong>Reg Fee Without KIT:</strong> Rs. {course.regFeeWithoutKit}</p>
                  <p className="mb-2"><strong>Reg Fee With KIT:</strong> Rs. {course.regFeeWithKit}</p>
                  <p className="mb-2"><strong>Exam Question Papers:</strong> {course.examQuestionPapers}</p>
                  <p className="mb-2"><strong>Semester :</strong> {course.semester}</p>
                  <p className="mb-2"><strong>Semester Type:</strong> {course.semesterType}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Details:</h3>
                <p className="text-gray-700">{course.details}</p>
              </div>

              {/* Subjects Section */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-red-500 inline-block mb-4">
                  Subject Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="border p-2 text-center w-16">Sl No</th>
                        <th className="border p-2 text-left">Subject Name</th>
                        <th className="border p-2 text-center">Full Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.subjects?.map((s, index) => (
                        <tr key={s._id || index} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2">{s.name}</td>
                          <td className="border p-2 text-center">{s.fullMarks}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan="3" className="text-center text-gray-500 py-4">No subjects added.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}