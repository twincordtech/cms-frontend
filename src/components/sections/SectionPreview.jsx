/**
 * SectionPreview.jsx
 *
 * Preview component for section layouts. Renders a visual preview of the section with columns and content.
 * Handles accessibility, placeholder images, and clear user feedback.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';
import Card from '../elements/Card';

/**
 * SectionPreview Component
 *
 * Renders a preview of the section layout with columns, images, and content.
 * Handles placeholder images and accessibility for preview mode.
 *
 * @component
 * @param {Object} props
 * @param {string} props.type - Layout type (two-column, three-column, four-column)
 * @param {Object} props.data - Section data (title, description, columns)
 * @returns {JSX.Element} Section preview UI
 */
const SectionPreview = ({ type, data }) => {
  /**
   * Returns the column width class based on layout type
   * @returns {string}
   */
  const getColumnClass = () => {
    switch(type) {
      case 'two-column':
        return 'w-1/2';
      case 'three-column':
        return 'w-1/3';
      case 'four-column':
        return 'w-1/4';
      default:
        return 'w-full';
    }
  };

  /**
   * Returns a placeholder image URL if none provided
   * @param {string} imageURL
   * @returns {string}
   */
  const getImageUrl = (imageURL) => {
    if (imageURL && imageURL.trim() !== '') return imageURL;
    return `https://via.placeholder.com/600x400/eeeeee/333333?text=Column+Image`;
  };

  return (
    <Card className="p-6" aria-label="Section preview">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold mb-2">{data.title || 'Section Title'}</h3>
        {data.description && (
          <p className="text-gray-600">{data.description}</p>
        )}
      </div>
      <div className="flex flex-wrap -mx-2">
        {data.columns?.map((column, index) => (
          <div key={index} className={`px-2 mb-4 ${getColumnClass()}`}>
            <div className="border rounded p-4 h-full flex flex-col">
              {column.imageURL && (
                <div className="mb-4">
                  <img 
                    src={getImageUrl(column.imageURL)} 
                    alt={column.title || `Column ${index + 1}`} 
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
              <h4 className="text-lg font-semibold mb-2">
                {column.title || `Column ${index + 1} Title`}
              </h4>
              <p className="text-gray-600 mb-4 flex-grow">
                {column.content || 'Column content goes here'}
              </p>
              {column.buttonText && (
                <div className="mt-auto">
                  <a 
                    href={column.buttonURL || '#'} 
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {column.buttonText}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t text-center text-gray-500 text-sm">
        <p>Preview Mode - This is how your {type} layout will appear on the page</p>
      </div>
    </Card>
  );
};

export default SectionPreview;

/**
 * @copyright Tech4biz Solutions Private
 */ 