// ============================== FILE HEADER ==============================
// File: SetPassword.jsx
// Description: Secure password setup page for new users or invitees. Handles password creation with validation, accessibility, and robust error handling.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ========================================================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * SetPassword component allows a user to set their password for the first time (e.g., after invitation).
 * Handles validation, accessibility, and user feedback for a secure onboarding experience.
 * @component
 */
const SetPassword = () => {
  const { token } = useParams();
  const { setPassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // React Hook Form setup for validation and state management
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  /**
   * Handles form submission for setting the password.
   * @param {Object} data - Form data containing password and confirmPassword.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    try {
      const result = await setPassword(token, data.password);
      if (result.success) {
        setSuccess(true);
        // Redirect to dashboard after a short delay for user feedback
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError(result.message || 'Failed to set password. The link may have expired.');
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
        aria-label="Set Password Form Container"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Set your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create a secure password to complete your account setup
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
                  Your password has been set successfully. Redirecting to dashboard...
                </p>
                <div className="mt-4">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
                  >
                    Go to dashboard
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} aria-label="Set Password Form" autoComplete="off" noValidate>
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
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
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: 'Password must contain uppercase, lowercase, number, and special character'
                      }
                    })}
                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700'} placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800`}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    aria-label="Confirm New Password"
                    aria-required="true"
                    aria-invalid={!!errors.confirmPassword}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    className={`appearance-none relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700'} placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={0}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="w-5 h-5" />
                ) : (
                  'Set Password & Continue'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Return to login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SetPassword;
// ============================== FILE FOOTER ==============================
// End of SetPassword.jsx
// ======================================================================== 