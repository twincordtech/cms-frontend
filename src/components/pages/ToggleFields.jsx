// ===============================
// File: ToggleFields.jsx
// Description: Toggle switches for isActive and isMultiPage in the CMS page form.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Toggle switches for isActive and isMultiPage in the CMS page form
 * @param {Object} props
 * @param {boolean} isActive - Whether the page is active
 * @param {boolean} isMultiPage - Whether the page is multi-page
 * @param {function} onChange - Change handler for both toggles
 */
const ToggleFields = ({ isActive, isMultiPage, onChange }) => (
  <>
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="isActive"
          checked={isActive}
          onChange={onChange}
          className="mr-2"
          aria-label="Active (Publicly Visible)"
        />
        <span className="text-sm font-bold">Active (Publicly Visible)</span>
      </label>
    </div>
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          name="isMultiPage"
          checked={isMultiPage}
          onChange={onChange}
          className="mr-2"
          aria-label="Dynamic Page (Multiple Instances)"
        />
        <span className="text-sm font-bold">Dynamic Page (Multiple Instances)</span>
      </label>
      <p className="text-sm text-gray-500 mt-1 ml-6">
        Enable this if the page will have multiple instances (e.g., blog posts, product pages)
      </p>
    </div>
  </>
);

ToggleFields.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isMultiPage: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ToggleFields;
// ===============================
// End of File: ToggleFields.jsx
// Description: Toggle switches for isActive and isMultiPage in the CMS page form.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 