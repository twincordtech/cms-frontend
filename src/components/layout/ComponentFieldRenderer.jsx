/* ========================================================================
 * File: ComponentFieldRenderer.jsx
 * Description: Renders a field input based on its type and definition for layout editing.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import PropTypes from 'prop-types';
import FieldIcon from './FieldIcon';
import ReactQuill from 'react-quill';

/**
 * ComponentFieldRenderer Component
 * Renders a field input based on its type and definition for layout editing.
 * @param {object} props
 * @param {object} props.field - Field definition
 * @param {any} props.value - Current value
 * @param {function} props.onChange - Change handler
 * @param {object} props.helpers - Helper functions (getUserFriendlyLabel, etc.)
 * @param {string} [props.commonClasses] - Common input classes
 */
const ComponentFieldRenderer = ({ field, value, onChange, helpers, commonClasses }) => {
  const { getUserFriendlyLabel } = helpers;
  const fieldType = field.fieldType || field.type;
  const friendlyLabel = getUserFriendlyLabel(field.name);

  // Example usage: <FieldIcon type={fieldType} />

  switch (fieldType) {
    case 'text':
    case 'string':
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={commonClasses}
            placeholder={`Enter ${field.label || friendlyLabel}`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
    case 'textarea':
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={`${commonClasses} min-h-[100px]`}
            rows={4}
            placeholder={`Write your ${field.label || friendlyLabel.toLowerCase()} here...`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
    case 'richText':
      return (
        <div className="rich-text-editor flex items-center">
          <FieldIcon type={fieldType} />
          <ReactQuill
            value={value || ''}
            onChange={onChange}
            placeholder={`Start writing your ${field.label || friendlyLabel.toLowerCase()}...`}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
      );
    case 'number':
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <input
            type="number"
            value={value || 0}
            onChange={e => onChange(Number(e.target.value))}
            className={commonClasses}
            placeholder={`Enter ${field.label || friendlyLabel.toLowerCase()}`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
    case 'boolean':
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <input
            type="checkbox"
            checked={value === true}
            onChange={e => onChange(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            autoFocus={!!field.autoFocus}
          />
          <span className="ml-2 text-sm text-gray-600">
            {field.label || field.name}
          </span>
        </div>
      );
    case 'date':
      return (
        <div className="relative flex items-center">
          <FieldIcon type={fieldType} />
          <input
            type="date"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={commonClasses}
            placeholder={`Select ${field.label || friendlyLabel.toLowerCase()}`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
    case 'select':
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={commonClasses}
          >
            <option value="">Choose {field.label || friendlyLabel.toLowerCase()}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <FieldIcon type={fieldType} />
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className={commonClasses}
            placeholder={`Enter ${field.label || friendlyLabel}`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
  }
};

ComponentFieldRenderer.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  helpers: PropTypes.object.isRequired,
  commonClasses: PropTypes.string
};

export default ComponentFieldRenderer;

/* ========================================================================
 * End of File: ComponentFieldRenderer.jsx
 * ======================================================================== */ 