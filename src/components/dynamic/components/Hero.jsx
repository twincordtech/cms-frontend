// ===============================
// File: Hero.jsx
// Description: Hero section component for displaying a large heading, subheading, background image, and call-to-action buttons.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Hero component displays a prominent section with a heading, subheading, background image, and CTA buttons.
 * Used for landing pages and key marketing sections.
 */
const Hero = ({ heading, subheading, backgroundImage, ctaButtons }) => {
  // Prepare background style if image is provided
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <div className="relative bg-gray-900 h-[600px]" style={backgroundStyle}>
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {/* Optional subheading */}
          {subheading && (
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              {subheading}
            </p>
          )}
          {/* CTA buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="mt-10 flex justify-center gap-4">
              {ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.link}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm
                    ${index === 0 
                      ? 'text-white bg-indigo-600 hover:bg-indigo-700' 
                      : 'text-indigo-600 bg-white hover:bg-gray-50'
                    }`}
                >
                  {button.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  backgroundImage: PropTypes.string,
  ctaButtons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired
    })
  )
};

export default Hero;
// ===============================
// End of File: Hero.jsx
// Description: Hero section component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 