import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaUserGraduate, FaClipboardList, FaBookOpen, FaBuilding,
  FaMoneyBillWave, FaQrcode, FaBoxOpen, FaDownload, FaUniversity, FaBullhorn,
  FaChalkboardTeacher, FaEnvelope, FaTruck, FaCog, FaDatabase, FaLock, FaPowerOff,
  FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const allMenuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FaTachometerAlt /> },
    { name: "Center Dashboard", path: "/center-dashboard", icon: <FaTachometerAlt /> },
    {
      name: "Student Management",
      icon: <FaUserGraduate />,
      subItems: [
        { name: "Add Student", path: "/add-students" },
        { name: "All Students", path: "/all-students" },
        { name: "Deleted Students", path: "/deleted-students" },
        { name: "Online Registered", path: "/online-registered-students" },
      ],
    },
    {
      name: "Exams & Marks",
      icon: <FaClipboardList />,
      subItems: [
        { name: "Download Admit List", path: "/download-admit" },
        { name: "Update Marks List", path: "/update-marks-list" },
        { name: "View Marks List", path: "/view-marks-list" },
        { name: "Certificate Issued", path: "/certificate-list" },
      ],
    },
    {
      name: "Course Management",
      icon: <FaBookOpen />,
      subItems: [
        { name: "All Categories", path: "/category-lists" },
        { name: "All Courses", path: "/course-lists" },
        { name: "Deleted Courses", path: "/delete-course" },
        { name: "Deleted Categories", path: "/delete-category" },
      ],
    },
    {
      name: "Center Management",
      icon: <FaBuilding />,
      subItems: [
        { name: "All Centers", path: "/center-lists" },
        { name: "Deleted Centers", path: "/delete-center-list" },
        { name: "Center Renewal", path: "/center-renewal-list" },
        { name: "Online Reg. Center", path: "/online-registered-center" },
        { name: "All Enquiries", path: "/center-enquiry-list" },
        { name: "All Notices", path: "/manage-notice" },
      ],
    },
    { name: "Student Fees", path: "/fee-list", icon: <FaMoneyBillWave /> },
    {
      name: "Payment & Earning",
      icon: <FaMoneyBillWave />,
      subItems: [
        { name: "QRBalance Online Payment", path: "/qr-balance-list", icon: <FaQrcode /> },
        { name: "Offline Payments", path: "/offline-balance-list" },
        { name: "Transaction History", path: "/transaction-history" },
      ],
    },
    { name: "Orders", path: "/order-list", icon: <FaBoxOpen /> },
    { name: "Downloads", path: "/download-list", icon: <FaDownload /> },
    { name: "Library", path: "/book-list", icon: <FaUniversity /> },
    {
      name: "Front Panel",
      icon: <FaBullhorn />,
      subItems: [
        { name: "Job Details", path: "/job-list" },
        { name: "All Enquiry", path: "/center-enquiry-list" },
        { name: "Manage Page", path: "/manage-page" },
        { name: "Manage Slider", path: "/manage-slider" },
        { name: "Manage Notice", path: "/manage-notice" },
        { name: "Manage Gallery", path: "/gallery-list" },
        { name: "Manage Team Members", path: "/team-list" },
        { name: "Testimonials", path: "/testimonial-list" },
        { name: "Blog Category", path: "/blog-category-list" },
        { name: "Manage Blogs", path: "/blog-list" },
      ],
    },
    {
      name: "Online Exam",
      icon: <FaBookOpen />,
      subItems: [
        { name: "All Exams", path: "/online-exam-list" },
        { name: "Practical Result", path: "/practical-exam-result-list" },
        { name: "Main Exam Result", path: "/main-exam-result-list" },
      ],
    },
    { name: "Live Classes", path: "/live-class-list", icon: <FaChalkboardTeacher /> },
    { name: "Messages", path: "/message-list", icon: <FaEnvelope /> },
    { name: "Delivery", path: "/delivery-list", icon: <FaTruck /> },
    { name: "Track Delivery", path: "/track-delivery", icon: <FaTruck /> },
    { name: "Settings", path: "/setting", icon: <FaCog /> },
    { name: "Database Backup", path: "/backup", icon: <FaDatabase /> },
    { name: "Change Password", path: "/change-password", icon: <FaLock /> },
    { name: "Logout", path: "/logout", icon: <FaPowerOff /> },
  ];

  const allowedNames = [
    "Center Dashboard", "Student Management", "Exams & Marks", "Course Management",
    "Center Management", "Student Fees", "Payment & Earning", "Downloads", "Library",
    "Online Exam  Exam", "Live Classes", "Messages", "Change Password", "Logout", "Track Delivery"
  ];
  const allowedSubItems = {
    "Student Management": ["Add Student", "All Students"],
    "Exams & Marks": ["Download Admit List", "Update Marks List", "View Marks List", "Certificate Issued"],
    "Course Management": ["All Categories", "All Courses"],
    "Center Management": ["All Centers"],
    "Payment & Earning": ["QRBalance Online Payment", "Transaction History"],
    "Online Exam": ["All Exams", "Practical Result", "Main Exam Result"]
  };

  const filteredMenuItems = allMenuItems
    .filter(item => {
      if (user?.role === "admin") {
        return item.name !== "Center Dashboard";
      } else if (user?.role === "center") {
        return allowedNames.includes(item.name);
      }
      return false;
    })
    .map(item => {
      if (user?.role === "center" && item.subItems && allowedSubItems[item.name]) {
        return {
          ...item,
          subItems: item.subItems.filter(sub => allowedSubItems[item.name].includes(sub.name))
        };
      }
      return item;
    });

  return (
    <div className={`${isOpen ? "w-80" : "w-24"} bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 text-white flex flex-col transition-all duration-500 ease-in-out shadow-2xl`}>
      {/* Logo & Toggle Button - FIXED COLOR */}
      <div className="flex items-center justify-between p-6 border-b border-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white border-opacity-30">
            <span className="text-2xl font-bold">IT</span>
          </div>
          {isOpen && (
            <div>
              <h2 className="text-2xl font-bold tracking-wider text-white drop-shadow-lg">ITVE</h2>
              <p className="text-xs opacity-80 font-medium">{user?.role === "admin" ? "Administrator" : "Center Panel"}</p>
            </div>
          )}
        </div>

        {/* Toggle Button - FIXED COLOR (Now Purple) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-white border-opacity-30"
        >
          {isOpen ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
        {filteredMenuItems.map((item, idx) => (
          <div key={idx} className="mb-2">
            {item.subItems ? (
              <button
                onClick={() => toggleDropdown(item.name)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-400 group
                  ${openDropdown === item.name 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50" 
                    : "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-opacity-30 hover:shadow-2xl hover:shadow-purple-500/30"
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300 text-cyan-300">
                    {item.icon}
                  </div>
                  {isOpen && <span className="font-medium text-lg tracking-wide">{item.name}</span>}
                </div>
                {isOpen && (
                  <div className="text-cyan-300">
                    {openDropdown === item.name ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                )}
              </button>
            ) : item.name === "Logout" ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-5 px-6 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-700 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-400 group"
              >
                <div className="text-2xl text-red-400 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                {isOpen && <span className="font-medium text-lg text-red-300">Logout</span>}
              </button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-400 group
                  ${isActive 
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-2xl shadow-cyan-500/50 font-bold" 
                    : "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-opacity-30 hover:shadow-2xl hover:shadow-purple-500/30"
                  }`
                }
              >
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300 text-cyan-300">
                  {item.icon}
                </div>
                {isOpen && <span className="font-medium text-lg tracking-wide">{item.name}</span>}
              </NavLink>
            )}

            {/* Submenu */}
            {item.subItems && openDropdown === item.name && isOpen && (
              <div className="mt-3 ml-12 space-y-2 border-l-4 border-cyan-400 pl-6">
                {item.subItems.map((sub, subIdx) => (
                  <NavLink
                    key={subIdx}
                    to={sub.path}
                    className={({ isActive }) =>
                      `block px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                        : "hover:bg-purple-600 hover:bg-opacity-40 text-purple-200"
                      }`
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-6 border-t border-purple-800 bg-black bg-opacity-20">
          <div className="text-center">
            <p className="text-sm opacity-80 font-medium">© 2025 ITVE Institute</p>
            <p className="text-xs opacity-60 mt-1">All rights reserved</p>
          </div>
        </div>
      )}
    </div>
  );
}