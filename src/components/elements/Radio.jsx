// ===============================
// File: Radio.jsx
// Description: Accessible radio button component with label, error handling, and validation support.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

/**
 * Radio component provides a styled, accessible radio button input with label and error handling.
 * Supports required field validation, disabled state, and custom styling.
 */
const Radio = ({
  label,
  name,
  value,
  checked,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="radio"
          id={`${name}-${value}`}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 border-gray-300 text-blue-600
            focus:ring-blue-500
            ${error ? 'border-red-300' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3">
        {/* Radio button label with required indicator */}
        {label && (
          <label htmlFor={`${name}-${value}`} className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {/* Error message display */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Radio;
// ===============================
// End of File: Radio.jsx
// Description: Radio button component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 