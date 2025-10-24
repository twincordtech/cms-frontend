/**
 * AccountSection.jsx
 * 
 * Account management component for user profile settings.
 * Handles account information display and admin role elevation.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserShield, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';

/**
 * AccountSection Component
 * 
 * Displays user account information and provides admin role elevation functionality.
 * Includes proper error handling, loading states, and accessibility features.
 * 
 * @component
 * @returns {JSX.Element} Account section component
 */
const AccountSection = () => {
  // Authentication context for user data
  const { user, updateUser } = useAuth();
  
  // Loading state for admin role elevation
  const [makingAdmin, setMakingAdmin] = useState(false);
  
  // Confirmation state for admin elevation
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Handles admin role elevation with proper validation and error handling
   * @async
   * @function handleMakeAdmin
   * @returns {Promise<void>}
   */
  const handleMakeAdmin = useCallback(async () => {
    try {
      setMakingAdmin(true);
      
      // Validate user exists
      if (!user) {
        toast.error('User information not available');
        return;
      }

      // Call API to elevate user role
      const response = await authApi.makeAdmin();
      
      if (response?.data?.success) {
        toast.success('Your account is now an admin');
        
        // Update local user context if available
        if (updateUser) {
          updateUser({ ...user, role: 'admin' });
        }
        
        // Reload page to reflect changes
        window.location.reload();
      } else {
        toast.error(response?.data?.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error making admin:', error);
      
      // Provide user-friendly error message
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update role. Please try again.';
      toast.error(errorMessage);
    } finally {
      setMakingAdmin(false);
      setShowConfirmation(false);
    }
  }, [user, updateUser]);

  /**
   * Handles confirmation dialog for admin elevation
   * @function handleAdminConfirmation
   */
  const handleAdminConfirmation = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  /**
   * Cancels admin elevation confirmation
   * @function handleCancelConfirmation
   */
  const handleCancelConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // Early return if user data is not available
  if (!user) {
    return (
      <div className="bg-white rounded-lg max-w-full shadow-md p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-3" />
            <p className="text-gray-600">User information not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg max-w-full shadow-md p-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
        {user?.role === 'admin' && (
          <div className="flex items-center text-green-600">
            <FaCheckCircle className="mr-2" />
            <span className="text-sm font-medium">Admin Account</span>
          </div>
        )}
      </div>

      {/* Email Information */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email Address
        </label>
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-gray-800 font-medium">{user.email}</span>
        </div>
      </div>

      {/* Role Information */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Account Role
        </label>
        <div className="flex items-center justify-between">
          <div className={`px-3 py-2 rounded-md capitalize font-medium ${
              user.role === 'admin' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
            {user.role || 'user'}
          </div>
          {/* Admin Elevation Button */}
          {user.role !== 'admin' && (
            <button
              onClick={handleAdminConfirmation}
              disabled={makingAdmin}
              className="bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Elevate account to admin role"
            >
              {makingAdmin ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" 
                       role="status" aria-label="Processing">
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <FaUserShield className="mr-2" aria-hidden="true" />
                  Make Admin
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <FaUserShield className="text-purple-600 text-xl mr-3" />
              <h3 className="text-lg font-semibold">Confirm Admin Elevation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to elevate your account to admin role? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelConfirmation}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={makingAdmin}
              >
                Cancel
              </button>
              <button
                onClick={handleMakeAdmin}
                disabled={makingAdmin}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {makingAdmin ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSection;

/**
 * @copyright Tech4biz Solutions Private
 */ 