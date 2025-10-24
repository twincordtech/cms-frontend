// ===============================
// File: DeletePageModal.jsx
// Description: Modal for confirming deletion of a CMS page.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../elements/Button';

/**
 * Modal for confirming deletion of a CMS page
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onCancel - Function to cancel deletion
 * @param {function} props.onConfirm - Function to confirm deletion
 * @param {boolean} props.loading - Whether the delete action is loading
 */
const DeletePageModal = ({ isOpen, onCancel, onConfirm, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" aria-modal="true" role="dialog" tabIndex={-1}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            aria-label="Cancel delete page"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            aria-label="Confirm delete page"
            isLoading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

DeletePageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default DeletePageModal;
// ===============================
// End of File: DeletePageModal.jsx
// Description: Modal for confirming deletion of a CMS page.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 