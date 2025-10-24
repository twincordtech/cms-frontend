// ===============================
// File: Login.jsx
// Description: User login form with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Login provides a form for users to sign in to their account.
 * Includes accessibility, error handling, and user feedback.
 * @component
 */
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  /**
   * Handle form submission for login
   * @param {Object} data
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
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
        aria-label="Login Form"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} aria-label="User Login Form">
          {loginError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{loginError}</p>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
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
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Password"
                  aria-required="true"
                  aria-label="Password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                aria-label="Remember me"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex justify-center py-3"
              aria-label="Sign in"
            >
              {isLoading ? (
                <LoadingSpinner size="small" className="mr-2" />
              ) : (
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
              Sign in
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
// ===============================
// End of File: Login.jsx
// Description: User login form with accessibility and error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 