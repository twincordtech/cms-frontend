/* ========================================================================
 * File: EditFileModal.jsx
 * Description: File editing modal for media library.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FaEdit, FaTimes, FaUpload } from 'react-icons/fa';

/**
 * EditFileModal - File editing modal
 * @param {object} props
 * @param {boolean} props.showEditModal - Show edit modal
 * @param {object} props.editFile - File being edited
 * @param {function} props.setEditFile - Setter for edit file
 * @param {object} props.editFileUpload - File upload for editing
 * @param {function} props.setEditFileUpload - Setter for edit file upload
 * @param {function} props.handleEditFile - Handler for editing file
 * @param {Array} props.folders - List of folders
 * @param {function} props.getFileTypeIcon - Function to get file type icon
 * @param {function} props.getMediaUrl - Function to get media URL
 * @param {function} props.setShowEditModal - Setter for showing edit modal
 */
const EditFileModal = ({ 
  showEditModal, 
  editFile, 
  setEditFile, 
  editFileUpload, 
  setEditFileUpload, 
  handleEditFile, 
  folders, 
  getFileTypeIcon, 
  getMediaUrl, 
  setShowEditModal 
}) => {
  if (!showEditModal || !editFile) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFileUpload(file);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
    setEditFile(null);
    setEditFileUpload(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaEdit className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit File</h3>
                <div className="mt-4">
                  <form onSubmit={handleEditFile} className="space-y-4">
                    {/* File Preview */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {editFileUpload ? (
                          <img
                            src={URL.createObjectURL(editFileUpload)}
                            alt="Preview"
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        ) : editFile.type === 'image' && editFile.url ? (
                          <img
                            src={getMediaUrl(editFile.url)}
                            alt={editFile.name}
                            className="h-16 w-16 object-cover rounded-lg"
                            onError={(e) => {
                              console.error('Image failed to load:', editFile.url, 'Generated URL:', getMediaUrl(editFile.url));
                              console.error('File data:', editFile);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', editFile.url, 'Generated URL:', getMediaUrl(editFile.url));
                            }}
                          />
                        ) : null}
                        {(!editFileUpload && (editFile.type !== 'image' || !editFile.url)) && (
                          <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-lg">
                            {getFileTypeIcon(editFile)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {editFileUpload ? editFileUpload.name : editFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {editFile.type} • {editFile.size ? `${(editFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                        </p>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Replace File (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FaUpload className="mr-2" />
                          Choose File
                          <input
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          />
                        </label>
                        {editFileUpload && (
                          <button
                            type="button"
                            onClick={() => setEditFileUpload(null)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* File Name */}
                    <div>
                      <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
                        File Name
                      </label>
                      <input
                        type="text"
                        id="fileName"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editFile.name || ''}
                        onChange={(e) => setEditFile({ ...editFile, name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Folder Selection */}
                    <div>
                      <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
                        Folder
                      </label>
                      <select
                        id="folder"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={typeof editFile.folder === 'object' ? editFile.folder._id : (editFile.folder || '')}
                        onChange={(e) => setEditFile({ ...editFile, folder: e.target.value })}
                        required
                      >
                        <option value="">Select a folder</option>
                        {folders.map((folder) => (
                          <option key={folder._id} value={folder._id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* File Type */}
                    <div>
                      <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">
                        File Type
                      </label>
                      <select
                        id="fileType"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editFile.type || 'image'}
                        onChange={(e) => setEditFile({ ...editFile, type: e.target.value })}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editFile.description || ''}
                        onChange={(e) => setEditFile({ ...editFile, description: e.target.value })}
                        placeholder="Enter file description (optional)"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleEditFile}
            >
              Update File
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFileModal;

/* ========================================================================
 * End of File: EditFileModal.jsx
 * ======================================================================== */ 