// ===============================
// File: Select.jsx
// Description: Reusable select dropdown component with label, options, and error handling.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

/**
 * Select component provides a consistent, accessible dropdown select field with label and error handling.
 * Supports required validation, disabled state, custom placeholder, and option mapping.
 */
const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  className = '',
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Select label with required indicator */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {/* Render select options */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
// ===============================
// End of File: Select.jsx
// Description: Select dropdown component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 