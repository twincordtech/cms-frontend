// ===============================
// File: formUtils.js
// Description: Utility functions for form name generation and related helpers.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================

/**
 * Generates a unique form name based on the title or a random string.
 * @param {string} title - The form title
 * @returns {string} Unique form name
 */
export function generateFormName(title) {
  if (!title) return 'form_' + Math.random().toString(36).slice(2, 8);
  // Clean and format the title for use as a form name
  const base = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return base + '_' + Math.floor(Math.random() * 90 + 10);
}

// ===============================
// End of File: formUtils.js
// Description: Form utility functions
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
