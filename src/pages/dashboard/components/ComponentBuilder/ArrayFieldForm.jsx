/* ========================================================================
 * File: ArrayFieldForm.jsx
 * Description: Modal form for configuring an array field (with nested subfields) in the component builder.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * ArrayFieldForm
 * Modal form for configuring an array field (with nested subfields) in the component builder.
 * @component
 * @param {object} props
 * @param {boolean} props.visible - Whether the modal is visible.
 * @param {function} props.onCancel - Callback to close the modal.
 * @param {function} props.onSubmit - Callback to submit the form data.
 * @param {object} [props.initialValues] - Initial values for the form.
 * @param {Array} props.FIELD_TYPES - List of available field types.
 * @returns {JSX.Element}
 */
const ArrayFieldForm = ({ visible, onCancel, onSubmit, initialValues, FIELD_TYPES }) => {
  const [form] = Form.useForm();
  const [subFields, setSubFields] = useState(initialValues?.subFields || []);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues || {});
      setSubFields(initialValues?.subFields || []);
    }
  }, [visible, form, initialValues]);

  /**
   * Update a nested field value by path.
   */
  const updateNestedField = (fieldPath, value, property = 'name') => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      // Handle top-level fields
      if (fieldPath.length === 1) {
        const index = fieldPath[0];
        newFields[index] = {
          ...newFields[index],
          [property]: value
        };
        return newFields;
      }
      // Handle nested fields
      let target = newFields;
      const indices = [];
      for (let i = 0; i < fieldPath.length; i++) {
        const currentPath = fieldPath[i];
        if (currentPath === 'subFields') continue;
        indices.push({ target, index: currentPath });
        if (!target[currentPath]) {
          target[currentPath] = { subFields: [] };
        }
        if (!target[currentPath].subFields) {
          target[currentPath].subFields = [];
        }
        target = target[currentPath].subFields;
      }
      // Update the target field
      if (indices.length > 0) {
        const lastIndex = indices[indices.length - 1];
        if (!lastIndex.target[lastIndex.index]) {
          lastIndex.target[lastIndex.index] = {};
        }
        lastIndex.target[lastIndex.index] = {
          ...lastIndex.target[lastIndex.index],
          [property]: value
        };
      }
      return newFields;
    });
  };

  /**
   * Add a nested field at the given path.
   */
  const addNestedField = (fieldPath) => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      let target = newFields;
      for (const path of fieldPath) {
        if (path === 'subFields') continue;
        if (!target[path]) {
          target[path] = { subFields: [] };
        }
        if (!target[path].subFields) {
          target[path].subFields = [];
        }
        target = target[path].subFields;
      }
      target.push({
        name: '',
        type: 'text',
        required: false,
        subFields: [],
        options: []
      });
      return newFields;
    });
  };

  /**
   * Remove a nested field at the given path.
   */
  const removeNestedField = (fieldPath) => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      // Handle top-level fields
      if (fieldPath.length === 1) {
        newFields.splice(fieldPath[0], 1);
        return newFields;
      }
      // Handle nested fields
      let target = newFields;
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const currentPath = fieldPath[i];
        if (currentPath === 'subFields') continue;
        if (!target[currentPath] || !target[currentPath].subFields) {
          return newFields; // Return unchanged if path is invalid
        }
        target = target[currentPath].subFields;
      }
      // Remove the target field
      const lastIndex = fieldPath[fieldPath.length - 1];
      if (target && Array.isArray(target)) {
        target.splice(lastIndex, 1);
      }
      return newFields;
    });
  };

  /**
   * Handle type change for a subfield, initializing or clearing subFields as needed.
   */
  const handleSubFieldTypeChange = (fieldPath, value) => {
    updateNestedField(fieldPath, value, 'type');
    if (value === 'array' || value === 'object') {
      updateNestedField(fieldPath, [], 'subFields');
      updateNestedField(fieldPath, undefined, 'options');
    } else if (value === 'select') {
      updateNestedField(fieldPath, undefined, 'subFields');
      updateNestedField(fieldPath, [], 'options');
    } else {
      updateNestedField(fieldPath, undefined, 'subFields');
      updateNestedField(fieldPath, undefined, 'options');
    }
  };

  /**
   * Add an option to a select field.
   */
  const addSelectOption = (fieldPath) => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      let target = newFields;
      for (const path of fieldPath) {
        if (path === 'subFields') continue;
        if (!target[path]) {
          target[path] = {};
        }
        target = target[path];
      }
      if (!target.options) {
        target.options = [];
      }
      target.options.push({ label: '', value: '' });
      return newFields;
    });
  };

  /**
   * Remove an option from a select field.
   */
  const removeSelectOption = (fieldPath, optionIndex) => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      let target = newFields;
      for (const path of fieldPath) {
        if (path === 'subFields') continue;
        if (!target[path]) {
          target[path] = {};
        }
        target = target[path];
      }
      if (target.options && Array.isArray(target.options)) {
        target.options.splice(optionIndex, 1);
      }
      return newFields;
    });
  };

  /**
   * Update a select option.
   */
  const updateSelectOption = (fieldPath, optionIndex, property, value) => {
    setSubFields(prevFields => {
      const newFields = [...prevFields];
      let target = newFields;
      for (const path of fieldPath) {
        if (path === 'subFields') continue;
        if (!target[path]) {
          target[path] = {};
        }
        target = target[path];
      }
      if (!target.options) {
        target.options = [];
      }
      if (!target.options[optionIndex]) {
        target.options[optionIndex] = {};
      }
      target.options[optionIndex][property] = value;
      return newFields;
    });
  };

  /**
   * Render a subfield form recursively.
   */
  const renderSubFieldForm = (field, fieldPath = [], level = 0) => {
    const isNested = field.type === 'array' || field.type === 'object';
    const isSelect = field.type === 'select';
    const maxLevel = 3;
    return (
      <div
        key={fieldPath.join('-')}
        className={`bg-gray-50 p-4 rounded-lg ${level > 0 ? 'border-l-4 border-blue-400 ml-4' : ''}`}
      >
        <div className="flex gap-4 items-center justify-between">
          <Form.Item label="Field Name" required className="mb-0 flex-1">
            <Input
              placeholder="Enter field name"
              value={field.name || ''}
              onChange={(e) => updateNestedField(fieldPath, e.target.value, 'name')}
            />
          </Form.Item>
          <Form.Item label="Field Type" required className="mb-0 flex-1">
            <Select
              value={field.type || 'text'}
              onChange={(value) => handleSubFieldTypeChange(fieldPath, value)}
              disabled={level >= maxLevel}
            >
              {FIELD_TYPES.map(type => (
                <Select.Option
                  key={type.type}
                  value={type.type}
                  disabled={level >= maxLevel && (type.type === 'array' || type.type === 'object')}
                >
                  {type.label}
                  {level >= maxLevel && (type.type === 'array' || type.type === 'object') &&
                    ' (Max nesting reached)'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Required" className="mb-0">
            <Select
              value={field.required || false}
              onChange={(value) => updateNestedField(fieldPath, value, 'required')}
            >
              <Select.Option value={true}>Required</Select.Option>
              <Select.Option value={false}>Optional</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="mb-0">
            <Button
              type="text"
              danger
              icon={<MinusCircleOutlined />}
              onClick={() => removeNestedField(fieldPath)}
            />
          </Form.Item>
        </div>

        {/* Select Field Options */}
        {isSelect && (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">Select Options</h4>
              <Button
                type="dashed"
                size="small"
                onClick={() => addSelectOption(fieldPath)}
                icon={<PlusCircleOutlined />}
              >
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {(field.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2 items-center">
                  <Input
                    placeholder="Option label"
                    value={option.label || ''}
                    onChange={(e) => updateSelectOption(fieldPath, optionIndex, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Option value"
                    value={option.value || ''}
                    onChange={(e) => updateSelectOption(fieldPath, optionIndex, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeSelectOption(fieldPath, optionIndex)}
                  />
                </div>
              ))}
              {(!field.options || field.options.length === 0) && (
                <div className="text-sm text-gray-500 italic">
                  No options added yet. Click "Add Option" to add select options.
                </div>
              )}
            </div>
          </div>
        )}

        {isNested && level < maxLevel && (
          <div className="mt-4 pl-4">
            <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-2">
              <h4 className="text-sm font-medium text-gray-700">
                {field.type === 'array' ? 'Array Items' : 'Object Properties'}
              </h4>
              <Button
                type="dashed"
                size="small"
                onClick={() => addNestedField(fieldPath)}
                icon={<PlusCircleOutlined />}
              >
                Add {field.type === 'array' ? 'Item' : 'Property'}
              </Button>
            </div>
            <div className="space-y-4 mt-2">
              {(field.subFields || []).map((subField, subIndex) =>
                renderSubFieldForm(subField, [...fieldPath, 'subFields', subIndex], level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      subFields,
      type: 'array'
    });
    form.resetFields();
    setSubFields([]);
  };

  return (
    <Modal
      title="Configure Array Field"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose={true}
      aria-label="Configure Array Field Modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="Array Field Name"
          rules={[{ required: true, message: 'Please enter field name' }]}
        >
          <Input placeholder="Enter field name" />
        </Form.Item>
        <div className="space-y-4 max-h-[600px] overflow-y-auto overflow-x-hidden">
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-4">
            <h3 className="text-lg font-semibold">Sub Fields</h3>
            <Button
              type="dashed"
              onClick={() => {
                setSubFields([
                  ...subFields,
                  {
                    name: '',
                    type: 'text',
                    subFields: [],
                    required: false,
                    options: []
                  }
                ]);
              }}
              icon={<PlusCircleOutlined />}
            >
              Add Sub Field
            </Button>
          </div>
          <div className="space-y-4">
            {subFields.map((field, index) => renderSubFieldForm(field, [index]))}
          </div>
        </div>
        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" disabled={subFields.length === 0}>
            Save Array Field
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ArrayFieldForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  FIELD_TYPES: PropTypes.array.isRequired
};

export default ArrayFieldForm;

/* ========================================================================
 * End of file: ArrayFieldForm.jsx
 * ======================================================================== */ 