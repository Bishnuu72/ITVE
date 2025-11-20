import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Logo from "../../assets/images/Logo.jpg";
import { getAllSettings } from "../../services/settingService";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getAllSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-white text-gray-700 border-t">
      {/* MAIN CONTENT */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-10">
        
        {/* ABOUT SECTION */}
        <div className="text-center md:text-left">
          <img
            src={settings?.logo || "/fallback-logo.png"}
            alt="Site Logo"
            className="h-32 w-32 mx-auto md:mx-0 mb-4 rounded-full border-2 border-gray-200 shadow-md"
          />
          <p className="text-sm leading-relaxed text-justify">
            ITVE (Information Technology and Vocational Education) is a renowned
            organization registered under the Ministry of Corporate Affairs and
            MSME, Government of India. With certifications in ISO 9001:2015, ISO
            21001:2018, and ISO 29993:2017, ITVE stands as a leader in vocational
            training and skill development. We are dedicated to providing
            industry-aligned, high-quality skill-based education, empowering
            individuals nationwide to achieve meaningful careers and lifelong
            success.
          </p>

           {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-6 mt-5">
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 text-2xl transition">
                <i className="fab fa-facebook-f"></i>
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 text-2xl transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 text-2xl transition">
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 text-2xl transition">
                <i className="fab fa-youtube"></i>
              </a>
            )}
          </div>
        </div>

        {/* INFORMATION SECTION */}
        <div className="text-center md:text-left">
          <h3 className="text-gray-900 font-bold text-lg border-b-2 border-gray-300 inline-block mb-3">
            INFORMATION
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><Link to="/about" className="hover:text-red-600">About Us</Link></li>
            <li><Link to="/course-list" className="hover:text-red-600">Courses</Link></li>
            <li><Link to="/center-list" className="hover:text-red-600">Centre List</Link></li>
            <li><Link to="/blog" className="hover:text-red-600">Blog</Link></li>
            <li><Link to="/refund-policy" className="hover:text-red-600">Refund Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-red-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-red-600">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div className="text-center md:text-left">
          <h3 className="text-gray-900 font-bold text-lg border-b-2 border-gray-300 inline-block mb-3">
            USEFUL LINKS
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-red-600">Centre Login</Link></li>
            <li><Link to="/login" className="hover:text-red-600">Staff Login</Link></li>
            <li><Link to="/login" className="hover:text-red-600">Admin Login</Link></li>
            <li><Link to="/webmail" className="hover:text-red-600">Webmail Login</Link></li>
            <li><Link to="/contact" className="hover:text-red-600">Franchise Enquiry</Link></li>
            <li><Link to="/contact" className="hover:text-red-600">Contact</Link></li>
          </ul>
        </div>

         {/* CONTACT SECTION */}
<div className="text-center md:text-left">
  <h3 className="text-gray-900 font-bold text-lg border-b-2 border-gray-300 inline-block mb-3">
    GET IN TOUCH
  </h3>
  <p className="text-sm leading-relaxed">
    <strong>Address:</strong>{" "}
    {settings?.address ||
      "Reg. Office: House No. 192, 1st Floor, Main Road, Khichripur Village, Near MCD School, Delhi - 110091"}
  </p>
  <p className="text-sm mt-2">
    <strong>Phone:</strong>{" "}
    {settings?.adminMobile || "9507470236"}, {settings?.franchiseEnquiry || "06226 314459"}, {settings?.helpline || ""}
  </p>
  <p className="text-sm mt-1">
    <strong>Email:</strong> {settings?.adminEmail || "itve@itveindia.org"}
  </p>


          {/* Map */}
          <div className="mt-4 rounded-lg overflow-hidden">
            <iframe
              title="ITVE Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.290301922947!2d77.307!3d28.6205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce460a93c9f73%3A0x5ef6dc1eaf5c8f8f!2sKhichripur%20Village%2C%20New%20Delhi%2C%20Delhi%20110091!5e0!3m2!1sen!2sin!4v1677322125324!5m2!1sen!2sin"
              width="100%"
              height="130"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-red-600 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-bold">
          ITVE (Information Technology and Vocational Education)
        </span>{" "}
        — All Rights Reserved.
      </div>
    </footer>
  );
}
