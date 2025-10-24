// ===============================
// File: ComponentEditor.jsx
// Description: Editor modal for editing dynamic component fields, including images and arrays.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaSelector from '../MediaSelector';

/**
 * ComponentEditor provides a modal UI for editing the fields of a dynamic component.
 * Supports string, text, richText, image, and array field types.
 */
const ComponentEditor = ({ component, onSave, onCancel }) => {
  const [formData, setFormData] = useState(component.fields);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  // Handle input changes for simple fields
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle changes for array fields
  const handleArrayItemChange = (fieldName, index, itemField, value) => {
    setFormData(prev => {
      const items = [...prev[fieldName]];
      items[index] = {
        ...items[index],
        [itemField]: value
      };
      return {
        ...prev,
        [fieldName]: items
      };
    });
  };

  // Add a new item to an array field
  const addArrayItem = (fieldName, structure) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [
        ...(prev[fieldName] || []),
        structure.reduce((acc, field) => ({
          ...acc,
          [field.name]: ''
        }), {})
      ]
    }));
  };

  // Remove an item from an array field
  const removeArrayItem = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  // Handle media selection for image fields
  const handleMediaSelect = (media) => {
    if (currentField) {
      handleInputChange(currentField, media.url);
    }
    setShowMediaSelector(false);
    setCurrentField(null);
  };

  // Render a field based on its type
  const renderField = (field) => {
    switch (field.type) {
      case 'string':
        return (
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${field.name}`}
          />
        );
      case 'text':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${field.name}`}
          />
        );
      case 'richText':
        return (
          <ReactQuill
            value={formData[field.name] || ''}
            onChange={(content) => handleInputChange(field.name, content)}
            className="bg-white"
          />
        );
      case 'image':
        return (
          <div>
            {formData[field.name] ? (
              <div className="relative w-48 h-48 mb-2">
                <img
                  src={formData[field.name]}
                  alt={field.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleInputChange(field.name, '')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setCurrentField(field.name);
                setShowMediaSelector(true);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {formData[field.name] ? 'Change Image' : 'Select Image'}
            </button>
          </div>
        );
      case 'array':
        return (
          <div className="space-y-4">
            {(formData[field.name] || []).map((item, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                <button
                  onClick={() => removeArrayItem(field.name, index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
                {field.itemStructure.map((itemField) => (
                  <div key={itemField.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {itemField.name}
                    </label>
                    {renderField({
                      ...itemField,
                      name: `${field.name}.${index}.${itemField.name}`,
                      value: item[itemField.name]
                    })}
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(field.name, field.itemStructure)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-600"
            >
              Add Item
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Edit {component.componentType}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            {component.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.name}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Media selector modal for image fields */}
      {showMediaSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MediaSelector
              onSelect={handleMediaSelect}
              onClose={() => {
                setShowMediaSelector(false);
                setCurrentField(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

ComponentEditor.propTypes = {
  component: PropTypes.shape({
    componentType: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        default: PropTypes.any
      })
    ).isRequired
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ComponentEditor;
// ===============================
// End of File: ComponentEditor.jsx
// Description: Editor modal for dynamic components
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 