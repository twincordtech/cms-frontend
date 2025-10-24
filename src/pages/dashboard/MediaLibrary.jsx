/* ========================================================================
 * File: MediaLibrary.jsx
 * Description: Production-quality media library dashboard using modular components.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cmsApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
import FolderSidebar from '../../components/media/FolderSidebar';
import FileGrid from '../../components/media/FileGrid';
import UploadModal from '../../components/media/UploadModal';
import EditFileModal from '../../components/media/EditFileModal';
import DeleteConfirmationModal from '../../components/media/DeleteConfirmationModal';
import { FaPlus, FaTimes, FaUpload, FaImage, FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';

const MediaLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'folder' or 'file'
  const [newFolder, setNewFolder] = useState({ name: '', description: '' });
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadData, setUploadData] = useState({ 
    description: '', 
    type: 'image',
    folder: null 
  });
  const [editFile, setEditFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [editFileUpload, setEditFileUpload] = useState(null);
  const CARDS_PER_PAGE = 12;

  // Get base URL for media files
  const getMediaUrl = (path) => {
    if (!path) return '';
    
    // If it's already a full URL, return it as is
    if (path.startsWith('http')) return path;
    
    // Handle malformed URLs like "uploadsmedia1752899497345-718978807.png"
    if (path.includes('uploadsmedia') && !path.includes('/uploads/media/')) {
      const filename = path.replace('uploadsmedia', '');
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/media/${filename}`;
    }
    
    // If it contains a full path with uploads/media, extract just the filename
    if (path.includes('/uploads/media/')) {
      const filename = path.split('/uploads/media/').pop();
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/media/${filename}`;
    }
    
    // For paths that might already be just filenames
    if (!path.includes('/')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/media/${path}`;
    }
    
    // Default case: extract the filename from the path and construct the URL
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/media/${path.split('/').pop()}`;
  };

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        await Promise.all([fetchFolders(), fetchFiles()]);
      } catch (error) {
        console.error('Error loading media library:', error);
        toast.error('Failed to load media library');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, navigate]);

  useEffect(() => {
    if (user && currentFolder) {
      fetchFiles();
    }
  }, [currentFolder, user]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [currentFolder, searchQuery, user]);

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [folderSearchQuery, user]);

  const fetchFolders = async () => {
    try {
      const response = await cmsApi.getFolders();
      const filteredFolders = folderSearchQuery
        ? response.data.filter(folder => 
            folder.name.toLowerCase().includes(folderSearchQuery.toLowerCase()) ||
            folder.description?.toLowerCase().includes(folderSearchQuery.toLowerCase())
          )
        : response.data;
      setFolders(filteredFolders);
      
      if (!currentFolder && filteredFolders.length > 0 && !folderSearchQuery) {
        setCurrentFolder(filteredFolders[0]._id);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to fetch folders');
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (currentFolder) {
        params.folder = currentFolder;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await cmsApi.getFiles(params);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await cmsApi.createFolder({
        ...newFolder,
        parent: currentFolder
      });

      toast.success('Folder created successfully');
      setShowNewFolderModal(false);
      setNewFolder({ name: '', description: '' });
      setFolders([...folders, response.data]);
      
      if (folders.length === 0) {
        setCurrentFolder(response.data._id);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error(error.response?.data?.message || 'Failed to create folder');
    }
  };

  const processFiles = async (files) => {
    setIsProcessing(true);
    setProcessedFiles([]);
    setFileProgress({});
    
    // Process all files in parallel
    const fileArray = Array.from(files);
    
    // Initialize progress for all files at once
    const initialProgress = fileArray.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {});
    setFileProgress(initialProgress);
    
    // Generate all previews in parallel
    const processedFilesData = fileArray.map(file => {
      // Immediately create object URL for preview instead of simulating delay
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : null;
        
      // Mark as 100% processed right away
      setFileProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));
      
      return {
        file,
        preview,
        processed: true,
        name: file.name,
        size: file.size,
        type: file.type
      };
    });
    
    setProcessedFiles(processedFilesData);
    setIsProcessing(false);
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadFiles(selectedFiles);
    setUploadProgress(
      selectedFiles.reduce((acc, file) => {
        acc[file.name] = 0;
        return acc;
      }, {})
    );
    
    // Start processing the files immediately after selection
    await processFiles(selectedFiles);
  };

  const handleUploadFiles = async (e) => {
    if (e) e.preventDefault();
    if (!processedFiles.length) {
      toast.error('Please select files');
      return;
    }

    const targetFolder = uploadData.folder || currentFolder;
    if (!targetFolder) {
      toast.error('Please select a folder');
      return;
    }

    // Set uploading state to show progress UI
    setUploadingFiles(processedFiles.map(p => p.file));
    setShowUploadProgress(true);
    
    try {
      // Initialize all progress at 0%
      const initialUploadProgress = processedFiles.reduce((acc, file) => {
        acc[file.name] = 0;
        return acc;
      }, {});
      setUploadProgress(initialUploadProgress);
      
      const uploadPromises = processedFiles.map(async (processedFile) => {
        const formData = new FormData();
        formData.append('files', processedFile.file);
        formData.append('description', uploadData.description);
        formData.append('type', uploadData.type);
        formData.append('folder', targetFolder);

        const response = await cmsApi.uploadFile(formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [processedFile.name]: progress
            }));
          }
        });
        return response.data;
      });

      const results = await Promise.all(uploadPromises);
      const uploadedFiles = results.flatMap(result => result.data || []);

      toast.success(`${uploadedFiles.length} files uploaded successfully`);
      
      // Reset all states
      setUploadFiles([]);
      setUploadProgress({});
      setUploadData({ description: '', type: 'image', folder: null });
      setProcessedFiles([]);
      setFileProgress({});
      setUploadingFiles([]);
      setShowUploadProgress(false);
      
      if (targetFolder === currentFolder) {
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
      } else {
        fetchFiles();
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(error.response?.data?.message || 'Failed to upload files');
      setShowUploadProgress(false);
      setUploadingFiles([]);
    }
  };

  const handleDeleteConfirmation = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'folder') {
        await cmsApi.deleteFolder(itemToDelete._id);
        setFolders(folders.filter(folder => folder._id !== itemToDelete._id));
        
        if (currentFolder === itemToDelete._id) {
          setCurrentFolder(null);
        }
        
        toast.success('Folder deleted successfully');
        fetchFiles();
      } else if (deleteType === 'file') {
        await cmsApi.deleteFile(itemToDelete._id);
        setFiles(prevFiles => prevFiles.filter(file => file._id !== itemToDelete._id));
        toast.success('File deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
      setDeleteType(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY [at] hh:mm A');
  };

  const handleEditFile = async (e) => {
    e.preventDefault();
    try {
      console.log('Editing file:', editFile);
      console.log('Edit file upload:', editFileUpload);
      
      // Ensure folder is a string ID, not an object
      const folderId = typeof editFile.folder === 'object' ? editFile.folder._id : editFile.folder;
      
      let response;
      if (editFileUpload) {
        const formData = new FormData();
        formData.append('file', editFileUpload);
        formData.append('name', editFile.name);
        formData.append('description', editFile.description);
        formData.append('type', editFile.type);
        formData.append('folder', folderId);
        
        console.log('Sending FormData update for file:', editFile._id);
        console.log('Folder ID:', folderId);
        response = await cmsApi.updateFile(editFile._id, formData, true);
      } else {
        const updateData = {
          name: editFile.name,
          description: editFile.description,
          type: editFile.type,
          folder: folderId
        };
        
        console.log('Sending JSON update for file:', editFile._id, updateData);
        console.log('Folder ID:', folderId);
        response = await cmsApi.updateFile(editFile._id, updateData);
      }
      
      console.log('Update response:', response);
      console.log('Updated file data:', response.data);
      
      // Update the files list with the new data
      setFiles(prevFiles => prevFiles.map(f => f._id === editFile._id ? response.data : f));
      
      toast.success('File updated successfully');
      setShowEditModal(false);
      setEditFile(null);
      setEditFileUpload(null);
    } catch (error) {
      console.error('Error updating file:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to update file');
    }
  };

  const renderFilePreview = () => {
    if (!uploadFiles.length) return <FaUpload className="h-24 w-24 text-gray-400 group-hover:text-blue-500 transition-colors" />;

    if (uploadFiles[0].type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(uploadFiles[0])}
          alt="Preview"
          className="h-24 w-24 object-cover rounded-lg"
        />
      );
    }
    
    return <FaFile className="h-24 w-24 text-gray-400" />;
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchFiles();
  };

  const handleClearFolderSearch = () => {
    setFolderSearchQuery('');
    fetchFolders();
  };

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
    setSearchQuery('');
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setProcessedFiles([]);
    setFileProgress({});
    setUploadFiles([]);
    setUploadData({ description: '', type: 'image', folder: null });
  };

  const renderUploadProgress = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Uploading Files</h2>
            <div className="text-sm text-gray-500">
              {Object.values(uploadProgress).filter(p => p === 100).length} of {uploadingFiles.length} complete
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2">
            {uploadingFiles.map((file, index) => {
              const progress = uploadProgress[file.name] || 0;
              const isComplete = progress === 100;
              
              return (
                <div key={index} className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <div className="aspect-w-16 aspect-h-12">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaFileAlt className="text-4xl text-gray-400" />
                      </div>
                    )}
                    
                    {/* Progress overlay */}
                    {!isComplete && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                        <svg className="animate-spin w-10 h-10 mb-2 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Completed checkmark */}
                    {isComplete && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="bg-green-500 rounded-full p-2">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Progress bar at bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      <span className="text-xs font-medium text-blue-600">{progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Overall progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>
                {Math.round(Object.values(uploadProgress).reduce((sum, p) => sum + p, 0) / 
                  (uploadingFiles.length || 1))}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ 
                  width: `${Object.values(uploadProgress).reduce((sum, p) => sum + p, 0) / 
                    (uploadingFiles.length || 1)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl" style={{ maxHeight: '90vh' }}>
        <div className="p-6 flex flex-col h-full" style={{ maxHeight: '90vh' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isProcessing ? 'Processing Files...' : 'Files Ready for Upload'}
            </h2>
            <button 
              onClick={handleCancelUpload}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 mb-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-1">
              {uploadFiles.map((file, index) => {
                const isProcessed = processedFiles.find(f => f.name === file.name);
                const progress = fileProgress[file.name] || 0;
                
                return (
                  <div key={index} className="relative">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      {isProcessed ? (
                        <>
                          {isProcessed.preview ? (
                            <img
                              src={isProcessed.preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaFileAlt className="text-4xl text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-[35%] left-[35%]">
                            <div className="bg-green-500 rounded-full p-1 w-[20%] h-[35%]">
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <svg className="animate-spin w-8 h-8 mb-3 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <div className="text-blue-600 font-medium text-lg">
                            {progress}%
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-auto">
            {isProcessing ? (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Preparing files for upload...</p>
                <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                    style={{ 
                      width: `${Object.values(fileProgress).reduce((a, b) => a + b, 0) / (uploadFiles.length * 100) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUploadFiles();
                    setShowUploadModal(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload Files
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUploadModal = () => (
    <>
      {!isProcessing && processedFiles.length === 0 ? (
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

                        {uploadFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Files:</h4>
                            <div className="max-h-32 overflow-y-auto">
                              {uploadFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between py-1">
                                  <span className="text-sm truncate">{file.name}</span>
                                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
                              Folder
                            </label>
                            <select
                              id="folder"
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={uploadData.folder || currentFolder || ''}
                              onChange={(e) => setUploadData({ ...uploadData, folder: e.target.value })}
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

                          <div className="col-span-2 sm:col-span-1">
                            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">
                              File Type
                            </label>
                            <select
                              id="fileType"
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={uploadData.type}
                              onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                            >
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                              <option value="document">Document</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <textarea
                              id="description"
                              rows="3"
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={uploadData.description}
                              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                              placeholder="Enter file description (optional)"
                            />
                          </div>
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
                  onClick={handleUploadFiles}
                >
                  Process Files
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelUpload}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : renderProcessingModal()}
    </>
  );

  // Helper to get icon for file type
  const getFileTypeIcon = (file) => {
    if (file.type === 'image') return <FaImage className="text-4xl text-blue-400" />;
    if (file.type === 'video') return <FaFileAlt className="text-4xl text-purple-400" />;
    if (file.name?.toLowerCase().endsWith('.pdf')) return <FaFilePdf className="text-4xl text-red-500" />;
    if (file.name?.toLowerCase().endsWith('.doc') || file.name?.toLowerCase().endsWith('.docx')) return <FaFileWord className="text-4xl text-blue-600" />;
    return <FaFileAlt className="text-4xl text-gray-400" />;
  };

  const getFileTypeLabel = (file) => {
    if (file.type === 'image') return 'Image';
    if (file.type === 'video') return 'Video';
    if (file.name?.toLowerCase().endsWith('.pdf')) return 'PDF';
    if (file.name?.toLowerCase().endsWith('.doc') || file.name?.toLowerCase().endsWith('.docx')) return 'DOC';
    return 'Document';
  };

  const paginatedFiles = files.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your media files and folders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <FaPlus className="mr-2 -ml-1" /> New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              disabled={folders.length === 0}
            >
              <FaUpload className="mr-2 -ml-1" /> Upload Files
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
          <div className="grid grid-cols-12">
            <div className="col-span-2 border-r border-gray-100 min-h-[calc(100vh-12rem)] ">
              <FolderSidebar
                folders={folders}
                currentFolder={currentFolder}
                onFolderClick={handleFolderClick}
                folderSearchQuery={folderSearchQuery}
                setFolderSearchQuery={setFolderSearchQuery}
                handleClearFolderSearch={handleClearFolderSearch}
                user={user}
                handleDeleteConfirmation={handleDeleteConfirmation}
              />
            </div>

            <div className="col-span-10 min-h-[calc(100vh-12rem)]">
              <div className="p-6">
                {/* File search input can remain here if not modularized */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* FaSearch icon here if needed */}
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {/* FaTimes icon here if needed */}
                      </button>
                    )}
                  </div>
                </div>
                <FileGrid
                  files={files.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE)}
                  getMediaUrl={getMediaUrl}
                  getFileTypeIcon={getFileTypeIcon}
                  getFileTypeLabel={getFileTypeLabel}
                  handleDeleteConfirmation={handleDeleteConfirmation}
                  setEditFile={setEditFile}
                  setShowEditModal={setShowEditModal}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  CARDS_PER_PAGE={CARDS_PER_PAGE}
                  loading={loading}
                />
                              </div>
                            </div>
                          </div>
                            </div>
        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Folder</h3>
                      <div className="mt-4">
                        <form onSubmit={handleCreateFolder} className="space-y-4">
                          <div>
                            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700">
                              Folder Name
                            </label>
                            <input
                              type="text"
                              id="folderName"
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={newFolder.name}
                              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                              placeholder="Enter folder name"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="folderDescription" className="block text-sm font-medium text-gray-700">
                              Description (Optional)
                            </label>
                            <textarea
                              id="folderDescription"
                              rows="3"
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={newFolder.description}
                              onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                              placeholder="Enter folder description"
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
                    onClick={handleCreateFolder}
                  >
                    Create Folder
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowNewFolderModal(false);
                      setNewFolder({ name: '', description: '' });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showUploadModal && renderUploadModal()}
        {showUploadProgress && renderUploadProgress()}
        <EditFileModal
          showEditModal={showEditModal}
          editFile={editFile}
          setEditFile={setEditFile}
          editFileUpload={editFileUpload}
          setEditFileUpload={setEditFileUpload}
          handleEditFile={handleEditFile}
          folders={folders}
          getFileTypeIcon={getFileTypeIcon}
          getMediaUrl={getMediaUrl}
          setShowEditModal={setShowEditModal}
        />
        <DeleteConfirmationModal
          showDeleteConfirmation={showDeleteConfirmation}
          itemToDelete={itemToDelete}
          deleteType={deleteType}
          handleDelete={handleDelete}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          setItemToDelete={setItemToDelete}
          setDeleteType={setDeleteType}
          getMediaUrl={getMediaUrl}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default MediaLibrary; 