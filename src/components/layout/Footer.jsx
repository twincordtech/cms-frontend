/**
 * Footer.jsx
 * 
 * A comprehensive footer component for the application.
 * Provides company information, navigation links, contact details,
 * and social media links with responsive design and accessibility features.
 * 
 * Features:
 * - Responsive grid layout
 * - Company branding and description
 * - Navigation links
 * - Contact information with icons
 * - Social media links
 * - Dark mode support
 * - Accessibility features
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 */

import { Link } from 'react-router-dom';
import { FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaGithub } from 'react-icons/fa';

/**
 * Footer - Footer component for the application
 * 
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
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
   * Handle contact link clicks
   * 
   * @param {string} type - Contact type (email, website)
   */
  const handleContactClick = (type) => {
    // Analytics tracking could be implemented here
    console.log(`Contact link clicked: ${type}`);
  };

  /**
   * Navigation links configuration
   */
  const navigationLinks = [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' }
  ];

  /**
   * Contact information configuration
   */
  const contactInfo = [
    {
      icon: <FaEnvelope className="h-5 w-5 mr-2 text-primary-500" />,
      label: 'Email',
      value: 'support@FentroCMS.com',
      href: 'mailto:support@FentroCMS.com',
      type: 'email'
    },
    {
      icon: <FaGlobe className="h-5 w-5 mr-2 text-primary-500" />,
      label: 'Website',
      value: 'FentroCMS.com',
      href: 'https://FentroCMS.com',
      type: 'website'
    }
  ];

  /**
   * Social media links configuration
   */
  const socialLinks = [
    {
      icon: <FaFacebook className="h-6 w-6" />,
      href: 'https://facebook.com/FentroCMS',
      platform: 'Facebook',
      label: 'Facebook'
    },
    {
      icon: <FaTwitter className="h-6 w-6" />,
      href: 'https://twitter.com/FentroCMS',
      platform: 'Twitter',
      label: 'Twitter'
    },
    {
      icon: <FaGithub className="h-6 w-6" />,
      href: 'https://github.com/FentroCMS',
      platform: 'GitHub',
      label: 'GitHub'
    }
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Information */}
            <div>
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                FentroCMS
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A modern content management system with email-based authentication 
                and a beautiful, responsive user interface designed for optimal 
                user experience and productivity.
              </p>
            </div>
            
            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Contact Information
              </h3>
              <ul className="space-y-3">
                {contactInfo.map((contact) => (
                  <li key={contact.type} className="flex items-center text-gray-600 dark:text-gray-400">
                    {contact.icon}
                    <a 
                      href={contact.href}
                      onClick={() => handleContactClick(contact.type)}
                      className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors duration-200"
                      target={contact.type === 'website' ? '_blank' : undefined}
                      rel={contact.type === 'website' ? 'noopener noreferrer' : undefined}
                      aria-label={`${contact.label}: ${contact.value}`}
                    >
                      {contact.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Copyright and Social Links */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {currentYear} FentroCMS. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.platform}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(social.platform)}
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/**
 * @copyright Tech4biz Solutions Private
 */ 