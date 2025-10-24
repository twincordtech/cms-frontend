// ===============================
// File: Footer.jsx
// Description: Footer component for displaying navigation columns and social media links.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

// Mapping of social platform names to icon components
const socialIcons = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub
};

/**
 * Footer component displays navigation columns and social media links.
 * Used at the bottom of the site for navigation and branding.
 */
const Footer = ({ columns, social }) => {
  if (!columns || columns.length === 0) return null;

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Social media icons and copyright */}
        {social && social.length > 0 && (
          <div className="mt-8 border-t border-gray-700 pt-8">
            <div className="flex space-x-6 justify-center">
              {social.map((item, index) => {
                const Icon = socialIcons[item.platform.toLowerCase()];
                return Icon ? (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    <span className="sr-only">{item.platform}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                ) : null;
              })}
            </div>
            <p className="mt-8 text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

Footer.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      platform: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  )
};

export default Footer;
// ===============================
// End of File: Footer.jsx
// Description: Footer component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 