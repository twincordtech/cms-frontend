/**
 * ConfirmationModal.jsx
 *
 * Reusable confirmation modal for critical actions. Supports warning, danger, and info types.
 * Ensures accessibility, keyboard navigation, and production-level code quality.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * ConfirmationModal Component
 *
 * Displays a modal dialog for confirming user actions. Supports different types (warning, danger, info).
 * Handles accessibility, keyboard navigation, and clear user feedback.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {function} props.onConfirm - Callback to confirm the action
 * @param {string} [props.title] - Modal title
 * @param {string} [props.message] - Modal message
 * @param {string} [props.confirmText] - Confirm button text
 * @param {string} [props.cancelText] - Cancel button text
 * @param {string} [props.type] - Modal type ('warning', 'danger', 'info')
 * @returns {JSX.Element|null}
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
          ring: 'focus:ring-red-500',
          bg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          ring: 'focus:ring-yellow-500',
          bg: 'bg-yellow-100'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          ring: 'focus:ring-blue-500',
          bg: 'bg-blue-100'
        };
      default:
        return {
          icon: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          ring: 'focus:ring-gray-500',
          bg: 'bg-gray-100'
        };
    }
  };

  const styles = getTypeStyles();

  // Trap focus inside modal for accessibility
  React.useEffect(() => {
    if (!isOpen) return;
    const focusable = document.querySelectorAll(
      '.confirmation-modal [tabindex]:not([tabindex="-1"]), .confirmation-modal button, .confirmation-modal a, .confirmation-modal input, .confirmation-modal select, .confirmation-modal textarea'
    );
    if (focusable.length) focusable[0].focus();
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-label="Close modal"
        />
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="document">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.bg} sm:mx-0 sm:h-10 sm:w-10`}>
              <FaExclamationTriangle className={`h-6 w-6 ${styles.icon}`} aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500" id="modal-desc">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none ${styles.ring} sm:ml-3 sm:w-auto sm:text-sm ${styles.button}`}
              onClick={onConfirm}
              tabIndex={0}
              aria-label={confirmText}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
              tabIndex={0}
              aria-label={cancelText}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

/**
 * @copyright Tech4biz Solutions Private
 */ 