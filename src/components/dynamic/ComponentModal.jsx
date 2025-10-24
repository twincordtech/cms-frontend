// ===============================
// File: ComponentModal.jsx
// Description: Modal for configuring and editing component properties in a form-like UI.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

/**
 * ComponentModal displays a modal dialog for editing component properties.
 * Supports text, textarea, and file inputs for various field types.
 */
const ComponentModal = ({ isOpen, onClose, component, type, onSave }) => {
  if (!isOpen) return null;

  // Determine input type based on field name
  const getInputType = (field) => {
    if (field.includes('image') || field.includes('background')) return 'file';
    if (field.includes('content')) return 'textarea';
    return 'text';
  };

  // Handle form submission and collect data
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{type} Component</h2>
            <p className="text-sm text-gray-600 mt-1">Configure component properties</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {component.fields.map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {getInputType(field) === 'textarea' ? (
                  <textarea
                    name={field}
                    defaultValue={component[field] || ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[120px]"
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                ) : getInputType(field) === 'file' ? (
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      name={field}
                      className="hidden"
                      id={`file-${field}`}
                    />
                    <label
                      htmlFor={`file-${field}`}
                      className="px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-center text-sm text-gray-600 hover:text-blue-600"
                    >
                      Choose file
                    </label>
                    <span className="text-sm text-gray-500">
                      {component[field] ? component[field].split('/').pop() : 'No file chosen'}
                    </span>
                  </div>
                ) : (
                  <input
                    type={getInputType(field)}
                    name={field}
                    defaultValue={component[field] || ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="component-form"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

ComponentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  component: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ComponentModal;
// ===============================
// End of File: ComponentModal.jsx
// Description: Modal for component properties
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 