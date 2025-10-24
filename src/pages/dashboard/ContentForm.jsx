/* ========================================================================
 * File: ContentForm.jsx
 * Description: Form for creating and editing content layouts with dynamic fields and components.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Switch, Upload, message, Card, Space, Typography } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getLayout, createLayout, updateLayout, getComponents } from '../../services/api';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DynamicField from './components/DynamicField';

const { TextArea } = Input;
const { Option } = Select;

/**
 * useContentManager
 * Custom hook for managing content form state, auto-save, and server sync.
 * @param {string} layoutId
 * @returns {object}
 */
const useContentManager = (layoutId) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState(null);
  const [components, setComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [componentTypes, setComponentTypes] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);

  // Helper function to transform layout data
  const transformLayoutData = (layout) => {
    if (!layout) return null;

    const transformedComponents = layout.components.map(comp => {
      const fields = comp.fields || [];
      const transformedData = {};

      fields.forEach(field => {
        if (field.type === 'array') {
          // Handle array fields
          transformedData[field.name] = comp.data[field.name]?.map(item => {
            const mappedItem = {};
            field.itemStructure?.forEach(subField => {
              mappedItem[subField.name] = item[subField.name]?.value || '';
            });
            return mappedItem;
          }) || [];
        } else if (field.type === 'object') {
          // Handle object fields
          transformedData[field.name] = {};
          field.subFields?.forEach(subField => {
            transformedData[field.name][subField.name] = 
              comp.data[field.name]?.[subField.name]?.value || '';
          });
        } else {
          // Handle regular fields
          transformedData[field.name] = comp.data[field.name]?.value || field.default || '';
        }
      });

      return {
        id: comp._id,
        type: comp.type,
        name: comp.name,
        data: transformedData,
        fields: fields
      };
    });

    return {
      ...layout,
      components: transformedComponents
    };
  };

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [layoutRes, componentsRes] = await Promise.all([
          getLayout(layoutId),
          getComponents()
        ]);

        if (layoutRes.success && componentsRes.success) {
          setComponentTypes(componentsRes.data);
          const transformedLayout = transformLayoutData(layoutRes.data);
          setLayout(transformedLayout);
          
          // Initialize form with transformed data
          form.setFieldsValue({
            name: transformedLayout.name,
            components: transformedLayout.components.map(comp => ({
              id: comp.id,
              type: comp.type,
              name: comp.name,
              data: comp.data
            }))
          });
          
          setSelectedComponents(transformedLayout.components);
          
          // Load draft if exists
          const savedDraft = localStorage.getItem(`draft_${layoutId}`);
          if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            if (draft.timestamp > transformedLayout.updatedAt) {
              form.setFieldsValue(draft.data);
              setDraftData(draft);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load layout data');
      }
    };

    if (layoutId) {
      fetchData();
    }
  }, [layoutId, form]);

  // Auto-save setup
  useEffect(() => {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    const interval = setInterval(() => {
      if (form.isFieldsTouched()) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    setAutoSaveInterval(interval);
    return () => clearInterval(interval);
  }, [form]);

  // Auto-save handler
  const handleAutoSave = async () => {
    try {
      const values = form.getFieldsValue();
      const draft = {
        data: values,
        timestamp: new Date().toISOString(),
        version: versionHistory.length + 1
      };
      
      // Save to localStorage
      localStorage.setItem(`draft_${layoutId}`, JSON.stringify(draft));
      setDraftData(draft);
      
      // Add to version history
      setVersionHistory(prev => [...prev, draft]);
      
      toast.info('Draft saved automatically');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Save handler with validation and error recovery
  const handleSave = async (values, isPublish = false) => {
    try {
      setIsSaving(true);
      
      // Validate form
      await form.validateFields();
      
      // Transform data for server
      const transformedData = transformDataForServer(values);
      
      // Create save point
      const savePoint = {
        data: transformedData,
        timestamp: new Date().toISOString(),
        version: versionHistory.length + 1
      };
      
      // Optimistic update
      setLastSaved(savePoint);
      
      // Save to server
      const response = layoutId 
        ? await updateLayout(layoutId, transformedData)
        : await createLayout(transformedData);
      
      if (response.success) {
        // Clear draft
        localStorage.removeItem(`draft_${layoutId}`);
        setDraftData(null);
        
        // Add to version history
        setVersionHistory(prev => [...prev, savePoint]);
        
        // Show success message
        toast.success(isPublish ? 'Content published successfully' : 'Content saved successfully');
        
        // Navigate if needed
        if (isPublish) {
          navigate('/dashboard/content');
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      
      // Error recovery
      if (lastSaved) {
        form.setFieldsValue(lastSaved.data);
        toast.warning('Recovered last saved version');
      }
      
      toast.error(error.response?.data?.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  // Data transformation helper
  const transformDataForServer = (values) => {
    return {
      ...values,
      components: values.components.map(comp => ({
        ...comp,
        data: transformComponentData(comp.data)
      }))
    };
  };

  return {
    form,
    isSaving,
    lastSaved,
    draftData,
    versionHistory,
    handleSave,
    handleAutoSave
  };
};

/**
 * ContentForm
 * Form for creating and editing content layouts with dynamic fields and components.
 * @component
 * @param {object} props
 * @param {string} [props.layoutId] - The layout ID to edit (if any).
 * @returns {JSX.Element}
 */
const ContentForm = ({ layoutId }) => {
  const navigate = useNavigate();
  const {
    form,
    isSaving,
    lastSaved,
    draftData,
    versionHistory,
    handleSave,
    handleAutoSave
  } = useContentManager(layoutId);

  // Handle form submission
  const onFinish = async (values) => {
    await handleSave(values);
  };

  // Handle publish
  const handlePublish = async () => {
    const values = form.getFieldsValue();
    await handleSave(values, true);
  };

  // Restore draft
  const restoreDraft = () => {
    if (draftData) {
      form.setFieldsValue(draftData.data);
      toast.success('Draft restored');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header with save status */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {layoutId ? 'Edit Layout' : 'Create New Layout'}
            </h1>
            <div className="flex items-center space-x-4">
              {draftData && (
                <Button onClick={restoreDraft}>
                  Restore Draft
                </Button>
              )}
              <Button onClick={handlePublish} type="primary">
                Publish
              </Button>
            </div>
          </div>

          {/* Last saved indicator */}
          {lastSaved && (
            <div className="mb-4 text-sm text-gray-500">
              Last saved: {new Date(lastSaved.timestamp).toLocaleString()}
            </div>
          )}

          {/* Form content */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: '',
              components: []
            }}
          >
            <Form.Item
              name="name"
              label="Layout Name"
              rules={[{ required: true, message: 'Please enter layout name' }]}
            >
              <Input placeholder="Enter layout name" />
            </Form.Item>

            <Form.List name="components">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }) => {
                    const component = selectedComponents[name];
                    return (
                      <Card key={key} className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="Component Type"
                            rules={[{ required: true, message: 'Please select a component type' }]}
                          >
                            <Select
                              placeholder="Select a component"
                              onChange={(value) => {
                                // This function is no longer needed as DynamicField handles its own onChange
                              }}
                            >
                              {Object.keys(componentTypes).map(type => (
                                <Option key={type} value={type}>
                                  {type}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            onClick={() => {
                              remove(name);
                              setSelectedComponents(prev => {
                                const newState = [...prev];
                                newState.splice(name, 1);
                                return newState;
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        {component?.fields?.map((field) => (
                          <DynamicField
                            key={field.name}
                            field={field}
                            value={form.getFieldValue(['components', name, 'data', field.name])}
                            onChange={(value) => {
                              form.setFieldsValue({
                                components: {
                                  [name]: {
                                    ...form.getFieldValue(['components', name]),
                                    data: {
                                      ...form.getFieldValue(['components', name, 'data']),
                                      [field.name]: value
                                    }
                                  }
                                }
                              });
                            }}
                            name={name}
                          />
                        ))}
                      </Card>
                    );
                  })}
                  <Button type="dashed" onClick={() => add()} block>
                    Add Component
                  </Button>
                </div>
              )}
            </Form.List>

            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => navigate('/dashboard/content')}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSaving}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContentForm;

/* ========================================================================
 * End of file: ContentForm.jsx
 * ======================================================================== */ 