// ===============================
// File: MetaFields.jsx
// Description: Meta title and meta description fields for the CMS page form.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Meta title and meta description fields for the CMS page form
 * @param {Object} props
 * @param {string} metaTitle - Meta title value
 * @param {string} metaDescription - Meta description value
 * @param {function} onChange - Change handler for both fields
 */
const MetaFields = ({ metaTitle, metaDescription, onChange }) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaTitle">
        Meta Title
      </label>
      <input
        type="text"
        id="metaTitle"
        name="metaTitle"
        value={metaTitle}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        aria-label="Meta Title"
      />
      <p className="text-sm text-gray-500 mt-1">
        SEO title tag (defaults to page title if left blank)
      </p>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaDescription">
        Meta Description
      </label>
      <textarea
        id="metaDescription"
        name="metaDescription"
        value={metaDescription}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        rows="3"
        aria-label="Meta Description"
      />
      <p className="text-sm text-gray-500 mt-1">
        Brief description for search engines (recommended: 150-160 characters)
      </p>
    </div>
  </>
);

MetaFields.propTypes = {
  metaTitle: PropTypes.string.isRequired,
  metaDescription: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MetaFields;
// ===============================
// End of File: MetaFields.jsx
// Description: Meta title and meta description fields for the CMS page form.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 