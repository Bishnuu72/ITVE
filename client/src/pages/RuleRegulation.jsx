import React, { useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
function RuleRegulation() {
  const contentRef = useRef();

  // 🖨️ Print or Save as PDF
  const handlePrint = () => {
    const printContent = contentRef.current;
    const newWindow = window.open("", "", "width=900,height=650");
    newWindow.document.write(`
      <html>
        <head>
          <title>Rules & Regulations - ITVE</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
            h1, h2, h3 { color: #c53030; }
            ul { margin-left: 20px; }
            li { margin-bottom: 6px; }
            .section-title { font-size: 22px; font-weight: bold; margin-top: 20px; }
            .page-title { text-align: center; font-size: 28px; font-weight: bold; color: #222; margin-bottom: 20px; }
            img { width: 100%; border-radius: 8px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="page-title">Rules & Regulations - ITVE</div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <>
 <Navbar />
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 HERO SECTION */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80"
          alt="Rules and Regulations Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black text-center">
            📘 Rules & Regulations
          </h1>
          <p className="text-black text-lg mt-2 text-center px-4">
            For Students & Training Partner Franchise
          </p>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div ref={contentRef} className="max-w-6xl mx-auto py-12 px-6 space-y-12">
        {/* STUDENT RULES */}
        <section>
          <h2 className="text-3xl font-bold text-red-500 mb-6">
            Rules and Regulations for Computer Institute
          </h2>

          {/* Each section below is formatted properly */}
          {[
            {
              title: "1. General Conduct",
              points: [
                "Students and staff must adhere to the institute's policies and maintain a respectful environment.",
                "Any form of discrimination, harassment, or bullying will not be tolerated.",
                "Eating, drinking, or smoking is strictly prohibited in classrooms and computer labs.",
                "All individuals must wear appropriate attire while on the premises.",
              ],
            },
            {
              title: "2. Attendance and Punctuality",
              points: [
                "Students must attend at least 75% of classes to be eligible for examinations or certifications.",
                "Late entry beyond 10 minutes may result in denied entry.",
                "Attendance must be marked daily through biometric or register systems.",
              ],
            },
            {
              title: "3. Fees and Payment",
              points: [
                "Course fees must be paid as per the admission schedule.",
                "Late payments will attract penalties.",
                "Fees once paid are non-refundable unless specified.",
              ],
            },
            {
              title: "4. Lab Usage",
              points: [
                "Students must log in and out when using lab computers.",
                "Damaging or tampering with hardware/software is prohibited.",
                "Unauthorized software installations are not allowed.",
                "USB drives must be virus scanned before use.",
              ],
            },
            {
              title: "5. Internet and Resources Usage",
              points: [
                "Internet use is limited to academic purposes.",
                "Accessing inappropriate content is strictly prohibited.",
                "Printing is allowed only for approved academic work.",
              ],
            },
            {
              title: "6. Safety and Security",
              points: [
                "Students must safeguard personal belongings.",
                "Follow safety instructions in case of emergencies.",
                "Report any incidents immediately to administration.",
              ],
            },
            {
              title: "7. Examination and Certification",
              points: [
                "Students must fulfill all course requirements for certification.",
                "Plagiarism or cheating leads to disqualification.",
                "Certificates issued only upon successful completion.",
              ],
            },
            {
              title: "8. Disciplinary Actions",
              points: [
                "Violations may result in suspension or expulsion.",
                "Legal action may be taken for property damage or misconduct.",
              ],
            },
            {
              title: "9. Complaints and Grievances",
              points: [
                "Students can file formal complaints for grievances.",
                "All grievances will be addressed promptly.",
              ],
            },
            {
              title: "10. Amendments to Rules",
              points: [
                "The institute reserves the right to modify rules as needed.",
                "Students will be informed of any updates in advance.",
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <ul className="list-disc pl-6 space-y-1">
                {section.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 🔹 FRANCHISE RULES */}
        <section>
          <h2 className="text-3xl font-bold text-red-500 mb-6">
            Rules and Regulations for Training Partner Franchise
          </h2>
          {[
            {
              title: "1. Franchise Agreement and Adherence",
              points: [
                "Franchisees must sign a formal agreement outlining rights and terms.",
                "All franchises must follow the institute’s policies and guidelines.",
                "Agreements are subject to periodic review and renewal.",
              ],
            },
            {
              title: "2. Branding and Identity",
              points: [
                "Use official logos and branding provided by the parent institute.",
                "Unauthorized brand alterations are prohibited.",
                "Marketing materials must be approved before use.",
              ],
            },
            {
              title: "3. Course Delivery and Quality Standards",
              points: [
                "Deliver courses per the parent institute’s curriculum.",
                "Faculty must meet qualification standards.",
                "Regular audits ensure teaching quality.",
              ],
            },
            {
              title: "4. Financial Obligations",
              points: [
                "Pay franchise fees and royalties as scheduled.",
                "Maintain accurate financial records.",
                "Failure to comply may result in penalties or termination.",
              ],
            },
            {
              title: "5. Infrastructure Requirements",
              points: [
                "Maintain adequate labs, classrooms, and student facilities.",
                "Use updated software and equipment.",
                "Periodic inspections will ensure compliance.",
              ],
            },
            {
              title: "6. Student Enrollment and Fees",
              points: [
                "Follow official admission and fee policies.",
                "Seek written approval for any deviations.",
                "Refund policies must align with parent institute rules.",
              ],
            },
            {
              title: "7. Marketing and Promotion",
              points: [
                "Franchisees handle local marketing under brand rules.",
                "Online promotions must align with institute standards.",
                "Misrepresentation of services is strictly prohibited.",
              ],
            },
            {
              title: "8. Reporting and Communication",
              points: [
                "Submit regular reports on enrollment, faculty, and finance.",
                "Maintain continuous communication with headquarters.",
                "Report legal or operational issues immediately.",
              ],
            },
            {
              title: "9. Legal and Ethical Compliance",
              points: [
                "Comply with local laws and ethical practices.",
                "Report legal disputes promptly to the parent institute.",
              ],
            },
            {
              title: "10. Termination and Dispute Resolution",
              points: [
                "Serious violations may lead to termination.",
                "Disputes resolved through mediation or legal terms.",
                "After termination, stop using the brand immediately.",
              ],
            },
            {
              title: "11. Feedback and Support",
              points: [
                "Provide regular feedback to improve operations.",
                "Receive training and support from the parent institute.",
                "Unresolved issues can be escalated to the support team.",
              ],
            },
            {
              title: "12. Amendments",
              points: [
                "Parent institute may update rules as needed.",
                "All changes must be followed upon official notice.",
              ],
            },
          ].map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
              <ul className="list-disc pl-6 space-y-1">
                {section.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {/* 🔹 DOWNLOAD BUTTON */}
      <div className="text-center py-8 bg-gray-100">
        <button
          onClick={handlePrint}
          className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all"
        >
          🖨️ Download / Print Rules as PDF
        </button>
      </div>
    </div>
       <Footer />
</>
  );
}

export default RuleRegulation;
