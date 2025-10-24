// ===============================
// File: EditSubscriberModal.jsx
// Description: Modal for editing newsletter subscribers.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Modal for editing a newsletter subscriber
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {Object} props.subscriber - Subscriber object to edit
 * @param {function} props.onUpdate - Callback after updating subscriber
 */
const EditSubscriberModal = ({ isOpen, onClose, subscriber, onUpdate }) => {
  const [formData, setFormData] = useState({
    email: '',
    status: 'active',
    source: 'website'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form when subscriber changes
  useEffect(() => {
    if (subscriber) {
      setFormData({
        email: subscriber.email || '',
        status: subscriber.status || 'active',
        source: subscriber.source || 'website'
      });
    }
  }, [subscriber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Basic validation
      if (!formData.email || !formData.email.trim()) {
        throw new Error('Email is required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Call the onUpdate function with form data
      await onUpdate(subscriber._id, formData);
      
      toast.success('Subscriber updated successfully');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error updating subscriber';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Edit Subscriber</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-500" 
                aria-label="Close edit subscriber modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  disabled={loading}
                  required
                  aria-label="Email address"
                />
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  aria-label="Select status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Source Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  aria-label="Select source"
                >
                  <option value="website">Website</option>
                  <option value="import">Import</option>
                  <option value="api">API</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  disabled={loading}
                  aria-label="Cancel edit subscriber"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                  aria-label="Update subscriber"
                >
                  {loading ? 'Updating...' : 'Update Subscriber'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EditSubscriberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subscriber: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

export default EditSubscriberModal;
// ===============================
// End of File: EditSubscriberModal.jsx
// Description: Modal for editing newsletter subscribers.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 