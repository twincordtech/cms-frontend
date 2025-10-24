// ===============================
// File: NotificationCenter.jsx
// Description: Real-time notification center with drawer interface, polling, and notification management.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Badge, Drawer, List, Button, Empty, Spin, message, notification } from 'antd';
import { 
  BellOutlined, 
  CheckOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  ClockCircleOutlined,
  MailOutlined
} from '@ant-design/icons';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import './NotificationCenter.css';
import { FaBell } from 'react-icons/fa';

/**
 * NotificationCenter provides a comprehensive notification management system with real-time updates.
 * Features include polling for new notifications, mark as read functionality, and notification deletion.
 */
const NotificationCenter = () => {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Get appropriate icon for notification type
  const getNotificationIcon = (type, data) => {
    if (data?.type === 'upcoming' || data?.type === 'sent') {
      return <MailOutlined style={{ color: '#1890ff' }} />;
    }
    return <UserOutlined style={{ color: '#52c41a' }} />;
  };

  // Generate notification content based on type and data
  const getNotificationContent = (notification) => {
    const { data } = notification;
    
    // Newsletter notifications
    if (data?.type === 'upcoming') {
      return (
        <div>
          <p><strong>{data.subject}</strong></p>
          <p>Scheduled to send in 10 minutes</p>
          <p className="text-xs text-gray-400 mt-1">
            Scheduled time: {new Date(data.nextSendDate).toLocaleString()}
          </p>
        </div>
      );
    }
    
    if (data?.type === 'sent') {
      return (
        <div>
          <p><strong>{data.subject}</strong></p>
          <p>Newsletter has been sent successfully</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      );
    }

    if (data?.type === 'subscription') {
      return (
        <div>
          <p><strong>{data.email}</strong></p>
          <p>New newsletter subscription</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(data.subscribedAt), { addSuffix: true })}
          </p>
        </div>
      );
    }

    if (data?.type === 'unsubscription') {
      return (
        <div>
          <p><strong>{data.email}</strong></p>
          <p>Unsubscribed from newsletter</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(data.unsubscribedAt), { addSuffix: true })}
          </p>
        </div>
      );
    }

    if (data?.type === 'reactivation') {
      return (
        <div>
          <p><strong>{data.email}</strong></p>
          <p>Reactivated newsletter subscription</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(data.subscribedAt), { addSuffix: true })}
          </p>
        </div>
      );
    }

    // Meeting notifications
    if (data?.meetingTitle) {
      return (
        <div>
          <p><strong>{data.meetingTitle}</strong></p>
          <p>Meeting with {data.leadName}</p>
          <div className="mt-2">
            <p className="text-sm">
              {new Date(data.meetingDateTime).toLocaleString()} ({data.meetingDuration})
            </p>
            {data.locationType === 'virtual' && (
              <p className="text-sm">
                Via {data.platform === 'meet' ? 'Google Meet' : 'Zoom'}
              </p>
            )}
            {data.locationType === 'offline' && (
              <p className="text-sm">Location: {data.location}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Scheduled by {data.scheduledBy?.name || 'Admin'}
          </p>
        </div>
      );
    }

    // Lead notifications (default)
    return (
      <div>
        <p><strong>{data?.leadName}</strong> ({data?.leadEmail})</p>
        {data?.leadCompany && <p>Company: {data.leadCompany}</p>}
        <p className="text-xs text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
    );
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      const newNotifications = response.data;
      
      // Update notifications state with deduplication
      setNotifications(prevNotifications => {
        // Create a map of existing notifications by ID
        const existingNotifs = new Map(prevNotifications.map(n => [n._id, n]));
        
        // Process new notifications and show popups
        newNotifications.forEach(notif => {
          const isUpcoming = notif.data?.type === 'upcoming';
          const shownIds = getShownNotificationIds();
          const alreadyShown = shownIds.includes(notif._id);
          // Only show popup if not already shown, or if it's an upcoming notification
          if ((!alreadyShown && !isUpcoming) || isUpcoming) {
            notification.info({
              message: notif.title,
              description: notif.message,
              placement: 'topRight',
              duration: 5,
              icon: getNotificationIcon(notif.type, notif.data),
              onClick: () => setVisible(true),
              className: 'custom-notification'
            });
            // Mark as shown in localStorage (persist across refresh)
            if (!isUpcoming) addShownNotificationId(notif._id);
          }
        });

        // Update last fetch time
        setLastFetchTime(new Date());
        
        // Return merged notifications, keeping the most recent version of each
        const mergedNotifications = newNotifications.map(notif => ({
          ...existingNotifs.get(notif._id),
          ...notif
        }));
        
        // Sort by creation date, newest first
        return mergedNotifications.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      });

      // Update unread count
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    } catch (error) {
      message.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark individual notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  // Delete individual notification
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = notifications.filter(n => n._id !== id);
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      message.error('Failed to delete notification');
    }
  };

  // Get color for notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#52c41a';
      case 'warning': return '#faad14';
      case 'error': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  // Format time ago for display
  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper to get shown notification IDs from localStorage
  const getShownNotificationIds = () => {
    try {
      return JSON.parse(localStorage.getItem('shownNotificationIds') || '[]');
    } catch {
      return [];
    }
  };

  // Helper to add shown notification ID to localStorage
  const addShownNotificationId = (id) => {
    const ids = getShownNotificationIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem('shownNotificationIds', JSON.stringify(ids));
    }
  };

  return (
    <>
      {/* Notification bell with badge */}
      <Badge 
        count={unreadCount} 
        offset={[-6, 6]}
        className="notification-badge-wrapper"
      >
        <button className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors relative"
          onClick={() => setVisible(true)}
        >
          <FaBell className="w-5 h-5 text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </Badge> 

      {/* Notification drawer */}
      <Drawer
        title={
          <div className="notification-header">
            <span className="notification-title">Notifications</span>
            {unreadCount > 0 && (
              <Badge 
                count={unreadCount} 
                style={{ backgroundColor: '#52c41a' }}
                className="notification-count-badge"
              />
            )}
          </div>
        }
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={480}
        className="notification-drawer"
        extra={
          notifications.length > 0 && (
            <Button 
              type="primary" 
              ghost 
              onClick={handleMarkAllAsRead}
              className="mark-all-read-button"
            >
              Mark all as read
            </Button>
          )
        }
      >
        {loading ? (
          <div className="notification-loading">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <Empty 
            description="No notifications" 
            className="notification-empty"
          />
        ) : (
          <List
            className="notification-list"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`notification-item ${!item.read ? 'unread' : ''}`}
                actions={[
                  !item.read && (
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => handleMarkAsRead(item._id)}
                      className="read-button"
                    />
                  ),
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(item._id)}
                    className="delete-button"
                  />
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="notification-item-header">
                      <span
                        className="notification-type-indicator"
                        style={{ backgroundColor: getNotificationColor(item.type) }}
                      />
                      <span className={!item.read ? 'font-semibold' : ''}>
                        {item.title}
                      </span>
                    </div>
                  }
                  description={
                    <div className="notification-content">
                      <p className="notification-message">{item.message}</p>
                      {item.data?.leadCompany && (
                        <p className="notification-company">
                          Company: {item.data.leadCompany}
                        </p>
                      )}
                      <div className="notification-time">
                        <ClockCircleOutlined className="time-icon" />
                        {getTimeAgo(item.createdAt)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default NotificationCenter;
// ===============================
// End of File: NotificationCenter.jsx
// Description: Real-time notification center
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 