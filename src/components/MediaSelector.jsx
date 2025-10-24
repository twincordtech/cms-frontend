// ===============================
// File: MediaSelector.jsx
// Description: Media file/folder selector modal with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { FaFolder, FaImage, FaTimes, FaArrowLeft, FaFolderOpen, FaThLarge, FaFile, FaFileVideo, FaFileAlt, FaCheck, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cmsApi } from '../services/api';

/**
 * MediaSelector provides a modal for selecting media files or folders.
 * Includes accessibility, error handling, keyboard navigation, and user feedback.
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {function} props.onSelect - Callback when a file is selected
 * @returns {JSX.Element|null}
 */
const MediaSelector = ({ isOpen, onClose, onSelect }) => {
  // State for folders, files, current folder, loading, search, view, and selection
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files and folders when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllFiles();
      fetchFolders();
    }
  }, [isOpen]);

  /**
   * Fetch all folders
   */
  const fetchFolders = async () => {
    try {
      const response = await cmsApi.getFolders();
      if (response.data) {
        setFolders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast.error('Failed to fetch folders');
      setFolders([]);
    }
  };

  /**
   * Fetch all files
   */
  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      const response = await cmsApi.getFiles();
      if (response.data) {
        const fileData = Array.isArray(response.data) ? response.data : [];
        setFiles(fileData);
        setCurrentFolder(null);
        setViewMode('all');
      }
    } catch (error) {
      toast.error('Failed to fetch files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch files for a specific folder
   * @param {string} folderId
   */
  const fetchFiles = async (folderId) => {
    try {
      setLoading(true);
      const response = await cmsApi.getFiles({ folder: folderId });
      if (response.data) {
        const fileData = Array.isArray(response.data) ? response.data : [];
        setFiles(fileData);
        const selectedFolder = folders.find(f => f._id === folderId);
        setCurrentFolder(selectedFolder || null);
        setViewMode('folders');
      }
    } catch (error) {
      toast.error('Failed to fetch files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle folder click
   * @param {string} folderId
   */
  const handleFolderClick = (folderId) => {
    if (!folderId) return;
    fetchFiles(folderId);
  };

  /**
   * Handle file selection
   * @param {Object} file
   */
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  /**
   * Finish selection and call onSelect
   */
  const handleFinishSelection = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      onClose();
    } else {
      toast.warning('Please select a file first');
    }
  };

  /**
   * Go back to previous folder or view
   */
  const handleBack = () => {
    if (currentFolder) {
      setCurrentFolder(null);
      fetchAllFiles();
    } else {
      setViewMode('folders');
      setFiles([]);
    }
  };

  /**
   * Format file size for display
   * @param {number} bytes
   * @returns {string}
   */
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Get icon for file type
   * @param {string} type
   * @returns {JSX.Element}
   */
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'image':
        return <FaImage className="w-6 h-6 text-blue-500" aria-label="Image file" />;
      case 'video':
        return <FaFileVideo className="w-6 h-6 text-purple-500" aria-label="Video file" />;
      case 'document':
        return <FaFileAlt className="w-6 h-6 text-yellow-500" aria-label="Document file" />;
      default:
        return <FaFile className="w-6 h-6 text-gray-400" aria-label="File" />;
    }
  };

  /**
   * Get image URL (absolute or relative)
   * @param {Object} file
   * @returns {string|null}
   */
  const getImageUrl = (file) => {
    if (!file?.url) return null;
    if (file.url.startsWith('http')) return file.url;
    return `http://localhost:5000${file.url}`;
  };

  /**
   * Filter files by search term
   * @param {Array} files
   * @param {string} searchTerm
   * @returns {Array}
   */
  const filterFiles = (files, searchTerm) => {
    if (!Array.isArray(files)) return [];
    return files.filter(file => file?.name?.toLowerCase().includes((searchTerm || '').toLowerCase()));
  };

  /**
   * Filter folders by search term
   * @param {Array} folders
   * @param {string} searchTerm
   * @returns {Array}
   */
  const filterFolders = (folders, searchTerm) => {
    if (!Array.isArray(folders)) return [];
    return folders.filter(folder => folder?.name?.toLowerCase().includes((searchTerm || '').toLowerCase()));
  };

  /**
   * Render the file grid
   * @param {Array} filesToShow
   * @returns {JSX.Element}
   */
  const renderFileGrid = (filesToShow) => (
    <div className="max-h-[70vh] overflow-y-auto" aria-label="File Grid">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filesToShow.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500" role="status">
            {searchTerm ? 'No matching files found' : 'No files found'}
          </div>
        ) : (
          filesToShow.map((file) => (
            <div
              key={file._id}
              onClick={() => handleFileSelect(file)}
              className={`cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-lg ${
                selectedFile?._id === file._id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              tabIndex={0}
              aria-label={`Select file ${file.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleFileSelect(file);
              }}
            >
              <div className="aspect-w-16 aspect-h-12 bg-gray-50">
                {file.type === 'image' ? (
                  <img
                    src={getImageUrl(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-gray-400">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      `);
                      if (e.target.parentElement) {
                        e.target.parentElement.setAttribute('title', `Failed to load image: ${file.name}`);
                      }
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name || 'Unnamed file'}
                  </h3>
                  {selectedFile?._id === file._id && (
                    <FaCheck className="w-4 h-4 text-blue-500" aria-label="Selected" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                    {file.type?.toUpperCase() || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  const filteredFiles = filterFiles(files, searchTerm);
  const filteredFolders = filterFolders(folders, searchTerm);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Media Selector Modal">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                {currentFolder && (
                  <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Back"
                  >
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentFolder ? `Files in ${currentFolder.name}` : viewMode === 'all' ? 'All Media' : 'Browse Folders'}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {viewMode === 'all' ? (
                  <button
                    onClick={() => setViewMode('folders')}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Browse Folders"
                  >
                    <FaFolder className="w-4 h-4 mr-2" />
                    Browse Folders
                  </button>
                ) : (
                  <button
                    onClick={fetchAllFiles}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="View All Files"
                  >
                    <FaThLarge className="w-4 h-4 mr-2" />
                    View All Files
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close Modal"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={currentFolder || viewMode === 'all' ? "Search files..." : "Search folders..."}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label={currentFolder || viewMode === 'all' ? "Search files" : "Search folders"}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : viewMode === 'all' ? (
              renderFileGrid(filteredFiles)
            ) : currentFolder ? (
              renderFileGrid(filteredFiles)
            ) : (
              <div className="grid grid-cols-3 gap-4" aria-label="Folder Grid">
                {filteredFolders.length === 0 ? (
                  <div className="col-span-3 text-center py-8 text-gray-500" role="status">
                    {searchTerm ? 'No matching folders found' : 'No folders found. Please create a folder first.'}
                  </div>
                ) : (
                  filteredFolders.map((folder) => (
                    <div
                      key={folder._id}
                      onClick={() => handleFolderClick(folder._id)}
                      className="cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition duration-150 shadow-sm"
                      tabIndex={0}
                      aria-label={`Open folder ${folder.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleFolderClick(folder._id);
                      }}
                    >
                      <div className="flex items-center">
                        {folder.parent ? (
                          <FaFolderOpen className="w-8 h-8 text-blue-500 mr-2" aria-label="Subfolder" />
                        ) : (
                          <FaFolder className="w-8 h-8 text-blue-500 mr-2" aria-label="Folder" />
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">
                            {folder.name}
                          </span>
                          {folder.parent && (
                            <span className="text-xs text-gray-500">
                              in {folder.parent.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleFinishSelection}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                selectedFile
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedFile}
              aria-label="Finish Selection"
            >
              Finish Selection
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSelector;
// ===============================
// End of File: MediaSelector.jsx
// Description: Media selector modal with accessibility and error handling
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 