/* ========================================================================
 * File: SelectFieldForm.jsx
 * Description: Modal form for configuring a select field in the component builder.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * SelectFieldForm
 * Modal form for configuring a select field in the component builder.
 * @component
 * @param {object} props
 * @param {boolean} props.visible - Whether the modal is visible.
 * @param {function} props.onCancel - Callback to close the modal.
 * @param {function} props.onSubmit - Callback to submit the form data.
 * @param {object} [props.initialValues] - Initial values for the form.
 * @returns {JSX.Element}
 */
const SelectFieldForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState(initialValues?.options || []);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues || {});
      setOptions(initialValues?.options || []);
    }
  }, [visible, form, initialValues]);

  const handleAddOption = () => {
    setOptions([...options, { label: '', value: '' }]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      options,
      type: 'select'
    });
    form.resetFields();
    setOptions([]);
  };

  return (
    <Modal
      title="Configure Select Field"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose={true}
      aria-label="Configure Select Field Modal"
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
          label="Select Field Name"
          rules={[{ required: true, message: 'Please enter field name' }]}
        >
          <Input placeholder="Enter field name" />
        </Form.Item>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Options</h3>
            <Button
              type="dashed"
              onClick={handleAddOption}
              icon={<PlusCircleOutlined />}
            >
              Add Option
            </Button>
          </div>
          {options.map((option, index) => (
            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Option Label"
                  value={option.label}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index].label = e.target.value;
                    newOptions[index].value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                    setOptions(newOptions);
                  }}
                />
                <Input
                  placeholder="Option Value"
                  value={option.value}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index].value = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              </div>
              <Button
                type="text"
                danger
                icon={<MinusCircleOutlined />}
                onClick={() => handleRemoveOption(index)}
              />
            </div>
          ))}
        </div>
        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" disabled={options.length === 0}>
            Save Select Field
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

SelectFieldForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};

export default SelectFieldForm;

/* ========================================================================
 * End of file: SelectFieldForm.jsx
 * ======================================================================== */ 