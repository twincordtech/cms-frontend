/* ========================================================================
 * File: ImagePreviewModal.jsx
 * Description: Modal for previewing images in layout editing.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

/**
 * ImagePreviewModal Component
 * Modal for previewing images in layout editing.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.imageUrl - The image URL to preview
 * @param {function} props.onClose - Handler to close the modal
 */
const ImagePreviewModal = ({ isOpen, imageUrl, onClose }) => {
  console.log('ImagePreviewModal render:', { isOpen, imageUrl });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="relative bg-white rounded-lg max-w-[800px] max-h-[800px] w-full h-full m-4 overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-md"
            aria-label="Close image preview"
          >
            <FaTimes className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onLoad={() => console.log('Image loaded successfully:', imageUrl)}
              onError={(e) => {
                console.error('Image failed to load:', imageUrl, e);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-lg mb-2">No image to preview</div>
              <div className="text-sm">Image URL: {imageUrl || 'undefined'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ImagePreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default ImagePreviewModal;

/* ========================================================================
 * End of File: ImagePreviewModal.jsx
 * ======================================================================== */ 