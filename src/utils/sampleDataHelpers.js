/* ========================================================================
 * File: sampleDataHelpers.js
 * Description: Helper functions for generating sample data for dynamic components.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

/**
 * Generates a placeholder image URL for use in sample data.
 * @param {number} width
 * @param {number} height
 * @param {string} text
 * @returns {string}
 */
export function getPlaceholderImage(width = 800, height = 400, text) {
  return `https://placehold.co/${width}x${height}/007AFF/ffffff?text=${encodeURIComponent(text || 'Image')}`;
}

/**
 * Generates a string of lorem ipsum text for use in sample data.
 * @param {number} words
 * @returns {string}
 */
export function getLoremIpsum(words = 20) {
  const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  return loremText.split(' ').slice(0, words).join(' ');
}

/**
 * Generates a sample value for a given field definition.
 * @param {object} field
 * @returns {any}
 */
export function generateSampleValue(field) {
  const { type, name, subFields, fields } = field;
  switch (type.toLowerCase()) {
    case 'string':
      if (name.toLowerCase().includes('image') || name.toLowerCase().includes('avatar')) {
        return getPlaceholderImage(600, 400, name);
      }
      if (name.toLowerCase().includes('title')) {
        return 'Sample ' + name.charAt(0).toUpperCase() + name.slice(1);
      }
      if (name.toLowerCase().includes('description') || name.toLowerCase().includes('content')) {
        return getLoremIpsum(30);
      }
      return 'Sample Text';
    case 'number':
      return Math.floor(Math.random() * 100);
    case 'boolean':
      return true;
    case 'array':
      if (subFields) {
        return [
          generateSampleDataFromFields(subFields),
          generateSampleDataFromFields(subFields)
        ];
      }
      return [];
    case 'object':
      if (fields) {
        return generateSampleDataFromFields(fields);
      }
      return {};
    default:
      return 'Sample Data';
  }
}

/**
 * Generates a sample data object from a list of field definitions.
 * @param {Array} fields
 * @returns {object}
 */
export function generateSampleDataFromFields(fields) {
  const sampleData = {};
  fields.forEach(field => {
    sampleData[field.name] = generateSampleValue(field);
  });
  return sampleData;
}

/* ========================================================================
 * End of File: sampleDataHelpers.js
 * ======================================================================== */ 