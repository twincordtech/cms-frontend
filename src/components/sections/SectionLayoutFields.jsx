/**
 * SectionLayoutFields.jsx
 *
 * Dynamic form fields for section layout configuration. Renders input fields for each column based on layout type.
 * Handles input changes, accessibility, and validation for section content.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';
import Card from '../elements/Card';

/**
 * SectionLayoutFields Component
 *
 * Renders dynamic input fields for each column in the selected layout type.
 * Handles input changes and accessibility for section configuration.
 *
 * @component
 * @param {Object} props
 * @param {string} props.layoutType - The selected layout type (two-column, three-column, four-column)
 * @param {Object} props.formData - The current form data for the section
 * @param {function} props.handleInputChange - Callback for input changes
 * @returns {JSX.Element} Section layout fields UI
 */
const SectionLayoutFields = ({ layoutType, formData, handleInputChange }) => {
  /**
   * Returns the number of columns for the selected layout type
   * @returns {number}
   */
  const getFieldCount = () => {
    switch (layoutType) {
      case 'two-column':
        return 2;
      case 'three-column':
        return 3;
      case 'four-column':
        return 4;
      default:
        return 0;
    }
  };

  /**
   * Renders input fields for each column
   * @returns {JSX.Element[]}
   */
  const renderFields = () => {
    const fields = [];
    const fieldCount = getFieldCount();

    for (let i = 1; i <= fieldCount; i++) {
      fields.push(
        <div key={i} className="mb-6">
          <h3 className="text-lg font-medium mb-2">Field {i}</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor={`field${i}Title`} className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id={`field${i}Title`}
                name={`field${i}Title`}
                value={formData[`field${i}Title`] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter title for field ${i}`}
                aria-label={`Title for field ${i}`}
                required
              />
            </div>
            <div>
              <label htmlFor={`field${i}Content`} className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id={`field${i}Content`}
                name={`field${i}Content`}
                value={formData[`field${i}Content`] || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter content for field ${i}`}
                aria-label={`Content for field ${i}`}
                required
              />
            </div>
          </div>
        </div>
      );
    }

    return fields;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Section Title and Description */}
        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Section Title *
              </label>
              <input
                type="text"
                id="sectionTitle"
                name="sectionTitle"
                value={formData.sectionTitle || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter section title"
                aria-label="Section title"
                required
              />
            </div>
            <div>
              <label htmlFor="sectionDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Section Description
              </label>
              <textarea
                id="sectionDescription"
                name="sectionDescription"
                value={formData.sectionDescription || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter section description"
                aria-label="Section description"
              />
            </div>
          </div>
        </div>

        {/* Layout Type Header */}
        <h2 className="text-xl font-semibold mb-4">
          {layoutType === 'two-column' ? 'Two Column Layout' :
           layoutType === 'three-column' ? 'Three Column Layout' :
           'Four Column Layout'} Fields
        </h2>

        {/* Column Fields */}
        <div className="space-y-6">
          {renderFields()}
        </div>
      </div>
    </Card>
  );
};

export default SectionLayoutFields;

/**
 * @copyright Tech4biz Solutions Private
 */ 