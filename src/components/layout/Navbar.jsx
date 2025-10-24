/**
 * Navbar.jsx
 * 
 * A comprehensive navigation bar component for the application.
 * Provides responsive navigation with authentication-aware menu items,
 * mobile menu functionality, and smooth animations.
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Authentication-aware navigation
 * - Smooth animations using Framer Motion
 * - Dark mode support
 * - Accessibility features
 * - Focus management
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Navbar - Navigation bar component for the application
 * 
 * @returns {JSX.Element} Navigation bar component
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  /**
   * Handle user logout with proper error handling
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Could add notification here for logout failure
    }
  };

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /**
   * Handle escape key to close mobile menu
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  /**
   * Navigation links configuration
   */
  const navigationLinks = [
    { to: '/', label: 'Home' }
  ];

  /**
   * Animation variants for mobile menu
   */
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                aria-label="Go to homepage"
              >
                FentroCMS
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-primary-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop User Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors duration-200"
                  type="button"
                  aria-label="Logout from application"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
              type="button"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="sm:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="mt-3 space-y-1">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500 transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-500 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-200"
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-500 transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block pl-3 pr-4 py-2 border-l-4 border-primary-500 text-base font-medium text-primary-700 dark:text-primary-500 bg-primary-50 dark:bg-gray-800 transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

/**
 * @copyright Tech4biz Solutions Private
 */ 