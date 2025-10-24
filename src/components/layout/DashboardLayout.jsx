/**
 * DashboardLayout.jsx
 * 
 * A comprehensive layout component for the dashboard application.
 * Provides a responsive layout with collapsible sidebar, header,
 * and main content area with smooth animations and transitions.
 * 
 * Features:
 * - Responsive sidebar with collapse functionality
 * - Mobile-friendly overlay sidebar
 * - Smooth animations using Framer Motion
 * - Dark mode support
 * - Accessibility features
 * - Proper focus management
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

/**
 * DashboardLayout - Main layout component for dashboard application
 * 
 * @returns {JSX.Element} Dashboard layout component
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  /**
   * Toggle sidebar visibility for mobile devices
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /**
   * Toggle sidebar collapse state for desktop
   */
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  /**
   * Close sidebar on mobile when clicking outside
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * Handle escape key to close mobile sidebar
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  /**
   * Animation variants for mobile sidebar
   */
  const sidebarVariants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  /**
   * Animation variants for overlay backdrop
   */
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-20"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
              onClick={closeSidebar}
              aria-hidden="true"
            />
            
            {/* Sidebar */}
            <motion.div 
              className="fixed inset-y-0 left-0 flex flex-col"
              variants={sidebarVariants}
              style={{ width: isCollapsed ? '4rem' : '16rem' }}
            >
              <Sidebar 
                closeSidebar={closeSidebar} 
                isCollapsed={isCollapsed} 
                toggleCollapse={toggleCollapse} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300`}>
        <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <Sidebar 
            isCollapsed={isCollapsed} 
            toggleCollapse={toggleCollapse} 
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-gray-800">
        {/* Header */}
        <DashboardHeader toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <motion.main 
          className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-screen pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: 'easeOut'
          }}
        >
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </motion.main>
        {/* Modern, Open Source Attribution Footer */}
        <footer className="fixed bottom-0 left-0 w-full text-center text-xs text-gray-600 bg-gradient-to-r from-blue-50 via-white to-blue-50 py-3 z-50 border-t border-blue-100 flex items-center justify-center gap-2 shadow-sm">
          <span className="inline-flex items-center gap-1 font-semibold">
            <svg className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17l4-4-4-4m8 8V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2z" /></svg>
            Fentro CMS — Crafted with <span className="mx-1" role="img" aria-label="love">❤️</span>
            and powered by
            <a href="https://cloudtopiaa.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition underline">
              Cloudtopiaa
              <svg className="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

/**
 * @copyright Tech4biz Solutions Private
 */ 