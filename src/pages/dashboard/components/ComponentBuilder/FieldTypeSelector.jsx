/* ========================================================================
 * File: FieldTypeSelector.jsx
 * Description: Modal for selecting a field type in the component builder.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { Modal, Card } from 'antd';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * FieldTypeSelector
 * Modal for selecting a field type in the component builder.
 * @component
 * @param {object} props
 * @param {boolean} props.visible - Whether the modal is visible.
 * @param {function} props.onClose - Callback to close the modal.
 * @param {function} props.onSelect - Callback when a field type is selected.
 * @param {Array} props.FIELD_TYPES - List of available field types.
 * @returns {JSX.Element}
 */
const FieldTypeSelector = ({ visible, onClose, onSelect, FIELD_TYPES }) => {
  return (
    <Modal
      title="Select Field Type"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="field-type-selector-modal"
      aria-label="Select Field Type Modal"
    >
      <div className="grid grid-cols-2 gap-4 p-4">
        {FIELD_TYPES.map((fieldType) => (
          <motion.div
            key={fieldType.type}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onSelect(fieldType)}
          >
            <Card
              hoverable
              className="border-2 hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{fieldType.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{fieldType.label}</h3>
                  <p className="text-gray-600 text-sm">{fieldType.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Modal>
  );
};

FieldTypeSelector.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  FIELD_TYPES: PropTypes.array.isRequired
};

export default FieldTypeSelector;

/* ========================================================================
 * End of file: FieldTypeSelector.jsx
 * ======================================================================== */ 