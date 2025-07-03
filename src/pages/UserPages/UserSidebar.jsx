import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaTasks, FaCalendarAlt, FaBell, FaUser, FaFilter, FaCommentAlt } from "react-icons/fa";
import ResponsiveSidebar from "../../components/common/ResponsiveSidebar";

const UserSidebar = () => {
  const location = useLocation();

  // Sidebar links with icons
  const menuItems = [
    { path: "/user/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { path: "/user/userpage", label: "Create Tasks", icon: <FaTasks /> },
    { path: "/user/task-filter", label: "Filter Tasks", icon: <FaFilter /> },
    { path: "/user/calendar", label: "Calendar", icon: <FaCalendarAlt /> },
    { path: "/user/notifications", label: "Notifications", icon: <FaBell /> },
    { path: "/user/feedback", label: "Submit Feedback", icon: <FaCommentAlt /> },
    { path: "/user/profile", label: "Profile", icon: <FaUser /> },
  ];

  return (
    <ResponsiveSidebar title="User Panel" icon="🚀">
      <ul className="space-y-3">
        {menuItems.map(({ path, label, icon }) => (
          <li key={path}>
            <Link
              to={path}
              className={`flex items-center gap-3 py-3 px-5 rounded-lg transition-all duration-200 text-lg font-medium ${
                location.pathname === path
                  ? "bg-blue-600 shadow-lg transform scale-105"
                  : "hover:bg-blue-700 hover:scale-105 transition"
              }`}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </ResponsiveSidebar>
  );
};

export default UserSidebar;
