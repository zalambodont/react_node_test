/**
 * ResponsiveSidebar Component
 * 
 * A responsive sidebar wrapper that handles mobile and desktop layouts.
 * Features overlay sidebar on mobile and fixed sidebar on desktop.
 * Works in conjunction with the main Navbar component for hamburger menu.
 * 
 * Features:
 * - Mobile-first responsive design
 * - Overlay sidebar on mobile (no horizontal overflow)
 * - Fixed sidebar on desktop (md and larger)
 * - Smooth animations and transitions
 * - Controlled by main navbar hamburger menu
 * - Proper z-index layering above main content
 * 
 * @author Senior Full-Stack Engineer
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react';

const ResponsiveSidebar = ({ 
  children, 
  title, 
  icon = "⚙️"
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Listen to navbar sidebar state
  useEffect(() => {
    const checkNavbarState = () => {
      if (window.sidebarOpen !== undefined) {
        setIsSidebarOpen(window.sidebarOpen);
      }
    };

    // Check every 100ms for navbar state updates
    const interval = setInterval(checkNavbarState, 100);

    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && 
          !event.target.closest('.sidebar-container') && 
          !event.target.closest('nav') && // Don't close when clicking navbar
          window.setSidebarOpen) {
        window.setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-90 md:hidden"
          onClick={() => window.setSidebarOpen && window.setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          sidebar-container
          ${isMobile ? 'fixed' : 'sticky'} 
          ${isMobile ? 'top-0' : 'top-16'} left-0 
          ${isMobile ? 'h-screen' : 'h-[calc(100vh-4rem)]'}
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'z-[95]' : 'z-20'}
          ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile ? 'w-80' : 'w-64'}
        `}
      >
        <div className="w-full h-full p-6 bg-gray-900 text-white glassmorphism border-r border-gray-700">
          <h2 className="text-2xl font-extrabold text-center text-gray-100 tracking-wide mb-6">
            {icon} {title}
          </h2>
          {children}
        </div>
      </div>
    </>
  );
};

export default ResponsiveSidebar; 