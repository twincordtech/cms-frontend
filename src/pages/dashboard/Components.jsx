/* ========================================================================
 * File: Components.jsx
 * Description: Dashboard page for listing, editing, and deleting dynamic components.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getComponents, deleteComponent } from '../../services/api';

/**
 * Components
 * Dashboard page for listing, editing, and deleting dynamic components.
 * @component
 * @returns {JSX.Element}
 */
const Components = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComponents();
  }, []);

  /**
   * Fetch all components from the API.
   */
  const fetchComponents = async () => {
    try {
      const response = await getComponents();
      if (response.data.success) {
        setComponents(response.data.data);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching components:', error);
      message.error('Failed to fetch components');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to the edit page for a component.
   * @param {object} component
   */
  const handleEdit = (component) => {
    navigate(`/dashboard/components/edit/${component._id}`);
  };

  /**
   * Delete a component and refresh the list.
   * @param {object} component
   */
  const handleDelete = async (component) => {
    try {
      await deleteComponent(component._id);
      message.success('Component deleted successfully');
      fetchComponents();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting component:', error);
      message.error('Failed to delete component');
    }
  };

  /**
   * Table columns definition for the components table.
   */
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
    },
    {
      title: 'Fields',
      key: 'fields',
      render: (_, record) => record.fields.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            aria-label={`Edit component ${record.name}`}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            aria-label={`Delete component ${record.name}`}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6" aria-label="Components Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Components</h1>
        <Button
          type="primary"
          onClick={() => navigate('/dashboard/components/create')}
          aria-label="Create Component"
        >
          Create Component
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={components}
        loading={loading}
        rowKey="_id"
        aria-label="Components Table"
      />
    </div>
  );
};

export default Components;

/* ========================================================================
 * End of file: Components.jsx
 * ======================================================================== */ 