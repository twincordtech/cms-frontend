/* ========================================================================
 * File: FileGrid.jsx
 * Description: File card grid, file actions, and pagination for media library.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FaEye, FaEdit, FaTrash, FaFile } from 'react-icons/fa';
import { Pagination } from 'antd';

/**
 * FileGrid - File card grid, file actions, and pagination
 * @param {object} props
 * @param {Array} props.files - List of file objects (paginated)
 * @param {function} props.getMediaUrl - Function to get media URL
 * @param {function} props.getFileTypeIcon - Function to get file type icon
 * @param {function} props.getFileTypeLabel - Function to get file type label
 * @param {function} props.handleDeleteConfirmation - Handler for file delete
 * @param {function} props.setEditFile - Setter for editing file
 * @param {function} props.setShowEditModal - Setter for showing edit modal
 * @param {number} props.currentPage - Current page number
 * @param {function} props.setCurrentPage - Setter for current page
 * @param {number} props.CARDS_PER_PAGE - Number of cards per page
 * @param {boolean} props.loading - Loading state
 */
const FileGrid = ({ files, getMediaUrl, getFileTypeIcon, getFileTypeLabel, handleDeleteConfirmation, setEditFile, setShowEditModal, currentPage, setCurrentPage, CARDS_PER_PAGE, loading }) => (
  <>
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-blue-500"></div>
      </div>
    ) : files.length === 0 ? (
      <div className="text-center py-16">
        <FaFile className="text-6xl text-gray-200 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No files found</h3>
        <p className="text-gray-500 mb-6">Upload some files to get started</p>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {files.map((file) => (
            <div key={file._id} className="relative group bg-white rounded-xl shadow border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-60 flex items-center justify-center bg-gray-50">
                {file.type === 'image' ? (
                  <img 
                    src={getMediaUrl(file.url)} 
                    alt={file.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    {getFileTypeIcon(file)}
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    className="p-2 rounded-full bg-white/80 hover:bg-blue-600 hover:text-white text-gray-700 shadow"
                    onClick={() => window.open(getMediaUrl(file.url), '_blank')}
                    title="Preview"
                    aria-label={`Preview file ${file.name}`}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="p-2 rounded-full bg-white/80 hover:bg-blue-600 hover:text-white text-gray-700 shadow"
                    onClick={() => {
                      setEditFile(file);
                      setShowEditModal(true);
                    }}
                    title="Edit"
                    aria-label={`Edit file ${file.name}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 rounded-full bg-white/80 hover:bg-red-600 hover:text-white text-gray-700 shadow"
                    onClick={() => handleDeleteConfirmation(file, 'file')}
                    title="Delete"
                    aria-label={`Delete file ${file.name}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate" title={file.name}>{file.name}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ml-auto
                    ${file.type === 'image' 
                      ? 'bg-blue-100 text-blue-800' 
                      : file.type === 'video'
                      ? 'bg-purple-100 text-purple-800'
                      : file.name?.toLowerCase().endsWith('.pdf')
                      ? 'bg-red-100 text-red-800'
                      : file.name?.toLowerCase().endsWith('.doc') || file.name?.toLowerCase().endsWith('.docx')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {getFileTypeLabel(file)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{file.description || 'No description'}</div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span>{file.size ? `${(file.size / 1024).toFixed(2)} KB` : ''}</span>
                  <span>{file.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            pageSize={CARDS_PER_PAGE}
            total={files.length * CARDS_PER_PAGE}
            onChange={setCurrentPage}
            showSizeChanger={false}
            aria-label="File pagination"
          />
        </div>
      </>
    )}
  </>
);

export default FileGrid;

/* ========================================================================
 * End of File: FileGrid.jsx
 * ======================================================================== */ 