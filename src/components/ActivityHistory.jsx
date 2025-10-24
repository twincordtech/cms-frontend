// ===============================
// File: ActivityHistory.jsx
// Description: Displays a paginated, filterable table of user activities with details modal. Includes accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Select, DatePicker, Space, Typography, Tooltip, Button, Modal } from 'antd';
import { FaHistory, FaUser, FaCalendarAlt, FaInfoCircle, FaDownload } from 'react-icons/fa';
import { format } from 'date-fns';
import { getActivities } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * ActivityHistory displays a paginated, filterable table of user activities.
 * Includes details modal, accessibility, error handling, and user feedback.
 * @component
 */
const ActivityHistory = () => {
  // State for activities, loading, error, pagination, filters, and modal
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    action: null,
    entity: null,
    dateRange: null
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { user } = useAuth();

  /**
   * Fetch activities from API with current filters and pagination
   * @param {Object} params - Pagination params
   */
  const fetchActivities = async (params = pagination) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActivities({
        page: params.current,
        limit: params.pageSize,
        ...filters,
        startDate: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: filters.dateRange?.[1]?.format('YYYY-MM-DD')
      });
      setActivities(response.data);
      setPagination({
        ...params,
        total: response.pagination.total,
        current: response.pagination.page
      });
    } catch (error) {
      setError(error.message || 'Failed to fetch activities. Please try again.');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities when filters change
  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /**
   * Get color for action tag
   * @param {string} action
   * @returns {string}
   */
  const getActionColor = (action) => {
    const colors = {
      create: 'green',
      update: 'blue',
      delete: 'red',
      view: 'purple',
      login: 'cyan',
      logout: 'orange',
      status_change: 'gold',
      meeting_scheduled: 'magenta'
    };
    return colors[action] || 'default';
  };

  /**
   * Get icon for entity type
   * @param {string} entity
   * @returns {JSX.Element}
   */
  const getEntityIcon = (entity) => {
    const icons = {
      lead: <FaUser className="text-blue-500" aria-label="Lead" />,
      user: <FaUser className="text-green-500" aria-label="User" />,
      meeting: <FaCalendarAlt className="text-purple-500" aria-label="Meeting" />,
      auth: <FaHistory className="text-orange-500" aria-label="Auth" />
    };
    return icons[entity] || <FaHistory aria-label="Activity" />;
  };

  /**
   * Open details modal for selected activity
   * @param {Object} activity
   */
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailsModalVisible(true);
  };

  // Table columns definition with accessibility and tooltips
  const columns = [
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center" aria-label="User Initial">
            {record.user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.user?.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={getActionColor(action)} aria-label={`Action: ${action}`}>
          {action.charAt(0).toUpperCase() + action.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity',
      render: (entity) => (
        <div className="flex items-center gap-2">
          {getEntityIcon(entity)}
          <span className="capitalize">{entity}</span>
        </div>
      )
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (details, record) => (
        <div className="flex items-center gap-2">
          <div className="text-gray-600">
            {details.method} {details.path}
          </div>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<FaInfoCircle className="text-blue-500" aria-label="View Details" />}
              aria-label="View Details"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => format(new Date(date), 'MMM dd, yyyy h:mm a')
    }
  ];

  /**
   * Render the details modal for an activity
   * @returns {JSX.Element}
   */
  const renderDetailsModal = () => (
    <Modal
      title="Activity Details"
      open={detailsModalVisible}
      onCancel={() => setDetailsModalVisible(false)}
      footer={null}
      width={800}
      aria-modal="true"
      aria-labelledby="activity-details-title"
      destroyOnClose
    >
      {selectedActivity && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary">User</Text>
              <div className="mt-1">
                <div className="font-medium">{selectedActivity.user?.name}</div>
                <div className="text-gray-500">{selectedActivity.user?.email}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary">Action</Text>
              <div className="mt-1">
                <Tag color={getActionColor(selectedActivity.action)}>
                  {selectedActivity.action.charAt(0).toUpperCase() + selectedActivity.action.slice(1)}
                </Tag>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text type="secondary">Request Details</Text>
            <div className="mt-2 space-y-2">
              <div>
                <Text strong>Method:</Text> {selectedActivity.details.method}
              </div>
              <div>
                <Text strong>Path:</Text> {selectedActivity.details.path}
              </div>
              {selectedActivity.details.params && Object.keys(selectedActivity.details.params).length > 0 && (
                <div>
                  <Text strong>Params:</Text>
                  <pre className="mt-1 bg-white p-2 rounded text-sm" aria-label="Params">
                    {JSON.stringify(selectedActivity.details.params, null, 2)}
                  </pre>
                </div>
              )}
              {selectedActivity.details.body && Object.keys(selectedActivity.details.body).length > 0 && (
                <div>
                  <Text strong>Body:</Text>
                  <pre className="mt-1 bg-white p-2 rounded text-sm" aria-label="Body">
                    {JSON.stringify(selectedActivity.details.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary">IP Address</Text>
              <div className="mt-1">{selectedActivity.ipAddress}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text type="secondary">User Agent</Text>
              <div className="mt-1 text-sm">{selectedActivity.userAgent}</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <Card aria-label="Activity History" tabIndex={0}>
      <div className="flex items-center justify-between mb-6">
        <Title level={4} className="flex items-center gap-2" id="activity-details-title">
          <FaHistory className="text-blue-500" aria-hidden="true" />
          Activity History
        </Title>
        <Space>
          {/* Action Filter */}
          <Select
            placeholder="Filter by Action"
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, action: value })}
            allowClear
            aria-label="Filter by Action"
          >
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="update">Update</Select.Option>
            <Select.Option value="delete">Delete</Select.Option>
            <Select.Option value="view">View</Select.Option>
            <Select.Option value="login">Login</Select.Option>
            <Select.Option value="logout">Logout</Select.Option>
            <Select.Option value="status_change">Status Change</Select.Option>
            <Select.Option value="meeting_scheduled">Meeting Scheduled</Select.Option>
          </Select>
          {/* Entity Filter */}
          <Select
            placeholder="Filter by Entity"
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, entity: value })}
            allowClear
            aria-label="Filter by Entity"
          >
            <Select.Option value="lead">Lead</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="meeting">Meeting</Select.Option>
            <Select.Option value="auth">Auth</Select.Option>
          </Select>
          {/* Date Range Filter */}
          <RangePicker
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            allowClear
            aria-label="Filter by Date Range"
          />
          {/* Export Button (future: implement export logic) */}
          <Button
            type="primary"
            icon={<FaDownload aria-label="Export" />}
            aria-label="Export Activities"
            onClick={() => {
              // TODO: Implement export functionality
            }}
          >
            Export
          </Button>
        </Space>
      </div>
      {/* Error message display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <Text type="danger">{error}</Text>
        </div>
      )}
      {/* Activities Table */}
      <Table
        columns={columns}
        dataSource={activities}
        rowKey="_id"
        pagination={pagination}
        loading={loading}
        onChange={(pagination) => fetchActivities(pagination)}
        aria-label="Activity Table"
      />
      {/* Details Modal */}
      {renderDetailsModal()}
    </Card>
  );
};

export default ActivityHistory;
// ===============================
// End of File: ActivityHistory.jsx
// Description: Activity history table with details modal
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 