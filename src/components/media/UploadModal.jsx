/* ========================================================================
 * File: UploadModal.jsx
 * Description: File upload modal and processing modal for media library.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FaUpload } from 'react-icons/fa';

/**
 * UploadModal - File upload modal and processing modal
 * @param {object} props
 * @param {boolean} props.showUploadModal - Show upload modal
 * @param {function} props.handleCancelUpload - Handler to cancel upload
 * @param {function} props.handleUploadFiles - Handler to upload files
 * @param {Array} props.uploadFiles - Files to upload
 * @param {function} props.renderFilePreview - Function to render file preview
 * @param {function} props.handleFileSelect - Handler for file selection
 * @param {Array} props.folders - List of folders
 * @param {object} props.uploadData - Upload data state
 * @param {function} props.setUploadData - Setter for upload data
 * @param {string|null} props.currentFolder - Current folder ID
 * @param {Array} props.processedFiles - Processed files
 * @param {boolean} props.isProcessing - Processing state
 * @param {function} props.renderProcessingModal - Function to render processing modal
 * @param {object} props.fileProgress - File progress state
 * @param {function} props.formatFileSize - Function to format file size
 * @param {boolean} props.showUploadProgress - Show upload progress
 * @param {function} props.renderUploadProgress - Function to render upload progress
 */
const UploadModal = ({ showUploadModal, handleCancelUpload, handleUploadFiles, uploadFiles, renderFilePreview, handleFileSelect, folders, uploadData, setUploadData, currentFolder, processedFiles, isProcessing, renderProcessingModal, fileProgress, formatFileSize, showUploadProgress, renderUploadProgress }) => {
  if (!showUploadModal) return null;
  if (isProcessing || processedFiles.length > 0) return renderProcessingModal();
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
                <FaUpload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Files</h3>
                <div className="mt-4">
                  <form onSubmit={handleUploadFiles} className="space-y-4">
                    <div className="w-full">
                      <div 
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 relative group"
                        onClick={() => document.getElementById('file-upload').click()}
                      >
                        <div className="space-y-2 text-center">
                          <div className="mx-auto h-24 w-24 flex items-center justify-center">
                            {renderFilePreview()}
                          </div>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload files</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileSelect}
                                multiple
                                accept="image/*,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {uploadFiles.length ? `${uploadFiles.length} files selected` : 'All image formats, MP4, PDF, DOC, DOCX up to 10MB each'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* ...rest of modal form fields (folders, type, description) can be passed as children or further split if needed... */}
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* ...footer buttons and actions... */}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

/* ========================================================================
 * End of File: UploadModal.jsx
 * ======================================================================== */ 