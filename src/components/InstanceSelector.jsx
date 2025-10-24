// ===============================
// File: InstanceSelector.jsx
// Description: Select and create page instances with accessibility, error handling, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Select, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

/**
 * InstanceSelector allows users to select or create a page instance.
 * Includes accessibility, error handling, and user feedback.
 * @component
 * @param {Object} props
 * @param {string} props.pageId - The page ID to fetch instances for
 * @param {string} props.value - The selected instance ID
 * @param {function} props.onChange - Callback for instance selection change
 * @param {function} props.onInstanceChange - Callback for instance object change
 * @returns {JSX.Element}
 */
const InstanceSelector = ({ pageId, value, onChange, onInstanceChange }) => {
  // State for instances, loading, modal, and form
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch instances when pageId changes
  useEffect(() => {
    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  /**
   * Fetch instances for the given page
   */
  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/pages/${pageId}/instances`);
      setInstances(response.data.data);
    } catch (error) {
      message.error('Failed to fetch instances');
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle creation of a new instance
   * @param {Object} values - Form values
   */
  const handleCreateInstance = async (values) => {
    try {
      const response = await axios.post(`/api/pages/${pageId}/instances`, values);
      setInstances([...instances, response.data.data]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Instance created successfully');
      if (onInstanceChange) {
        onInstanceChange(response.data.data);
      }
    } catch (error) {
      message.error('Failed to create instance');
    }
  };

  /**
   * Handle instance selection change
   * @param {string} instanceId
   */
  const handleInstanceChange = (instanceId) => {
    if (onChange) {
      onChange(instanceId);
    }
    if (onInstanceChange) {
      const instance = instances.find(i => i._id === instanceId);
      onInstanceChange(instance);
    }
  };

  return (
    <div className="flex items-center gap-2" aria-label="Instance Selector">
      {/* Instance select dropdown */}
      <Select
        value={value}
        onChange={handleInstanceChange}
        loading={loading}
        style={{ width: 200 }}
        placeholder="Select an instance"
        aria-label="Select an instance"
        optionFilterProp="children"
        showSearch
      >
        {instances.map(instance => (
          <Option key={instance._id} value={instance._id} aria-label={instance.title}>
            {instance.title}
          </Option>
        ))}
      </Select>
      {/* New instance button */}
      <Button
        type="primary"
        icon={<PlusOutlined aria-label="Add New Instance" />}
        onClick={() => setIsModalVisible(true)}
        aria-label="Create New Instance"
      >
        New Instance
      </Button>
      {/* Create instance modal */}
      <Modal
        title="Create New Instance"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        aria-modal="true"
        aria-labelledby="create-instance-title"
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleCreateInstance}
          layout="vertical"
          aria-labelledby="create-instance-title"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input aria-required="true" aria-label="Instance Title" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter a slug' }]}
          >
            <Input aria-required="true" aria-label="Instance Slug" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="draft"
          >
            <Select aria-label="Instance Status">
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" aria-label="Create Instance">
              Create Instance
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstanceSelector;
// ===============================
// End of File: InstanceSelector.jsx
// Description: Instance selector with create modal and accessibility
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 