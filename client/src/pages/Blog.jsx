import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getAllBlogs, uploadsUrl } from "../services/blogService";
import { getAllCategories } from "../services/blogCategoryService";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getAllCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const allBlogs = await getAllBlogs();
        if (selectedCategory) {
          const filtered = allBlogs.filter(
            (blog) => blog.category?.name === selectedCategory
          );
          setBlogs(filtered);
        } else {
          setBlogs(allBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen pb-16">
        {/* ✅ Header with Background Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80"
          alt="Blog Banner"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase drop-shadow-lg">
            ITVE Blog & Updates
          </h1>
          <p className="text-lg mt-2 drop-shadow-md">
            Stay informed with the latest education insights
          </p>
        </div>
      </div>


        {/* ✅ Category Filter */}
        <div className="container mx-auto px-6 mt-10">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border p-2 rounded-md w-full md:w-1/3"
            >
              <option value="">-- All Categories --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Blog Cards */}
          <div className="grid gap-10 md:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={
                    blog.image
                      ? `${uploadsUrl}/${blog.image}`
                      : "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-3">
                  <Link to={`/blog-detail/${blog._id}`}>
                    <h2 className="text-xl font-bold text-red-700 hover:underline cursor-pointer">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500">
                    By <span className="font-semibold">{blog.author}</span> /{" "}
                    {new Date(blog.createdAt).toLocaleDateString()} /{" "}
                    {blog.comments?.length || 0} Comments
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {blog.excerpt}
                  </p>
                  <Link
                    to={`/blog-detail/${blog._id}`}
                    className="text-red-700 font-semibold hover:underline mt-2 inline-block"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}