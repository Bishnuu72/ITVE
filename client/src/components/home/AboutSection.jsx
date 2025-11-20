import React from "react";
import Boy from "../../assets/images/Boy.png";
const AboutSection = () => {
  return (
    <section
      className="relative mb-10 bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/group-happy-students_329181-14271.jpg')",
      }}
    >
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-[#1a1a4a]/90"></div>

      <div className="relative container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-10 py-16 lg:py-24 gap-10">

        {/* LEFT TEXT SECTION */}
        <div className="lg:w-2/3 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-snug">
            WHY YOU CHOOSE ITVE (INFORMATION TECHNOLOGY AND VOCATIONAL
            EDUCATION)?
          </h2>

          <p className="text-gray-200 leading-relaxed mb-4">
            First of all, I would like to express my gratitude to you and thank
            you wholeheartedly that you have selected the Bright Career
            Institute for your bright future, and also to tell you that we
            always take for you the course that is high in demand in the present
            time and in the coming time and the ITVE (Information Technology and
            Vocational Education) is certified by the Government of India.
          </p>

          <p className="text-gray-200 leading-relaxed mb-8">
            If the certificate received from the Institute is recognised not
            only in your own country but also abroad, you can put it in places
            where the certificate is sought without any concern! We wish you a
            bright future and once again thank you!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a
              href="/student-admission"
              className="bg-[#007baf] hover:bg-[#009ddc] transition text-white font-semibold px-6 py-3 rounded-sm uppercase tracking-wide"
            >
              Join With Us as a Student
            </a>
            <a
              href="/center-apply-form"
              className="bg-[#009ddc] hover:bg-[#00b3f6] transition text-white font-semibold px-6 py-3 rounded-sm uppercase tracking-wide"
            >
              Join With Us as Training Centre
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="lg:w-1/3 flex justify-center">
          <img
            src={Boy}
            alt="Student"
            className="w-80 sm:w-96 rounded-lg mt-30"
          />
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
