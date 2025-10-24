/* ========================================================================
 * File: MeetingModal.jsx
 * Description: Modal for scheduling meetings with leads.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { Modal, Typography, Input, Select, DatePicker, TimePicker, Radio, Button } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { FaBuilding } from 'react-icons/fa';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * MeetingModal - Modal for scheduling meetings with leads
 * @param {object} props
 * @param {boolean} props.visible - Modal visibility
 * @param {function} props.onClose - Close handler
 * @param {object} props.lead - Lead object
 * @param {object} props.meetingData - Meeting data state
 * @param {function} props.setMeetingData - Setter for meeting data
 * @param {function} props.handleScheduleMeeting - Handler for scheduling meeting
 * @param {boolean} props.schedulingMeeting - Loading state
 * @param {function} props.validateMeetingLink - Validator for meeting link
 */
const MeetingModal = ({ visible, onClose, lead, meetingData, setMeetingData, handleScheduleMeeting, schedulingMeeting, validateMeetingLink }) => (
  <Modal
    title={
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-medium shadow-lg">
          <VideoCameraOutlined />
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>Schedule Meeting</Title>
          <Text type="secondary">{lead?.name}</Text>
        </div>
      </div>
    }
    open={visible}
    onCancel={onClose}
    footer={null}
    width={800}
  >
    <div className="space-y-6 mt-4">
      <div>
        <Text strong className="block mb-2">Client Details</Text>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100/80">
            <Text type="secondary" className="block mb-1">Name</Text>
            <Text strong>{lead?.name}</Text>
          </div>
          <div className="bg-gray-50/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100/80">
            <Text type="secondary" className="block mb-1">Email</Text>
            <Text strong>{lead?.email}</Text>
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

export default MeetingModal;

/* ========================================================================
 * End of File: MeetingModal.jsx
 * ======================================================================== */ 