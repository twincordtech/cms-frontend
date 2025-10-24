/**
 * SaveProgressModal.jsx
 *
 * Modal for displaying save progress, success, or error states during content updates.
 * Provides animated feedback, accessibility, and clear user guidance.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes, FaHistory } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

/**
 * SaveProgressModal Component
 *
 * Displays a modal with animated feedback for saving, success, or error states.
 * Handles accessibility, keyboard navigation, and user feedback.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {string} [props.status] - Status ('saving', 'success', 'error')
 * @param {Object} [props.savedData] - Data about the save operation
 * @returns {JSX.Element|null}
 */
const SaveProgressModal = ({ isOpen, onClose, status = 'saving', savedData = null }) => {
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let progressInterval;
    let closeTimeout;

    if (isOpen && status === 'saving') {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 400);
    }

    if (status === 'success') {
      setProgress(100);
      setShowSuccess(true);
      closeTimeout = setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setProgress(0);
      }, 4000);
    }

    if (status === 'error') {
      setProgress(100);
      closeTimeout = setTimeout(() => {
        onClose();
        setProgress(0);
      }, 4000);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [isOpen, status, onClose]);

  /**
   * Returns content and styles based on status
   * @returns {Object}
   */
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <AiOutlineLoading3Quarters className="w-14 h-14 text-blue-500 animate-spin" aria-label="Saving..." />,
          title: 'Saving your changes',
          message: 'Please wait while we update your content...',
          ringColor: 'ring-blue-100',
          iconColor: 'text-blue-500',
          bgGlow: 'bg-blue-50'
        };
      case 'success':
        return {
          icon: <FaCheckCircle className="w-14 h-14 text-emerald-500" aria-label="Success" />,
          title: 'Content updated successfully',
          message: savedData?.message || 'Your changes have been saved and published',
          ringColor: 'ring-emerald-100',
          iconColor: 'text-emerald-500',
          bgGlow: 'bg-emerald-50'
        };
      case 'error':
        return {
          icon: <FaTimesCircle className="w-14 h-14 text-red-500" aria-label="Error" />,
          title: 'Error updating content',
          message: savedData?.error || 'There was a problem saving your changes. Please try again.',
          ringColor: 'ring-red-100',
          iconColor: 'text-red-500',
          bgGlow: 'bg-red-50'
        };
      default:
        return null;
    }
  };

  /**
   * Renders details about the saved content (if any)
   * @returns {JSX.Element|null}
   */
  const renderSavedContent = () => {
    if (!savedData?.components) return null;
    return (
      <div className="mt-6 pt-6 border-t border-gray-100">
        {/* History Link */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-base">
          <FaHistory className="text-gray-400" aria-hidden="true" />
          <span className="text-gray-600">Track all changes in the</span>
          <button 
            onClick={() => {
              onClose();
              // Add navigation to history page here if needed
            }}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            aria-label="Go to history page"
          >
            history page
          </button>
        </div>
      </div>
    );
  };

  const content = getStatusContent();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="save-modal-title" aria-describedby="save-modal-desc">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <div className="px-8 py-10">
          <div className="text-center">
            {/* Icon with glow effect */}
            <div className="relative inline-flex mb-8">
              {/* Outer glow */}
              <div className={`absolute inset-0 ${content.bgGlow} rounded-full blur-xl opacity-50 scale-150`}></div>
              {/* Middle ring */}
              <div className={`absolute inset-0 ${content.bgGlow} rounded-full animate-ping opacity-30`}></div>
              {/* Icon container */}
              <div className={`relative rounded-full p-4 ${content.ringColor} ring-8 bg-white`}>
                {content.icon}
              </div>
            </div>
            {/* Content */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-3" id="save-modal-title">
              {content.title}
            </h2>
            <p className="text-base text-gray-600 mb-6" id="save-modal-desc">
              {content.message}
            </p>
            {/* Saved Content Details */}
            {status === 'success' && renderSavedContent()}
            {/* Action buttons */}
            {status === 'error' && (
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  aria-label="Try Again"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveProgressModal;

/**
 * @copyright Tech4biz Solutions Private
 */ 