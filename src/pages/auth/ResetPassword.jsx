// ============================== FILE HEADER ==============================
// File: ResetPassword.jsx
// Description: Secure password reset page for users. Handles password reset with validation, accessibility, and robust error handling.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ========================================================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * ResetPassword component allows a user to reset their password using a token (e.g., from a password reset email).
 * Handles validation, accessibility, and user feedback for a secure password reset experience.
 * @component
 */
const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // React Hook Form setup for validation and state management
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  // Redirect to forgot-password if token is missing
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  /**
   * Handles form submission for resetting the password.
   * @param {Object} data - Form data containing password and confirmPassword.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    try {
      const result = await resetPassword(token, data.password);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
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
        aria-label="Reset Password Form Container"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create a new password for your account
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
                  Your password has been reset successfully. You can now login with your new password.
                </p>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
                  >
                    Go to login page
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} aria-label="Reset Password Form" autoComplete="off" noValidate>
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

            <div className="space-y-4">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  aria-label="New Password"
                  aria-required="true"
                  aria-invalid={!!errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                      message: 'Password must contain at least one letter and one number'
                    }
                  })}
                  className={`input ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  aria-label="Confirm New Password"
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className={`input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex justify-center py-3"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" className="mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
                Reset Password
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

export default ResetPassword;
// ============================== FILE FOOTER ==============================
// End of ResetPassword.jsx
// ======================================================================== 