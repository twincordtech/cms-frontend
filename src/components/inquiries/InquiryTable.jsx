/**
 * InquiryTable.jsx
 * 
 * A comprehensive table component for displaying and managing inquiry data.
 * Provides a data table with sorting, pagination, and action buttons for
 * inquiry management operations including preview, history, meeting scheduling,
 * and deletion.
 * 
 * Features:
 * - Responsive data table with sorting and pagination
 * - Status-based color coding for visual clarity
 * - Action buttons for inquiry management
 * - Tooltip-enhanced user interface
 * - Loading states and error handling
 * - Accessible table structure
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Table, Space, Button, Tag, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, VideoCameraOutlined, ClockCircleOutlined } from '@ant-design/icons';

/**
 * Get color for status tag based on inquiry status
 * 
 * @param {string} status - The inquiry status
 * @returns {string} Color code for the status tag
 */
const getStatusColor = (status) => {
  const colors = {
    new: '#1890ff',
    contacted: '#52c41a',
    qualified: '#722ed1',
    closed: '#f5222d',
    rejected: '#fa541c'
  };
  return colors[status] || '#1890ff';
};

/**
 * InquiryTable - Table component for displaying and managing inquiries
 * 
 * @param {Object} props - Component props
 * @param {Array} props.inquiries - Array of inquiry data objects
 * @param {boolean} props.loading - Loading state for table data
 * @param {Object} props.pagination - Pagination configuration object
 * @param {Function} props.onTableChange - Callback for table state changes
 * @param {Function} props.onPreview - Callback for inquiry preview action
 * @param {Function} props.onDelete - Callback for inquiry deletion action
 * @param {Function} props.onScheduleMeeting - Callback for meeting scheduling action
 * @param {Function} props.onHistory - Callback for status history action
 * @returns {JSX.Element} Inquiry data table
 */
const InquiryTable = ({ 
  inquiries, 
  loading, 
  pagination, 
  onTableChange, 
  onPreview, 
  onDelete, 
  onScheduleMeeting, 
  onHistory 
}) => {
  // Format date for display with error handling
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  // Handle action button clicks with confirmation for destructive actions
  const handleDelete = (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      onDelete(inquiryId);
    }
  };

  // Table column definitions with sorting and filtering capabilities
  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      render: (text, record) => (
        <span style={{ fontWeight: 500 }}>
          {record.firstName} {record.lastName}
        </span>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email) => (
        <a href={`mailto:${email}`} style={{ color: '#1890ff' }}>
          {email}
        </a>
      )
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => (a.companyName || '').localeCompare(b.companyName || ''),
      render: (companyName) => companyName || '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Contacted', value: 'contacted' },
        { text: 'Qualified', value: 'qualified' },
        { text: 'Closed', value: 'closed' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 500 }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => formatDate(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View inquiry details">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => onPreview(record)}
              type="text"
              size="small"
            />
          </Tooltip>
          <Tooltip title="View status history">
            <Button 
              icon={<ClockCircleOutlined />} 
              onClick={() => onHistory(record)}
              type="text"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Schedule meeting">
            <Button 
              icon={<VideoCameraOutlined />} 
              onClick={() => onScheduleMeeting(record)}
              type="text"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete inquiry">
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              onClick={() => handleDelete(record._id)}
              type="text"
              size="small"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={inquiries}
      rowKey="_id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} inquiries`,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      onChange={onTableChange}
      scroll={{ x: 1000 }}
      size="middle"
      bordered={false}
      style={{ 
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};

export default InquiryTable;

/**
 * @copyright Tech4biz Solutions Private
 */ 