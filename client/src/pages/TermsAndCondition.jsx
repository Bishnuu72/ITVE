import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
export default function TermsAndConditions() {
  return (
    <>
 <Navbar />
    <section className="bg-gray-50 min-h-screen pb-12">
      {/* ✅ Top Banner Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1600&q=80"
          alt="Terms and Conditions Banner"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase drop-shadow-lg">
            Terms and Conditions
          </h1>
          <p className="text-lg mt-2 drop-shadow-md">
            Guidelines and policies governing ITVE certifications
          </p>
        </div>
      </div>

      {/* ✅ Main Content Section */}
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-12 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Terms and Conditions
        </h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          These Terms and Conditions outline the rules, responsibilities, and
          policies governing all courses, certifications, and training programs
          offered by <strong>ITVE (Information Technology and Vocational Education)</strong>.
        </p>

        {/* 1️⃣ Certification Validity */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          1. Certification Validity
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          All certificates issued by ITVE are valid as proof of participation or
          successful completion of a course or training under the organization’s
          standards.
        </p>

        {/* 2️⃣ Non-Transferability */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          2. Non-Transferability
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Certificates issued are non-transferable and valid only for the
          individual whose name appears on the certificate.
        </p>

        {/* 3️⃣ Eligibility Criteria */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          3. Eligibility Criteria
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Candidates must fulfill the required attendance, assignments, and
          performance criteria to be eligible for certification.
        </p>

        {/* 4️⃣ Verification */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">4. Verification</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          All certificates can be verified through ITVE’s official records or
          verification portal (if applicable). Any tampering or duplication will
          render the certificate invalid and may lead to legal action.
        </p>

        {/* 5️⃣ Usage Restrictions */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          5. Usage Restrictions
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Certificates and training content may not be used for commercial
          purposes, resale, or misrepresentation. ITVE reserves the right to
          take necessary action in case of misuse.
        </p>

        {/* 6️⃣ Amendments */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">6. Amendments</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          ITVE reserves the right to revise or update these Terms and Conditions
          without prior notice, in accordance with its policies and applicable
          legal requirements.
        </p>

        {/* 7️⃣ Dispute Resolution */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          7. Dispute Resolution
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Any disputes arising in relation to certification, training, or
          services will be subject to the jurisdiction of the courts located in
          the organization’s registered state.
        </p>

        {/* 8️⃣ Contact & Support */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          8. Contact & Support
        </h3>
        <p className="text-gray-700 leading-relaxed">
          For any queries regarding certifications, verification, or course
          matters, please contact our official support team via the details
          provided below:
        </p>
        <p className="text-gray-700 mt-4 leading-relaxed">
          <strong>Email:</strong> support@itveindia.org <br />
          <strong>Phone:</strong> +91 9507470236 / +91 6226 314459 <br />
          <strong>Address:</strong> ITVE Head Office, Patna, Bihar, India
        </p>
      </div>
    </section>
       <Footer />
</>
  );
}
