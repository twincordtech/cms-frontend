// ===============================
// File: Accordion.jsx
// Description: Accordion component for expandable/collapsible content sections.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * AccordionItem represents a single item in the accordion.
 * Handles its own open/close state via parent.
 */
const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 px-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${title}`}
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <FaChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <FaChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4" id={`accordion-content-${title}`}>
          <p className="text-gray-600">{content}</p>
        </div>
      )}
    </div>
  );
};

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

/**
 * Accordion component renders a list of AccordionItems.
 * Manages open/close state for each item.
 */
const Accordion = ({ items }) => {
  const [openItems, setOpenItems] = useState({});

  // Toggle open/close state for a given item
  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white rounded-lg shadow-sm">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            isOpen={openItems[index] || false}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Accordion;
// ===============================
// End of File: Accordion.jsx
// Description: Accordion component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 