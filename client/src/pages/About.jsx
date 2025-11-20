import React, { useEffect, useState } from "react";
import { Target, Eye, Phone, Mail } from "lucide-react";
import { getTeamMembers } from "../services/teamService";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

 function About() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamMembers();
        const activeMembers = data.filter(member => member.status === "Active");
        setTeamMembers(activeMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    fetchData();
  }, []);


  return (
    <>
 <Navbar />
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 🔹 HERO SECTION */}
      <div className="relative w-full h-72 md:h-96">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
          alt="ITVE Banner"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0  bg-opacity-40 flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
            WELCOME TO ITVE
          </h1>
          <p className="text-white text-lg mt-3 text-center px-4">
            Information Technology and Vocational Education
          </p>
        </div>
      </div>

      {/* 🔹 ABOUT SECTION */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-red-500 mb-4">About Us</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          ITVE (Information Technology and Vocational Education) is a registered
          organization dedicated to advancing digital literacy, skill development,
          and vocational training across India. Founded with a mission to bridge
          the digital divide and empower individuals with employable skills, ITVE
          focuses on delivering quality education in the fields of Information
          Technology, Digital Services, and Vocational Skill Training.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our goal is to create a sustainable learning ecosystem that supports
          youth, women, and underprivileged communities through accessible,
          practical, and industry-relevant training programs. By integrating modern
          technology with vocational education, we aim to enhance employability,
          entrepreneurship, and lifelong learning.
        </p>

        {/* Registration Info */}
        <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Registration & Certification Details:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              NCT Certificate No.: <strong>IN-DL52188359861807W</strong>
            </li>
            <li>
              Registration No.: <strong>2024/4/IV/814</strong>
            </li>
            <li>
              CSR Reference No.: <strong>SRN-F96492582</strong>
            </li>
            <li>
              NITI Aayog No.: <strong>BR/2024/0430100</strong>
            </li>
            <li>
              Udyam Registration (UAN): <strong>UDYAM-BR-34-0029213</strong>
            </li>
            <li>
              GSTIN: <strong>10AACTI3208CIZK</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* 🔹 OUR MISSION & VISION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="p-6 border-l-4 border-red-500 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-red-500" />
              <h3 className="text-2xl font-bold">OUR MISSION</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To empower individuals through accessible, practical, and
              high-quality education in the fields of Information Technology,
              Digital Services, and Vocational Skills. We are committed to
              bridging the skill gap, promoting digital literacy, and fostering
              self-reliance and entrepreneurship, especially among youth, women,
              and underserved communities across India.
            </p>
          </div>

          <div className="p-6 border-l-4 border-red-500 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="text-red-500" />
              <h3 className="text-2xl font-bold">OUR VISION</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To be a leading force in skill development and digital education,
              building a future-ready, empowered, and inclusive society. Through
              innovation, collaboration, and commitment to excellence, ITVE
              envisions transforming lives and driving socio-economic growth by
              making skill-based education available to all.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 TEAM MEMBERS */}
      <section className="py-12 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-red-500 mb-3">Meet Our Team</h2>
          <p className="text-gray-600">
            Passionate professionals driving ITVE's mission forward.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">{member.description}</p>
                <p className="text-sm text-gray-500 mt-2 flex justify-center items-center gap-1">
                  <Phone className="w-4 h-4 text-red-500" />
                  {member.mobile}
                </p>
                <p className="text-sm text-gray-500 mt-1 flex justify-center items-center gap-1">
                  <Mail className="w-4 h-4 text-red-500" />
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 FACILITIES SECTION */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Training Partners */}
          <div>
            <h3 className="text-2xl font-bold text-red-500 mb-4">
              Facilities For Training Partners
            </h3>
            <ul className="space-y-3 text-gray-700 list-disc pl-5">
              <li>
                Program Development: Help in creating training programs that
                match industry needs.
              </li>
              <li>
                Resources: Provide equipment, materials, and space for training.
              </li>
              <li>
                Certification Support: Help with certifying students’ skills
                after completion.
              </li>
              <li>
                Tech Support: Offer tools and platforms for online or blended
                learning.
              </li>
              <li>
                Industry Connections: Link training partners with businesses for
                job opportunities.
              </li>
              <li>
                Trainer Support: Keep trainers updated with industry trends.
              </li>
              <li>
                Student Monitoring: Track student progress and success after
                training.
              </li>
            </ul>
          </div>

          {/* Students */}
          <div>
            <h3 className="text-2xl font-bold text-red-500 mb-4">
              Facilities For Students
            </h3>
            <ul className="space-y-3 text-gray-700 list-disc pl-5">
              <li>
                Hands-on Learning: Access to workshops and labs with real-world
                equipment.
              </li>
              <li>
                Classrooms & Online Learning: Well-equipped classrooms and
                online options.
              </li>
              <li>
                Career Help: Mentors provide job advice and placement support.
              </li>
              <li>
                Certifications: Official recognition after completing programs.
              </li>
              <li>
                Job Placement: Assistance with job or internship opportunities.
              </li>
              <li>
                Financial Help: Scholarships or payment plans for affordability.
              </li>
              <li>
                Assessments: Regular tests to track progress and maintain
                standards.
              </li>
              <li>
                Soft Skills: Communication, teamwork, and problem-solving
                training.
              </li>
              <li>
                Learning Resources: Books, online tools, and study materials.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔹 BANK DETAILS */}
      <section className="bg-gray-100 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-red-500 mb-6">
            Bank Details
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-md inline-block text-left text-gray-700">
            <p>
              <strong>Bank Name:</strong> Canara Bank
            </p>
            <p>
              <strong>A/C Holder Name:</strong> Information Technology and
              Vocational Education
            </p>
            <p>
              <strong>A/C No.:</strong> 120030082675
            </p>
            <p>
              <strong>IFSC Code:</strong> CNRB0006245
            </p>
            <p>
              <strong>Account Type:</strong> Current A/C
            </p>
          </div>
        </div>
      </section>
    </div>
     <Footer />
</>
  );

}

export default About;
