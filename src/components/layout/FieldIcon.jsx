/* ========================================================================
 * File: FieldIcon.jsx
 * Description: Renders an icon for a given field type in layout editing.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { FileTextOutlined, PictureOutlined, UnorderedListOutlined, CalendarOutlined, CheckSquareOutlined, NumberOutlined, EditOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * FieldIcon Component
 * Renders an icon for a given field type.
 * @param {object} props
 * @param {string} props.type - Field type
 */
const FieldIcon = ({ type }) => {
  switch (type) {
    case 'text':
    case 'string':
      return <FileTextOutlined className="text-gray-400 mr-1" />;
    case 'image':
      return <PictureOutlined className="text-gray-400 mr-1" />;
    case 'array':
      return <UnorderedListOutlined className="text-gray-400 mr-1" />;
    case 'date':
      return <CalendarOutlined className="text-gray-400 mr-1" />;
    case 'boolean':
      return <CheckSquareOutlined className="text-gray-400 mr-1" />;
    case 'number':
      return <NumberOutlined className="text-gray-400 mr-1" />;
    case 'textarea':
    case 'richText':
      return <EditOutlined className="text-gray-400 mr-1" />;
    default:
      return null;
  }
};

FieldIcon.propTypes = {
  type: PropTypes.string.isRequired
};

export default FieldIcon;

/* ========================================================================
 * End of File: FieldIcon.jsx
 * ======================================================================== */ 