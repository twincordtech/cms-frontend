// ===============================
// File: AuthContext.jsx
// Description: Authentication context provider with login, register, password, and admin logic. Includes error handling and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

/**
 * AuthContext provides authentication state and actions for the app.
 */
const AuthContext = createContext();

/**
 * useAuth returns the authentication context value.
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * AuthProvider wraps the app and provides authentication state and actions.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  // State for user and loading
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const { data } = await authApi.getCurrentUser();
        if (data.success) {
          setUser(data.user);
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  /**
   * Log out the user and clear tokens
   */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  /**
   * Login with email and password (4-step process)
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const login = async (email, password) => {
    try {
      // Step 1: Check credentials
      const credentialsResponse = await authApi.checkCredentials(email, password);
      if (!credentialsResponse.data.success) {
        throw new Error(credentialsResponse.data.message);
      }
      const { user } = credentialsResponse.data;
      // Step 2: Get refresh token
      const refreshTokenResponse = await authApi.getRefreshToken(user.id);
      if (!refreshTokenResponse.data.success) {
        throw new Error('Failed to get refresh token');
      }
      const { refreshToken } = refreshTokenResponse.data;
      localStorage.setItem('refreshToken', refreshToken);
      // Step 3: Get access token
      const accessTokenResponse = await authApi.getAccessToken(refreshToken);
      if (!accessTokenResponse.data.success) {
        throw new Error('Failed to get access token');
      }
      const { accessToken } = accessTokenResponse.data;
      // Step 4: Login with access token
      await authApi.login(accessToken);
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Register a new user with email, name, mobile, and password
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email
   * @param {string} userData.mobile - User's mobile number
   * @param {string} userData.password - User's password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const register = async (userData) => {
    try {
      const { data } = await authApi.register(userData);
      if (data.success) {
        toast.success('Registration successful! You can now login.');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Set password for a user
   * @param {string} token
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const setPassword = async (token, password) => {
    try {
      const { data } = await authApi.setPassword(token, password);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Password set successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to set password';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Log out the user (API call and clear tokens)
   * @returns {Promise<{success: boolean}>}
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Log error for debugging
      // (Do not show toast to user for logout errors)
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    }
  };

  /**
   * Request password reset email
   * @param {string} email
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const forgotPassword = async (email) => {
    try {
      const { data } = await authApi.forgotPassword(email);
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to process request';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const resetPassword = async (token, password) => {
    try {
      const { data } = await authApi.resetPassword(token, password);
      if (data.success) {
        toast.success('Password reset successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return { success: false, message };
    }
  };

  /**
   * Check if the current user is an admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Context value
  const value = {
    user,
    isLoading,
    login,
    register,
    setPassword,
    logout,
    forgotPassword,
    resetPassword,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// ===============================
// End of File: AuthContext.jsx
// Description: Authentication context provider with error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 