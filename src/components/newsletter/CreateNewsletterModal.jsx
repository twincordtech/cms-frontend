// ===============================
// File: CreateNewsletterModal.jsx
// Description: Modal for creating or editing a newsletter (subject, content, preview, etc.).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaCode, FaEye } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Modal for creating or editing a newsletter
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onSubmit - Form submit handler
 * @param {Object} props.editingNewsletter - Newsletter being edited (if any)
 * @param {Object} props.newNewsletter - Newsletter form state
 * @param {function} props.setNewNewsletter - Setter for newsletter form state
 * @param {string} props.editorMode - Editor mode ('visual' or 'html')
 * @param {function} props.setEditorMode - Setter for editor mode
 * @param {boolean} props.showPreview - Whether to show preview
 * @param {function} props.setShowPreview - Setter for preview state
 */
const CreateNewsletterModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingNewsletter,
  newNewsletter,
  setNewNewsletter,
  editorMode,
  setEditorMode,
  showPreview,
  setShowPreview
}) => {
  if (!isOpen) return null;
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close create/edit newsletter modal"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingNewsletter ? 'Edit Newsletter' : 'Create Newsletter'}
                </h3>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={newNewsletter.subject}
                    onChange={(e) => setNewNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditorMode(prev => prev === 'visual' ? 'html' : 'visual')}
                      className={`inline-flex items-center px-3 py-1 border rounded-md text-sm ${editorMode === 'html' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                      aria-label="Toggle HTML editor mode"
                    >
                      <FaCode className="mr-1" />
                      HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className={`inline-flex items-center px-3 py-1 border rounded-md text-sm ${showPreview ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                      aria-label="Toggle content preview"
                    >
                      <FaEye className="mr-1" />
                      Preview
                    </button>
                  </div>
                </div>
                <div className={`grid ${showPreview ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                  <div className="space-y-2">
                    {editorMode === 'visual' ? (
                      <ReactQuill
                        value={newNewsletter.content}
                        onChange={(content) => setNewNewsletter(prev => ({ ...prev, content }))}
                        modules={modules}
                        className="h-[500px] mb-12"
                      />
                    ) : (
                      <textarea
                        value={newNewsletter.content}
                        onChange={(e) => setNewNewsletter(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full h-[500px] font-mono text-sm p-2 border border-gray-300 rounded-md"
                        placeholder="Enter HTML content here..."
                      />
                    )}
                  </div>
                  {showPreview && (
                    <div className="border border-gray-200 rounded-md p-4 h-[500px] overflow-auto">
                      <div className="text-sm text-gray-500 mb-2">Preview:</div>
                      <div
                        className="preview-content"
                        dangerouslySetInnerHTML={{ __html: newNewsletter.content }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end py-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Cancel create/edit newsletter"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={editingNewsletter ? 'Update newsletter' : 'Create newsletter'}
                  >
                    {editingNewsletter ? 'Update Newsletter' : 'Create Newsletter'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateNewsletterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingNewsletter: PropTypes.object,
  newNewsletter: PropTypes.object.isRequired,
  setNewNewsletter: PropTypes.func.isRequired,
  editorMode: PropTypes.string.isRequired,
  setEditorMode: PropTypes.func.isRequired,
  showPreview: PropTypes.bool.isRequired,
  setShowPreview: PropTypes.func.isRequired
};

export default CreateNewsletterModal;
// ===============================
// End of File: CreateNewsletterModal.jsx
// Description: Modal for creating or editing a newsletter (subject, content, preview, etc.).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 