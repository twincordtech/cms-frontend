// ===============================
// File: DeleteConfirmModal.jsx
// Description: Reusable confirmation modal for delete operations with customizable title, message, and button text.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * DeleteConfirmModal provides a consistent confirmation dialog for delete operations.
 * Features customizable title, message, and button text with danger styling for the confirm action.
 */
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel'
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-red-500">
          <ExclamationCircleOutlined className="text-xl" />
          <span>{title}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      okText={confirmButtonText}
      cancelText={cancelButtonText}
      okButtonProps={{
        danger: true,
        className: 'bg-red-500'
      }}
    >
      <p className="text-gray-600">{message}</p>
    </Modal>
  );
};

export default DeleteConfirmModal;
// ===============================
// End of File: DeleteConfirmModal.jsx
// Description: Delete confirmation modal
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 