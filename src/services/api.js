// ===============================
// File: api.js
// Description: Centralized API service for all HTTP requests, authentication, CMS, newsletter, and utility endpoints. Includes interceptors, error handling, and token management.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import axios from 'axios';

// Get access token from localStorage
const accessToken = localStorage.getItem('accessToken');

// Set up axios instance with defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        // Get new access token
        const response = await authApi.getAccessToken(refreshToken);
        if (response.data.success) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid or expired, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 */
export const authApi = {
  /** Step 1: Check credentials */
  checkCredentials: (email, password) => api.post('/auth/check-credentials', { email, password }),
  /** Step 2: Get refresh token */
  getRefreshToken: (userId) => api.post('/auth/refresh-token', { userId }),
  /** Step 3: Get access token */
  getAccessToken: (refreshToken) => api.post('/auth/access-token', { refreshToken }),
  /** Step 4: Login (using access token) */
  login: (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    return Promise.resolve({ success: true });
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return api.post('/auth/logout');
  },
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  setPassword: (token, password) => api.post(`/auth/set-password/${token}`, { password }),
  updatePassword: (currentPassword, newPassword) => api.put('/auth/profile/password', { currentPassword, newPassword }),
  makeAdmin: () => api.post('/auth/make-admin')
};

/**
 * CMS API endpoints for sections, pages, blogs, media, search, stats, and components
 */
export const cmsApi = {
  // Sections
  getSections: () => api.get('/cms/sections'),
  getAdminSections: () => api.get('/cms/admin/sections'),
  getSection: (id) => api.get(`/cms/admin/sections/${id}`),
  createSection: (data) => api.post('/cms/admin/sections', data),
  updateSection: (id, data) => api.put(`/cms/admin/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/cms/admin/sections/${id}`),
  updateSectionOrder: (sectionIds) => api.put('/cms/admin/sections/order', { sectionIds }),
  restoreSectionVersion: (id, versionIndex) => api.put(`/cms/admin/sections/${id}/restore/${versionIndex}`),
  getSectionStats: () => api.get('/cms/sections/stats'),
  getRecentSections: () => api.get('/cms/sections/recent'),
  // Pages
  getPages: () => api.get('/cms/pages'),
  getAdminPages: () => api.get('/cms/admin/pages'),
  getPage: (id) => api.get(`/cms/admin/pages/${id}`),
  createPage: (data) => api.post('/cms/admin/pages', data),
  updatePage: (id, data) => api.put(`/cms/admin/pages/${id}`, data),
  deletePage: (id) => api.delete(`/cms/admin/pages/${id}`),
  getPageBySlug: (slug) => api.get(`/cms/pages/${slug}`),
  // Page Content with Sections
  getPageContent: (slug) => api.get(`/cms/pages/${slug}/content`),
  getAdminPageContent: (slug) => api.get(`/cms/admin/pages/${slug}/content`),
  updatePageContent: (slug, data) => api.put(`/cms/admin/pages/${slug}/content`, data),
  // Blogs
  getBlogs: (params) => api.get('/blogs', { params }),
  getAdminBlogs: () => api.get('/blogs'),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
  getBlogStats: () => api.get('/blogs/stats'),
  getRecentBlogs: () => api.get('/blogs/recent'),
  publishBlog: (id) => api.put(`/blogs/${id}/publish`),
  unpublishBlog: (id) => api.put(`/blogs/${id}/unpublish`),
  searchBlogs: (query) => api.get('/blogs/search', { params: { query } }),
  // Media Library
  getFolders: () => api.get('/cms/folders'),
  createFolder: (data) => api.post('/cms/folders', data),
  updateFolder: (id, data) => api.put(`/cms/folders/${id}`, data),
  deleteFolder: (id) => api.delete(`/cms/folders/${id}`),
  getFiles: (params) => api.get('/cms/files', { params }),
  uploadFile: (formData, config = {}) => api.post('/cms/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, ...config
  }),
  updateFile: (id, data, isFormData = false) => {
    if (isFormData) {
      return api.put(`/cms/files/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/cms/files/${id}`, data);
  },
  deleteFile: (id) => api.delete(`/cms/files/${id}`),
  // Search
  searchContent: (query) => api.get('/cms/search', { params: { query } }),
  // Stats and Analytics
  getStats: () => api.get('/cms/stats'),
  getAnalytics: (startDate, endDate) => api.get('/cms/analytics', { params: { startDate, endDate } }),
  // Components
  getComponents: () => api.get('/cms/components'),
  getComponent: (id) => api.get(`/cms/components/${id}`),
  createComponent: (data) => api.post('/cms/components', data),
  updateComponent: (id, data) => api.put(`/cms/components/${id}`, data),
  deleteComponent: (id) => api.delete(`/cms/components/${id}`),
  createComponentFromExisting: (data) => api.post('/cms/components', { ...data, isBasedOn: data.baseComponentId })
};

