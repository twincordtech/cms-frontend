/* ========================================================================
 * File: layoutHelpers.js
 * Description: Helper functions for layout component field labels.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

/**
 * Returns a user-friendly label for a field name.
 * @param {string} fieldName
 * @param {string} [parentFieldName]
 * @returns {string}
 */
export function getUserFriendlyLabel(fieldName, parentFieldName = '') {
  const cleanName = fieldName.replace(/^list\.|^\d+\.|\.\d+\./g, '');
  const parts = cleanName.split('.');
  const lastPart = parts[parts.length - 1];
  const spacedName = lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  const specialCases = {
    'one': 'First Item',
    'two': 'Second Item',
    'three': 'Third Item',
    'title': 'Title',
    'description': 'Description',
    'name': 'Name',
    'email': 'Email Address',
    'phone': 'Phone Number',
    'address': 'Address',
    'url': 'Website URL',
    'image': 'Image',
    'content': 'Content',
    'date': 'Date',
    'price': 'Price',
    'quantity': 'Quantity'
  };
  return specialCases[lastPart] || spacedName;
}

/* ========================================================================
 * End of File: layoutHelpers.js
 * ======================================================================== */ 