// ===============================
// File: About.jsx
// Description: About section component for displaying heading, content, and image.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * About component displays a heading, rich content (HTML), and an optional image.
 * Used for About Us or similar informational sections.
 */
const About = ({ heading, content, image }) => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            {/* Section heading */}
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {heading}
            </h2>
            {/* Section content (HTML injected) */}
            <div className="mt-6 text-gray-500 space-y-6" 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          </div>
          <div className="mt-8 lg:mt-0">
            {/* Optional image display */}
            {image && (
              <div className="aspect-w-5 aspect-h-3">
                <img
                  className="object-cover shadow-lg rounded-lg"
                  src={image}
                  alt={heading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

About.propTypes = {
  heading: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string
};

export default About;
// ===============================
// End of File: About.jsx
// Description: About section component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
