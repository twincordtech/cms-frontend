// ===============================
// File: ShareModal.jsx
// Description: Modal for sharing a link with copy-to-clipboard functionality, accessibility, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useEffect, useRef } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { ShareAltOutlined, CopyOutlined } from '@ant-design/icons';

/**
 * ShareModal displays a modal for sharing a link with copy-to-clipboard functionality.
 * Includes accessibility, keyboard navigation, and user feedback.
 * @component
 * @param {Object} props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {function} props.onCancel - Callback to close the modal
 * @param {string} props.shareUrl - The URL to share
 * @returns {JSX.Element}
 */
const ShareModal = ({ visible, onCancel, shareUrl }) => {
  const inputRef = useRef(null);

  /**
   * Copy the share URL to clipboard
   */
  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      message.success('Link copied to clipboard!');
    }
  };

  // Auto-select input when modal opens
  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.select();
    }
  }, [visible]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ShareAltOutlined className="text-blue-500" aria-hidden="true" />
          <span>Share Lead</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      aria-modal="true"
      aria-labelledby="share-modal-title"
      destroyOnClose
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={shareUrl}
            readOnly
            className="flex-1"
            aria-label="Share URL"
            tabIndex={0}
            onFocus={(e) => e.target.select()}
          />
          <Button
            type="primary"
            icon={<CopyOutlined aria-label="Copy to clipboard" />}
            onClick={handleCopy}
            aria-label="Copy link to clipboard"
          >
            Copy
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
// ===============================
// End of File: ShareModal.jsx
// Description: Share modal with copy-to-clipboard and accessibility
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
