import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartPie, FaUsers, FaTasks, FaCog, FaFilter, FaUserShield, FaCommentAlt } from "react-icons/fa";
import ResponsiveSidebar from "../common/ResponsiveSidebar";

const Sidebar = () => {
  const location = useLocation();

  // Sidebar menu items with icons
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { path: "/admin/manage-users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/admin/manage-tasks", label: "Manage Tasks", icon: <FaTasks /> },
    { path: "/admin/task-filter", label: "Filter Tasks", icon: <FaFilter /> },
    { path: "/admin/user-logs", label: "User Logs", icon: <FaUserShield /> },
    { path: "/admin/feedback", label: "Feedback Management", icon: <FaCommentAlt /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <ResponsiveSidebar title="Admin Panel" icon="⚙️">
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

export default Sidebar;
