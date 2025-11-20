import React from "react";
import topImage from "../assets/images/Course7.JPG"; // Replace with your image
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
function StudentRegistrationProcess() {
  return (
    <>
 <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Banner Section */}
      <div className="relative w-full h-64">
        <img
          src={topImage}
          alt="Student Registration Process"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Student Registration Process
          </h1>
          <p className="text-white/90 mt-2">
            Your journey toward skill development begins here.
          </p>
        </div>
      </div>

      {/* 🔹 Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
        <h2 className="text-2xl font-semibold text-red-600 mb-6 text-center">
          Step-by-Step Registration Guide
        </h2>

        <p className="mb-6 text-justify">
          The student registration process for <strong>Information Technology and
          Vocational Education (ITVE)</strong> is simple, secure, and designed to
          make your enrollment experience smooth and efficient. Prospective
          students can register <strong>online via the official ITVE website</strong> or visit
          the nearest center for in-person assistance.
        </p>

        <ol className="list-decimal list-inside space-y-4">
          <li>
            <strong>Step 1 – Visit the Registration Portal:</strong>  
            Access the ITVE online admission form from the official website or
            center dashboard.
          </li>

          <li>
            <strong>Step 2 – Fill Personal Details:</strong>  
            Enter your full name, date of birth, contact details, and other required
            information in capital letters.
          </li>

          <li>
            <strong>Step 3 – Provide Academic Information:</strong>  
            Mention your educational qualifications, previous institutes, and
            relevant background details.
          </li>

          <li>
            <strong>Step 4 – Choose Your Course:</strong>  
            Select your preferred vocational or technical course according to
            your interests and career goals.
          </li>

          <li>
            <strong>Step 5 – Upload Documents:</strong>  
            Attach the necessary documents such as educational certificates,
            identity proofs, and passport-size photographs.
          </li>

          <li>
            <strong>Step 6 – Submit Application & Pay Fees:</strong>  
            Review your details carefully before submitting the form. Complete
            the payment of the <strong>Online Registration Fee (₹150)</strong>.
          </li>

          <li>
            <strong>Step 7 – Verification & Approval:</strong>  
            The submitted information is verified by the ITVE administrative team.
            You may be invited for an interview or basic assessment to confirm
            course eligibility.
          </li>

          <li>
            <strong>Step 8 – Confirmation of Admission:</strong>  
            Once approved, students receive a <strong>confirmation email or SMS</strong> with
            their course details, center name, and start date.
          </li>

          <li>
            <strong>Step 9 – Orientation & Learning Support:</strong>  
            Attend an introductory session at your ITVE center and start your
            journey with ongoing academic support and practical training.
          </li>
        </ol>

        <div className="mt-10 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Note:
          </h3>
          <p className="text-gray-700">
            Please fill all details in <strong>capital letters only</strong> and ensure that
            all uploaded documents are clear and within the required size limits.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/student-admission"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Apply for Student Registration
          </a>
        </div>
      </section>
    </div>
       <Footer />
</>
  );
}

export default StudentRegistrationProcess;
