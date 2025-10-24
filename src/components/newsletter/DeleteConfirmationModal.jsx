// ===============================
// File: DeleteConfirmationModal.jsx
// Description: Modern confirmation modal for newsletter deletion with polite messaging and user-friendly design.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { FaExclamationTriangle, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../common/ErrorBoundary';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  newsletter, 
  isLoading = false 
}) => {
  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !newsletter) return null;

  const isSent = newsletter.status === 'sent';
  const isScheduled = newsletter.status === 'scheduled';

  const getModalContent = () => {
    if (isSent) {
      return {
        title: 'Delete Sent Newsletter',
        icon: <FaExclamationTriangle className="text-orange-500" />,
        message: 'This newsletter has already been sent to subscribers. Deleting it will remove it from your records, but it cannot undo the emails that were already sent.',
        warning: 'This action is irreversible and will permanently remove the newsletter from your system.',
        confirmText: 'Yes, Delete Newsletter',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      };
    } else if (isScheduled) {
      return {
        title: 'Delete Scheduled Newsletter',
        icon: <FaExclamationTriangle className="text-yellow-500" />,
        message: 'This newsletter is currently scheduled to be sent. Deleting it will cancel the schedule and remove it permanently.',
        warning: 'This action is irreversible and will cancel any pending sends.',
        confirmText: 'Yes, Delete & Cancel Schedule',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      };
    } else {
      return {
        title: 'Delete Newsletter',
        icon: <FaTrash className="text-red-500" />,
        message: 'Are you sure you want to delete this newsletter? This will permanently remove it from your system.',
        warning: 'This action is irreversible.',
        confirmText: 'Yes, Delete Newsletter',
        confirmColor: 'bg-red-600 hover:bg-red-700'
      };
    }
  };

  const content = getModalContent();

  return (
    <ErrorBoundary>
      <AnimatePresence>
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {content.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {content.title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Newsletter Info */}
                {newsletter && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {newsletter.subject}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          newsletter.status === 'sent' ? 'bg-green-500' :
                          newsletter.status === 'scheduled' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></span>
                        {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                      </span>
                      <span>
                        Created: {new Date(newsletter.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Message */}
                <p className="text-gray-700 leading-relaxed">
                  {content.message}
                </p>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      {content.warning}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:space-x-3 sm:space-x-reverse">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${content.confirmColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sm:w-auto`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    {content.confirmText}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
        </AnimatePresence>
      </ErrorBoundary>
    );
  };

export default DeleteConfirmationModal;

/* ========================================================================
 * End of File: DeleteConfirmationModal.jsx
 * ======================================================================== */ 