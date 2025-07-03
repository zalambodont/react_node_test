/**
 * AuthRouter Component
 * 
 * Smart routing component that handles root path authentication logic.
 * Redirects users based on their authentication status and role.
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Redirects authenticated users to role-appropriate dashboard
 * - Handles loading states gracefully
 * - Centralizes auth routing logic
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * AuthRouter Component
 * 
 * Determines where to redirect users based on authentication status
 * 
 * @returns {React.ReactElement} Navigation component or loading state
 */
const AuthRouter = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="mt-4 text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  const isAuthenticated = !!user || !!localStorage.getItem("token");
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, redirect to appropriate dashboard based on role
  const userRole = localStorage.getItem("userRole");
  
  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (userRole === "user") {
    return <Navigate to="/user/dashboard" replace />;
  } else {
    // If authenticated but no role set, redirect to login to set role
    return <Navigate to="/login" replace />;
  }
};

export default AuthRouter; 