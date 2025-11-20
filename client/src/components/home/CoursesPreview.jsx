import React, { useState, useEffect } from "react";
import { getCourses } from "../../services/courseService"; // Use service for fetching (like gallery)
import placeholderImage from "../../assets/images/Course9.JPG"; // Local placeholder (adjust path if needed)


const imgUrl = import.meta.env.VITE_API_BASE_URL;
// Single course card component (simple, like GalleryCard)
function CourseCard({ image, title, description, paragraph }) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-gradient-to-r hover:border-transparent hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:ring-4 hover:ring-blue-500/20 hover:ring-offset-2 hover:scale-105 transition-all duration-500 ease-out transform overflow-hidden relative">
      {/* Subtle background pattern or glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
      
      {/* Course Name (Title) - Prominent with hover color change */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      
      {/* Image */}
      <div className="mb-4 relative z-10">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-64 h-64 rounded-lg object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Adapted from CourseList handlePhotoError
              console.error(`❌ Photo load failed for ${image}: 404 - File not found`);
              e.target.style.display = "none";
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500">
                    No Photo
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-64 h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors duration-300">
            No Photo
          </div>
        )}
      </div>
      
      {/* Short Description (e.g., Code + Type) */}
      <h4 className="text-sm text-gray-500 mb-2 relative z-10 group-hover:text-gray-700 transition-colors duration-300">{description}</h4>
      
      {/* Full Description (Details) - Shown if exists */}
      {paragraph && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed text-center max-w-xs relative z-10 group-hover:text-gray-800 transition-colors duration-300">
          {paragraph}
        </p>
      )}
      
      {/* Gradient accent line with enhanced hover */}
      <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-2 relative z-10 transform group-hover:scale-125 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
    </div>
  );
}

export default function CoursesPreview() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const items = await getCourses(); // Fetches from /api/courses (non-deleted by backend if filtered)
        console.log("📋 Fetched courses for preview:", items); // DEBUG: See data
        // Filter out deleted courses (if backend doesn't already)
        const activeCourses = Array.isArray(items)
          ? items.filter((item) => !item.deleted)
          : [];
        setCourses(activeCourses);
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
          Courses Preview
        </h2>
        <div className="text-center text-gray-500 animate-pulse">Loading courses...</div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Beautiful Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg relative after:content-['']">
        Courses Preview
      </h2>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((item) => {
            // Construct image URL exactly like CourseList (e.g., http://localhost:4000/uploads/photo_...)
            let imageUrl = null;
            if (item.photo) {
              imageUrl = `${imgUrl}${item.photo}`; // Direct match to CourseList src
              console.log(`🖼️ Image URL for "${item.name}": ${imageUrl}`); // DEBUG
            } else {
              console.log(`⚠️ No photo for "${item.name}"`); // DEBUG
              // Optional: Use placeholder if no photo (but CourseList shows "No Photo" div)
              // imageUrl = placeholderImage; // Uncomment if you want placeholder image instead of "No Photo"
            }
            
            return (
              <CourseCard
                key={item._id} // Use unique ID for key
                image={imageUrl} // Backend URL or null -> "No Photo" div (like CourseList)
                title={item.name || "Untitled Course"} // Course name
                description={`${item.code || "N/A"} - ${item.type || "N/A"}`} // Short info: code + type
                paragraph={item.details || ""} // Full description
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">No courses available.</div>
      )}
    </section>
  );
}