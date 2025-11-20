import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSliders, getImageUrl } from "../../services/sliderService";
import { getNotices } from "../../services/noticeService";

export default function HeroSection() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [heroNotices, setHeroNotices] = useState([]);

  // Fetch slider images
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const data = await getSliders();
        const activeSliders = data.filter(slider => slider.status === "Active");
        const imageUrls = activeSliders.map(slider => getImageUrl(slider.photo));
        setImages(imageUrls);
      } catch (error) {
        console.error("Failed to load slider images", error);
      }
    };

    fetchSliderImages();
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch hero notices
  useEffect(() => {
    const fetchHeroNotices = async () => {
      try {
        const data = await getNotices();
        const activeHeroNotices = data
          .filter(notice => notice.status === "Active" && notice.heroNotice)
          .map(notice => notice.heroNotice);
        setHeroNotices(activeHeroNotices);
      } catch (error) {
        console.error("Failed to load hero notices", error);
      }
    };

    fetchHeroNotices();
  }, []);

  const nextSlide = () => setCurrent(current === images.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? images.length - 1 : current - 1);

  return (
    <>
      {/* Slider Section */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 text-white z-30 cursor-pointer"
        >
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 text-white z-30 cursor-pointer"
        >
          <FaChevronRight />
        </button>
      </section>

      {/* Scrolling Hero Notices Section */}
      <div className="w-full py-2 overflow-hidden" style={{ backgroundColor: "#f7cd7f" }}>
        <div
          className="animate-marquee whitespace-nowrap font-bold text-lg md:text-xl hover:pause-marquee"
          style={{ color: "#000000", padding: "10px" }}
        >
          {heroNotices.length > 0 ? (
            heroNotices.map((text, index) => (
              <span key={index} className="mx-4">
                {text}
              </span>
            ))
          ) : (
            <span>Welcome to ITVE – Empowering Vocational Education</span>
          )}
        </div>
      </div>
    </>
  );
}