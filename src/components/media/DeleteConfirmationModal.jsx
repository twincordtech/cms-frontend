/* ========================================================================
 * File: DeleteConfirmationModal.jsx
 * Description: Delete confirmation modal for media library.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FaTrash, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * DeleteConfirmationModal - Delete confirmation modal
 * @param {object} props
 * @param {boolean} props.showDeleteConfirmation - Show delete confirmation modal
 * @param {object} props.itemToDelete - Item to delete
 * @param {string} props.deleteType - Type of item ('folder' or 'file')
 * @param {function} props.handleDelete - Handler for delete
 * @param {function} props.setShowDeleteConfirmation - Setter for showing delete confirmation
 * @param {function} props.setItemToDelete - Setter for item to delete
 * @param {function} props.setDeleteType - Setter for delete type
 * @param {function} props.getMediaUrl - Function to get media URL
 * @param {function} props.formatFileSize - Function to format file size
 * @param {function} props.formatDate - Function to format date
 */
const DeleteConfirmationModal = ({ 
  showDeleteConfirmation, 
  itemToDelete, 
  deleteType, 
  handleDelete, 
  setShowDeleteConfirmation, 
  setItemToDelete, 
  setDeleteType, 
  getMediaUrl, 
  formatFileSize, 
  formatDate 
}) => {
  if (!showDeleteConfirmation || !itemToDelete) return null;

  const handleClose = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
    setDeleteType(null);
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleClose();
  };

  const isFolder = deleteType === 'folder';
  const isFile = deleteType === 'file';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete {isFolder ? 'Folder' : 'File'}
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this {isFolder ? 'folder' : 'file'}? This action cannot be undone.
                  </p>
                  
                  {/* Item Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    {isFolder && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {itemToDelete.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {itemToDelete.description || 'No description'}
                          </p>
                          {itemToDelete.createdAt && (
                            <p className="text-xs text-gray-400">
                              Created {formatDate(itemToDelete.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {isFile && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {itemToDelete.type === 'image' ? (
                            <img
                              src={getMediaUrl(itemToDelete.path)}
                              alt={itemToDelete.name}
                              className="h-12 w-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center" style={{ display: itemToDelete.type === 'image' ? 'none' : 'flex' }}>
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {itemToDelete.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {itemToDelete.type} • {itemToDelete.size ? formatFileSize(itemToDelete.size) : 'Unknown size'}
                          </p>
                          {itemToDelete.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {itemToDelete.description}
                            </p>
                          )}
                          {itemToDelete.createdAt && (
                            <p className="text-xs text-gray-400">
                              Uploaded {formatDate(itemToDelete.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Warning Message */}
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          {isFolder 
                            ? 'This will permanently delete the folder and all its contents.'
                            : 'This will permanently delete the file from your media library.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleConfirmDelete}
            >
              <FaTrash className="mr-2" />
              Delete {isFolder ? 'Folder' : 'File'}
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

export default DeleteConfirmationModal;

/* ========================================================================
 * End of File: DeleteConfirmationModal.jsx
 * ======================================================================== */ 