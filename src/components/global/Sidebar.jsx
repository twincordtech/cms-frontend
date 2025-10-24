// ===============================
// File: Sidebar.jsx
// Description: Navigation sidebar component for the dashboard with menu items and routing.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  UserAddOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

/**
 * Sidebar provides the main navigation menu for the dashboard.
 * Features responsive design, active state highlighting, and icon-based navigation.
 */
const Sidebar = () => {
  const location = useLocation();

  // Menu items configuration with icons and routes
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>
    },
    {
      key: 'leads',
      icon: <UserAddOutlined />,
      label: <Link to="/dashboard/leads">Leads Management</Link>
    },
    {
      key: 'inquiries',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/dashboard/inquiries">Inquiries Management</Link>
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/dashboard/profile">Profile</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/dashboard/settings">Settings</Link>
    }
  ];

  return (
    <Sider
      width={250}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000
      }}
    >
      {/* Sidebar header with logo */}
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>CMS Dashboard</h2>
      </div>
      {/* Navigation menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
// ===============================
// End of File: Sidebar.jsx
// Description: Dashboard navigation sidebar
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 