// ===============================
// File: Banner.jsx
// Description: Banner component for hero/header sections with background image, title, subtitle, and CTA.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Banner component displays a large hero section with background image, title, subtitle, and call-to-action button.
 * Used for landing pages and key marketing sections.
 */
const Banner = ({ title, subtitle, backgroundImage, ctaText, ctaLink }) => {
  return (
    <div 
      className="relative h-[500px] flex items-center justify-center text-white"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to right, #4F46E5, #7C3AED)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
};

Banner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string
};

Banner.defaultProps = {
  title: 'Welcome to Our Website',
  subtitle: 'We provide the best services',
  ctaText: 'Learn More',
  ctaLink: '/about'
};

export default Banner;
// ===============================
// End of File: Banner.jsx
// Description: Banner component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 