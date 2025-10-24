// ===============================
// File: NewsletterDashboard.jsx
// Description: Newsletter dashboard for managing newsletters and subscribers, including scheduling, editing, and sending.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { newsletterApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaEnvelope, FaUsers, FaPaperPlane, FaEdit, FaTrash, FaTimes, FaPlus, FaCode, FaEye, FaClock, FaCalendarAlt } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { TimePicker, Tooltip } from 'antd';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'antd/dist/reset.css';
import { NewsletterDashboardSkeleton } from '../../components/skeletons/DashboardSkeletons';
import { Pagination, Tabs } from 'antd';
import ScheduleModal from '../../components/newsletter/ScheduleModal';
import CreateNewsletterModal from '../../components/newsletter/CreateNewsletterModal';
import NewslettersTable from '../../components/newsletter/NewslettersTable';
import SubscribersTable from '../../components/newsletter/SubscribersTable';
import EditSubscriberModal from '../../components/newsletter/EditSubscriberModal';
import DeleteConfirmationModal from '../../components/newsletter/DeleteConfirmationModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorBoundary from '../../components/common/ErrorBoundary';
// ===============================
// End of File: NewsletterDashboard.jsx
// Description: Newsletter dashboard for managing newsletters and subscribers, including scheduling, editing, and sending.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'One Time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' }
];

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

// Helper to check if 24 hours have passed since last sent
const isActionDisabled = (newsletter) => {
  const sentAt = newsletter.lastSentAt || newsletter.updatedAt || newsletter.createdAt;
  if (!sentAt) return false;
  const sentTime = dayjs(sentAt);
  const now = dayjs();
  return newsletter.status === 'sent' && now.diff(sentTime, 'hour') < 24;
};

