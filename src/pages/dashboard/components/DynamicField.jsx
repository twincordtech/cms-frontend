/* ========================================================================
 * File: DynamicField.jsx
 * Description: Renders a dynamic form field based on the field type for content layouts.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { Form, Input, Button, Select, DatePicker, Switch, Upload, Card, Space } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
const { Option } = Select;

/**
 * DynamicField
 * Renders a dynamic form field based on the field type.
 * @component
 * @param {object} props
 * @param {object} props.field - Field definition object.
 * @param {*} props.value - Current value of the field.
 * @param {function} props.onChange - Change handler for the field.
 * @returns {JSX.Element}
 */
const DynamicField = ({ field, value, onChange }) => {
  const handleChange = (newValue) => {
    onChange({
      value: newValue,
      type: field.type,
      fieldType: field.fieldType || field.type
    });
  };
  // Get the actual value from the value object
  const fieldValue = value?.value !== undefined ? value.value : value;
  switch (field.type) {
    case 'text':
    case 'string':
      return (
        <Input
          value={fieldValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${field.name}`}
        />
      );
    case 'textarea':
      return (
        <TextArea
          value={fieldValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${field.name}`}
          rows={4}
        />
      );
    case 'richText':
      return (
        <div className="rich-text-editor">
          <ReactQuill
            value={fieldValue || ''}
            onChange={handleChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
      );
    case 'number':
      return (
        <Input
          type="number"
          value={fieldValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder={`Enter ${field.name}`}
        />
      );
    case 'image':
      return (
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => handleChange(fileList[0])}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      );
    case 'boolean':
      return (
        <Switch
          checked={fieldValue}
          onChange={handleChange}
        />
      );
    case 'date':
      return (
        <DatePicker
          value={fieldValue}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      );
    case 'select':
      return (
        <Select
          value={fieldValue}
          onChange={handleChange}
          style={{ width: '100%' }}
          placeholder={`Select ${field.name}`}
        >
          {field.options?.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
    case 'array':
      return (
        <Form.List name={field.name}>
          {(fields, { add, remove }) => (
            <div className="array-fields">
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="mb-4">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {field.itemStructure?.map((subField) => (
                      <Form.Item
                        {...restField}
                        name={[name, subField.name]}
                        label={subField.name}
                        key={subField.name}
                      >
                        <DynamicField
                          field={{
                            ...subField,
                            type: subField.fieldType || subField.type
                          }}
                          value={fieldValue?.[name]?.[subField.name]}
                          onChange={(newValue) => {
                            const newArray = [...(fieldValue || [])];
                            newArray[name] = {
                              ...newArray[name],
                              [subField.name]: newValue
                            };
                            handleChange(newArray);
                          }}
                        />
                      </Form.Item>
                    ))}
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    >
                      Remove Item
                    </Button>
                  </Space>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => {
                  const newItem = {};
                  field.itemStructure?.forEach(subField => {
                    newItem[subField.name] = {
                      value: '',
                      type: subField.type,
                      fieldType: subField.fieldType || subField.type
                    };
                  });
                  add(newItem);
                }}
                block
                icon={<PlusOutlined />}
              >
                Add Item
              </Button>
            </div>
          )}
        </Form.List>
      );
    case 'object':
      return (
        <Card className="object-field">
          {field.subFields?.map((subField) => (
            <Form.Item
              key={subField.name}
              name={[field.name, subField.name]}
              label={subField.name}
            >
              <DynamicField
                field={{
                  ...subField,
                  type: subField.fieldType || subField.type
                }}
                value={fieldValue?.[subField.name]}
                onChange={(newValue) => {
                  handleChange({
                    ...fieldValue,
                    [subField.name]: newValue
                  });
                }}
              />
            </Form.Item>
          ))}
        </Card>
      );
    default:
      return (
        <Input
          value={fieldValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${field.name}`}
        />
      );
  }
};

export default DynamicField;

/* ========================================================================
 * End of file: DynamicField.jsx
 * ======================================================================== */ 