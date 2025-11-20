import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import DashboardCard from "../../components/admin/DashboardCard";
import { 
  FaUserGraduate, FaGlobe, FaBuilding, FaBookOpen, 
  FaLayerGroup, FaHome, FaRupeeSign, 
  FaCalendarAlt, FaCalendarWeek, FaCalendar,
  FaDownload, FaVideo
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    onlineStudents: 0,
    offlineStudents: 0,
    totalCourses: 0,
    totalCategories: 0,
    totalCenters: 0,
    totalDownloads: 0,
    totalLiveClasses: 0,
    todayFees: "0.00",
    monthlyFees: "0.00",
    yearlyFees: "0.00",
    totalFees: "0.00",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const fetchWithAuth = (url) =>
        fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      const [studentsRes, coursesRes, categoriesRes, centresRes, feesRes, downloadsRes, liveClassesRes] = await Promise.all([
        fetchWithAuth(`${API_BASE}/students`),
        fetchWithAuth(`${API_BASE}/courses`),
        fetchWithAuth(`${API_BASE}/courses/categories`),
        fetchWithAuth(`${API_BASE}/centres`),
        fetchWithAuth(`${API_BASE}/fees`),
        fetchWithAuth(`${API_BASE}/downloads`),
        fetchWithAuth(`${API_BASE}/live-classes`),
      ]);

      const [studentsRaw, coursesRaw, categoriesRaw, centresRaw, feesRaw, downloadsRaw, liveClassesRaw] = await Promise.all([
        studentsRes.json(),
        coursesRes.json(),
        categoriesRes.json(),
        centresRes.json(),
        feesRes.json(),
        downloadsRes.json(),
        liveClassesRes.json(),
      ]);

      // Safe data extraction
      const students = Array.isArray(studentsRaw) ? studentsRaw : studentsRaw?.data || [];
      const courses = Array.isArray(coursesRaw) ? coursesRaw : coursesRaw?.data || [];
      const categories = Array.isArray(categoriesRaw) ? categoriesRaw : categoriesRaw?.data || [];
      const centres = Array.isArray(centresRaw) ? centresRaw : centresRaw?.data || [];
      const fees = feesRaw?.data && Array.isArray(feesRaw.data) ? feesRaw.data : Array.isArray(feesRaw) ? feesRaw : [];
      const downloads = downloadsRaw?.data && Array.isArray(downloadsRaw.data) ? downloadsRaw.data : Array.isArray(downloadsRaw) ? downloadsRaw : [];
      const liveClasses = liveClassesRaw?.data && Array.isArray(liveClassesRaw.data) ? liveClassesRaw.data : Array.isArray(liveClassesRaw) ? liveClassesRaw : [];

      const onlineStudents = students.filter(s => s.registrationType === "Online").length;
      const offlineStudents = students.filter(s => s.registrationType === "Admin").length;

      const getAmount = (f) => parseFloat(f.amount || f.feeAmount || f.totalAmount || 0) || 0;
      const getDate = (f) => new Date(f.date || f.paymentDate || f.createdAt || f.updatedAt || 0);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const todayFees = fees.filter(f => getDate(f) >= today).reduce((sum, f) => sum + getAmount(f), 0);
      const monthlyFees = fees.filter(f => getDate(f) >= monthStart).reduce((sum, f) => sum + getAmount(f), 0);
      const yearlyFees = fees.filter(f => getDate(f) >= yearStart).reduce((sum, f) => sum + getAmount(f), 0);
      const totalFees = fees.reduce((sum, f) => sum + getAmount(f), 0);

      setStats({
        totalStudents: students.length,
        onlineStudents,
        offlineStudents,
        totalCourses: courses.length,
        totalCategories: categories.length,
        totalCenters: centres.length,
        totalDownloads: downloads.length,
        totalLiveClasses: liveClasses.length,
        todayFees: todayFees.toFixed(2),
        monthlyFees: monthlyFees.toFixed(2),
        yearlyFees: yearlyFees.toFixed(2),
        totalFees: totalFees.toFixed(2),
      });

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Students",       value: loading ? "..." : stats.totalStudents,     icon: <FaUserGraduate className="text-5xl" />, bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",     link: "/all-students" },
    { title: "Online Registered",    value: loading ? "..." : stats.onlineStudents,    icon: <FaGlobe className="text-5xl" />,        bgColor: "bg-gradient-to-br from-green-500 to-green-700",   link: "/all-students" },
    { title: "Offline Registered",   value: loading ? "..." : stats.offlineStudents,   icon: <FaBuilding className="text-5xl" />,     bgColor: "bg-gradient-to-br from-purple-500 to-purple-700", link: "/all-students" },
    { title: "Total Courses",        value: loading ? "..." : stats.totalCourses,      icon: <FaBookOpen className="text-5xl" />,     bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600", link: "/course-lists" },
    { title: "Total Categories",     value: loading ? "..." : stats.totalCategories,   icon: <FaLayerGroup className="text-5xl" />,   bgColor: "bg-gradient-to-br from-pink-500 to-red-600",      link: "/category-lists" },
    { title: "Total Centers",        value: loading ? "..." : stats.totalCenters,      icon: <FaHome className="text-5xl" />,         bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700", link: "/centre-list" },

    // NEW CARDS - BEFORE FEE CARDS
    { title: "Total Downloads",      value: loading ? "..." : stats.totalDownloads,    icon: <FaDownload className="text-5xl" />,     bgColor: "bg-gradient-to-br from-orange-500 to-red-600",    link: "/download-list" },
    { title: "Live Classes",         value: loading ? "..." : stats.totalLiveClasses,  icon: <FaVideo className="text-5xl" />,        bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",     link: "/live-class-list" },

    // FEE CARDS
    { title: "Today's Allocation",   value: loading ? "..." : `₹${stats.todayFees}`,   icon: <FaCalendarAlt className="text-5xl" />,   bgColor: "bg-gradient-to-br from-teal-500 to-teal-700",     link: "/fee-list" },
    { title: "Monthly Allocation",   value: loading ? "..." : `₹${stats.monthlyFees}`, icon: <FaCalendarWeek className="text-5xl" />,  bgColor: "bg-gradient-to-br from-cyan-500 to-cyan-700",     link: "/fee-list" },
    { title: "Annual Allocation",    value: loading ? "..." : `₹${stats.yearlyFees}`,  icon: <FaCalendar className="text-5xl" />,      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700", link: "/fee-list" },
    { title: "Total Allocation",     value: loading ? "..." : `₹${stats.totalFees}`,   icon: <FaRupeeSign className="text-5xl" />,     bgColor: "bg-gradient-to-br from-lime-500 to-lime-700",     link: "/fee-list" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h1 className="text-6xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
              <p className="text-2xl text-gray-600">Welcome back! Here's your institute overview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {loading ? (
                [...Array(12)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-3xl h-64 animate-pulse shadow-2xl" />
                ))
              ) : (
                cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl rounded-3xl overflow-hidden"
                    onClick={() => navigate(card.link)}
                  >
                    <DashboardCard {...card} />
                  </div>
                ))
              )}
            </div>

            {!loading && (
              <div className="mt-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-3xl">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
                  <div><p className="text-5xl font-bold">{stats.totalStudents}</p><p className="text-xl mt-2 opacity-90">Students</p></div>
                  <div><p className="text-5xl font-bold text-green-300">{stats.onlineStudents}</p><p className="text-xl mt-2 opacity-90">Online</p></div>
                  <div><p className="text-5xl font-bold text-purple-300">{stats.offlineStudents}</p><p className="text-xl mt-2 opacity-90">Offline</p></div>
                  <div><p className="text-5xl font-bold text-yellow-300">{stats.totalCourses}</p><p className="text-xl mt-2 opacity-90">Courses</p></div>
                  <div><p className="text-5xl font-bold text-pink-300">{stats.totalCategories}</p><p className="text-xl mt-2 opacity-90">Categories</p></div>
                  <div><p className="text-5xl font-bold text-indigo-300">{stats.totalCenters}</p><p className="text-xl mt-2 opacity-90">Centers</p></div>
                  <div><p className="text-5xl font-bold text-orange-300">{stats.totalDownloads}</p><p className="text-xl mt-2 opacity-90">Downloads</p></div>
                  <div><p className="text-5xl font-bold text-rose-300">{stats.totalLiveClasses}</p><p className="text-xl mt-2 opacity-90">Live Classes</p></div>
                  <div><p className="text-5xl font-bold text-teal-300">₹{stats.todayFees}</p><p className="text-xl mt-2 opacity-90">Today</p></div>
                  <div><p className="text-5xl font-bold text-lime-300">₹{stats.totalFees}</p><p className="text-2xl mt-2 opacity-90">Total Fees</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}