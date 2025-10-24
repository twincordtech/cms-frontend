// ===============================
// File: CardGrid.jsx
// Description: Card grid component for displaying a set of cards with image, title, description, and link.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';

/**
 * CardGrid component displays a grid of cards, each with an image, title, description, and optional link.
 * Used for features, services, or team member showcases.
 */
const CardGrid = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Optional card image */}
              {card.image && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                {/* Optional card link */}
                {card.link && (
                  <a
                    href={card.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {card.linkText || 'Learn more'}
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

CardGrid.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string,
      link: PropTypes.string,
      linkText: PropTypes.string
    })
  ).isRequired
};

export default CardGrid;
// ===============================
// End of File: CardGrid.jsx
// Description: Card grid component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 