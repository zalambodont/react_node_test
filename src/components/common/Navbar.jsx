import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaUserCircle, FaTasks, FaBars, FaTimes } from "react-icons/fa";
import TaskList from "../tasks/TaskList";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hideProfileRoutes = ["/", "/login", "/signup"];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taskListOpen, setTaskListOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const taskListRef = useRef(null);
  const [profile, setProfile] = useState({ name: "User", profilePic: "", role: "user" });

  // Check if we're on a dashboard page that needs sidebar
  const isDashboardPage = location.pathname.startsWith("/admin/") || location.pathname.startsWith("/user/");
  const showSidebarToggle = isDashboardPage && !hideProfileRoutes.includes(location.pathname);

  useEffect(() => {
    // Check if user is in admin or user portal
    const isAdminPortal = location.pathname.startsWith("/admin");

    // Load correct profile from localStorage
    const storedProfile = JSON.parse(localStorage.getItem(isAdminPortal ? "adminProfile" : "userProfile"));
    
    if (storedProfile) {
      setProfile({
        name: storedProfile.name || "User",
        profilePic: storedProfile.profilePic || "",
        role: storedProfile.role || (isAdminPortal ? "admin" : "user"), // Ensure role is set
      });
    }
  }, [location.pathname]); // Re-run when path changes

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (taskListRef.current && !taskListRef.current.contains(event.target)) {
        setTaskListOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Expose sidebar state to global scope for ResponsiveSidebar
  useEffect(() => {
    window.sidebarOpen = sidebarOpen;
    window.setSidebarOpen = setSidebarOpen;
  }, [sidebarOpen]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle logo click
  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // Close task list when clicking outside
  const handleTaskListToggle = () => {
    setTaskListOpen(!taskListOpen);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-3 md:px-5 py-3 md:py-4 flex justify-between items-center shadow-lg z-50">
      {/* Logo with Image & Text - Responsive sizing */}
      <Link
        to="/"
        onClick={handleLogoClick}
        className="flex items-center text-lg md:text-3xl font-bold tracking-wide hover:opacity-70 transition"
      >
        <img src="/app_icon.png" alt="TaskFlow Logo" className="w-8 h-8 md:w-12 md:h-12 rounded-full mr-2" />
        <span className="hidden sm:inline">TaskFlow</span>
        <span className="sm:hidden">TF</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">

        {/* Task List Button (Hidden on Landing/Login/Signup) - Responsive sizing */}
        {!hideProfileRoutes.includes(location.pathname) && (
          <div className="relative" ref={taskListRef}>
            <button
              onClick={handleTaskListToggle}
              className="flex items-center bg-white text-blue-600 font-medium px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md 
                         hover:bg-blue-700 hover:text-white transition-all focus:outline-none text-sm md:text-base"
            >
              <FaTasks className="text-sm md:text-xl mr-1 md:mr-2" />
              <span className="hidden sm:inline">Tasks</span>
            </button>

            {/* Task List Dropdown - Fixed z-index */}
            {taskListOpen && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white shadow-lg rounded-lg overflow-hidden z-[60]">
                <TaskList />
              </div>
            )}
          </div>
        )}

        {/* Profile Button (Hidden on Landing/Login/Signup) - Responsive sizing */}
        {!hideProfileRoutes.includes(location.pathname) && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-white text-blue-600 font-medium px-2 md:px-4 py-1 md:py-2 rounded-lg shadow-md 
                         hover:bg-blue-700 hover:text-white transition-all focus:outline-none text-sm md:text-base"
            >
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Profile" className="w-5 h-5 md:w-6 md:h-6 rounded-full mr-1 md:mr-2" />
              ) : (
                <FaUserCircle className="text-sm md:text-xl mr-1 md:mr-2" />
              )}
              <span className="hidden sm:inline">{profile.name}</span>
              <span className="sm:hidden">Profile</span>
            </button>

            {/* Profile Dropdown - Fixed z-index */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-[60]">
                <div className="px-4 py-2 text-gray-700 border-b">
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                </div>
                <Link
                  to={`/${profile.role}/profile`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
                {/* Sidebar Toggle Button (Mobile only, Dashboard pages only) */}
                {showSidebarToggle && (
          <button
            onClick={handleSidebarToggle}
            className="md:hidden flex items-center bg-white text-blue-600 font-medium px-2 py-1 rounded-lg shadow-md 
                       hover:bg-blue-700 hover:text-white transition-all focus:outline-none text-sm"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
