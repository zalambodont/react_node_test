/**
 * Login Component
 * 
 * A comprehensive authentication component that handles user login with proper
 * validation, error handling, and state management. Now includes role selection
 * functionality for both login and signup options.
 * 
 * Features:
 * - Role selection (Admin/User) directly on login page
 * - Supports both default and custom user accounts
 * - Persists authentication state across browser sessions
 * - Provides clear error feedback and loading states
 * - Implements role-based redirection
 * - Logs authentication events for admin tracking
 * 
 * @author Senior Full-Stack Engineer
 * @version 3.0.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaLock, FaEnvelope, FaExclamationCircle, FaSpinner, FaUserShield, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  // State management with proper initialization
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // Hooks initialization
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role from location state if coming from direct navigation
  const roleFromState = location.state?.role;
  const from = location.state?.from || "/";

  /**
   * Effect hook to handle role from navigation state
   */
  useEffect(() => {
    if (roleFromState) {
      setSelectedRole(roleFromState);
      setShowLoginForm(true);
    }
  }, [roleFromState]);

  /**
   * Effect hook to check for existing authentication
   * Redirects authenticated users to appropriate dashboard
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userRole = localStorage.getItem("userRole");
      navigate(userRole === "admin" ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [navigate]);

  /**
   * Handle role selection
   * @param {string} role - Selected role (admin/user)
   */
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowLoginForm(true);
    setError(""); // Clear any previous errors
  };

  /**
   * Handle back to role selection
   */
  const handleBackToRoleSelection = () => {
    setShowLoginForm(false);
    setSelectedRole(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  /**
   * Handle signup navigation
   */
  const handleSignupNavigation = () => {
    navigate("/signup", { state: { role: selectedRole } });
  };

  /**
   * Handles form submission and authentication
   * Implements localStorage-based authentication with support for custom users
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    
    // Reset previous errors
    setError("");
    setLoading(true);
    
    try {
      // Simulate network latency for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get stored users from localStorage or initialize with default users
      const storedUsers = JSON.parse(localStorage.getItem('users') || JSON.stringify([
        { email: 'admin@example.com', password: 'password123', role: 'admin', userId: 'admin-123' },
        { email: 'user@example.com', password: 'password123', role: 'user', userId: 'user-456' }
      ]));
      
      // Find matching user
      const user = storedUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Check if user role matches selected role
        if (user.role !== selectedRole) {
          setError(`This account is registered as ${user.role === 'admin' ? 'Administrator' : 'Team Member'}. Please select the correct role or use a different account.`);
          setLoading(false);
          return;
        }

        // User found and role matches, proceed with login
        const mockToken = `mock-token-${Date.now()}`;
        
        // Store authentication data in localStorage for persistence
        localStorage.setItem("token", mockToken);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.userId);
        localStorage.setItem("email", email);
        
        // Create log entry for admin tracking
        const logData = {
          id: `login-${Date.now()}`,
          userId: user.userId,
          username: email,
          role: user.role,
          action: "login",
          loginTime: new Date().toISOString(),
          logoutTime: null,
          ipAddress: "127.0.0.1", // In production, this would be captured from the request
          tokenName: mockToken.substring(0, 10) + "..." // Truncated for security
        };
        
        // Store login logs in localStorage for admin view
        const existingLogs = JSON.parse(localStorage.getItem('userLogs') || '[]');
        existingLogs.push(logData);
        localStorage.setItem('userLogs', JSON.stringify(existingLogs));
        
        console.log("User login:", logData);
        
        // Update authentication context
        login(email);
        
        // Navigate to appropriate dashboard or requested page
        navigate(from !== "/" ? from : (user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"));
      } else {
        // Invalid credentials
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If not showing login form, show role selection
  if (!showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to TaskFlow</h1>
            <p className="text-lg text-gray-600">Choose your role to continue</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {[
              {
                role: "user",
                title: "Team Member",
                description: "Create tasks, track progress, and collaborate with your team.",
                icon: <FaUser className="text-4xl text-blue-500" />,
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                buttonColor: "from-blue-500 to-blue-600"
              },
              {
                role: "admin", 
                title: "Administrator",
                description: "Manage users, verify tasks, and oversee team operations.",
                icon: <FaUserShield className="text-4xl text-purple-500" />,
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200", 
                buttonColor: "from-purple-500 to-purple-600"
              }
            ].map(({ role, title, description, icon, bgColor, borderColor, buttonColor }) => (
              <motion.div
                key={role}
                className={`${bgColor} ${borderColor} border-2 p-6 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer`}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="text-center mb-4">
                  {icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 text-center mb-3">{title}</h3>
                <p className="text-gray-600 text-center mb-6">{description}</p>
                <button
                  className={`w-full py-3 bg-gradient-to-r ${buttonColor} text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity`}
                >
                  Continue as {title}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Want to access the full landing page?{" "}
              <Link to="/welcome" className="text-blue-600 hover:underline">
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form for selected role
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md transform transition duration-300 hover:scale-105">
        {/* Back button */}
        <button
          onClick={handleBackToRoleSelection}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          ← Back to role selection
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
            {selectedRole === "admin" ? (
              <FaUserShield className="text-5xl text-purple-500 mx-auto" />
            ) : (
              <FaUser className="text-5xl text-blue-500 mx-auto" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {selectedRole === "admin" ? "Administrator Login" : "Team Member Login"}
          </h2>
          <p className="text-gray-600 mt-2">
            {selectedRole === "admin" 
              ? "Access admin dashboard and management tools" 
              : "Access your tasks and collaboration tools"}
          </p>
        </div>

        {/* Error display with animation */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded animate-pulse" role="alert">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" aria-hidden="true" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                className="w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Submit button with loading state */}
          <button
            type="submit"
            className={`w-full py-3 rounded-md shadow-md transition duration-200 text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : selectedRole === "admin" 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
            }`}
            disabled={loading}
            aria-label="Login Button"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" aria-hidden="true" />
                Signing In...
              </div>
            ) : (
              `Sign In as ${selectedRole === "admin" ? "Administrator" : "Team Member"}`
            )}
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={handleSignupNavigation}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up as {selectedRole === "admin" ? "Administrator" : "Team Member"}
            </button>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Demo Credentials:</p>
          <div className="text-xs text-gray-600 space-y-1">
            {selectedRole === "admin" ? (
              <>
                <p><strong>Admin:</strong> admin@example.com</p>
                <p><strong>Password:</strong> password123</p>
              </>
            ) : (
              <>
                <p><strong>User:</strong> user@example.com</p>
                <p><strong>Password:</strong> password123</p>
              </>
            )}
          </div>
        </div>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
