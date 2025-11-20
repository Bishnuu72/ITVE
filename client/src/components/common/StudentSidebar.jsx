import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaUserGraduate, FaBookOpen, FaMoneyBillWave,
  FaBullhorn, FaEnvelope, FaPowerOff, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/student-dashboard", icon: <FaTachometerAlt /> },
    { name: "My Profile", path: "/student/profile", icon: <FaUserGraduate /> },
    { name: "Fee Status", path: "/student/fees", icon: <FaMoneyBillWave /> },
    {
      name: "Library",
      icon: <FaBookOpen />,
      subItems: [
        { name: "Center Library", path: "/center-library" },
        { name: "Head Branch Library", path: "/head-branch-library" },
      ],
    },
    { name: "Live Class", path: "/student/notices", icon: <FaBullhorn /> },
    { name: "Messages", path: "/student/messages", icon: <FaEnvelope /> },
    {
      name: "Online Exam",
      icon: <FaBookOpen />,
      subItems: [
        { name: "Practical Exam", path: "/online-exam-list" },
        { name: "Main Exam", path: "/practical-exam-result-list" },
        { name: " Result", path: "/main-exam-result-list" },
      ],
    },
    { name: "Center Details", path: "/student/center-details", icon: <FaBullhorn /> },
    { name: "Logout", icon: <FaPowerOff /> },
  ];

  return (
    <div className={`${isOpen ? "w-64" : "w-20"} bg-gray-800 text-white flex flex-col transition-all duration-300 min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <span className="font-bold text-lg">ITVE Student</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-gray-300 rounded hover:bg-gray-700 transition"
        >
          {isOpen ? "<" : ">"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto max-h-[calc(100vh-60px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-700 transition-all ${
                    openDropdown === item.name ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg">{item.icon}</div>
                    {isOpen && <span className="text-sm font-medium">{item.name}</span>}
                  </div>
                  {isOpen &&
                    (openDropdown === item.name ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />)}
                </button>

                {openDropdown === item.name && (
                  <div className="ml-10 mt-1 border-l border-gray-700">
                    {item.subItems.map((sub, subIdx) => (
                      <NavLink
                        key={subIdx}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm rounded hover:bg-gray-700 transition ${
                            isActive ? "bg-gray-700 font-semibold text-white" : "text-gray-300"
                          }`
                        }
                      >
                        {isOpen ? sub.name : "-"}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : item.name === "Logout" ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 w-full text-left hover:bg-gray-700 transition"
              >
                <div className="text-lg">{item.icon}</div>
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 hover:bg-gray-700 transition-all ${
                    isActive ? "bg-gray-700 font-semibold" : ""
                  }`
                }
              >
                <div className="text-lg">{item.icon}</div>
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}