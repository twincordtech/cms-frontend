/* ========================================================================
 * File: StatusButtons.jsx
 * Description: Status update buttons for lead management.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { Button, Tooltip } from 'antd';

/**
 * StatusButtons - Renders status update buttons for leads
 * @param {object} props
 * @param {string} props.selectedStatus - Currently selected status
 * @param {Set} props.usedStatuses - Set of used statuses
 * @param {function} props.onStatusUpdate - Handler for status update
 */
const StatusButtons = ({ selectedStatus, usedStatuses, onStatusUpdate }) => {
  const statuses = [
    { key: 'contacted', label: 'Contacted', color: 'green' },
    { key: 'qualified', label: 'Qualified', color: 'purple' },
    { key: 'lost', label: 'Lost', color: 'red' },
    { key: 'rejected', label: 'Rejected', color: 'orange' }
  ];
  return (
    <div className="flex gap-2 mb-4">
      {statuses.map(({ key, label, color }) => {
        const isUsed = usedStatuses.has(key);
        const tooltipText = isUsed ? `Lead is already ${label.toLowerCase()}` : '';
        return (
          <Tooltip key={key} title={tooltipText}>
            <Button
              type={selectedStatus === key ? 'primary' : 'default'}
              onClick={() => onStatusUpdate(key)}
              className={selectedStatus === key ? `bg-${color}-500 border-${color}-500` : ''}
              disabled={isUsed}
              style={isUsed ? {
                opacity: 0.5,
                cursor: 'not-allowed',
                backgroundColor: '#f5f5f5',
                borderColor: '#d9d9d9',
                color: 'rgba(0, 0, 0, 0.25)'
              } : {}}
            >
              {label}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default StatusButtons;

/* ========================================================================
 * End of File: StatusButtons.jsx
 * ======================================================================== */ 