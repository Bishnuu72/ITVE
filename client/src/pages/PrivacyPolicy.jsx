import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
export default function PrivacyPolicy() {
  return (
    <>
 <Navbar />
    <section className="bg-gray-50 min-h-screen pb-12">
      {/* ✅ Top Banner Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1600&q=80"
          alt="Privacy Policy Banner"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-lg mt-2 drop-shadow-md">
            Your privacy, our responsibility
          </p>
        </div>
      </div>

      {/* ✅ Main Content Section */}
      <div className="container mx-auto px-6 md:px-16 lg:px-24 py-12 bg-white shadow-lg rounded-2xl mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Policy</h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          At <strong>ITVE (Information Technology and Vocational Education)</strong>, we are
          committed to protecting the privacy and personal information of our students,
          partners, and website visitors. This policy outlines how we collect, use, and
          safeguard your data.
        </p>

        {/* 1️⃣ Information We Collect */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          1. Information We Collect
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, address, phone number, email ID,
            date of birth, and educational details collected during registration or course
            enrollment.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how users interact with our
            website, learning platforms, and digital services.
          </li>
          <li>
            <strong>Documents:</strong> ID proofs, academic records, and certifications
            submitted for verification and record-keeping.
          </li>
        </ul>

        {/* 2️⃣ How We Use Your Information */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          2. How We Use Your Information
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>To register and verify students.</li>
          <li>To issue certificates and maintain academic records.</li>
          <li>To provide course updates, support, and communication.</li>
          <li>For internal reporting, analytics, and educational improvement.</li>
        </ul>

        {/* 3️⃣ Data Protection & Security */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          3. Data Protection & Security
        </h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            All personal data is stored securely using appropriate technical and
            organizational measures.
          </li>
          <li>Access is restricted to authorized personnel only.</li>
          <li>
            We do not sell, trade, or rent your personal information to third parties.
          </li>
        </ul>

        {/* 4️⃣ Sharing of Information */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">
          4. Sharing of Information
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Information may be shared only with government education bodies or verification
          agencies when required by law or for legitimate verification purposes.
        </p>

        {/* 5️⃣ User Rights */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">5. User Rights</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>You may request access to, correction of, or deletion of your personal data.</li>
          <li>You may opt out of receiving promotional communication at any time.</li>
        </ul>

        {/* 6️⃣ Policy Updates */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">6. Policy Updates</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          ITVE reserves the right to modify this Privacy Policy at any time. Updated
          policies will be published on our official communication channels.
        </p>

        {/* 7️⃣ Contact Us */}
        <h3 className="text-xl font-semibold text-red-700 mb-2">7. Contact Us</h3>
        <p className="text-gray-700 leading-relaxed">
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
