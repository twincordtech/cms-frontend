/**
 * DashboardLayout.jsx
 * 
 * A comprehensive dashboard layout component using Ant Design.
 * Provides a structured layout with header, sidebar, and content areas
 * with user authentication integration and notification system.
 * 
 * Features:
 * - Ant Design Layout components integration
 * - User authentication display
 * - Notification center integration
 * - Responsive design
 * - Dark mode support
 * - Accessibility features
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';

const { Header, Content, Sider } = Layout;

/**
 * DashboardLayout - Main dashboard layout component using Ant Design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in content area
 * @returns {JSX.Element} Dashboard layout component
 */
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  /**
   * Get user display name with fallback
   * 
   * @returns {string} User display name
   */
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || user.email || user.username || 'Admin';
  };

  /**
   * Get user role for display
   * 
   * @returns {string} User role
   */
  const getUserRole = () => {
    if (!user) return 'Guest';
    return user.role || 'User';
  };

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <Header className="bg-white dark:bg-gray-800 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600" />
          <span className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
            Welcome back
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <NotificationCenter />
          
          {/* User Information */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {getUserDisplayName()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getUserRole()}
              </div>
            </div>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Header>
      
      {/* Main Content Area */}
      <Layout className="flex-1">
        <Content className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

/**
 * @copyright Tech4biz Solutions Private
 */ 