/**
 * EmailSetupSection.jsx
 * 
 * Email notification preferences component for user profile settings.
 * Handles email configuration, newsletter subscriptions, and notification preferences.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Switch, Button, Card, Space, Divider, message } from 'antd';
import { FaEnvelope, FaBell, FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

/**
 * EmailSetupSection Component
 * 
 * Manages email notification preferences including email address, newsletter
 * subscriptions, and various notification types with validation and save functionality.
 * 
 * @component
 * @returns {JSX.Element} Email setup section component
 */
const EmailSetupSection = () => {
  // Form instance for validation and submission
  const [form] = Form.useForm();
  
  // Authentication context for user data
  const { user } = useAuth();
  
  // UI state management
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Email preferences state
  const [emailPreferences, setEmailPreferences] = useState({
    email: user?.email || '',
    newsletter: false,
    marketing: false,
    updates: true,
    security: true,
    digest: false
  });

  /**
   * Loads saved email preferences from localStorage or user data
   * @function loadSavedPreferences
   */
  const loadSavedPreferences = useCallback(() => {
    try {
      const savedPreferences = localStorage.getItem('emailPreferences');
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setEmailPreferences(prev => ({ ...prev, ...parsed }));
        form.setFieldsValue(parsed);
      } else {
        // Set default values from user data
        const defaultPreferences = {
          email: user?.email || '',
          newsletter: false,
          marketing: false,
          updates: true,
          security: true,
          digest: false
        };
        setEmailPreferences(defaultPreferences);
        form.setFieldsValue(defaultPreferences);
      }
    } catch (error) {
      console.error('Error loading email preferences:', error);
      message.error('Failed to load email preferences');
    }
  }, [form, user?.email]);

  /**
   * Validates email format and availability
   * @async
   * @function validateEmail
   * @param {string} email - Email address to validate
   * @returns {Promise<boolean>} Validation result
   */
  const validateEmail = useCallback(async (email) => {
    if (!email) return false;
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Additional validation could be added here (e.g., API call to check availability)
    return true;
  }, []);

  /**
   * Handles email validation on blur
   * @async
   * @function handleEmailValidation
   * @param {string} email - Email address to validate
   */
  const handleEmailValidation = useCallback(async (email) => {
    if (!email) return;
    
    setIsValidating(true);
    try {
      const isValid = await validateEmail(email);
      if (!isValid) {
        form.setFields([
          {
            name: 'email',
            errors: ['Please enter a valid email address']
          }
        ]);
      } else {
        form.setFields([
          {
            name: 'email',
            errors: []
          }
        ]);
      }
    } catch (error) {
      console.error('Email validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [form, validateEmail]);

  /**
   * Saves email preferences to localStorage and potentially to backend
   * @async
   * @function savePreferences
   */
  const savePreferences = useCallback(async () => {
    try {
      setLoading(true);
      
      // Validate form
      const values = await form.validateFields();
      
      // Update preferences state
      const updatedPreferences = {
        ...emailPreferences,
        ...values,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('emailPreferences', JSON.stringify(updatedPreferences));
      
      // Simulate API call for saving preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailPreferences(updatedPreferences);
      setHasChanges(false);
      message.success('Email preferences saved successfully');
      
      // Additional success feedback
      message.info('You will receive a confirmation email shortly');
      
    } catch (error) {
      console.error('Error saving email preferences:', error);
      
      if (error.errorFields) {
        message.error('Please fix the validation errors');
      } else {
        message.error('Failed to save email preferences. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [form, emailPreferences]);

  /**
   * Resets form to last saved values
   * @function resetForm
   */
  const resetForm = useCallback(() => {
    form.setFieldsValue(emailPreferences);
    setHasChanges(false);
    message.info('Form reset to last saved values');
  }, [form, emailPreferences]);

  /**
   * Handles form field changes to track modifications
   * @function handleFormChange
   */
  const handleFormChange = useCallback(() => {
    setHasChanges(true);
  }, []);

  // Load preferences on component mount
  useEffect(() => {
    loadSavedPreferences();
  }, [loadSavedPreferences]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-blue-500 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Email Notifications</h2>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Button
              onClick={resetForm}
              icon={<FaTimes />}
              disabled={loading}
            >
              Reset
            </Button>
          )}
          <Button
            type="primary"
            onClick={savePreferences}
            loading={loading}
            disabled={!hasChanges}
            icon={<FaSave />}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        initialValues={emailPreferences}
      >
        <Space direction="vertical" size="large" className="w-full">
          {/* Email Address Configuration */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                <span className="font-medium">Email Address</span>
              </div>
            }
            className="border-0 shadow-sm"
          >
            <Form.Item
              label="Primary Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please input your email address!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
              extra="This email will be used for all notifications and account communications"
            >
              <Input 
                placeholder="Enter your email address"
                suffix={isValidating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />}
                onBlur={(e) => handleEmailValidation(e.target.value)}
                disabled={loading}
              />
            </Form.Item>
          </Card>

          {/* Notification Preferences */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <FaBell className="text-blue-500" />
                <span className="font-medium">Notification Preferences</span>
              </div>
            }
            className="border-0 shadow-sm"
          >
            <Space direction="vertical" size="large" className="w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Newsletter Subscription</h4>
                  <p className="text-sm text-gray-600">Receive weekly newsletters with updates and tips</p>
                </div>
                <Form.Item name="newsletter" valuePropName="checked" noStyle>
                  <Switch disabled={loading} />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Marketing Communications</h4>
                  <p className="text-sm text-gray-600">Receive promotional emails and special offers</p>
                </div>
                <Form.Item name="marketing" valuePropName="checked" noStyle>
                  <Switch disabled={loading} />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">System Updates</h4>
                  <p className="text-sm text-gray-600">Important system updates and maintenance notifications</p>
                </div>
                <Form.Item name="updates" valuePropName="checked" noStyle>
                  <Switch disabled={loading} />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Security Alerts</h4>
                  <p className="text-sm text-gray-600">Critical security notifications and login alerts</p>
                </div>
                <Form.Item name="security" valuePropName="checked" noStyle>
                  <Switch disabled={loading} />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Weekly Digest</h4>
                  <p className="text-sm text-gray-600">Summary of your weekly activity and insights</p>
                </div>
                <Form.Item name="digest" valuePropName="checked" noStyle>
                  <Switch disabled={loading} />
                </Form.Item>
              </div>
            </Space>
          </Card>

          {/* Information Section */}
          <Card className="border-0 bg-blue-50">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Email Preferences Updated</h4>
                <p className="text-sm text-blue-700">
                  Your email preferences have been saved. You can change these settings at any time. 
                  All emails include an unsubscribe link for your convenience.
                </p>
              </div>
            </div>
          </Card>
        </Space>
      </Form>
    </div>
  );
};

export default EmailSetupSection;

/**
 * @copyright Tech4biz Solutions Private
 */ 