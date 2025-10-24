// ===============================
// File: ForgotPassword.jsx
// Description: Password reset request form with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * ForgotPassword provides a form for users to request a password reset link.
 * Includes accessibility, error handling, and user feedback.
 * @component
 */
const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  /**
   * Handle form submission for password reset
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await forgotPassword(data.email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to process request. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full space-y-8 glass p-8 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Forgot Password Form"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        {success ? (
          <motion.div
            className="rounded-md bg-green-50 dark:bg-green-900/30 p-4 my-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  If your email is registered in our system, you will receive a password reset link shortly.
                </p>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} aria-label="Password Reset Form">
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your email"
                aria-required="true"
                aria-label="Email address"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.email.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex justify-center py-3"
                aria-label="Send Reset Link"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" className="mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                )}
                Send Reset Link
              </button>
            </div>
            <div className="text-center">
              <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Return to login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
// ===============================
// End of File: ForgotPassword.jsx
// Description: Password reset request form with accessibility and error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 