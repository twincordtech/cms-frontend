/**
 * Sidebar.jsx
 * 
 * A comprehensive sidebar component for the dashboard application.
 * Provides collapsible navigation with role-based menu items,
 * smooth animations, and responsive design for all screen sizes.
 * 
 * Features:
 * - Collapsible sidebar with smooth animations
 * - Role-based menu visibility (admin/user)
 * - Responsive design for mobile and desktop
 * - Smooth hover effects and transitions
 * - Dark mode support
 * - Accessibility features
 * - User profile information display
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFile, FaColumns, FaCode, FaUsers, FaUser, FaFileAlt, FaTh, FaImage, FaEnvelope, FaBlog, FaCubes, FaLayerGroup, FaList, FaUserPlus, FaChevronLeft, FaChevronRight, FaHistory, FaEnvelopeOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Sidebar - Collapsible sidebar component for dashboard navigation
 * 
 * @param {Object} props - Component props
 * @param {Function} props.closeSidebar - Callback to close mobile sidebar
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.toggleCollapse - Callback to toggle collapse state
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = ({ closeSidebar, isCollapsed, toggleCollapse }) => {
  const { user, isAdmin } = useAuth();
  const { pathname } = useLocation();
  
  /**
   * Menu sections configuration with role-based visibility
   */
  const menuSections = {
    main: [
      {
        to: '/dashboard',
        icon: <FaHome className="w-5 h-5" />,
        text: 'Dashboard',
        description: 'Main dashboard overview'
      }
    ],
    management: [
      {
        to: '/dashboard/leads',
        icon: <FaUserPlus className="w-5 h-5" />,
        text: 'Leads Management',
        description: 'Manage lead information',
        adminOnly: true
      },
      {
        to: '/dashboard/users',
        icon: <FaUsers className="w-5 h-5" />,
        text: 'Users',
        description: 'User management',
        adminOnly: true
      },
      {
        to: '/dashboard/inquiries',
        icon: <FaEnvelopeOpen className="w-5 h-5" />,
        text: 'Inquiries',
        description: 'Manage customer inquiries',
        adminOnly: true
      }
    ],
 
    content: [
      {
        to: '/dashboard/pages',
        icon: <FaFileAlt className="w-5 h-5" />,
        text: 'Pages',
        description: 'Page management',
        adminOnly: true
      },
      {
        to: '/dashboard/components',
        icon: <FaCubes className="w-5 h-5" />,
        text: 'Components',
        description: 'Component library',
        adminOnly: true
      },
      {
        to: '/dashboard/layouts',
        icon: <FaLayerGroup className="w-5 h-5" />,
        text: 'Layouts',
        description: 'Layout management',
        adminOnly: true
      },
      {
        to: '/dashboard/content',
        icon: <FaList className="w-5 h-5" />,
        text: 'Content',
        description: 'Content management',
        adminOnly: true
      },
      {
        to: '/dashboard/blogs',
        icon: <FaBlog className="w-5 h-5" />,
        text: 'Blog',
        description: 'Blog management',
        adminOnly: true
      },
      {
        to: '/dashboard/media',
        icon: <FaImage className="w-5 h-5" />,
        text: 'Media Library',
        description: 'Media file management',
        adminOnly: true
      }
    ],
    tools: [
      {
        to: '/dashboard/api-playground',
        icon: <FaCode className="w-5 h-5" />,
        text: 'API Playground',
        description: 'API testing and documentation',
        adminOnly: true
      },
      {
        to: '/dashboard/newsletter',
        icon: <FaEnvelope className="w-5 h-5" />,
        text: 'Newsletter',
        description: 'Newsletter management',
        adminOnly: true
      }
    ],
    profile: [
      {
        to: '/dashboard/profile',
        icon: <FaUser className="w-5 h-5" />,
        text: 'Profile',
        description: 'User profile settings'
      }
    ],
   
  };

  /**
   * Render individual menu item with proper accessibility
   * 
   * @param {Object} item - Menu item configuration
   * @returns {JSX.Element|null} Menu item component
   */
  const renderMenuItem = (item) => {
    // Hide admin-only items for non-admin users
    if (item.adminOnly && !isAdmin()) return null;

    const isActive = pathname === item.to;

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-2xl transition-all duration-300 relative ${
          isActive
            ? 'bg-gradient-to-r from-white/80 to-white/60 text-blue-600 shadow-[0_0_20px_rgba(191,219,254,0.3)] backdrop-blur-lg border border-white/40'
            : 'text-slate-600 hover:bg-gradient-to-r hover:from-white/50 hover:to-white/30 hover:text-blue-600 hover:shadow-[0_0_15px_rgba(191,219,254,0.2)] hover:border hover:border-white/30'
        } ${isCollapsed ? 'justify-center w-10 h-10 p-0 mx-auto' : ''}`}
        onClick={closeSidebar}
        aria-label={item.description || item.text}
        title={isCollapsed ? item.text : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          <span className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isCollapsed ? '' : 'mr-3'}`}>
            {item.icon}
          </span>
          {!isCollapsed && <span className="font-medium">{item.text}</span>}
        </div>
        {isActive && !isCollapsed && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-2 w-1 h-1 rounded-full bg-blue-500"
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    );
  };

  /**
   * Render menu section with title and items
   * 
   * @param {string} title - Section title
   * @param {Array} items - Menu items array
   * @returns {JSX.Element|null} Menu section component
   */
  const renderSection = (title, items) => {
    // Only render section if it has visible items
    if (!items.some(item => !item.adminOnly || (item.adminOnly && isAdmin()))) return null;

    return (
      <div className="mb-6">
        {!isCollapsed && (
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </h3>
        )}
        <nav className="space-y-1.5" role="navigation" aria-label={`${title} navigation`}>
          {items.map(renderMenuItem)}
        </nav>
      </div>
    );
  };
  
  return (
    <div 
      className={`flex flex-col h-full transition-all duration-300 relative
        before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:via-blue-50/10 before:to-white/20 before:backdrop-blur-xl before:-z-10
        after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/10 after:to-transparent after:backdrop-blur-2xl after:-z-20
        border-r border-white/30 shadow-[0_0_30px_-12px_rgba(0,0,0,0.02)]
        ${isCollapsed ? 'items-center w-20' : 'w-64'}`
      }
    >
      {/* Header Section */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100/40 scrollbar-track-transparent">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 mb-6`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500/90 to-blue-400/90 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/20 backdrop-blur-sm">
                <span className="text-white font-bold text-lg" aria-label="FentroCMS Logo">M</span>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Fentro CMS
              </span>
            </div>
          )}
          
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            className={`p-2 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 hover:from-white/60 hover:to-white/40 
              text-blue-500 hover:text-blue-600 focus:outline-none transition-all duration-300 
              shadow-[0_0_15px_rgba(191,219,254,0.2)] hover:shadow-[0_0_20px_rgba(191,219,254,0.3)] 
              backdrop-blur-xl border border-white/30 hover:border-white/40
              ${isCollapsed ? 'w-10 h-10' : ''}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            type="button"
          >
            {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {renderSection('MAIN', menuSections.main)}
          {renderSection('MANAGEMENT', menuSections.management)}
          {renderSection('CONTENT', menuSections.content)}
          {renderSection('TOOLS', menuSections.tools)}
          {renderSection('PROFILE', menuSections.profile)}
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className={` relative z-[9999] p-4 border-t border-white/20 bg-gradient-to-r from-white/20 to-transparent backdrop-blur-xl ${isCollapsed ? 'text-center' : ''}`}>
        <div className="flex items-center">
          <div className={`flex-1 min-w-0 ${isCollapsed ? 'hidden' : ''}`}>
            <p className="text-sm font-medium text-slate-700 truncate" title={user?.email}>
              {user?.email}
            </p>
            <p className="text-xs text-slate-500">
              {isAdmin() ? 'Administrator' : 'User'}
            </p>
          </div>
          <div className={`${
            isCollapsed ? 'w-10 h-10' : 'w-10 h-10 ml-3'
          } rounded-2xl bg-gradient-to-r from-white/50 to-white/30 flex items-center justify-center 
            shadow-[0_0_15px_rgba(191,219,254,0.2)] backdrop-blur-xl border border-white/30`}>
            <FaUser className="w-4 h-4 text-blue-500" aria-label="User profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

/**
 * @copyright Tech4biz Solutions Private
 */ 