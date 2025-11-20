import React, { useEffect, useState } from "react";
import { getNotices } from "../../services/noticeService";

export default function NoticeSection() {
  const [boardNotices, setBoardNotices] = useState([]);

  useEffect(() => {
    const fetchBoardNotices = async () => {
      try {
        const data = await getNotices();
        const activeBoardNotices = data
          .filter(notice => notice.status === "Active" && notice.boardNotice)
          .map(notice => notice.boardNotice);
        setBoardNotices(activeBoardNotices);
      } catch (error) {
        console.error("Failed to fetch board notices", error);
      }
    };

    fetchBoardNotices();
  }, []);

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-20 py-12">
      {/* Top Icon + Welcome Message */}
      
      {/* Top Icon + Welcome Message */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src="https://www.itveindia.org/assets/img/icon/section.png"
          alt="Icon"
          className="h-16 w-16 mb-4"
        />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          WELCOME TO ITVE (Information Technology and Vocational Education)
        </h2>
      </div>

      {/* Main Content: Left Paragraphs + Right Notice Board */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Paragraphs */}
        <div className="md:w-2/3 text-left">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            Welcome to ITVE – Where Learning Transforms Lives. At ITVE, we believe every learner holds the potential to succeed — and we’re here to guide that journey. As a vibrant community of passionate students, experienced educators, and industry professionals, we’re united by a single mission:
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To empower you with practical skills, real-world knowledge, and the confidence to thrive in a competitive world. Whether you're starting a new career or upgrading your existing skills, ITVE offers hands-on training, industry-relevant programs, and unwavering support to help you reach your goals. Here, learning goes beyond textbooks — it becomes a transformation. You’re not just enrolling in a course; you’re becoming a valued part of the ITVE family. Together, we’ll unlock your full potential.
          </p>
        </div>

        {/* Right Notice Board */}
        <div className="md:w-1/3 bg-blue-800 text-white rounded shadow-md overflow-hidden relative">
          <div className="bg-red-600 px-4 py-2 font-bold text-lg">
            Notice Board / Update News
          </div>
          <div className="h-[300px] overflow-hidden relative">
            <div className="absolute animate-scrollTop space-y-4 px-4 py-2">
              {boardNotices.length > 0 ? (
                boardNotices.map((notice, idx) => (
                  <p key={idx} className="text-black font-semibold text-sm md:text-base">
                    {notice}
                  </p>
                ))
              ) : (
                <p className="text-white font-semibold text-sm md:text-base">
                  No board notices available at the moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind keyframes for vertical scroll */}
      <style>
        {`
          @keyframes scrollTop {
            0% { top: 100%; }
            100% { top: -100%; }
          }
          .animate-scrollTop {
            position: absolute;
            animation: scrollTop 10s linear infinite;
          }
        `}
      </style>
    </section>
  );
}