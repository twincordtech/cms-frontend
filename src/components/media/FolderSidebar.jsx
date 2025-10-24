/* ========================================================================
 * File: FolderSidebar.jsx
 * Description: Sidebar for folder listing, search, and selection in media library.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FaFolder, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';

/**
 * FolderSidebar - Sidebar for folder listing, search, and selection
 * @param {object} props
 * @param {Array} props.folders - List of folder objects
 * @param {string|null} props.currentFolder - Currently selected folder ID
 * @param {function} props.onFolderClick - Handler for folder selection
 * @param {string} props.folderSearchQuery - Folder search query
 * @param {function} props.setFolderSearchQuery - Setter for folder search query
 * @param {function} props.handleClearFolderSearch - Handler to clear folder search
 * @param {object} props.user - Current user object
 * @param {function} props.handleDeleteConfirmation - Handler for folder delete
 */
const FolderSidebar = ({ folders, currentFolder, onFolderClick, folderSearchQuery, setFolderSearchQuery, handleClearFolderSearch, user, handleDeleteConfirmation }) => (
  <div className="p-4">
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search folders..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={folderSearchQuery}
        onChange={(e) => setFolderSearchQuery(e.target.value)}
        aria-label="Search folders"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {folderSearchQuery && (
        <button
          onClick={handleClearFolderSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear folder search"
        >
          <FaTimes />
        </button>
      )}
    </div>
    <div className="space-y-1">
      <button
        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${!currentFolder ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
        onClick={() => onFolderClick(null)}
        aria-current={!currentFolder ? 'page' : undefined}
      >
        <FaFolder className={!currentFolder ? 'text-blue-700' : 'text-gray-400'} />
        <span>All Files</span>
      </button>
      {folders.map((folder) => (
        <button
          key={folder._id}
          className={`w-full px-4 py-3 rounded-lg flex items-center justify-between group transition-all ${currentFolder === folder._id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => onFolderClick(folder._id)}
          aria-current={currentFolder === folder._id ? 'page' : undefined}
        >
          <div className="flex items-center gap-3">
            <FaFolder className={currentFolder === folder._id ? 'text-blue-700' : 'text-gray-400'} />
            <span>{folder.name}</span>
          </div>
          {user?.isAdmin && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirmation(folder, 'folder');
              }}
              aria-label={`Delete folder ${folder.name}`}
            >
              <FaTrash className="text-red-500 hover:text-red-600" />
            </button>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default FolderSidebar;

/* ========================================================================
 * End of File: FolderSidebar.jsx
 * ======================================================================== */ 