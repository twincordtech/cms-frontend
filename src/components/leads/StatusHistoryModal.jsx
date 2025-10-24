/* ========================================================================
 * File: StatusHistoryModal.jsx
 * Description: Modal for displaying lead status history with single-panel open logic.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Modal, Timeline, Tag } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

/**
 * StatusHistoryModal - Shows the status history timeline for a lead
 * Only one timeline item is expanded at a time (single-panel open logic)
 * @param {object} props
 * @param {boolean} props.visible - Modal visibility
 * @param {function} props.onClose - Close handler
 * @param {object} props.lead - Lead object with statusHistory
 * @param {function} props.getTimelineColor - Function to get color for status
 */
const StatusHistoryModal = ({ visible, onClose, lead, getTimelineColor }) => {
  const [activePanel, setActivePanel] = useState(lead?.statusHistory?.length ? `${lead.statusHistory[0]._id}` : '');
  useEffect(() => {
    if (lead?.statusHistory?.length) setActivePanel(`${lead.statusHistory[0]._id}`);
  }, [lead]);
  return (
    <Modal
      title={<div className="flex items-center gap-3"><HistoryOutlined /> Status History</div>}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      bodyStyle={{ padding: '24px' }}
    >
      {lead?.statusHistory?.length > 0 ? (
        <Timeline mode="left">
          {lead.statusHistory.map((history, idx) => (
            <Timeline.Item
              key={history._id}
              color={getTimelineColor(history.status)}
              dot={<span className="w-4 h-4 rounded-full inline-block" style={{ background: getTimelineColor(history.status) }} />}
            >
              <div
                className={`cursor-pointer ${activePanel === history._id ? 'bg-blue-50' : ''}`}
                onClick={() => setActivePanel(history._id)}
                style={{ borderRadius: 8, padding: 12, marginBottom: 8 }}
              >
                <div className="flex items-center justify-between">
                  <Tag color={getTimelineColor(history.status)}>{history.status}</Tag>
                  <span className="text-xs text-gray-400">{format(new Date(history.updatedAt), 'MMM dd, yyyy h:mm a')}</span>
                </div>
                {activePanel === history._id && (
                  <div className="mt-2">
                    <div className="mb-2 text-gray-700"><b>Feedback:</b> {history.feedback}</div>
                    <div className="text-xs text-gray-500">By: {history.clientEmail || 'N/A'} | Company: {history.company || 'N/A'}</div>
                  </div>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <HistoryOutlined style={{ fontSize: '2rem' }} />
          <p className="mt-2">No status history available</p>
        </div>
      )}
    </Modal>
  );
};

export default StatusHistoryModal;

/* ========================================================================
 * End of File: StatusHistoryModal.jsx
 * ======================================================================== */ 