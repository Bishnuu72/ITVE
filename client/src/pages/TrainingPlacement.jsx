import React from "react";
import topImage from "../assets/images/Course5.JPG"; // Replace with your actual banner image
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
function TrainingPlacement() {
  // ✅ Dummy placement partners
  const partners = [
    { name: "TCS", logo: "https://1000logos.net/wp-content/uploads/2021/06/Tata-Consultancy-Services-logo.png" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Infosys_logo.svg" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Wipro_Primary_Logo_Color_RGB.svg" },
    { name: "HCL", logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/HCL_Technologies_Logo.svg" },
    { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Tech_Mahindra_New_Logo.svg" },
  ];

  // ✅ Dummy success stories
  const alumni = [
    {
      name: "Ravi Kumar",
      position: "Software Developer - TCS",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      quote: "ITVE helped me turn my passion into a profession. The practical training was world-class!",
    },
    {
      name: "Sneha Patel",
      position: "UI/UX Designer - Wipro",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
      quote: "Thanks to ITVE, I secured my dream job with top industry exposure and guidance.",
    },
    {
      name: "Aman Verma",
      position: "Network Engineer - HCL",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      quote: "The placement cell supported me at every step — from interview prep to final offer.",
    },
  ];

  return (
    <>
 <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Banner Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={topImage}
          alt="Training and Placement Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Training & Placement
          </h1>
        </div>
      </div>

      {/* 🔹 Introduction Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold text-red-600 mb-4">
          Empowering Futures Through Skill & Opportunity
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
          At <strong>ITVE (Information Technology & Vocational Education)</strong>, 
          we bridge the gap between education and employment by providing industry-focused 
          training and strong placement assistance. Our mission is to equip students with 
          practical knowledge and connect them with top recruiters across India.
        </p>
      </section>

      {/* 🔹 Key Highlights */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Why Choose ITVE for Training & Placement?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "100% Placement Assistance for Eligible Students",
              "Regular Industry Interaction & Workshops",
              "Soft Skills and Interview Preparation Sessions",
              "Internship Opportunities with Leading Companies",
              "Dedicated Placement Cell for Career Guidance",
              "Corporate Training & Industrial Visits",
            ].map((point, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h4 className="text-lg font-semibold text-red-600 mb-2">★</h4>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 Placement Partners */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Our Placement Partners</h3>
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="w-32 h-20 flex items-center justify-center bg-white border rounded-lg shadow hover:shadow-lg transition p-2"
            >
              <img src={partner.logo} alt={partner.name} className="max-h-12 object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Alumni Success Stories */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Our Successful Alumni
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {alumni.map((student, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-red-500"
                />
                <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
                <p className="text-red-600 text-sm mb-2">{student.position}</p>
                <p className="text-gray-600 italic text-sm">"{student.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
       <Footer />
</>
  );
}

export default TrainingPlacement;