/**
 * Newsletter API endpoints for subscriber and newsletter management
 */
export const newsletterApi = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
  getSubscribers: () => api.get('/newsletter/subscribers'),
  getSubscriber: (id) => api.get(`/newsletter/subscribers/${id}`),
  updateSubscriber: (id, data) => api.put(`/newsletter/subscribers/${id}`, data),
  deleteSubscriber: (id) => api.delete(`/newsletter/subscribers/${id}`),
  getNewsletters: () => api.get('/newsletter'),
  createNewsletter: (data) => api.post('/newsletter', data),
  sendNewsletter: (id) => api.post(`/newsletter/${id}/send`),
  deleteNewsletter: (id) => api.delete(`/newsletter/${id}`),
  updateNewsletter: (id, data) => api.put(`/newsletter/${id}`, data),
  scheduleNewsletter: (id, scheduleData) => api.post(`/newsletter/${id}/schedule`, scheduleData),
  cancelSchedule: (id) => api.post(`/newsletter/${id}/cancel-schedule`),
  getSchedule: (id) => api.get(`/newsletter/${id}/schedule`),
  updateSchedule: (id, scheduleData) => api.put(`/newsletter/${id}/schedule`, scheduleData),
  getScheduledNewsletters: () => api.get('/newsletter/scheduled')
};

// Component API (legacy, for direct calls)
export const getComponentTypes = () => api.get('/cms/component-types');
export const getComponents = () => api.get('/cms/components');
export const getPageComponents = (pageId) => api.get(`/cms/components/page/${pageId}`);
export const createComponent = (data) => api.post('/cms/components', data);
export const updateComponent = (id, data) => api.put(`/cms/components/${id}`, data);
export const deleteComponent = (name) => api.delete(`/cms/components/name/${name}`);
export const deleteComponentType = (id) => api.delete(`/cms/component-types/${id}`);
export const reorderComponents = (pageId, componentOrders) => api.put(`/cms/components/page/${pageId}/reorder`, { componentOrders });

// Layout API
export const getLayouts = () => api.get('/layouts');
export const getLayout = (id) => api.get(`/layouts/${id}`);
export const createLayout = (layoutData) => api.post('/layouts', layoutData);
export const updateLayout = (id, layoutData) => api.put(`/layouts/${id}`, layoutData);
export const deleteLayout = (id) => api.delete(`/layouts/${id}`);
export const getLayoutById = (id) => api.get(`/layouts/${id}`);
export const getLayoutVersions = (id) => api.get(`/layouts/${id}/versions`);

// Notification API functions
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};
export const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

// Lead API functions
export const createLead = async (leadData) => {
  try {
    const response = await api.post('/leads', leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getLeads = async (params = {}) => {
  try {
    const response = await api.get('/leads', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllLeads = async () => {
  try {
    const response = await api.get('/leads/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateLeadStatus = async (leadId, data) => {
  try {
    const response = await api.put(`/leads/${leadId}/status`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteLead = async (leadId) => {
  try {
    const response = await api.delete(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const scheduleMeeting = async (leadId, meetingData) => {
  try {
    const response = await api.post(`/leads/${leadId}/schedule-meeting`, meetingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.statusText || 
      'Failed to schedule meeting'
    );
  }
};

// Activity API
export const getActivities = async (params = {}) => {
  try {
    const response = await api.get('/activities', { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    throw error;
  }
};
export const getUserActivities = async (userId, params = {}) => {
  try {
    const response = await api.get(`/activities/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Inquiry API functions
export const createInquiry = async (inquiryData) => {
  try {
    const response = await api.post('/cms/inquiries', inquiryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getInquiries = async (params = {}) => {
  try {
    const response = await api.get('/cms/inquiries', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateInquiryStatus = async (inquiryId, statusData) => {
  try {
    const response = await api.put(`/cms/inquiries/${inquiryId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteInquiry = async (inquiryId) => {
  try {
    const response = await api.delete(`/cms/inquiries/${inquiryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const scheduleInquiryMeeting = async (inquiryId, meetingData) => {
  try {
    const response = await api.post(`/cms/inquiries/${inquiryId}/schedule-meeting`, meetingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Form API endpoints
 */
export const formApi = {
  getForms: () => api.get('/forms'),
  getFormById: (id) => api.get(`/forms/${id}`),
  createForm: (data) => api.post('/forms', data),
  updateForm: (id, data) => api.put(`/forms/${id}`, data),
  submitForm: (id, data) => api.post(`/forms/${id}/submit`, data),
  deleteForm: (id) => api.delete(`/forms/${id}`),
};

export const authorApi = {
  getAuthors: () => api.get('/auth/authors'),
  createAuthor: (data) => api.post('/auth/authors', data)
};

export default api;
// ===============================
// End of File: api.js
// Description: Centralized API service with error handling and documentation
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 