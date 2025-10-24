/* ========================================================================
 * File: LeadsManagement.jsx
 * Description: Production-quality leads management dashboard with high-quality standards, modularized subcomponents, and modern UI/UX.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Tag, Modal, message, Typography, Card, Select, Input, Timeline, Tooltip, DatePicker, TimePicker, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, MailOutlined, ClockCircleOutlined, HistoryOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { FaBuilding, FaClock, FaPhone } from 'react-icons/fa';
import { getLeads, updateLeadStatus, deleteLead, scheduleMeeting } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { LeadsManagementSkeleton, LeadDetailsSkeleton } from '../../components/skeletons/LeadsManagementSkeleton';
import StatusHistoryModal from '../../components/leads/StatusHistoryModal';
import MeetingModal from '../../components/leads/MeetingModal';
import StatusButtons from '../../components/leads/StatusButtons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * LeadsManagement - Main dashboard for managing leads
 * Modularized for maintainability and production quality
 * @component
 */
const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedHistoryLead, setSelectedHistoryLead] = useState(null);
  const [usedStatuses, setUsedStatuses] = useState(new Set());
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [selectedMeetingLead, setSelectedMeetingLead] = useState(null);
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    date: null,
    time: null,
    duration: '1 hour',
    locationType: 'virtual',
    location: '',
    meetingLink: '',
    platform: 'meet',
    agenda: ''
  });
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);

  const fetchLeads = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getLeads({
        page: params.current,
        limit: params.pageSize,
        ...params
      });
      
      setLeads(response.data);
      setPagination({
        ...params,
        total: response.pagination.total,
        current: response.pagination.page
      });
    } catch (error) {
      message.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchLeads({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: sorter.field,
      order: sorter.order,
      ...filters
    });
  };

  const handleHistoryClick = (lead) => {
    setSelectedHistoryLead(lead);
    setHistoryModalVisible(true);
  };

  const handleStatusUpdate = async (status) => {
    if (usedStatuses.has(status)) {
      message.error('This status has already been used');
      return;
    }
    setSelectedStatus(status);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedStatus) {
      message.error('Please select a status');
      return;
    }

    if (!feedback.trim()) {
      message.error('Please provide feedback for the status change');
      return;
    }

    try {
      setSubmitting(true);
      const response = await updateLeadStatus(selectedLead._id, {
        status: selectedStatus,
        feedback: feedback.trim(),
        updatedBy: user._id,
        clientName: selectedLead.name,
        clientEmail: selectedLead.email,
        company: selectedLead.company || 'N/A'
      });

      if (response.success) {
        message.success('Status updated successfully');
        setSelectedLead(response.data);
        setSelectedStatus(null);
        setFeedback('');
        setUsedStatuses(new Set([...usedStatuses, selectedStatus]));
        fetchLeads({
          current: pagination.current,
          pageSize: pagination.pageSize
        });
      }
    } catch (error) {
      message.error(error.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (leadId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lead?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteLead(leadId);
          message.success('Lead deleted successfully');
          fetchLeads();
        } catch (error) {
          message.error('Failed to delete lead');
        }
      }
    });
  };

  const handlePreview = (lead) => {
    setSelectedLead(lead);
    setPreviewVisible(true);
    setSelectedStatus(null);
    setFeedback('');
    
    // Initialize usedStatuses with current and historical statuses
    const usedStatusSet = new Set();
    
    // Add current status
    if (lead.status && lead.status !== 'new') {
      usedStatusSet.add(lead.status);
    }
    
    // Add historical statuses
    if (lead.statusHistory && lead.statusHistory.length > 0) {
      lead.statusHistory.forEach(history => {
        if (history.status !== 'new') {
          usedStatusSet.add(history.status);
        }
      });
    }
    
    setUsedStatuses(usedStatusSet);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#1890ff',
      contacted: '#52c41a',
      qualified: '#722ed1',
      lost: '#f5222d',
      rejected: '#fa541c'
    };
    return colors[status] || '#1890ff';
  };

  const getTimelineColor = (status) => {
    const colors = {
      new: '#1890ff',
      contacted: '#52c41a',
      qualified: '#722ed1',
      lost: '#f5222d',
      rejected: '#fa541c'
    };
    return colors[status] || '#1890ff';
  };

  const validateMeetingLink = (link, platform) => {
    if (!link) return false;
    
    const patterns = {
      meet: /^https:\/\/meet\.google\.com\/[a-z0-9\-]+$/i,
      zoom: /^https:\/\/[a-z0-9-.]+\.zoom\.us\/j\/[0-9]+$/i
    };

    return patterns[platform].test(link);
  };

  const handleScheduleMeeting = async () => {
    if (!meetingData.title || !meetingData.date || !meetingData.time || !meetingData.description) {
      message.error('Please fill in all required fields');
      return;
    }

    if (meetingData.locationType === 'virtual') {
      if (!meetingData.meetingLink) {
        message.error('Please provide a meeting link');
        return;
      }
      
      if (!validateMeetingLink(meetingData.meetingLink, meetingData.platform)) {
        message.error(`Please provide a valid ${meetingData.platform === 'meet' ? 'Google Meet' : 'Zoom'} link`);
        return;
      }
    }

    if (meetingData.locationType === 'offline' && !meetingData.location) {
      message.error('Please provide the meeting location');
      return;
    }

    try {
      setSchedulingMeeting(true);
      
      const payload = {
        title: meetingData.title,
        description: meetingData.description,
        date: meetingData.date.format('YYYY-MM-DD'),
        time: meetingData.time.format('HH:mm'),
        duration: meetingData.duration,
        locationType: meetingData.locationType,
        location: meetingData.locationType === 'offline' ? meetingData.location : '',
        meetingLink: meetingData.locationType === 'virtual' ? meetingData.meetingLink : '',
        platform: meetingData.platform,
        agenda: meetingData.agenda,
        leadId: selectedMeetingLead._id
      };
      
      const response = await scheduleMeeting(selectedMeetingLead._id, payload);

      if (response.status === 6000) {
        message.success('Meeting invitation sent successfully');
        fetchLeads({
          current: pagination.current,
          pageSize: pagination.pageSize
        });
        setMeetingModalVisible(false);
        setMeetingData({
          title: '',
          description: '',
          date: null,
          time: null,
          duration: '1 hour',
          locationType: 'virtual',
          location: '',
          meetingLink: '',
          platform: 'meet',
          agenda: ''
        });
        setSelectedMeetingLead(null);
      } else {
        throw new Error(response.message || 'Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Meeting scheduling error:', error);
      message.error(error.message || 'Failed to schedule meeting');
    } finally {
      setSchedulingMeeting(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {text.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          />
          <Button
            type="text"
            icon={<HistoryOutlined />}
            onClick={() => handleHistoryClick(record)}
          />
          <Button
            type="text"
            icon={<VideoCameraOutlined />}
            onClick={() => {
              setSelectedMeetingLead(record);
              setMeetingModalVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  /**
   * StatusHistoryModal - Shows the status history timeline for a lead
   * Only one timeline item is expanded at a time (single-panel open logic)
   */
  const StatusHistoryModal = ({ visible, onClose, lead }) => {
    const [activePanel, setActivePanel] = useState(lead?.statusHistory?.length ? `${lead.statusHistory[0]._id}` : '');
    useEffect(() => {
      if (lead?.statusHistory?.length) setActivePanel(`${lead.statusHistory[0]._id}`);
    }, [lead]);
    return (
      <Modal
        title={<div className="flex items-center gap-3"><HistoryOutlined /> Status History</div>}
        open={visible}
        onCancel={onClose}
        width={800}
        footer={null}
        bodyStyle={{ padding: '24px' }}
      >
        {lead?.statusHistory?.length > 0 ? (
          <Timeline mode="left">
            {lead.statusHistory.map((history, idx) => (
              <Timeline.Item
                key={history._id}
                color={getTimelineColor(history.status)}
                dot={<span className="w-4 h-4 rounded-full inline-block" style={{ background: getTimelineColor(history.status) }} />}
              >
                <div
                  className={`cursor-pointer ${activePanel === history._id ? 'bg-blue-50' : ''}`}
                  onClick={() => setActivePanel(history._id)}
                  style={{ borderRadius: 8, padding: 12, marginBottom: 8 }}
                >
                  <div className="flex items-center justify-between">
                    <Tag color={getTimelineColor(history.status)}>{history.status}</Tag>
                    <span className="text-xs text-gray-400">{format(new Date(history.updatedAt), 'MMM dd, yyyy h:mm a')}</span>
                  </div>
                  {activePanel === history._id && (
                    <div className="mt-2">
                      <div className="mb-2 text-gray-700"><b>Feedback:</b> {history.feedback}</div>
                      <div className="text-xs text-gray-500">By: {history.clientEmail || 'N/A'} | Company: {history.company || 'N/A'}</div>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <HistoryOutlined style={{ fontSize: '2rem' }} />
            <p className="mt-2">No status history available</p>
          </div>
        )}
      </Modal>
    );
  };

  const renderStatusButtons = () => {
    const statuses = [
      { key: 'contacted', label: 'Contacted', color: 'green' },
      { key: 'qualified', label: 'Qualified', color: 'purple' },
      { key: 'lost', label: 'Lost', color: 'red' },
      { key: 'rejected', label: 'Rejected', color: 'orange' }
    ];

    return (
      <div className="flex gap-2 mb-4">
        {statuses.map(({ key, label, color }) => {
          const isUsed = usedStatuses.has(key);
          const tooltipText = isUsed ? `Lead is already ${label.toLowerCase()}` : '';
          
          return (
            <Tooltip key={key} title={tooltipText}>
              <Button
                type={selectedStatus === key ? 'primary' : 'default'}
                onClick={() => handleStatusUpdate(key)}
                className={`${selectedStatus === key ? `bg-${color}-500 border-${color}-500` : ''}`}
                disabled={isUsed}
                style={isUsed ? { 
                  opacity: 0.5, 
                  cursor: 'not-allowed',
                  backgroundColor: '#f5f5f5',
                  borderColor: '#d9d9d9',
                  color: 'rgba(0, 0, 0, 0.25)'
                } : {}}
              >
                {label}
              </Button>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  const renderMeetingModal = () => (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium shadow-lg">
            <VideoCameraOutlined />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>Schedule Meeting</Title>
            <Text type="secondary">{selectedMeetingLead?.name}</Text>
          </div>
        </div>
      }
      open={meetingModalVisible}
      onCancel={() => {
        setMeetingModalVisible(false);
        setMeetingData({
          title: '',
          description: '',
          date: null,
          time: null,
          duration: '1 hour',
          locationType: 'virtual',
          location: '',
          meetingLink: '',
          platform: 'meet',
          agenda: ''
        });
        setSelectedMeetingLead(null);
      }}
      footer={null}
      width={800}
    >
      <div className="space-y-6 mt-4">
        <div>
          <Text strong className="block mb-2">Client Details</Text>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100/80">
              <Text type="secondary" className="block mb-1">Name</Text>
              <Text strong>{selectedMeetingLead?.name}</Text>
            </div>
            <div className="bg-gray-50/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100/80">
              <Text type="secondary" className="block mb-1">Email</Text>
              <Text strong>{selectedMeetingLead?.email}</Text>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Text strong className="block mb-2">Meeting Details</Text>
            <div className="space-y-4">
              <Input
                placeholder="Meeting Title"
                value={meetingData.title}
                onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
                className="w-full"
              />
              
              <TextArea
                placeholder="Meeting Description"
                value={meetingData.description}
                onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
                rows={3}
                className="w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  placeholder="Select Date"
                  value={meetingData.date}
                  onChange={(date) => setMeetingData({ ...meetingData, date })}
                  className="w-full"
                />
                <TimePicker
                  placeholder="Select Time"
                  value={meetingData.time}
                  onChange={(time) => setMeetingData({ ...meetingData, time })}
                  format="HH:mm"
                  className="w-full"
                />
              </div>

              <Select
                placeholder="Meeting Duration"
                value={meetingData.duration}
                onChange={(duration) => setMeetingData({ ...meetingData, duration })}
                className="w-full"
              >
                <Option value="30 minutes">30 minutes</Option>
                <Option value="1 hour">1 hour</Option>
                <Option value="1.5 hours">1.5 hours</Option>
                <Option value="2 hours">2 hours</Option>
              </Select>

              <div className="space-y-4">
                <Radio.Group
                  value={meetingData.locationType}
                  onChange={(e) => setMeetingData({ ...meetingData, locationType: e.target.value })}
                >
                  <Radio value="virtual">Virtual Meeting</Radio>
                  <Radio value="offline">Offline Meeting</Radio>
                </Radio.Group>

                {meetingData.locationType === 'virtual' && (
                  <div className="space-y-4">
                    <Select
                      value={meetingData.platform}
                      onChange={(value) => {
                        setMeetingData({ 
                          ...meetingData, 
                          platform: value,
                          meetingLink: '' // Clear link when platform changes
                        });
                      }}
                      className="w-full"
                    >
                      <Option value="meet">Google Meet</Option>
                      <Option value="zoom">Zoom</Option>
                    </Select>

                    <Input
                      placeholder={`${meetingData.platform === 'meet' ? 'Google Meet' : 'Zoom'} Meeting Link`}
                      value={meetingData.meetingLink}
                      onChange={(e) => setMeetingData({ ...meetingData, meetingLink: e.target.value })}
                      prefix={<VideoCameraOutlined className="text-gray-400" />}
                      status={
                        meetingData.meetingLink && 
                        !validateMeetingLink(meetingData.meetingLink, meetingData.platform) ? 
                        'error' : ''
                      }
                    />
                    {meetingData.meetingLink && 
                     !validateMeetingLink(meetingData.meetingLink, meetingData.platform) && (
                      <div className="text-red-500 text-sm">
                        Please enter a valid {meetingData.platform === 'meet' ? 'Google Meet' : 'Zoom'} link
                      </div>
                    )}
                  </div>
                )}

                {meetingData.locationType === 'offline' && (
                  <Input
                    placeholder="Meeting Location/Address"
                    value={meetingData.location}
                    onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
                    prefix={<FaBuilding className="text-gray-400" />}
                  />
                )}
              </div>

              <div>
                <Text strong className="block mb-2">Meeting Agenda</Text>
                <TextArea
                  placeholder="Enter meeting agenda..."
                  value={meetingData.agenda}
                  onChange={(e) => setMeetingData({ ...meetingData, agenda: e.target.value })}
                  rows={6}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button
            type="primary"
            onClick={handleScheduleMeeting}
            loading={schedulingMeeting}
            className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 border-0"
          >
            Send Meeting Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <LeadsManagementSkeleton />
      </div>
    );
  }

  return (
    <div style={{ padding: '0px' }}>
      <Card>
        <Title level={2}>Leads Management</Title>
        
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="_id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />

        <Modal
          title={
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
                {selectedLead?.name?.charAt(0).toUpperCase() || 'L'}
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>Lead Details</Title>
                <Text type="secondary">ID: {selectedLead?._id}</Text>
              </div>
            </div>
          }
          visible={previewVisible}
          onCancel={() => {
            setPreviewVisible(false);
            setSelectedStatus(null);
            setFeedback('');
          }}
          footer={null}
          width={700}
        >
          {selectedLead ? (
            <div className="space-y-6">
              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserOutlined className="text-blue-500" />
                    <div>
                      <Text type="secondary">Name</Text>
                      <div className="text-lg font-medium">{selectedLead.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-blue-500" />
                    <div>
                      <Text type="secondary">Email</Text>
                      <div className="text-lg">{selectedLead.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-500" />
                    <div>
                      <Text type="secondary">Phone</Text>
                      <div className="text-lg">{selectedLead.phone || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaBuilding className="text-blue-500" />
                    <div>
                      <Text type="secondary">Company</Text>
                      <div className="text-lg">{selectedLead.company || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
            <div>
                      <Text type="secondary">Created At</Text>
                      <div className="text-lg">
                        {format(new Date(selectedLead.createdAt), 'MMM dd, yyyy h:mm a')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag color={getStatusColor(selectedLead.status)} className="text-sm px-3 py-1">
                      {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              {selectedLead.message && (
                <div className="mt-6">
                  <Text type="secondary">Message</Text>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              {/* Status Update Section */}
              <div className="mt-6">
                <Text strong className="text-lg mb-4">Update Status</Text>
                <StatusButtons selectedStatus={selectedStatus} usedStatuses={usedStatuses} onStatusUpdate={handleStatusUpdate} />

                {selectedStatus && (
                  <div className="space-y-4">
                    <TextArea
                      placeholder="Add feedback for this status change..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <Button
                      type="primary"
                      onClick={handleSubmitFeedback}
                      loading={submitting}
                      className="w-full"
                    >
                      Submit Update
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <LeadDetailsSkeleton />
          )}
        </Modal>

        {/* History Modal */}
        <StatusHistoryModal visible={historyModalVisible} onClose={() => setHistoryModalVisible(false)} lead={selectedHistoryLead} getTimelineColor={getTimelineColor} />

        {/* Meeting Modal */}
        <MeetingModal
          visible={meetingModalVisible}
          onClose={() => {
            setMeetingModalVisible(false);
            setMeetingData({
              title: '',
              description: '',
              date: null,
              time: null,
              duration: '1 hour',
              locationType: 'virtual',
              location: '',
              meetingLink: '',
              platform: 'meet',
              agenda: ''
            });
            setSelectedMeetingLead(null);
          }}
          lead={selectedMeetingLead}
          meetingData={meetingData}
          setMeetingData={setMeetingData}
          handleScheduleMeeting={handleScheduleMeeting}
          schedulingMeeting={schedulingMeeting}
          validateMeetingLink={validateMeetingLink}
        />
      </Card>
    </div>
  );
};

export default LeadsManagement;

/* ========================================================================
 * End of File: LeadsManagement.jsx
 * ======================================================================== */ 