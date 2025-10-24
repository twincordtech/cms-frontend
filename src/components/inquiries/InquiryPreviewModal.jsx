/**
 * InquiryPreviewModal.jsx
 * 
 * A comprehensive modal component for previewing and managing inquiry details.
 * Provides detailed view of inquiry information with status management capabilities
 * and feedback submission functionality.
 * 
 * Features:
 * - Complete inquiry information display
 * - Status update functionality with feedback
 * - Responsive design with organized layout
 * - Client avatar and identification
 * - Project description display
 * - Status history tracking
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Modal, Tag, Typography, Avatar, Button, Input } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

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
 * Available status options for inquiry updates
 */
const statusOptions = [
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' }
];

/**
 * InquiryPreviewModal - Modal component for viewing and updating inquiry details
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Object} props.inquiry - Inquiry data to display
 * @param {Function} props.onCancel - Callback for modal cancellation
 * @param {string} props.selectedStatus - Currently selected status for update
 * @param {Function} props.onStatusChange - Callback for status selection
 * @param {string} props.feedback - Current feedback text
 * @param {Function} props.onFeedbackChange - Callback for feedback text changes
 * @param {Function} props.onSubmitFeedback - Callback for feedback submission
 * @param {boolean} props.submitting - Loading state for submission
 * @returns {JSX.Element} Inquiry preview modal
 */
const InquiryPreviewModal = ({
  visible,
  inquiry,
  onCancel,
  selectedStatus,
  onStatusChange,
  feedback,
  onFeedbackChange,
  onSubmitFeedback,
  submitting
}) => {
  // Handle feedback submission with validation
  const handleSubmitFeedback = () => {
    if (!selectedStatus) {
      // Could add notification here for missing status
      return;
    }
    onSubmitFeedback();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ backgroundColor: '#1890ff', marginRight: 16 }} 
            size={48} 
            icon={<UserOutlined />}
            alt={`${inquiry?.firstName || 'Client'} avatar`}
          >
            {inquiry?.firstName?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <Title level={4} style={{ margin: 0 }}>Inquiry Details</Title>
            {inquiry?._id && (
              <div style={{ color: '#888', fontSize: 13 }}>ID: {inquiry._id}</div>
            )}
          </div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnClose
      maskClosable={false}
    >
      {inquiry ? (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 32, 
          maxHeight: '67vh', 
          overflowY: 'auto'
        }}>
          {/* Primary Information Section */}
          <div style={{ 
            flex: 1, 
            minWidth: 260, 
            background: '#fff', 
            borderRadius: 12, 
            padding: 18 
          }}>
            <div style={{ marginBottom: 12 }}>
              <UserOutlined style={{ marginRight: 8 }} /> 
              <b>Name</b>: {inquiry.firstName} {inquiry.lastName}
            </div>
            <div style={{ marginBottom: 12 }}>
              <MailOutlined style={{ marginRight: 8 }} /> 
              <b>Email</b>: {inquiry.email}
            </div>
            <div style={{ marginBottom: 12 }}>
              <PhoneOutlined style={{ marginRight: 8 }} /> 
              <b>Telephone</b>: {inquiry.telephone}
            </div>
            <div style={{ marginBottom: 12 }}>
              <BankOutlined style={{ marginRight: 8 }} /> 
              <b>Company</b>: {inquiry.companyName}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Job Role</b>: {inquiry.jobRole}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Country</b>: {inquiry.country}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Use Case</b>: {inquiry.useCase}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Nature of Inquiry</b>: {inquiry.natureOfInquiry}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Inquiry Type</b>: {inquiry.inquiryType}
            </div>
          </div>

          {/* Secondary Information Section */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 12 }}>
              <ClockCircleOutlined style={{ marginRight: 8 }} /> 
              <b>Created At</b>: {formatDate(inquiry.createdAt)}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Status</b>: <Tag color={getStatusColor(inquiry.status)}>{inquiry.status}</Tag>
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Postal Code</b>: {inquiry.postalCode}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Industry</b>: {inquiry.industry}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Company Type</b>: {inquiry.companyType}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Reference</b>: {inquiry.reference}
            </div>
          </div>

          {/* Project Description Section */}
          <div style={{ width: '100%', marginTop: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Project Description</div>
            <div style={{ 
              background: '#f7f7f7', 
              borderRadius: 6, 
              padding: 16, 
              minHeight: 60 
            }}>
              {inquiry.projectDescription || (
                <span style={{ color: '#aaa' }}>No description provided.</span>
              )}
            </div>
          </div>

          {/* Status Update Section */}
          <div style={{ width: '100%', marginTop: 32 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Update Status</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {statusOptions.map(opt => (
                <Button
                  key={opt.value}
                  type={selectedStatus === opt.value ? 'primary' : 'default'}
                  onClick={() => onStatusChange(opt.value)}
                  size="middle"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            
            {selectedStatus && (
              <div>
                <TextArea
                  placeholder="Add feedback for this status change..."
                  value={feedback || ''}
                  onChange={onFeedbackChange}
                  rows={3}
                  style={{ marginBottom: 12 }}
                  maxLength={500}
                  showCount
                />
                <Button
                  type="primary"
                  onClick={handleSubmitFeedback}
                  loading={submitting}
                  style={{ minWidth: 160 }}
                  disabled={!feedback?.trim()}
                >
                  Submit Update
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
          No inquiry data available
        </div>
      )}
    </Modal>
  );
};

export default InquiryPreviewModal;

/**
 * @copyright Tech4biz Solutions Private
 */ 