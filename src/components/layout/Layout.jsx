/**
 * Layout.jsx
 * 
 * A comprehensive layout component for public pages of the application.
 * Provides a consistent layout structure with main content area and footer
 * including newsletter subscription and social media links.
 * 
 * Features:
 * - Responsive design for all screen sizes
 * - Newsletter subscription integration
 * - Social media links with proper accessibility
 * - Contact information display
 * - Dark mode support
 * - SEO-friendly structure
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import NewsletterSubscribe from '../NewsletterSubscribe';

/**
 * Layout - Main layout component for public pages
 * 
 * @returns {JSX.Element} Public page layout component
 */
const Layout = () => {
  /**
   * Get current year for copyright
   */
  const currentYear = new Date().getFullYear();

  /**
   * Handle social media link clicks with analytics
   * 
   * @param {string} platform - Social media platform name
   */
  const handleSocialClick = (platform) => {
    // Analytics tracking could be implemented here
    console.log(`Social media link clicked: ${platform}`);
  };

  /**
   * Handle contact email click
   */
  const handleContactClick = () => {
    // Analytics tracking could be implemented here
    console.log('Contact email clicked');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Newsletter Section */}
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and insights.
              </p>
              <NewsletterSubscribe />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Us
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaEnvelope className="h-5 w-5 mr-3 text-primary-500" />
                    <a 
                      href="mailto:contact@example.com" 
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                      onClick={handleContactClick}
                      aria-label="Send email to contact@example.com"
                    >
                      contact@example.com
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <FaPhone className="h-5 w-5 mr-3 text-primary-500" />
                    <a 
                      href="tel:+1234567890" 
                      className="hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                      aria-label="Call us at +1 (234) 567-890"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                  <div className="flex items-start text-gray-600 dark:text-gray-400">
                    <FaMapMarkerAlt className="h-5 w-5 mr-3 mt-0.5 text-primary-500 flex-shrink-0" />
                    <span>
                      123 Business Street<br />
                      Suite 100<br />
                      City, State 12345
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect with us on social media for updates and insights.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com/example"
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('Twitter')}
                    aria-label="Follow us on Twitter"
                  >
                    <FaTwitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://github.com/example"
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('GitHub')}
                    aria-label="Visit our GitHub repository"
                  >
                    <FaGithub className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com/company/example"
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialClick('LinkedIn')}
                    aria-label="Connect with us on LinkedIn"
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-center md:text-left text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} Tech4biz Solutions. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a 
                  href="/privacy" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a 
                  href="/cookies" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

/**
 * @copyright Tech4biz Solutions Private
 */ 