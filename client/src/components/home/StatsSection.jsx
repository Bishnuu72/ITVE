import React from "react";

// Dummy stats data
const stats = [
  { number: "+73", label: "OUR COURSES" },
  { number: "+13", label: "HAPPY STUDENTS" },
  { number: "+3", label: "AFFILIATED CENTRES" },
  { number: "+0", label: "VISITOR'S COUNT" },
];

export default function StatsSection() {
  return (
    <section className="w-full mb-10">
      {/* Full width gradient background */}
      <div className="w-full bg-linear-to-r from-blue-800 via-purple-700 to-red-600 text-white px-4 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center w-full max-w-7xl mx-auto">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex-1 py-4 border-white/30 ${
                idx !== stats.length - 1 ? "sm:border-r" : ""
              }`}
            >
              <h3 className="text-3xl font-bold">{stat.number}</h3>
              <p className="text-sm mt-1 tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
