// ===============================
// File: dashboardRoutes.jsx
// Description: Dashboard route configuration for main dashboard, leads, profile, and settings.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { UserOutlined, DashboardOutlined, FileOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import Dashboard from '../pages/dashboard/Dashboard';
import Profile from '../pages/dashboard/Profile';
import Settings from '../pages/dashboard/Settings';
import LeadsManagement from '../pages/dashboard/LeadsManagement';

/**
 * dashboardRoutes defines the route configuration for the dashboard section.
 * Each route includes a path, element, icon, and label.
 * @type {Array<{ path: string, element: JSX.Element, icon: JSX.Element, label: string }>}
 */
const dashboardRoutes = [
  {
    path: '',
    element: <Dashboard />, // Main dashboard page
    icon: <DashboardOutlined />,
    label: 'Dashboard'
  },
  {
    path: 'leads',
    element: <LeadsManagement />, // Leads management page
    icon: <UserAddOutlined />,
    label: 'Leads Management'
  },
  {
    path: 'profile',
    element: <Profile />, // User profile page
    icon: <UserOutlined />,
    label: 'Profile'
  },
  {
    path: 'settings',
    element: <Settings />, // Settings page
    icon: <SettingOutlined />,
    label: 'Settings'
  }
];

export default dashboardRoutes;
// ===============================
// End of File: dashboardRoutes.jsx
// Description: Dashboard route configuration
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 