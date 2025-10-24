/**
 * InquiryStatusHistoryModal.jsx
 * 
 * A comprehensive modal component for displaying inquiry status history.
 * Provides a timeline view of all status changes with detailed information
 * including timestamps, user actions, and feedback for each status update.
 * 
 * Features:
 * - Timeline visualization of status changes
 * - Detailed status information with timestamps
 * - User attribution for each status change
 * - Feedback display for each status update
 * - Responsive design with modern UI
 * - Color-coded status indicators
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Modal, Typography, Avatar } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';

const { Title } = Typography;

/**
 * Get color for status based on inquiry status
 * 
 * @param {string} status - The inquiry status
 * @returns {string} Color code for the status
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
 * InquiryStatusHistoryModal - Modal component for displaying inquiry status history
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Object} props.inquiry - Inquiry data containing status history
 * @param {Function} props.onCancel - Callback for modal cancellation
 * @returns {JSX.Element} Status history modal
 */
const InquiryStatusHistoryModal = ({ visible, inquiry, onCancel }) => {
  // Format date for display with error handling
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  // Capitalize first letter of status for display
  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              background: 'linear-gradient(135deg, #5b8cff 0%, #6be6c1 100%)', 
              marginRight: 16 
            }} 
            size={48}
            alt={`${inquiry?.firstName || 'Client'} avatar`}
          >
            {inquiry?.firstName?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <Title level={4} style={{ margin: 0 }}>Status History</Title>
            <div style={{ color: '#888', fontSize: 15 }}>
              {inquiry?.firstName} {inquiry?.lastName}
            </div>
          </div>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={650}
      bodyStyle={{ background: '#fafbfc' }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ 
        marginLeft: 12, 
        marginTop: 24, 
        maxHeight: '67vh', 
        overflowY: 'auto'
      }}>
        {inquiry?.statusHistory && inquiry.statusHistory.length > 0 ? (
          inquiry.statusHistory.map((history, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              marginBottom: 32 
            }}>
              {/* Timeline dot and connecting line */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginRight: 24 
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: getStatusColor(history.status),
                  border: '3px solid #fff',
                  boxShadow: `0 0 0 2px ${getStatusColor(history.status)}`,
                  marginBottom: 2
                }} />
                {idx !== inquiry.statusHistory.length - 1 && (
                  <div style={{ 
                    width: 4, 
                    flex: 1, 
                    background: getStatusColor(history.status), 
                    minHeight: 40, 
                    borderRadius: 2 
                  }} />
                )}
              </div>

              {/* Status History Card */}
              <div style={{ 
                background: '#fff', 
                borderRadius: 16, 
                boxShadow: '0 2px 12px #e6eaf1', 
                padding: 24, 
                flex: 1, 
                minWidth: 0 
              }}>
                {/* Status Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: 8 
                }}>
                  <span style={{
                    background: '#f6ffed',
                    color: getStatusColor(history.status),
                    fontWeight: 600,
                    fontSize: 18,
                    borderRadius: 16,
                    padding: '2px 18px',
                    marginRight: 16,
                    boxShadow: `0 2px 8px ${getStatusColor(history.status)}22`
                  }}>
                    {formatStatus(history.status)}
                  </span>
                  <span style={{ 
                    color: '#888', 
                    fontSize: 15, 
                    marginLeft: 'auto' 
                  }}>
                    {formatDate(history.updatedAt)}
                  </span>
                </div>

                {/* User Information */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: 12 
                }}>
                  <UserOutlined style={{ color: '#8c8c8c', marginRight: 6 }} />
                  <span style={{ color: '#888', fontSize: 14 }}>
                    Updated by {history.updatedBy?.name || 'Unknown'}
                  </span>
                </div>

                {/* Feedback Section */}
                <div style={{ marginBottom: 16, fontSize: 16 }}>
                  <div style={{ 
                    color: '#888', 
                    fontSize: 14, 
                    marginBottom: 2 
                  }}>
                    Feedback
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    {history.feedback || 'No feedback provided'}
                  </div>
                </div>

                {/* Client Information Footer */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: '#f5f7fa', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    minWidth: 120 
                  }}>
                    <BankOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    <span style={{ fontWeight: 500 }}>Company</span>
                    <span style={{ marginLeft: 8 }}>{inquiry.companyName}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: '#f5f7fa', 
                    borderRadius: 8, 
                    padding: '8px 16px', 
                    minWidth: 120 
                  }}>
                    <MailOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    <span style={{ fontWeight: 500 }}>Email</span>
                    <span style={{ marginLeft: 8 }}>{inquiry.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            color: '#888', 
            fontSize: 16, 
            marginTop: 32,
            padding: '40px 20px',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px #e6eaf1'
          }}>
            No status history available for this inquiry
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InquiryStatusHistoryModal;

/**
 * @copyright Tech4biz Solutions Private
 */ 