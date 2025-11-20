import React, { useState } from "react";
import { Smile, Mail, Phone } from "lucide-react";
import Swal from "sweetalert2";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { submitFeedback } from "../services/feedbackService";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, rating, message } = formData;

    if (!name || !email || !rating || !message) {
      Swal.fire({
        icon: "warning",
        title: "All fields are required",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await submitFeedback(formData);

      Swal.fire({
        icon: "success",
        title: "Feedback Submitted",
        text: res.message,
      });

      setFormData({ name: "", email: "", rating: "", message: "" });
    } catch (err) {
      console.error("Feedback error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err.response?.data?.message || "Failed to submit feedback",
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
            src="https://images.unsplash.com/photo-1551836022-4c4c79ecde16?auto=format&fit=crop&w=1600&q=80"
            alt="Feedback Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              💬 Your Feedback Matters
            </h1>
            <p className="text-white text-lg mt-2 text-center px-4">
              Help us make ITVE (Information Technology & Vocational Education) better for everyone.
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="py-12 px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              We Value Your <span className="text-red-500">Feedback</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Help us improve ITVE (Information Technology & Vocational Education)
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            {/* LEFT SIDE - Info */}
            <div className="bg-red-500 text-white p-10 flex flex-col justify-center space-y-6">
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                <Smile className="w-7 h-7" /> Share Your Thoughts
              </h2>
              <p className="text-white/90 leading-relaxed">
                Your feedback helps us grow and serve you better. Please take a moment to tell us about your experience.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p>feedback@itve.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Feedback Form */}
            <div className="p-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Submit Your Feedback
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
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="">Select Rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Write your feedback here..."
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
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Feedback;
