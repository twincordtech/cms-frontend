// ===============================
// File: Register.jsx
// Description: User registration form with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

/**
 * Register provides a form for users to create a new account.
 * Includes accessibility, error handling, and user feedback.
 * @component
 */
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();

  /**
   * Handle form submission for registration
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError('');
    try {
      const result = await register(data);
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setRegisterError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('An unexpected error occurred. Please try again.');
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
        aria-label="Register Form"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
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
                  Registration successful! Redirecting to login...
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} aria-label="User Registration Form">
            {registerError && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{registerError}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={`input ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Full Name"
                aria-required="true"
                aria-label="Full Name"
                {...registerField('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`input ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Email address"
                aria-required="true"
                aria-label="Email address"
                {...registerField('email', { 
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
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                autoComplete="tel"
                className={`input ${errors.mobile ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Mobile Number"
                aria-required="true"
                aria-label="Mobile Number"
                {...registerField('mobile', { 
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit mobile number'
                  }
                })}
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.mobile.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`input ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Password"
                aria-required="true"
                aria-label="Password"
                {...registerField('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`input ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Confirm Password"
                aria-required="true"
                aria-label="Confirm Password"
                {...registerField('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex justify-center py-3"
                aria-label="Register with Email"
              >
                {isLoading ? (
                  <LoadingSpinner size="small" className="mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                )}
                Register with Email
              </button>
            </div>
            <div className="text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                By registering, you agree to our{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
// ===============================
// End of File: Register.jsx
// Description: User registration form with accessibility and error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 