const NewsletterDashboard = () => {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' or 'html'
  const [showPreview, setShowPreview] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNewsletter, setDeletingNewsletter] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCancelScheduleModal, setShowCancelScheduleModal] = useState(false);
  const [cancellingNewsletter, setCancellingNewsletter] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showEditSubscriberModal, setShowEditSubscriberModal] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [showDeleteSubscriberModal, setShowDeleteSubscriberModal] = useState(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState(null);
  const [isDeletingSubscriber, setIsDeletingSubscriber] = useState(false);
  const [activeTab, setActiveTab] = useState('newsletters');
  const [currentNewsletterPage, setCurrentNewsletterPage] = useState(1);
  const [currentSubscriberPage, setCurrentSubscriberPage] = useState(1);
  const newsletterPageSize = 8;
  const subscriberPageSize = 10;

  const [newNewsletter, setNewNewsletter] = useState({
    subject: '',
    content: '',
    contentType: 'html'
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const [showSentUpdateError, setShowSentUpdateError] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [sendNewsletterId, setSendNewsletterId] = useState(null);
  const [showAlreadySentError, setShowAlreadySentError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newslettersRes, subscribersRes] = await Promise.all([
        newsletterApi.getNewsletters(),
        newsletterApi.getSubscribers()
      ]);
      
      const newsletterData = newslettersRes.data?.data || [];
      const subscriberData = subscribersRes.data?.data || [];
      
      console.log('Fetched newsletter data:', newsletterData);
      console.log('Fetched subscriber data:', subscriberData);
      
      setNewsletters(newsletterData);
      setSubscribers(subscriberData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNewsletter = (newsletter) => {
    setEditingNewsletter(newsletter);
    setNewNewsletter({
      subject: newsletter.subject,
      content: newsletter.content,
      contentType: newsletter.contentType || 'html'
    });
    setShowNewModal(true);
  };

  const handleDeleteNewsletter = (newsletter) => {
    setDeletingNewsletter(newsletter);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNewsletter) return;
    
    try {
      setIsDeleting(true);
      await newsletterApi.deleteNewsletter(deletingNewsletter._id);
      setNewsletters(prev => prev.filter(n => n._id !== deletingNewsletter._id));
      toast.success('Newsletter deleted successfully');
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete newsletter';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingNewsletter(null);
    setIsDeleting(false);
  };

  // Cleanup function to reset modal state
  const resetModalState = () => {
    setShowDeleteModal(false);
    setDeletingNewsletter(null);
    setIsDeleting(false);
    setShowCancelScheduleModal(false);
    setCancellingNewsletter(null);
    setIsCancelling(false);
    setShowNewModal(false);
    setEditingNewsletter(null);
    setShowScheduleModal(false);
    setSelectedNewsletter(null);
    setShowEditSubscriberModal(false);
    setEditingSubscriber(null);
    setShowDeleteSubscriberModal(false);
    setDeletingSubscriber(null);
    setIsDeletingSubscriber(false);
  };

  const handleCreateOrUpdateNewsletter = async (e) => {
    e.preventDefault();
    try {
      if (editingNewsletter) {
        const response = await newsletterApi.updateNewsletter(editingNewsletter._id, newNewsletter);
        const updatedNewsletter = response.data;
        setNewsletters(prev => prev.map(n => n._id === editingNewsletter._id ? updatedNewsletter : n));
        toast.success('Newsletter updated successfully');
      } else {
        const response = await newsletterApi.createNewsletter(newNewsletter);
        const createdNewsletter = response.data;
        setNewsletters(prev => [createdNewsletter, ...prev]);
        toast.success('Newsletter created successfully');
      }
      setShowNewModal(false);
      setNewNewsletter({ subject: '', content: '', contentType: 'html' });
      setEditingNewsletter(null);
      await fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || `Failed to ${editingNewsletter ? 'update' : 'create'} newsletter`;
      if (errorMsg === 'Cannot update sent newsletter') {
        setShowSentUpdateError(true);
      } else {
        console.error('Save error:', error);
        toast.error(errorMsg);
      }
    }
  };

  const handleSendNewsletter = async (id) => {
    setSendNewsletterId(id);
    setShowSendConfirm(true);
  };

  const confirmSendNewsletter = async () => {
    if (!sendNewsletterId) return;
    try {
      setSending(true);
      const response = await newsletterApi.sendNewsletter(sendNewsletterId);
      const { total, sent, failed } = response.data.data.stats;
      toast.success(
        `Newsletter sent successfully!\nSent to: ${sent} subscribers\nFailed: ${failed} subscribers\nTotal: ${total} subscribers`
      );
      setShowSendConfirm(false);
      setSendNewsletterId(null);
      await fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to send newsletter';
      if (errorMsg.toLowerCase().includes('already been sent')) {
        setShowAlreadySentError(true);
      } else {
        toast.error(errorMsg);
      }
      setShowSendConfirm(false);
      setSendNewsletterId(null);
    } finally {
      setSending(false);
    }
  };

  const handleSchedule = (newsletter) => {
    console.log('Schedule clicked for newsletter:', newsletter);
    setSelectedNewsletter(newsletter);
    setShowScheduleModal(true);
  };

  const handleCancelSchedule = (newsletter) => {
    setCancellingNewsletter(newsletter);
    setShowCancelScheduleModal(true);
  };

  const handleConfirmCancelSchedule = async () => {
    if (!cancellingNewsletter) return;
    
    try {
      setIsCancelling(true);
      await newsletterApi.cancelSchedule(cancellingNewsletter._id);
      setNewsletters(prev => prev.map(n => 
        n._id === cancellingNewsletter._id 
          ? { ...n, status: 'draft', schedule: null }
          : n
      ));
      toast.success('Schedule cancelled successfully');
      handleCloseCancelScheduleModal();
    } catch (error) {
      console.error('Cancel schedule error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel schedule');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelScheduleModal = () => {
    setShowCancelScheduleModal(false);
    setCancellingNewsletter(null);
    setIsCancelling(false);
  };

  // Subscriber management functions
  const handleEditSubscriber = (subscriber) => {
    setEditingSubscriber(subscriber);
    setShowEditSubscriberModal(true);
  };

  const handleUpdateSubscriber = async (subscriberId, updateData) => {
    try {
      const response = await newsletterApi.updateSubscriber(subscriberId, updateData);
      console.log('Update subscriber response:', response);
      
      // Handle the response structure correctly
      const updatedSubscriber = response.data?.data || response.data;
      console.log('Updated subscriber data:', updatedSubscriber);
      
      if (!updatedSubscriber || !updatedSubscriber._id) {
        console.log('Invalid subscriber data, refreshing list...');
        // If the response doesn't contain valid subscriber data, refresh the list
        await fetchData();
        toast.success('Subscriber updated successfully');
      } else {
        console.log('Updating local state with subscriber:', updatedSubscriber);
        // Update the local state with the new subscriber data
        setSubscribers(prev => {
          const updated = prev.map(s => 
            s._id === subscriberId ? updatedSubscriber : s
          );
          console.log('Updated subscribers list:', updated);
          return updated;
        });
        toast.success('Subscriber updated successfully');
      }
      
      setShowEditSubscriberModal(false);
      setEditingSubscriber(null);
    } catch (error) {
      console.error('Update subscriber error:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteSubscriber = (subscriber) => {
    setDeletingSubscriber(subscriber);
    setShowDeleteSubscriberModal(true);
  };

  const handleConfirmDeleteSubscriber = async () => {
    if (!deletingSubscriber) return;
    
    try {
      setIsDeletingSubscriber(true);
      await newsletterApi.deleteSubscriber(deletingSubscriber._id);
      setSubscribers(prev => prev.filter(s => s._id !== deletingSubscriber._id));
      toast.success('Subscriber deleted successfully');
      handleCloseDeleteSubscriberModal();
    } catch (error) {
      console.error('Delete subscriber error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete subscriber');
    } finally {
      setIsDeletingSubscriber(false);
    }
  };

  const handleCloseDeleteSubscriberModal = () => {
    setShowDeleteSubscriberModal(false);
    setDeletingSubscriber(null);
    setIsDeletingSubscriber(false);
  };

  // Calculate statistics
  const totalSubscribers = subscribers.length;
  const totalNewsletters = newsletters.length;
  const sentNewsletters = newsletters.filter(n => n.status === 'sent').length;
  const draftNewsletters = newsletters.filter(n => n.status !== 'sent').length;

  // Pagination logic
  const paginatedNewsletters = newsletters.slice((currentNewsletterPage - 1) * newsletterPageSize, currentNewsletterPage * newsletterPageSize);
  const paginatedSubscribers = subscribers.slice((currentSubscriberPage - 1) * subscriberPageSize, currentSubscriberPage * subscriberPageSize);

  if (loading) {
    return <NewsletterDashboardSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Newsletter Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-semibold text-gray-900">{totalSubscribers}</p>
              </div>
              <FaUsers className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Newsletters</p>
                <p className="text-2xl font-semibold text-gray-900">{totalNewsletters}</p>
              </div>
              <FaEnvelope className="text-3xl text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent Newsletters</p>
                <p className="text-2xl font-semibold text-gray-900">{sentNewsletters}</p>
              </div>
              <FaPaperPlane className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Newsletters</p>
                <p className="text-2xl font-semibold text-gray-900">{draftNewsletters}</p>
              </div>
              <FaEdit className="text-3xl text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'newsletters', label: 'Newsletters' },
              { key: 'subscribers', label: 'Subscribers' }
            ]}
            className="!mb-0"
          />
          {activeTab === 'newsletters' && (
            <button
              onClick={() => {
                setEditingNewsletter(null);
                setNewNewsletter({ subject: '', content: '', contentType: 'html' });
                setShowNewModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" /> Create Newsletter
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'newsletters' ? (
          <NewslettersTable
            newsletters={newsletters}
            currentPage={currentNewsletterPage}
            pageSize={newsletterPageSize}
            onPageChange={setCurrentNewsletterPage}
            onEdit={handleEditNewsletter}
            onDelete={handleDeleteNewsletter}
            onSend={handleSendNewsletter}
            onSchedule={handleSchedule}
            onCancelSchedule={handleCancelSchedule}
            sending={sending}
            isActionDisabled={isActionDisabled}
            // Pass a prop to indicate if a newsletter is scheduled for button label
            scheduleButtonLabelFn={(newsletter) =>
              newsletter.schedule && newsletter.schedule.nextSendDate ? 'Edit Schedule' : 'Schedule'
            }
          />
        ) : (
          <SubscribersTable
            subscribers={subscribers}
            currentPage={currentSubscriberPage}
            pageSize={subscriberPageSize}
            onPageChange={setCurrentSubscriberPage}
            onEdit={handleEditSubscriber}
            onDelete={handleDeleteSubscriber}
          />
        )}
      </div>

      {/* Create/Edit Newsletter Modal */}
      {showNewModal && (
        <CreateNewsletterModal
          isOpen={showNewModal}
          onClose={() => {
            setShowNewModal(false);
            setEditingNewsletter(null);
            setNewNewsletter({ subject: '', content: '', contentType: 'html' });
          }}
          onSubmit={handleCreateOrUpdateNewsletter}
          editingNewsletter={editingNewsletter}
          newNewsletter={newNewsletter}
          setNewNewsletter={setNewNewsletter}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        newsletter={selectedNewsletter}
        onSchedule={fetchData}
        // Log the scheduled data when editing
        onEditSchedule={(scheduledData) => {
          console.log('Editing scheduled newsletter data:', scheduledData);
        }}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        newsletter={deletingNewsletter}
        isLoading={isDeleting}
      />

      <ConfirmationModal
        isOpen={showCancelScheduleModal}
        onClose={handleCloseCancelScheduleModal}
        onConfirm={handleConfirmCancelSchedule}
        title="Cancel Schedule"
        message="Are you sure you want to cancel this schedule? The newsletter will return to draft status."
        confirmText="Cancel Schedule"
        cancelText="Keep Scheduled"
        type="warning"
      />

      <EditSubscriberModal
        isOpen={showEditSubscriberModal}
        onClose={() => {
          setShowEditSubscriberModal(false);
          setEditingSubscriber(null);
        }}
        subscriber={editingSubscriber}
        onUpdate={handleUpdateSubscriber}
      />

      <ConfirmationModal
        isOpen={showDeleteSubscriberModal}
        onClose={handleCloseDeleteSubscriberModal}
        onConfirm={handleConfirmDeleteSubscriber}
        title="Delete Subscriber"
        message={`Are you sure you want to delete the subscriber "${deletingSubscriber?.email}"? This action cannot be undone.`}
        confirmText="Delete Subscriber"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showSentUpdateError}
        onClose={() => setShowSentUpdateError(false)}
        onConfirm={() => setShowSentUpdateError(false)}
        title="Update Not Allowed"
        message={"Sorry, you cannot update a newsletter that has already been sent. Sent newsletters are locked to ensure delivery integrity. If you need to make changes, please create a new newsletter."}
        confirmText="OK"
        hideCancel={true}
        type="info"
      />
      <ConfirmationModal
        isOpen={showSendConfirm}
        onClose={() => { setShowSendConfirm(false); setSendNewsletterId(null); }}
        onConfirm={confirmSendNewsletter}
        title="Send Newsletter"
        message={<span><strong>Are you sure?</strong><br/>This will send your newsletter to <span style={{color:'#2563eb'}}>all subscribers</span>.<br/>This action <span style={{color:'#e53e3e'}}>cannot be undone</span>.</span>}
        confirmText="🚀 Send Now"
        cancelText="Cancel"
        type="warning"
        animated={true}
        appearance="modern"
      />
      <ConfirmationModal
        isOpen={showAlreadySentError}
        onClose={() => setShowAlreadySentError(false)}
        onConfirm={() => setShowAlreadySentError(false)}
        title={<span>Already Sent <span role="img" aria-label="sent">📬</span></span>}
        message={<span>
          <strong>This newsletter has already been sent.</strong><br/>
          <span style={{color:'#64748b'}}>You cannot send it again to avoid duplicate emails.</span><br/>
          <span style={{color:'#2563eb'}}>Tip:</span> If you need to resend, please <strong>create a new newsletter</strong>.<br/>
        </span>}
        confirmText="OK, Got it!"
        hideCancel={true}
        type="info"
        animated={true}
        appearance="modern"
      />
      </div>
    </ErrorBoundary>
  );
};

export default NewsletterDashboard;