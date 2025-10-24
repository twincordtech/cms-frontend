// ===============================
// File: Textarea.jsx
// Description: Reusable textarea component with label, validation, and error handling.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

/**
 * Textarea component provides a consistent, accessible multi-line text input with label and error handling.
 * Supports required validation, disabled state, custom rows, and placeholder text.
 */
const Textarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  className = '',
  disabled = false,
  placeholder = '',
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Textarea label with required indicator */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          ${error ? 'border-red-300' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      {/* Error message display */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
// ===============================
// End of File: Textarea.jsx
// Description: Textarea component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 