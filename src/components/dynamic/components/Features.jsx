// ===============================
// File: Features.jsx
// Description: Features section component for displaying a list of features with icons, titles, and descriptions.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Features component displays a heading, optional subheading, and a grid of feature items.
 * Each feature can have an icon, title, and description.
 */
const Features = ({ heading, subheading, features }) => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          {/* Section heading */}
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {heading}
          </h2>
          {/* Optional subheading */}
          {subheading && (
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                {/* Optional feature icon */}
                {feature.icon && (
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                    <img src={feature.icon} alt="" className="h-6 w-6" />
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Features.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Features;
// ===============================
// End of File: Features.jsx
// Description: Features section component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
