// src/pages/Contact.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Swal from "sweetalert2"; // import SweetAlert2
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { submitContact } from "../services/contactService";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Missing Fields",
        text: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await submitContact(formData);

      Swal.fire({
        icon: "success",
        title: "✅ Message Sent",
        text: res.message,
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: err.response?.data?.message || "Failed to send message",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-80">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
            alt="Contact Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              📞 Contact <span className="text-red-400">ITVE</span>
            </h1>
            <p className="text-white text-lg mt-2">
              We’re here to help — reach out for support, inquiries, or collaboration.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 mt-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Get in Touch with <span className="text-red-500">ITVE</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Information Technology & Vocational Education
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-12">
          {/* Left - Info */}
          <div className="bg-red-500 text-white p-10 flex flex-col justify-center space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p>123 Knowledge Park, Sector 12, New Delhi, India</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p>info@itve.org</p>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="p-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white font-medium px-6 py-3 rounded-md shadow-md transition`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
