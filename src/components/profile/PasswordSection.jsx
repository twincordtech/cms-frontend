/**
 * PasswordSection.jsx
 * 
 * Password management component for user profile settings.
 * Handles password changes with validation, security checks, and user feedback.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Card, Space, Alert, Progress, message } from 'antd';
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaKey,
  FaHistory
} from 'react-icons/fa';
import { authApi } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Password strength indicator component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.password - Password to evaluate
 * @returns {JSX.Element} Password strength indicator
 */
const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    
    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    
    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 10;
    
    return Math.min(score, 100);
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = (score) => {
    if (score < 40) return '#ff4d4f';
    if (score < 70) return '#faad14';
    return '#52c41a';
  };

  const getStrengthText = (score) => {
    if (score < 40) return 'Weak';
    if (score < 70) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">Password Strength:</span>
        <span 
          className="text-sm font-medium"
          style={{ color: getStrengthColor(strength) }}
        >
          {getStrengthText(strength)}
        </span>
      </div>
      <Progress 
        percent={strength} 
        strokeColor={getStrengthColor(strength)}
        showInfo={false}
        size="small"
      />
    </div>
  );
};

/**
 * PasswordSection Component
 * 
 * Provides secure password change functionality with comprehensive validation,
 * strength indicators, and user feedback. Includes security best practices.
 * 
 * @component
 * @returns {JSX.Element} Password section component
 */
const PasswordSection = () => {
  // Form instance for validation and submission
  const [form] = Form.useForm();
  
  // UI state management
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  /**
   * Validates password requirements and updates validation state
   * @function validatePasswordRequirements
   * @param {string} password - Password to validate
   */
  const validatePasswordRequirements = useCallback((password) => {
    if (!password) {
      setPasswordValidation({
        hasLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecial: false
      });
      return;
    }

    setPasswordValidation({
      hasLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password)
    });
  }, []);

  /**
   * Handles password visibility toggle
   * @function togglePasswordVisibility
   * @param {string} field - Password field to toggle
   */
  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  /**
   * Handles password change with validation
   * @async
   * @function onFinish
   * @param {Object} values - Form values
   */
  const onFinish = useCallback(async (values) => {
    try {
      setLoading(true);
      
      // Additional client-side validation
      if (values.newPassword === values.currentPassword) {
        toast.error('New password must be different from current password');
        return;
      }

      // Check password strength
      const strength = calculatePasswordStrength(values.newPassword);
      if (strength < 40) {
        toast.error('Please choose a stronger password');
        return;
      }

      // Call API to update password
      const response = await authApi.updatePassword(values.currentPassword, values.newPassword);
      
      if (response?.data?.success) {
        toast.success('Password updated successfully');
        form.resetFields();
        setPasswordValidation({
          hasLength: false,
          hasLowercase: false,
          hasUppercase: false,
          hasNumber: false,
          hasSpecial: false
        });
        
        // Log security event (in production, this would go to a security log)
        console.log('Password changed successfully at:', new Date().toISOString());
      } else {
        toast.error(response?.data?.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to update password';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || 'Invalid password format';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [form]);

  /**
   * Calculates password strength score
   * @function calculatePasswordStrength
   * @param {string} password - Password to evaluate
   * @returns {number} Strength score (0-100)
   */
  const calculatePasswordStrength = useCallback((password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    return Math.min(score, 100);
  }, []);

  /**
   * Handles new password input changes
   * @function handleNewPasswordChange
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleNewPasswordChange = useCallback((e) => {
    const password = e.target.value;
    validatePasswordRequirements(password);
  }, [validatePasswordRequirements]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaLock className="text-blue-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
      </div>

      {/* Security Information */}
      <Alert
        message="Password Security"
        description="For your security, please ensure your new password is strong and unique. We recommend using a combination of letters, numbers, and special characters."
        type="info"
        showIcon
        icon={<FaShieldAlt />}
        className="mb-6"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Space direction="vertical" size="large" className="w-full">
          {/* Current Password */}
          <Card className="border-0 shadow-sm">
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                { required: true, message: 'Please input your current password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                placeholder="Enter your current password"
                prefix={<FaKey className="text-gray-400" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                disabled={loading}
                autoComplete="current-password"
              />
            </Form.Item>
          </Card>

          {/* New Password */}
          <Card className="border-0 shadow-sm">
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('currentPassword') !== value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('New password must be different from current password!'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Enter your new password"
                prefix={<FaKey className="text-gray-400" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                onChange={handleNewPasswordChange}
                disabled={loading}
                autoComplete="new-password"
              />
            </Form.Item>

            {/* Password Strength Indicator */}
            <Form.Item noStyle>
              {({ getFieldValue }) => {
                const newPassword = getFieldValue('newPassword');
                return newPassword ? (
                  <PasswordStrengthIndicator password={newPassword} />
                ) : null;
              }}
            </Form.Item>

            {/* Password Requirements */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
              <div className="space-y-1">
                <div className={`flex items-center text-sm ${passwordValidation.hasLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasLength ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                  At least 8 characters long
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasLowercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                  Contains lowercase letter
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasUppercase ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                  Contains uppercase letter
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasNumber ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                  Contains number
                </div>
                <div className={`flex items-center text-sm ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasSpecial ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                  Contains special character
                </div>
              </div>
            </div>
          </Card>

          {/* Confirm New Password */}
          <Card className="border-0 shadow-sm">
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm your new password"
                prefix={<FaKey className="text-gray-400" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                disabled={loading}
                autoComplete="new-password"
              />
            </Form.Item>
          </Card>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              icon={<FaHistory />}
              size="large"
              className="w-full"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </Form.Item>
        </Space>
      </Form>

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <FaShieldAlt className="text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Security Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use a unique password that you don't use elsewhere</li>
              <li>• Consider using a password manager for better security</li>
              <li>• Enable two-factor authentication for additional protection</li>
              <li>• Regularly update your password and never share it</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSection;

/**
 * @copyright Tech4biz Solutions Private
 */ 