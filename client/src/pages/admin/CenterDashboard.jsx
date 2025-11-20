import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar"; // use center-specific Sidebar
import Topbar from "../../components/admin/Topbar";   // use center-specific topbar
import DashboardCard from "../../components/admin/DashboardCard"; // reuse or customize

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaFileAlt,
} from "react-icons/fa";

export default function CenterDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Students",
      value: 80,
      icon: <FaUserGraduate />,
      bgColor: "bg-blue-600",
      link: "/center/students",
    },
    {
      title: "Courses",
      value: 10,
      icon: <FaBook />,
      bgColor: "bg-yellow-600",
      link: "/center/courses",
    },
    {
      title: "Teachers",
      value: 15,
      icon: <FaChalkboardTeacher />,
      bgColor: "bg-green-600",
      link: "/center/teachers",
    },
    {
      title: "Notices",
      value: 5,
      icon: <FaFileAlt />,
      bgColor: "bg-red-600",
      link: "/center/notices",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Dashboard cards section */}
        <div className="p-6 flex-1">
          <h1 className="text-3xl font-bold mb-6">Center Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <div key={idx} className="cursor-pointer" onClick={() => navigate(card.link)}>
                <DashboardCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}