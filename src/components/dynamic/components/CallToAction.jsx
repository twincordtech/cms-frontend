// ===============================
// File: CallToAction.jsx
// Description: Call-to-action section with title and button for user engagement.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';

/**
 * CallToAction component displays a prominent section with a title and a button.
 * Used to drive user engagement and conversions.
 */
const CallToAction = ({ title, buttonText, buttonLink }) => {
  if (!title || !buttonText || !buttonLink) return null;

  return (
    <div className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h2>
          <div className="mt-8">
            <a
              href={buttonLink}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              {buttonText}
              <FaArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

CallToAction.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired
};

export default CallToAction;
// ===============================
// End of File: CallToAction.jsx
// Description: Call-to-action section
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 