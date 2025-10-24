/**
 * DashboardHeader.jsx
 * 
 * A comprehensive header component for the dashboard layout.
 * Provides navigation controls, search functionality, user actions,
 * and responsive design for both desktop and mobile views.
 * 
 * Features:
 * - Responsive design with mobile menu toggle
 * - Global search functionality
 * - User authentication controls
 * - Notification center integration
 * - Dark mode support
 * - Accessibility features
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../global/NotificationCenter';

/**
 * DashboardHeader - Header component for dashboard layout
 * 
 * @param {Object} props - Component props
 * @param {Function} props.toggleSidebar - Callback to toggle sidebar visibility
 * @returns {JSX.Element} Dashboard header component
 */
const DashboardHeader = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
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
   * Handle search input changes
   * 
   * @param {Event} event - Input change event
   */
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    // Implement search functionality here
    console.log('Search term:', searchTerm);
  };

  /**
   * Handle search form submission
   * 
   * @param {Event} event - Form submission event
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchTerm = formData.get('search');
    // Implement search submission here
    console.log('Search submitted:', searchTerm);
  };
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      {/* Mobile Menu Toggle */}
      <button
        className="block lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar menu"
        type="button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>
      
      {/* Search Bar */}
      <div className="flex-1 flex justify-center px-2 lg:justify-end">
        <div className="w-full max-w-lg lg:max-w-xs">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              className="block w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
              placeholder="Search..."
              onChange={handleSearchChange}
              aria-label="Search dashboard"
            />
          </form>
        </div>
      </div>
      
      {/* User Actions */}
      <div className="ml-4 flex items-center gap-3">
        {/* Logout Button */}
        <button
          className="hidden align-center justify-center sm:flex  btn btn-outline hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors duration-200 w-full"
          onClick={handleLogout}
          type="button"
          aria-label="Logout from dashboard"
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
       <span>   Logout</span>
        </button>

        {/* Mobile Logout Button */}
        <button
          className="sm:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          onClick={handleLogout}
          type="button"
          aria-label="Logout from dashboard"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
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
        </button>

        {/* Notification Center */}
        <NotificationCenter />
      </div>
    </header>
  );
};

export default DashboardHeader;

/**
 * @copyright Tech4biz Solutions Private
 */ 