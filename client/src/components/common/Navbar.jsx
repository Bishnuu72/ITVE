import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.JPG";
import { AuthContext } from "../../context/AuthContext";
import { getAllSettings } from "../../services/settingService";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext); // get user & logout
  const [settings, setSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCenter, setIsCenter] = useState(false);
   const [isStudent, setIsStudent] = useState(false);
  const navigate = useNavigate();

  // Determine if logged-in user is admin
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setIsAdmin(true);
        setIsCenter(false);
      } else if (user.role === "center") {
        setIsCenter(true);
        setIsAdmin(false);
      }  else if (user.role === "student") {
        setIsStudent(true);
        setIsAdmin(false);
        setIsCenter(false);
      } else {
        setIsAdmin(false);
        setIsCenter(false);
        setIsStudent(false);
      }
    } else {
      setIsAdmin(false);
      setIsCenter(false);
      setIsStudent(false);
    }
  }, [user, isAuthenticated, loading]);

  // ✅ Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getAllSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    logout(); // clear user and token
    navigate("/login"); // redirect to login
  };


  const menus = [
    {
      title: "ABOUT",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Rule & Regulation", path: "/rule-regulation" },
      ],
    },
    {
      title: "COURSES",
      links: [
        { name: "Courses List", path: "/course-list" },
        { name: "Category List", path: "/category-list" },
      ],
    },
    {
      title: "STUDENT",
      links: [
        { name: "Online Admission", path: "/student-admission" },
        { name: "Student Enquiry", path: "/contact" },
        { name: "Registration Process", path: "/student-registration-process" },
        { name: "Student Verify", path: "/student-verification" },
        { name: "Student Login", path: "/login" },
        { name: "Download Admit Card", path: "/download-admit-card" },
        { name: "Student Result Verify", path: "/student-result" },
        { name: "Certificate & Verify", path: "/certificate-verify" },
        { name: "Training & Placement", path: "/training-placement" },
        { name: "Apply For Job", path: "/apply-for-job" },
      ],
    },
    {
      title: "FRANCHISE",
      links: [
        { name: "Center Apply Online", path: "/center-apply-form" },
        { name: "Affiliation Process", path: "/affiliation-process" },
        { name: "Center Enquiry", path: "/contact" },
        { name: "Center Login", path: "/login" },

        { name: "Center Verify", path: "/verify" },
        { name: "Center List", path: "/center-list" },
      ],
    },
    {
      title: "STAFF LOGIN",
      links: [
        { name: "Login", path: "/login" },
        { name: "Verify", path: "/verify" },
      ],
    },
    {
      title: "CONTACT",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Feedback", path: "/feedback" },
      ],
    },
    {
      title: "Account",
      links: user
        ? [
          { name: `Hi, ${user.name}`, path: "#" },
          { name: "Logout", path: "/logout" },
        ]
        : [
          { name: "Register", path: "/register" },
          { name: "Login", path: "/login" },
        ],
    },
  ];



  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row text-white text-sm h-auto md:h-10">
        <div className="bg-blue-900 w-full md:w-1/2 px-4 md:px-20 py-2 flex items-center justify-center md:justify-start text-center md:text-left">

          EMAIL: {settings?.adminEmail || "Loading..."} | CALL:{" "}
          {settings?.adminMobile || "Loading..."}, {settings?.helpline || "Loading..."}

        </div>

        <div className="bg-red-600 w-full md:w-1/2 px-4 md:px-20 py-2 flex items-center justify-center md:justify-end gap-4">
          {isStudent ? (
            <Link
              to="/student-dashboard"
              className="hover:underline hover:text-yellow-300 transition"
            >
              Student DASHBOARD
            </Link>
          ) : (
            <Link
              to="/login"
              className="hover:underline hover:text-yellow-300 transition"
            >
              Student LOGIN
            </Link>
          )}
          {isCenter ? (
            <Link
              to="/center-dashboard"
              className="hover:underline hover:text-yellow-300 transition"
            >
              Center DASHBOARD
            </Link>
          ) : (
            <Link
              to="/login"
              className="hover:underline hover:text-yellow-300 transition"
            >
              Center LOGIN
            </Link>
          )}
          <Link
            to="/center-apply-form"
            className="hover:underline hover:text-yellow-300 transition"
          >
            CENTER APPLY
          </Link>
          {isAdmin ? (
            <Link
              to="/admin-dashboard"
              className="hover:underline hover:text-yellow-300 transition"
            >
              ADMIN DASHBOARD
            </Link>
          ) : (
            <Link
              to="/login"
              className="hover:underline hover:text-yellow-300 transition"
            >
              ADMIN LOGIN
            </Link>
          )}
        </div>
      </div>

      {/* Logo Section */}
      <div className="flex flex-col border-b px-4 py-3 bg-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <img
            src={settings?.logo || "/fallback-logo.png"} // ✅ Dynamic logo
            alt="Site Logo"
            className="h-35 w-40 rounded-full border-2 border-white"
          />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <h1 className="px-5 text-7xl md:text-9xl font-bold text-red-700 flex items-start gap-2">
              {settings?.seoTitle || "Loading..."}{" "} <span className="text-xl md:text-3xl text-black align-top">®</span>
            </h1>

            <div className="flex flex-col text-left mt-6 md:mt-14">
              <p className="text-black font-semibold text-2xl md:text-4xl text-center md:text-left">
                {settings?.seoKeyword || ""}
              </p>
              <p className="text-yellow-700 text-lg md:text-3xl font-medium text-center md:text-left">
                (An Autonomous Organization)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 text-black font-bold text-base md:text-xl">
          <p className="w-full text-center">
            Regd. Under Trust Act 1882, Govt. of INDIA NCT New Delhi & Ministry
            of Micro, Small & Medium Enterprises Govt. of India.
          </p>
          <p className="mx-auto text-center w-full md:w-2/3 mt-2">
            {settings?.seoDescription || ""}
          </p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-red-700 text-white text-lg relative z-50">
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center md:hidden py-3">
            <h2 className="font-bold text-xl">MENU</h2>
            <button
              className="focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
              </div>
            </button>
          </div>

          <div
            className={`${menuOpen ? "block" : "hidden"
              } md:flex flex-col md:flex-row justify-center items-center md:space-x-4`}
          >
            {/* Home */}
            <Link
              to="/"
              className="px-4 py-3 hover:bg-red-800 block w-full md:w-auto text-center"
            >
              HOME
            </Link>

            {/* Dropdown Menus */}
            {menus.map((menu, idx) => (
              <div
                key={idx}
                className="relative group w-full md:w-auto text-center md:text-left"
              >
                <span className="px-4 py-3 cursor-pointer hover:bg-red-800 block">
                  {menu.title}
                </span>

                <div
                  className="absolute left-0 top-full bg-white text-black shadow-lg w-60 md:min-w-[220px] hidden group-hover:block md:group-hover:animate-fadeIn border-t-2 border-red-600 z-9999"
                >
                  {menu.links.map((link, index) =>
                    link.name === "Logout" ? (
                      <button
                        key={index}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={link.path}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm text-left"
                      >
                        {link.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Single Links */}
            <Link
              to="/gallery"
              className="px-4 py-3 hover:bg-red-800 block w-full md:w-auto text-center"
            >
              GALLERY
            </Link>
            <Link
              to="/download"
              className="px-4 py-3 hover:bg-red-800 block w-full md:w-auto text-center"
            >
              DOWNLOAD
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
