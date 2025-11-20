import React from "react";
import topImage from "../assets/images/Course3.JPG"; // replace with your banner image
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
export default function AffiliationProcess() {
  return (
    <>
 <Navbar />
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 Top Image Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={topImage}
          alt="Affiliation Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            ITVE Affiliation Process
          </h1>
          <p className="text-white mt-3 text-lg">
            Partner with ITVE — Empowering Skills, Shaping Futures
          </p>
        </div>
      </div>

      {/* 🔹 Why Choose ITVE */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-8">
          Why Choose ITVE?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              🌟 Excellence in Vocational Education
            </h3>
            <p className="text-gray-700 mb-4">
              ITVE (Information Technology & Vocational Education) is a
              recognized training body dedicated to empowering individuals with
              industry-relevant skills. We bridge the gap between education and
              employability through technology-driven training programs.
            </p>
            <h3 className="text-xl font-semibold mb-3">🏫 Nationwide Network</h3>
            <p className="text-gray-700 mb-4">
              Our centers across India provide standardized training, advanced
              learning infrastructure, and certified instructors to ensure
              consistent quality education.
            </p>
            <h3 className="text-xl font-semibold mb-3">
              💼 Career-Focused Curriculum
            </h3>
            <p className="text-gray-700">
              Our curriculum aligns with the latest industry standards in IT,
              digital literacy, and vocational skills — preparing students for
              real-world opportunities.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-center text-red-500">
              Key Benefits of Becoming an ITVE Partner
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✅ Recognition as an Authorized ITVE Training Center</li>
              <li>✅ Access to updated course materials and online resources</li>
              <li>✅ Marketing & branding support from ITVE HQ</li>
              <li>✅ Student management and certification portal access</li>
              <li>✅ Regular quality audits and performance support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔹 Affiliation Process Steps */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
            Steps for Affiliation
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "Step 1",
                title: "Apply Online",
                desc: "Submit the affiliation application form with your institution details through our website.",
              },
              {
                step: "Step 2",
                title: "Document Verification",
                desc: "ITVE team reviews your documents, infrastructure, and staff qualifications.",
              },
              {
                step: "Step 3",
                title: "Center Inspection",
                desc: "Our representative inspects your center to ensure it meets ITVE standards.",
              },
              {
                step: "Step 4",
                title: "Approval & Training",
                desc: "Once approved, you’ll receive training and official affiliation certificate.",
              },
              {
                step: "Step 5",
                title: "Portal Access",
                desc: "Your center will get access to the ITVE online portal for student management.",
              },
              {
                step: "Step 6",
                title: "Start Operations",
                desc: "Begin offering ITVE-certified courses and contribute to skill development.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="text-red-500 font-bold mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA Section */}
      <section className="bg-red-500 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Join the ITVE Network?
        </h2>
        <p className="mb-6">
          Be part of a growing ecosystem that promotes digital and vocational
          excellence across India.
        </p>
        <button className="bg-white text-red-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition">
          Apply for Affiliation
        </button>
      </section>
    </div>
      <Footer />
</>
  );
}
