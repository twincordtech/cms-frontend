/* ========================================================================
 * File: InquiriesManagement.jsx
 * Description: Dashboard page for managing customer inquiries, including status, meetings, and history.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import InquiryTable from '../../components/inquiries/InquiryTable';
import InquiryPreviewModal from '../../components/inquiries/InquiryPreviewModal';
import InquiryMeetingModal from '../../components/inquiries/InquiryMeetingModal';
import InquiryStatusHistoryModal from '../../components/inquiries/InquiryStatusHistoryModal';
import { getInquiries, updateInquiryStatus, deleteInquiry, scheduleInquiryMeeting } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * InquiriesManagement Component
 * Dashboard page for managing customer inquiries, including status, meetings, and history.
 * Handles fetching, updating, deleting, and scheduling meetings for inquiries.
 * @component
 */
const InquiriesManagement = () => {
  // State for inquiries and UI
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [meetingData, setMeetingData] = useState({
    name: '',
    email: '',
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
  const [statusHistoryVisible, setStatusHistoryVisible] = useState(false);
  const [statusHistoryInquiry, setStatusHistoryInquiry] = useState(null);

  /**
   * Fetches inquiries from the API with pagination and filters.
   * @param {object} params
   */
  const fetchInquiries = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getInquiries({ page: params.current, limit: params.pageSize, ...params });
      setInquiries(response.data);
      setPagination({ ...params, total: response.pagination.total, current: response.pagination.page });
    } catch (error) {
      message.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  /**
   * Handles table pagination, sorting, and filtering changes.
   */
  const handleTableChange = (pagination, filters, sorter) => {
    fetchInquiries({ page: pagination.current, pageSize: pagination.pageSize, sort: sorter.field, order: sorter.order, ...filters });
  };

  /**
   * Handles previewing an inquiry in the modal.
   * @param {object} inquiry
   */
  const handlePreview = (inquiry) => {
    setSelectedInquiry(inquiry);
    setPreviewVisible(true);
    setSelectedStatus(null);
    setFeedback('');
  };

  /**
   * Handles deleting an inquiry.
   * @param {string} inquiryId
   */
  const handleDelete = async (inquiryId) => {
    try {
      await deleteInquiry(inquiryId);
      message.success('Inquiry deleted successfully');
      fetchInquiries();
    } catch (error) {
      message.error('Failed to delete inquiry');
    }
  };

  /**
   * Handles opening the meeting scheduling modal for an inquiry.
   * @param {object} inquiry
   */
  const handleScheduleMeeting = (inquiry) => {
    setSelectedInquiry(inquiry);
    setMeetingModalVisible(true);
    setMeetingData({
      name: `${inquiry.firstName} ${inquiry.lastName}`,
      email: inquiry.email,
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
  };

  /**
   * Handles status selection for an inquiry.
   * @param {string} status
   */
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  /**
   * Handles feedback input change for status update.
   * @param {object} e
   */
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  /**
   * Handles submitting feedback and status update for an inquiry.
   */
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
      const response = await updateInquiryStatus(selectedInquiry._id, { status: selectedStatus, feedback: feedback.trim() });
      if (response.success) {
        message.success('Status updated successfully');
        setSelectedInquiry(response.data);
        setSelectedStatus(null);
        setFeedback('');
        fetchInquiries({ current: pagination.current, pageSize: pagination.pageSize });
      }
    } catch (error) {
      message.error(error.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handles meeting data input change.
   * @param {object} data
   */
  const handleMeetingDataChange = (data) => {
    setMeetingData(data);
  };

  /**
   * Handles submitting the meeting scheduling form.
   */
  const handleScheduleMeetingSubmit = async () => {
    if (!meetingData.title || !meetingData.date || !meetingData.time || !meetingData.description) {
      message.error('Please fill in all required fields');
      return;
    }
    if (meetingData.locationType === 'virtual') {
      if (!meetingData.meetingLink) {
        message.error('Please provide a meeting link');
        return;
      }
      const patterns = {
        meet: /^https:\/\/meet\.google\.com\/[a-z0-9\-]+$/i,
        zoom: /^https:\/\/[a-z0-9-.]+\.zoom\.us\/j\/[0-9]+$/i
      };
      if (!patterns[meetingData.platform].test(meetingData.meetingLink)) {
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
        agenda: meetingData.agenda
      };
      const response = await scheduleInquiryMeeting(selectedInquiry._id, payload);
      if (response.success) {
        message.success('Meeting scheduled successfully');
        setMeetingModalVisible(false);
        setMeetingData({
          name: '',
          email: '',
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
        fetchInquiries({ current: pagination.current, pageSize: pagination.pageSize });
      }
    } catch (error) {
      message.error(error.message || 'Failed to schedule meeting');
    } finally {
      setSchedulingMeeting(false);
    }
  };

  /**
   * Handles opening the status history modal for an inquiry.
   * @param {object} inquiry
   */
  const handleHistory = (inquiry) => {
    setStatusHistoryInquiry(inquiry);
    setStatusHistoryVisible(true);
  };

  return (
    <div className="container mx-auto max-w-full px-4 py-8" aria-label="Inquiries Management Page">
      <Card>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Inquiries Management</h2>
        <InquiryTable
          inquiries={inquiries}
          loading={loading}
          pagination={pagination}
          onTableChange={handleTableChange}
          onPreview={handlePreview}
          onDelete={handleDelete}
          onScheduleMeeting={handleScheduleMeeting}
          onHistory={handleHistory}
        />
        <InquiryPreviewModal
          visible={previewVisible}
          inquiry={selectedInquiry}
          onCancel={() => setPreviewVisible(false)}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          feedback={feedback}
          onFeedbackChange={handleFeedbackChange}
          onSubmitFeedback={handleSubmitFeedback}
          submitting={submitting}
          onScheduleMeeting={() => setMeetingModalVisible(true)}
        />
        <InquiryMeetingModal
          visible={meetingModalVisible}
          meetingData={meetingData}
          onChange={handleMeetingDataChange}
          onCancel={() => setMeetingModalVisible(false)}
          onSchedule={handleScheduleMeetingSubmit}
          scheduling={schedulingMeeting}
        />
        <InquiryStatusHistoryModal
          visible={statusHistoryVisible}
          inquiry={statusHistoryInquiry}
          onCancel={() => setStatusHistoryVisible(false)}
        />
      </Card>
    </div>
  );
};

export default InquiriesManagement;

/* ========================================================================
 * End of File: InquiriesManagement.jsx
 * ======================================================================== */ 