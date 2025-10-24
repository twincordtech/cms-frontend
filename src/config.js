// ===============================
// File: config.js
// Description: Centralized application configuration for API, features, and UI settings.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
/**
 * Application Configuration
 *
 * This file centralizes all configuration values used throughout the application.
 * For environment-specific values, update them in this file.
 */

/**
 * API configuration values
 * @type {{ BASE_URL: string, TIMEOUT: number }}
 */
export const API_CONFIG = {
  BASE_URL: 'https://cms-backend-7fb2.onrender.com/api',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * Base URL for the application
 * @type {string}
 */
export const BASE_URL = 'https://cms-backend-7fb2.onrender.com';

/**
 * Feature flags for enabling/disabling features
 * @type {{ ENABLE_MOCK_DATA: boolean }}
 */
export const FEATURES = {
  ENABLE_MOCK_DATA: true, // Whether to use mock data when API calls fail
};

/**
 * UI configuration values
 * @type {{ ITEMS_PER_PAGE: number, DATE_FORMAT: { SHORT: object, LONG: object } }}
 */
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 10,
  DATE_FORMAT: {
    SHORT: { year: 'numeric', month: 'short', day: '2-digit' },
    LONG: { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' },
  },
};
// ===============================
// End of File: config.js
// Description: Application configuration
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 