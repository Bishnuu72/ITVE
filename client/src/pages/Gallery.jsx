import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { getGalleries, getMediaUrl } from "../services/galleryService";

// ✅ Helper to extract YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

// 🔹 Single gallery card component
function GalleryCard({ image, video, youtubeLink, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">
      {/* Media Section */}
      <div className="w-full h-56 sm:h-64 md:h-72 overflow-hidden">
        {youtubeLink ? (
          <iframe
            src={getYouTubeEmbedUrl(youtubeLink)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : video ? (
          <video
            controls
            preload="metadata"
            src={video}
            className="w-full h-full object-cover"
          ></video>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 text-center flex flex-col grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        </div>
        <div className="w-16 h-1 bg-linear-to-r from-red-500 to-orange-500 rounded-full mx-auto mt-4"></div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const items = await getGalleries();
        setGalleryItems(items);
      } catch (error) {
        console.error("Error fetching galleries:", error);
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* HERO SECTION */}
        <div
          className="relative w-full h-64 md:h-80 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              🎥 ITVE Gallery
            </h1>
            <p className="text-white text-lg mt-2 text-center px-4">
              Explore moments of learning, innovation, and celebration at ITVE
            </p>
          </div>
        </div>

        {/* GALLERY GRID */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-10 text-center text-red-600">
            Gallery Showcase
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading galleries...</p>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {galleryItems.map((item) => (
                <GalleryCard
                  key={item._id}
                  image={
                    item.type === "Photo" && item.photo
                      ? getMediaUrl(item.photo)
                      : null
                  }
                  video={
                    item.type === "Video" && item.videoFile
                      ? getMediaUrl(item.videoFile)
                      : null
                  }
                  youtubeLink={
                    item.type === "Video" && item.link ? item.link : null
                  }
                  title={item.name}
                  description={item.description}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No galleries found.</p>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}