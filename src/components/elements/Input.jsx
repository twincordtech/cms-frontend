// ===============================
// File: Input.jsx
// Description: Reusable input field component with label, validation, and error handling.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

/**
 * Input component provides a consistent, accessible text input field with label and error handling.
 * Supports various input types, required validation, disabled state, and custom styling.
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  disabled = false,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {/* Input label with required indicator */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-gray-900 placeholder-gray-400 text-sm transition
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

export default Input;
// ===============================
// End of File: Input.jsx
// Description: Input field component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 