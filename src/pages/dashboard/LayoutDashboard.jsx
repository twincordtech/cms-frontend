/* ========================================================================
 * File: LayoutDashboard.jsx
 * Description: Dashboard page for managing layout configurations with CRUD operations, table view, and modal forms.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Button, Table, Space, message, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getLayouts, deleteLayout } from '../../services/api';
import LayoutForm from '../../components/layouts/LayoutForm';
import { LayoutDashboardSkeleton } from '../../components/skeletons/DashboardSkeletons';

const { Content } = Layout;

const tagStyles = {
  dynamic: {
    color: '#9333EA',
    backgroundColor: '#F3E8FF',
    border: 'none',
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  static: {
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    border: 'none',
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  active: {
    color: '#16A34A',
    backgroundColor: '#F0FDF4',
    border: 'none',
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  inactive: {
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    border: 'none',
    borderRadius: '12px',
    padding: '2px 12px',
    fontSize: '12px',
    fontWeight: '500'
  }
};

const tableStyles = {
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: 'none',
  },
  header: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '12px 16px',
    borderBottom: '1px solid #F3F4F6',
  },
  row: {
    '&:hover': {
      backgroundColor: '#F9FAFB',
    },
    borderBottom: '1px solid #F3F4F6',
    transition: 'all 0.2s',
  },
  cell: {
    padding: '16px',
    color: '#374151',
    fontSize: '14px',
  },
  nameCell: {
    color: '#111827',
    fontWeight: '500',
    fontSize: '14px',
  },
  subText: {
    color: '#6B7280',
    fontSize: '13px',
    marginTop: '4px',
  },
  componentCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#374151',
    fontSize: '14px',
  },
  createdInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  createdDate: {
    color: '#374151',
    fontSize: '14px',
  },
  createdTime: {
    color: '#6B7280',
    fontSize: '13px',
  },
  authorCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  authorAvatar: {
    width: '28px',
    height: '28px',
    backgroundColor: '#3B82F6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  authorName: {
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
  },
  authorEmail: {
    color: '#6B7280',
    fontSize: '13px',
  },
  actionButton: {
    borderRadius: '8px',
    boxShadow: 'none',
    height: '32px',
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    borderColor: 'transparent',
    color: '#374151',
    '&:hover': {
      backgroundColor: '#E5E7EB',
      borderColor: 'transparent',
      color: '#111827',
    }
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderColor: 'transparent',
    color: '#DC2626',
    '&:hover': {
      backgroundColor: '#FEE2E2',
      borderColor: 'transparent',
      color: '#B91C1C',
    }
  }
};

/**
 * LayoutDashboard - Main dashboard component for managing layout configurations
 * Provides CRUD operations, table view, and modal forms for layout management
 */
const LayoutDashboard = () => {
  // State management for layouts and UI
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetch all layouts from the API
   * Updates the layouts state with fetched data
   */
  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const response = await getLayouts();
      setLayouts(response.data.data);
    } catch (error) {
      message.error('Failed to fetch layouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  /**
   * Handle layout deletion
   * @param {string} id - Layout ID to delete
   */
  const handleDelete = async (id) => {
    try {
      await deleteLayout(id);
      message.success('Layout deleted successfully');
      fetchLayouts();
    } catch (error) {
      message.error('Failed to delete layout');
    }
  };

  /**
   * Format date to modern readable format
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDateTimeModern = (date) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Get user initials from email address
   * @param {string} email - User email address
   * @returns {string} User initials
   */
  const getInitials = (email) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0].toUpperCase())
      .join('');
  };

  /**
   * Table columns configuration for layouts display
   * Defines structure and rendering for each column
   */
  const columns = [
    {
      title: 'BLOG DETAILS',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div style={tableStyles.nameCell}>{name}</div>
          <div style={tableStyles.subText}>{record.page?.slug}</div>
        </div>
      ),
    },
    {
      title: 'AUTHOR',
      dataIndex: ['createdBy', 'email'],
      key: 'author',
      render: (email) => (
        <div style={tableStyles.authorCell}>
          <div style={tableStyles.authorAvatar}>
            {getInitials(email)}
          </div>
          <div style={tableStyles.authorInfo}>
            <div style={tableStyles.authorName}>{email.split('@')[0]}</div>
            <div style={tableStyles.authorEmail}>{email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      render: (type = 'static') => (
        <Tag style={tagStyles[type.toLowerCase()]}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'CREATED',
      key: 'created',
      render: (_, record) => (
        <div style={{...tableStyles.createdInfo, alignItems: 'flex-start'}}>
          <span style={{...tableStyles.createdDate, fontWeight: 500}}>{formatDateTimeModern(record.createdAt)}</span>
        </div>
      ),
    },
    {
      title: 'PUBLISHED',
      key: 'published',
      render: (_, record) => (
        <div style={{...tableStyles.createdInfo, alignItems: 'flex-start'}}>
          <span style={{...tableStyles.createdDate, fontWeight: 500}}>{formatDateTimeModern(record.updatedAt)}</span>
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{ ...tableStyles.actionButton, ...tableStyles.editButton }}
            onClick={() => {
              setSelectedLayout(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            style={{ ...tableStyles.actionButton, ...tableStyles.deleteButton }}
            onClick={() => {
              setDeleteId(record._id);
              setShowDeleteConfirm(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <LayoutDashboardSkeleton />;
  }

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#F8FAFC' }}>
        <Card
          title="Layouts"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedLayout(null);
                setIsModalVisible(true);
              }}
              style={{
                borderRadius: '8px',
                height: '36px',
                padding: '0 16px',
                fontWeight: '500',
                background: '#2563EB',
                border: 'none',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              Create Layout
            </Button>
          }
          style={{ 
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: 'none'
          }}
          bodyStyle={{ padding: 0 }}
          headStyle={{
            borderBottom: '1px solid #F3F4F6',
            padding: '16px 24px',
            fontWeight: '600'
          }}
        >
          <Table
            columns={columns}
            dataSource={layouts}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true,
              style: { padding: '16px' }
            }}
            style={tableStyles.table}
            components={{
              header: {
                cell: (props) => (
                  <th style={tableStyles.header}>
                    {props.children}
                  </th>
                )
              }
            }}
            onRow={(record) => ({
              style: tableStyles.row
            })}
          />
        </Card>

        <Modal
          title={selectedLayout ? 'Edit Layout' : 'Create Layout'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={1300}
          className='p-0'
        >
          <div className="max-h-[75vh] overflow-y-auto">
          <LayoutForm
            layout={selectedLayout}
            onSuccess={() => {
              setIsModalVisible(false);
              fetchLayouts();
            }}
          />
          </div>
        </Modal>

        <Modal
          title="Delete Layout"
          open={showDeleteConfirm}
          onOk={async () => {
            await handleDelete(deleteId);
            setShowDeleteConfirm(false);
            setDeleteId(null);
          }}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteId(null);
          }}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this layout? This action cannot be undone.</p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default LayoutDashboard;

/* ========================================================================
 * End of LayoutDashboard.jsx
 * Description: End of layout dashboard component. Designed and developed by Tech4biz Solutions. Copyright © Tech4biz Solutions Private.
 * ======================================================================== */ 