import React from "react";
import HeroSection from "../components/home/HeroSection";
import NoticeSection from "../components/home/NoticeSection";
// import CategoryList from "../components/courses/CategoryList";
import GalleryPreview from "../components/home/GalleryPreview";
import StatsSection from "../components/home/StatsSection";
import AboutSection from "../components/home/AboutSection";
import Affiliation from "../components/home/Affiliation";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import CoursesPreview from "../components/home/CoursesPreview";
export default function Home() {
  return (
    <>
 <Navbar />


    <main className="w-full overflow-x-hidden">
      {/* Hero Section immediately below header */}
      <HeroSection />

      {/* Other sections */}
      <NoticeSection />
      {/* <CategoryList /> */}
      <GalleryPreview />
      <StatsSection />
      <AboutSection />
      <Affiliation />
      <CoursesPreview />
      </main>
       <Footer />
</>
  );
}
