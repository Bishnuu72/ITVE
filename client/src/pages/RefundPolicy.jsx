import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
export default function RefundPolicy() {
  return (
    <>
 <Navbar />
    <section className="bg-gray-50 min-h-screen pb-12">
      {/* ✅ Top Banner Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1600&q=80"
          alt="Refund Policy Banner"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase drop-shadow-lg">
            Refund Policy
          </h1>
          <p className="text-lg mt-2 drop-shadow-md">
            Transparency and fairness in every transaction
          </p>
        </div>
      </div>

      {/* ✅ Main Content Section */}
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-12 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Refund Policy</h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          At <strong>ITVE (Information Technology and Vocational Education)</strong>, we aim
          to provide quality education and training services. To maintain transparency and
          fairness, we have outlined the following refund policy:
        </p>

        {/* 1️⃣ Course Fee Refunds */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">1. Course Fee Refunds</h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Fees paid for short-term certificate courses, training programs, or workshops are{" "}
          <strong>non-refundable</strong> once the course has started or access to study
          materials has been provided.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          In case of cancellation before the course start date, a refund request may be
          considered after deducting a processing fee (usually{" "}
          <strong>10–15%</strong> of the total amount).
        </p>

        {/* 2️⃣ Refund Eligibility */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">2. Refund Eligibility</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Duplicate payment made due to a technical error.</li>
          <li>Course cancellation or rescheduling by ITVE without a suitable alternative.</li>
        </ul>

        {/* 3️⃣ Refund Request Procedure */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          3. Refund Request Procedure
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            All refund requests must be submitted in writing to the official ITVE support
            email within <strong>7 days</strong> of payment.
          </li>
          <li>Proof of payment and valid reason must be provided.</li>
          <li>
            Approved refunds will be processed within{" "}
            <strong>10–15 working days</strong> via the original mode of payment.
          </li>
        </ul>

        {/* 4️⃣ Non-Refundable Items */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">4. Non-Refundable Items</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            Registration charges, study materials, exam fees, or any third-party service
            charges.
          </li>
          <li>
            Fees paid under special promotional or discounted offers are{" "}
            <strong>non-refundable</strong>.
          </li>
        </ul>

        {/* 5️⃣ Disputes & Clarification */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">5. Disputes & Clarification</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          In case of any dispute regarding refunds, the decision of the{" "}
          <strong>ITVE management</strong> shall be final. Legal matters, if any, will fall
          under the jurisdiction of the registered office location.
        </p>

        {/* 📞 Contact Info */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          Contact for Refund Queries
        </h3>
        <p className="text-gray-700 leading-relaxed">
          <strong>Email:</strong> support@itveindia.org <br />
          <strong>Phone:</strong> +91 9507470236 / +91 6226 314459
        </p>
      </div>
    </section>
       <Footer />
</>
  );
}
