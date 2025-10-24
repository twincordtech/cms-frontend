/**
 * SectionRenderer.jsx
 *
 * Renders a section based on its layout type and data. Supports two, three, and four column layouts.
 * Handles accessibility, error handling, and clear user feedback for unsupported layouts.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';

/**
 * Column Component
 *
 * Renders a single column in a section layout.
 * @component
 * @param {Object} props
 * @param {Object} props.data - Column data (title, content, imageURL, buttonText, buttonURL)
 * @returns {JSX.Element}
 */
const Column = ({ data }) => {
  const { title, content, imageURL, buttonText, buttonURL } = data;
  return (
    <div className="flex flex-col h-full">
      {imageURL && (
        <div className="mb-4">
          <img 
            src={imageURL} 
            alt={title || 'Column image'} 
            className="w-full h-48 object-cover rounded-lg" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        </div>
      )}
      {title && <h3 className="text-xl font-bold mb-3">{title}</h3>}
      {content && <div className="text-gray-700 mb-4">{content}</div>}
      {buttonText && <div className="flex-grow"></div>}
      {buttonText && (
        <div className="mt-auto pt-4">
          <a 
            href={buttonURL || "#"} 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            target={buttonURL && buttonURL.startsWith('http') ? "_blank" : "_self"}
            rel={buttonURL && buttonURL.startsWith('http') ? "noopener noreferrer" : ""}
            aria-label={buttonText}
          >
            {buttonText}
          </a>
        </div>
      )}
    </div>
  );
};

/**
 * SectionRenderer Component
 *
 * Renders a section based on its type and data. Supports two, three, and four column layouts.
 * Handles accessibility and error feedback for unsupported layouts.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.section - Section data (type, data)
 * @returns {JSX.Element}
 */
const SectionRenderer = ({ section }) => {
  if (!section || !section.type) return null;
  const { type, data } = section;
  // Two Column Layout
  if (type === 'two-column') {
    return (
      <section className="py-12 px-4" aria-label="Two column section">
        <div className="container mx-auto">
          {data.title && <h2 className="text-3xl font-bold mb-6 text-center">{data.title}</h2>}
          {data.description && <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">{data.description}</p>}
          <div className="grid md:grid-cols-2 gap-8">
            {data.columns && data.columns.map((column, index) => (
              <Column key={index} data={column} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  // Three Column Layout
  if (type === 'three-column') {
    return (
      <section className="py-12 px-4" aria-label="Three column section">
        <div className="container mx-auto">
          {data.title && <h2 className="text-3xl font-bold mb-6 text-center">{data.title}</h2>}
          {data.description && <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">{data.description}</p>}
          <div className="grid md:grid-cols-3 gap-6">
            {data.columns && data.columns.map((column, index) => (
              <Column key={index} data={column} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  // Four Column Layout
  if (type === 'four-column') {
    return (
      <section className="py-12 px-4" aria-label="Four column section">
        <div className="container mx-auto">
          {data.title && <h2 className="text-3xl font-bold mb-6 text-center">{data.title}</h2>}
          {data.description && <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">{data.description}</p>}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.columns && data.columns.map((column, index) => (
              <Column key={index} data={column} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  // Default case - unsupported layout
  return (
    <div className="py-12 px-4 bg-gray-100" role="alert" aria-live="polite">
      <div className="container mx-auto text-center">
        <p className="text-gray-500">Section type "{type}" not supported</p>
      </div>
    </div>
  );
};

export default SectionRenderer;

/**
 * @copyright Tech4biz Solutions Private
 */ 