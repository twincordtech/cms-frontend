// ===============================
// File: Testimonials.jsx
// Description: Testimonials section for displaying client feedback with names, messages, and images.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaQuoteLeft } from 'react-icons/fa';

/**
 * Testimonials component displays a grid of client testimonials with messages, names, images, and designations.
 * Used for social proof and client feedback sections.
 */
const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 relative">
              {/* Decorative quote icon */}
              <div className="absolute -top-4 -left-4 text-blue-500 opacity-20">
                <FaQuoteLeft className="w-8 h-8" />
              </div>
              <div className="mb-4">
                <p className="text-gray-600 italic">"{testimonial.message}"</p>
              </div>
              <div className="flex items-center">
                {/* Optional testimonial image */}
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  {/* Optional designation */}
                  {testimonial.designation && (
                    <p className="text-sm text-gray-500">{testimonial.designation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Testimonials.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      image: PropTypes.string,
      designation: PropTypes.string
    })
  ).isRequired
};

export default Testimonials;
// ===============================
// End of File: Testimonials.jsx
// Description: Testimonials section
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 