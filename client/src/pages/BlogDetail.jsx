import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import topImage from "../assets/images/Course8.JPG";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getBlogById } from "../services/blogService";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    getBlogById(id)
      .then((data) => setBlog(data))
      .catch((err) => console.error("Error fetching blog details:", err));
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen">
        <div className="relative w-full h-64">
          <img src={topImage} alt="Blog Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Blog Details</h1>
            <p className="text-white text-sm mt-2">Latest Educational Insights from ITVE</p>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 py-12 max-w-5xl bg-white rounded-xl shadow-lg mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">{blog.title}</h2>
          <p className="text-gray-600 text-sm mb-6">
            By <span className="font-semibold">{blog.author}</span> /{" "}
            {new Date(blog.createdAt).toLocaleDateString()} /{" "}
            {blog.comments?.length || 0} Comments
          </p>
          <div
            className="space-y-6 text-gray-800 leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
          {/* Optional: Leave a Reply Section */}
        </div>
      </section>
      <Footer />
    </>
  );
}