/* ========================================================================
 * File: CreateSection.jsx
 * Description: React component for creating a new CMS section with dynamic fields (text, list, media).
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState } from 'react';
import { FaPlus, FaList, FaImage, FaTimes } from 'react-icons/fa';
import MediaSelector from '../../components/MediaSelector';
import { toast } from 'react-toastify';

/**
 * CreateSection Component
 * Renders a form to create a new section with dynamic fields (text, list, media).
 * Handles field addition, removal, media selection, and form submission.
 * @component
 */
const CreateSection = () => {
  /**
   * State for section data (title, description, fields)
   */
  const [sectionData, setSectionData] = useState({
    title: '',
    description: '',
    fields: []
  });

  /**
   * State for media selector modal visibility
   */
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  /**
   * State for tracking which field is being edited for media
   */
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);

  /**
   * Adds a new field of the specified type to the section
   * @param {string} type - The type of field to add ('field', 'list', 'media')
   */
  const handleAddField = (type) => {
    const newField = {
      type,
      title: '',
      content: type === 'media' ? null : ''
    };
    setSectionData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  /**
   * Handles changes to a field's value
   * @param {number} index - Index of the field
   * @param {string} key - Field property to update
   * @param {any} value - New value
   */
  const handleFieldChange = (index, key, value) => {
    setSectionData(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, [key]: value } : field
      )
    }));
  };

  /**
   * Handles media selection for a field
   * @param {object} file - Selected media file object
   */
  const handleMediaSelect = (file) => {
    if (editingFieldIndex !== null) {
      handleFieldChange(editingFieldIndex, 'content', {
        url: `/uploads/media/${file.filename}`,
        filename: file.filename,
        originalname: file.originalname
      });
    }
    setShowMediaSelector(false);
    setEditingFieldIndex(null);
  };

  /**
   * Removes a field from the section
   * @param {number} index - Index of the field to remove
   */
  const handleRemoveField = (index) => {
    setSectionData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  /**
   * Handles form submission to create a new section
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: Ensure section has a title and at least one field
    if (!sectionData.title.trim()) {
      toast.error('Section title is required.');
      return;
    }
    if (sectionData.fields.length === 0) {
      toast.error('At least one field is required.');
      return;
    }
    try {
      const response = await fetch('/api/cms/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
      });
      if (!response.ok) {
        throw new Error('Failed to create section');
      }
      // Reset form on success
      setSectionData({
        title: '',
        description: '',
        fields: []
      });
      toast.success('Section created successfully');
    } catch (error) {
      toast.error(error.message || 'An error occurred while creating the section.');
    }
  };

  return (
    <div className="p-6" aria-label="Create Section Page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900" tabIndex={0} aria-label="Create New Section Heading">Create New Section</h1>
        <div className="flex items-center space-x-3">
          {/* Add Field Button */}
          <button
            type="button"
            onClick={() => handleAddField('field')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Add Field"
          >
            <FaPlus className="mr-2" aria-hidden="true" /> Add Field
          </button>
          {/* Add List Button */}
          <button
            type="button"
            onClick={() => handleAddField('list')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Add List"
          >
            <FaList className="mr-2" aria-hidden="true" /> Add List
          </button>
          {/* Add Media Button */}
          <button
            type="button"
            onClick={() => handleAddField('media')}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            aria-label="Add Media"
          >
            <FaImage className="mr-2" aria-hidden="true" /> Add Media
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} aria-label="Create Section Form" autoComplete="off">
          <div className="space-y-6">
            {/* Section Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Section Title <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={sectionData.title}
                onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                aria-required="true"
                aria-label="Section Title"
                maxLength={100}
              />
            </div>
            {/* Section Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Section Description
              </label>
              <textarea
                id="description"
                value={sectionData.description}
                onChange={(e) => setSectionData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                aria-label="Section Description"
                maxLength={500}
              />
            </div>
            {/* Dynamic Fields List */}
            <div className="space-y-4">
              {sectionData.fields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 relative bg-gray-50" aria-label={`Field ${index + 1}`}> 
                  {/* Remove Field Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    aria-label={`Remove Field ${index + 1}`}
                  >
                    <FaTimes className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <div className="space-y-4">
                    {/* Field Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.title}
                        onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        aria-required="true"
                        aria-label={`Field ${index + 1} Title`}
                        maxLength={100}
                      />
                    </div>
                    {/* Field Content or Media */}
                    {field.type === 'media' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Media <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        {field.content ? (
                          <div className="mt-2 relative">
                            <img
                              src={field.content.url}
                              alt={field.content.originalname}
                              className="w-32 h-32 object-cover rounded-lg"
                              tabIndex={0}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFieldIndex(index);
                                setShowMediaSelector(true);
                              }}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                              aria-label={`Change Media for Field ${index + 1}`}
                            >
                              Change Media
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFieldIndex(index);
                              setShowMediaSelector(true);
                            }}
                            className="mt-1 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400"
                            aria-label={`Select Media for Field ${index + 1}`}
                          >
                            <div className="space-y-1 text-center">
                              <FaImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                              <div className="text-sm text-gray-600">
                                Click to select media
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Content <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          value={field.content}
                          onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                          aria-required="true"
                          aria-label={`Field ${index + 1} Content`}
                          maxLength={500}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Submit Button */}
            <div className="flex justify-end pt-5">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Create Section"
              >
                Create Section
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => {
          setShowMediaSelector(false);
          setEditingFieldIndex(null);
        }}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default CreateSection;

/* ========================================================================
 * End of File: CreateSection.jsx
 * ======================================================================== */ 