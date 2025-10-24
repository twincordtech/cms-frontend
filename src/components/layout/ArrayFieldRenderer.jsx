/* ========================================================================
 * File: ArrayFieldRenderer.jsx
 * Description: Renders and manages array-type fields (including nested arrays) for layout editing.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ComponentFieldRenderer from './ComponentFieldRenderer';

/**
 * ArrayFieldRenderer Component
 * Renders and manages array-type fields (including nested arrays) for layout editing.
 * @param {object} props
 * @param {object} props.field - Field definition
 * @param {Array} props.value - Current array value
 * @param {function} props.onChange - Change handler (index, subField, value)
 * @param {object} props.helpers - Helper functions (getUserFriendlyLabel, getFieldIcon, etc.)
 * @param {string} [props.parentPath] - Path for nested arrays
 * @param {string} [props.commonClasses] - Common input classes
 */
const ArrayFieldRenderer = ({ field, value = [], onChange, helpers, parentPath = '', commonClasses }) => {
  const { getUserFriendlyLabel } = helpers;
  const fullPath = parentPath ? `${parentPath}.${field.name}` : field.name;
  const friendlyLabel = getUserFriendlyLabel(field.name, parentPath);

  // State to control which panel is open (only one at a time)
  const [activePanel, setActivePanel] = useState(value.length > 0 ? `${fullPath}-0` : '');

  // Update activePanel if value length changes (e.g., add/remove)
  React.useEffect(() => {
    if (value.length === 0) {
      setActivePanel('');
    } else if (!activePanel) {
      setActivePanel(`${fullPath}-0`);
    } else {
      // Remove keys that no longer exist
      const validKeys = value.map((_, idx) => `${fullPath}-${idx}`);
      if (!validKeys.includes(activePanel)) {
        setActivePanel(validKeys[0]);
      }
    }
    // eslint-disable-next-line
  }, [value.length]);

  const handleAddItem = () => {
    const newItem = {};
    field.itemStructure.forEach(subField => {
      if (subField.type === 'array') {
        newItem[subField.name] = [];
      } else {
        newItem[subField.name] = '';
      }
    });
    onChange([...value, newItem]);
    setTimeout(() => {
      setActivePanel(`${fullPath}-${value.length}`); // Open the new panel
    }, 0);
  };

  const handleRemoveItem = (index) => {
    const updatedArray = value.filter((_, i) => i !== index);
    onChange(updatedArray);
    setTimeout(() => {
      if (updatedArray.length > 0) {
        setActivePanel(`${fullPath}-0`);
      } else {
        setActivePanel('');
      }
    }, 0);
  };

  const handleNestedFieldChange = (index, subField, nestedValue) => {
    const updatedArray = [...value];
    updatedArray[index] = {
      ...updatedArray[index],
      [subField.name]: nestedValue
    };
    onChange(updatedArray);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100">
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-700 text-base mr-2">{friendlyLabel}</span>
        <Tooltip title={`Add new ${friendlyLabel}`}>
          <button
            type="button"
            onClick={handleAddItem}
            className="ml-auto inline-flex items-center px-3 py-1.5 border border-primary-200 text-xs font-semibold rounded-full text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
            aria-label={`Add new ${friendlyLabel}`}
          >
            <PlusOutlined className="mr-1" /> Add
          </button>
        </Tooltip>
      </div>
      <Collapse
        bordered={false}
        ghost
        activeKey={activePanel}
        onChange={key => {
          // Always set only the clicked panel as open (string key)
          if (Array.isArray(key)) {
            setActivePanel(key.length > 0 ? key[key.length - 1] : '');
          } else if (typeof key === 'string') {
            setActivePanel(key);
          } else {
            setActivePanel('');
          }
        }}
      >
        {value.map((item, index) => (
          <Collapse.Panel
            key={`${fullPath}-${index}`}
            header={
              <div className="flex items-center w-full group">
                <span className="font-medium text-gray-800">{friendlyLabel} #{index + 1}</span>
                <Tooltip title="Remove">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleRemoveItem(index); }}
                    className="ml-auto inline-flex items-center p-1 border-none text-red-500 bg-transparent hover:bg-red-50 rounded-full transition"
                    aria-label={`Remove ${friendlyLabel} ${index + 1}`}
                  >
                    <DeleteOutlined />
                  </button>
                </Tooltip>
              </div>
            }
            showArrow={true}
          >
            <div className="space-y-3" data-autofocus={`${fullPath}-${index}`}> {/* For auto-focus */}
              {field.itemStructure.map((subField, subIdx) => (
                <div key={`${fullPath}-${index}-${subField.name}`} className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {subField.label || getUserFriendlyLabel(subField.name)}
                  </label>
                  <ComponentFieldRenderer
                    field={subField}
                    value={item[subField.name]}
                    onChange={val => handleNestedFieldChange(index, subField, val)}
                    helpers={helpers}
                    commonClasses={commonClasses}
                  />
                </div>
              ))}
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

ArrayFieldRenderer.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  helpers: PropTypes.object.isRequired,
  parentPath: PropTypes.string,
  commonClasses: PropTypes.string
};

export default ArrayFieldRenderer;

/* ========================================================================
 * End of File: ArrayFieldRenderer.jsx
 * ======================================================================== */ 