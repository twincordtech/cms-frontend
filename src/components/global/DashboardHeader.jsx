// ===============================
// File: DashboardHeader.jsx
// Description: Dashboard header component with user menu, notifications, and socket connection for real-time updates.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, Space, Badge, Button } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import { io } from 'socket.io-client';

const { Header } = Layout;

/**
 * DashboardHeader provides the main navigation header for the dashboard with user menu, notifications, and real-time updates.
 * Manages socket connection for live notifications and user authentication state.
 */
const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket connection for real-time notifications
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Listen for new notifications from server
    newSocket.on('notification', (notification) => {
      setUnreadCount(prev => prev + 1);
    });

    setSocket(newSocket);

    // Cleanup socket connection on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User menu items for dropdown
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/dashboard/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/dashboard/settings')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Header className="dashboard-header" style={{ 
      background: '#fff', 
      padding: '0 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Dashboard logo/brand */}
      <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold' }}>
        CMS Dashboard
      </div>
      
      <Space size="large">
        {/* Notification center with real-time updates */}
        <NotificationCenter socket={socket} unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
        
        {/* User dropdown menu */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              icon={<UserOutlined />} 
              src={user?.avatar} 
              style={{ backgroundColor: '#1890ff' }}
            />
            <span style={{ fontWeight: 500 }}>{user?.name || 'User'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardHeader;
// ===============================
// End of File: DashboardHeader.jsx
// Description: Dashboard header component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 