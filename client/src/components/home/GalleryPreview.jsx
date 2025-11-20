import React, { useState, useEffect } from "react";
import { getGalleries, getMediaUrl } from "../../services/galleryService";

// Single gallery card component
function GalleryCard({ image, title, description, paragraph }) {
  return (
    <div className="group bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-gradient-to-r hover:border-transparent hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:ring-4 hover:ring-blue-500/20 hover:ring-offset-2 hover:scale-105 transition-all duration-500 ease-out transform overflow-hidden relative">
      {/* Subtle background pattern or glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
      
      <h4 className="text-sm text-gray-500 mb-2 relative z-10 group-hover:text-gray-700 transition-colors duration-300">{description}</h4>
      
      <div className="mb-4 relative z-10">
        <img
          src={image}
          alt={title}
          className="w-64 h-64 rounded-lg object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      
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

export default function GalleryPreview() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch galleries from backend on component mount
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const items = await getGalleries();
        // Filter for active photo galleries only (to match the image-focused card design)
        // You can adjust this filter as needed (e.g., include videos with thumbnails)
        const activePhotos = Array.isArray(items)
          ? items.filter((item) => item.type === "Photo" && item.status === "Active" && item.photo)
          : [];
        setGalleries(activePhotos);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
          Gallery Preview
        </h2>
        <div className="text-center text-gray-500 animate-pulse">Loading galleries...</div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Beautiful Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg relative after:content-['']">
        Gallery Preview
      </h2>
      
      {galleries.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleries.map((item) => (
            <GalleryCard
              key={item._id} // Use unique ID for key
              image={getMediaUrl(item.photo)} // Use backend media URL
              title={item.name} // Map to backend 'name'
              description={item.type || "Photo"} // Map to backend 'type' (or fallback)
              paragraph={item.description} // Map to backend 'description'
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No gallery items available.</div>
      )}
    </section>
  );
}