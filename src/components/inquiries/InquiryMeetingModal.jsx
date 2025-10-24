/**
 * InquiryMeetingModal.jsx
 * 
 * A comprehensive modal component for scheduling meetings with inquiry clients.
 * Provides a user-friendly interface for setting up virtual or offline meetings
 * with detailed meeting information and agenda management.
 * 
 * Features:
 * - Client information display with avatar
 * - Meeting details configuration (title, description, date/time)
 * - Duration and location type selection
 * - Platform selection for virtual meetings
 * - Meeting agenda management
 * - Responsive design with modern UI
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Radio, Button, Typography, Avatar } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

/**
 * InquiryMeetingModal - Modal component for scheduling client meetings
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Object} props.meetingData - Current meeting configuration data
 * @param {Function} props.onChange - Callback for meeting data updates
 * @param {Function} props.onCancel - Callback for modal cancellation
 * @param {Function} props.onSchedule - Callback for meeting scheduling
 * @param {boolean} props.scheduling - Loading state for scheduling operation
 * @returns {JSX.Element} Meeting scheduling modal
 */
const InquiryMeetingModal = ({
  visible,
  meetingData,
  onChange,
  onCancel,
  onSchedule,
  scheduling
}) => {
  // Handle input changes with proper validation
  const handleInputChange = (field, value) => {
    onChange({ ...meetingData, [field]: value });
  };

  // Handle form submission with validation
  const handleSchedule = () => {
    if (!meetingData?.title?.trim()) {
      // Could add notification here for missing title
      return;
    }
    onSchedule();
  };

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      bodyStyle={{ background: '#fafbfc', padding: 0 }}
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
      destroyOnClose
      maskClosable={false}
    >
      {/* Custom Header with Client Information */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 4px 0 4px' }}>
        <Avatar 
          style={{ 
            background: 'linear-gradient(135deg, #5b8cff 0%, #6be6c1 100%)', 
            marginRight: 20 
          }} 
          size={56} 
          icon={<UserOutlined />}
          alt={`${meetingData?.name || 'Client'} avatar`}
        >
          {meetingData?.name?.[0]?.toUpperCase() || '?'}
        </Avatar>
        <div>
          <Title level={4} style={{ margin: 0 }}>Schedule Meeting</Title>
          <div style={{ color: '#888', fontSize: 15 }}>{meetingData?.name}</div>
        </div>
      </div>

      {/* Client Details Cards */}
      <div style={{ 
        display: 'flex', 
        gap: 24, 
        marginTop: 32, 
        marginBottom: 0, 
        padding: '0 12px' 
      }}>
        <div style={{ 
          flex: 1, 
          background: '#fff', 
          borderRadius: 12, 
          padding: 18, 
          minWidth: 180, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10 
        }}>
          <UserOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <div>
            <div style={{ color: '#888', fontSize: 13 }}>Name</div>
            <div style={{ fontWeight: 600 }}>{meetingData?.name}</div>
          </div>
        </div>
        <div style={{ 
          flex: 1, 
          background: '#fff', 
          borderRadius: 12, 
          padding: 18, 
          minWidth: 180, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10 
        }}>
          <MailOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <div>
            <div style={{ color: '#888', fontSize: 13 }}>Email</div>
            <div style={{ fontWeight: 600 }}>{meetingData?.email}</div>
          </div>
        </div>
      </div>

      {/* Meeting Configuration Form */}
      <div style={{ marginTop: 32, padding: '0 12px 0 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
          Meeting Details
        </div>
        
        <Form layout="vertical">
          {/* Meeting Title */}
          <Form.Item style={{ marginBottom: 16 }}>
            <Input 
              placeholder="Meeting Title" 
              value={meetingData?.title || ''} 
              onChange={e => handleInputChange('title', e.target.value)}
              maxLength={100}
              showCount
            />
          </Form.Item>

          {/* Meeting Description */}
          <Form.Item style={{ marginBottom: 16 }}>
            <Input 
              placeholder="Meeting Description" 
              value={meetingData?.description || ''} 
              onChange={e => handleInputChange('description', e.target.value)}
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* Date and Time Selection */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item style={{ flex: 1, marginBottom: 16 }}>
              <DatePicker 
                value={meetingData?.date} 
                onChange={date => handleInputChange('date', date)} 
                style={{ width: '100%' }} 
                placeholder="Select Date"
                disabledDate={current => current && current < new Date().startOf('day')}
              />
            </Form.Item>
            <Form.Item style={{ flex: 1, marginBottom: 16 }}>
              <TimePicker 
                value={meetingData?.time} 
                onChange={time => handleInputChange('time', time)} 
                style={{ width: '100%' }} 
                format="HH:mm" 
                placeholder="Select Time"
                minuteStep={15}
              />
            </Form.Item>
          </div>

          {/* Meeting Duration */}
          <Form.Item style={{ marginBottom: 16 }}>
            <Select 
              value={meetingData?.duration} 
              onChange={duration => handleInputChange('duration', duration)} 
              placeholder="Select Duration"
            >
              <Option value="30 minutes">30 minutes</Option>
              <Option value="1 hour">1 hour</Option>
              <Option value="1.5 hours">1.5 hours</Option>
              <Option value="2 hours">2 hours</Option>
            </Select>
          </Form.Item>

          {/* Location Type Selection */}
          <Form.Item style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={meetingData?.locationType} 
              onChange={e => handleInputChange('locationType', e.target.value)}
            >
              <Radio value="virtual">Virtual Meeting</Radio>
              <Radio value="offline">Offline Meeting</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Virtual Meeting Configuration */}
          {meetingData?.locationType === 'virtual' && (
            <>
              <Form.Item style={{ marginBottom: 16 }}>
                <Select 
                  value={meetingData?.platform} 
                  onChange={platform => handleInputChange('platform', platform)} 
                  placeholder="Select Platform"
                >
                  <Option value="meet">Google Meet</Option>
                  <Option value="zoom">Zoom</Option>
                  <Option value="teams">Microsoft Teams</Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ marginBottom: 16 }}>
                <Input 
                  placeholder="Meeting Link" 
                  value={meetingData?.meetingLink || ''} 
                  onChange={e => handleInputChange('meetingLink', e.target.value)}
                  addonBefore={meetingData?.platform === 'meet' ? 'meet.google.com/' : 
                               meetingData?.platform === 'zoom' ? 'zoom.us/j/' : 'teams.microsoft.com/'}
                />
              </Form.Item>
            </>
          )}

          {/* Offline Meeting Location */}
          {meetingData?.locationType === 'offline' && (
            <Form.Item style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Enter Location" 
                value={meetingData?.location || ''} 
                onChange={e => handleInputChange('location', e.target.value)}
                maxLength={150}
              />
            </Form.Item>
          )}

          {/* Meeting Agenda */}
          <div style={{ fontWeight: 600, fontSize: 16, margin: '24px 0 8px 0' }}>
            Meeting Agenda
          </div>
          <Form.Item style={{ marginBottom: 0 }}>
            <Input.TextArea 
              placeholder="Enter meeting agenda..." 
              value={meetingData?.agenda || ''} 
              onChange={e => handleInputChange('agenda', e.target.value)} 
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item style={{ 
            margin: '32px 0 0 0',
            position: 'sticky', 
            bottom: 0, 
            background: '#fff',
            padding: '16px 0',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              className='btn-primary' 
              type="primary" 
              onClick={handleSchedule} 
              loading={scheduling} 
              block 
              style={{ height: 48, fontSize: 17, borderRadius: 8 }}
              disabled={!meetingData?.title?.trim()}
            >
              Send Meeting Invitation
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default InquiryMeetingModal;

/**
 * @copyright Tech4biz Solutions Private
 */ 