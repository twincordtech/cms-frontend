/* ========================================================================
 * File: LayoutForm.jsx
 * Description: Production-quality form for creating and editing layout configurations, using shared ArrayFieldRenderer for array/list fields with single-panel open UX.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, message, Space, Switch, Modal, Tabs } from 'antd';
import { createLayout, updateLayout, getComponentTypes, cmsApi, getLayouts } from '../../services/api';
import LayoutSelector from './LayoutSelector';
import { EyeOutlined, CodeOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import ArrayFieldRenderer from '../layout/ArrayFieldRenderer';

/**
 * LayoutForm - Form component for creating and editing layouts
 * Uses shared ArrayFieldRenderer for array/list fields (single-panel open UX)
 * @param {Object} props - Component props
 * @param {Object} props.layout - Existing layout data for editing
 * @param {Function} props.onSuccess - Callback function called on successful save
 * @returns {JSX.Element} Layout form component
 */
const LayoutForm = ({ layout, onSuccess }) => {
  const [form] = Form.useForm();
  const [pages, setPages] = useState([]);
  const [componentTypes, setComponentTypes] = useState({});
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewComponent, setPreviewComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [existingPageLayout, setExistingPageLayout] = useState(null);
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);
  const [existingComponentData, setExistingComponentData] = useState({});

  /**
   * Initialize form data when layout prop changes
   */
  useEffect(() => {
    const initializeForm = async () => {
      await fetchPages();
      await fetchComponentTypes();
      
      if (layout) {
        form.setFieldsValue({
          name: layout.name,
          isActive: layout.isActive
        });
        setSelectedPage(layout.page);
        setSelectedComponents(layout.components?.map(c => c.type) || []);
      } else {
        form.resetFields();
        setSelectedPage(null);
        setSelectedComponents([]);
        setExistingPageLayout(null);
        setIsSelectionDisabled(false);
      }
    };

    initializeForm();
  }, [layout, form]);

  /**
   * Fetch available pages from API
   */
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await cmsApi.getAdminPages();
      if (response.data.success) {
        setPages(response.data.data || []);
      } else {
        message.error('Failed to fetch pages: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      message.error('Failed to fetch pages: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch component types from API
   */
  const fetchComponentTypes = async () => {
    try {
      const response = await getComponentTypes();
      if (response.data.success) {
        setComponentTypes(response.data.data);
      } else {
        message.error('Failed to fetch component types: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching component types:', error);
      message.error('Failed to fetch component types: ' + (error.response?.data?.message || error.message));
    }
  };

  /**
   * Fetch existing layout for a specific page
   * 
   * @param {string} pageId - Page ID to fetch layout for
   */
  const fetchExistingLayout = useCallback(async (pageId) => {
    try {
      setLoading(true);
      const response = await getLayouts();
      
      // Clear existing states
      setExistingPageLayout(null);
      setIsSelectionDisabled(false);
      setSelectedComponents([]);
      setExistingComponentData({});

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const existingLayout = response.data.data.find(layout => layout.page._id === pageId);
        
        if (existingLayout) {
          setExistingPageLayout(existingLayout);
          
          // Auto-select components from existing layout
          const existingComponents = existingLayout.components.map(c => c.type);
          setSelectedComponents(existingComponents);
          setIsSelectionDisabled(true);

          // Generate new name based on existing layout
          const timestamp = new Date().getTime();
          const baseName = existingLayout.name.split('_').slice(0, -1).join('_');
          const newName = `${baseName}_${timestamp}`;
          
          form.setFieldsValue({ 
            name: newName,
            existingLayout: existingLayout._id
          });

          // Store existing component data
          if (existingLayout.components) {
            const componentData = {};
            existingLayout.components.forEach(comp => {
              componentData[comp.type] = {
                ...comp.data,
                fields: comp.fields,
                order: comp.order
              };
            });
            setExistingComponentData(componentData);
          }

          message.success(`Layout found with ${existingComponents.length} components. Auto-selected.`);
        }
      }
    } catch (error) {
      console.error('Error fetching existing layout:', error);
      message.error('Unable to fetch layout information. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  /**
   * Handle component selection
   * 
   * @param {string} componentType - Component type to select/deselect
   */
  const handleComponentSelect = useCallback((componentType) => {
    if (isSelectionDisabled) {
      message.info('Component selection is disabled as this page already has a layout.');
      return;
    }
    
    setSelectedComponents(prev => {
      const isSelected = prev.includes(componentType);
      if (isSelected) {
        return prev.filter(type => type !== componentType);
      } else {
        return [...prev, componentType];
      }
    });
  }, [isSelectionDisabled]);

  /**
   * Handle page selection
   * 
   * @param {Object} page - Selected page object
   */
  const handlePageSelect = useCallback(async (page) => {
    setSelectedPage(page);
    
    if (!page) {
      setSelectedComponents([]);
      form.resetFields(['name']);
      setIsSelectionDisabled(false);
      setExistingPageLayout(null);
    } else if (!layout) {
      await fetchExistingLayout(page._id);
      
      if (!existingPageLayout) {
        const timestamp = new Date().getTime();
        const pageType = page.type || 'standard';
        const prefix = page.isMultiPage ? 'multi' : 'single';
        const sanitizedTitle = page.title.replace(/[^a-zA-Z0-9]/g, '');
        const layoutName = `${prefix}_${pageType}_${sanitizedTitle}_${timestamp}`;
        form.setFieldsValue({ name: layoutName });
      }
    }
  }, [layout, form, fetchExistingLayout, existingPageLayout]);

  /**
   * Handle component preview
   * 
   * @param {Object} component - Component to preview
   */
  const handlePreview = useCallback((component) => {
    setPreviewComponent(component);
  }, []);

  /**
   * Get default data for component type
   * 
   * @param {string} type - Component type
   * @returns {Object} Default data object
   */
  const getDefaultDataForType = useCallback((type) => {
    const componentType = componentTypes[type];
    if (!componentType) return {};

    const defaultData = {};
    componentType.fields.forEach(field => {
      if (field.type === 'array') {
        defaultData[field.name] = [];
      } else {
        defaultData[field.name] = field.default || '';
      }
    });
    return defaultData;
  }, [componentTypes]);

  /**
   * Handle form submission
   * 
   * @param {Object} values - Form values
   */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const layoutData = {
        name: values.name,
        page: selectedPage._id,
        components: selectedComponents.map((type, index) => {
          const existingComponent = layout?.components?.find(c => c.type === type);
          const existingData = existingComponentData[type] || {};
          
          return {
            type,
            name: componentTypes[type]?.name || type,
            order: index,
            data: existingComponent?.data || existingData.data || getDefaultDataForType(type),
            fields: componentTypes[type]?.fields || []
          };
        }),
        isActive: values.isActive
      };

      let response;
      if (layout) {
        response = await updateLayout(layout._id, layoutData);
        if (response?.data?.success) {
          message.success('Layout updated successfully');
          
          // Update existing component data
          const newComponentData = {};
          response.data.data.components.forEach(comp => {
            newComponentData[comp.type] = {
              data: comp.data,
              fields: comp.fields
            };
          });
          setExistingComponentData(newComponentData);
        } else {
          throw new Error(response?.data?.message || 'Failed to update layout');
        }
      } else {
        response = await createLayout(layoutData);
        if (response?.data?.success) {
          message.success('Layout created successfully');
          handleReset();
        } else {
          throw new Error(response?.data?.message || 'Failed to create layout');
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error('Layout operation failed:', error);
      message.error(error.message || 'An unexpected error occurred while saving the layout');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = useCallback(() => {
    form.resetFields();
    setSelectedPage(null);
    setSelectedComponents([]);
    setExistingPageLayout(null);
    setIsSelectionDisabled(false);
    setExistingComponentData({});
  }, [form]);

  /**
   * Handle layout loading from existing layouts
   * 
   * @param {string} layoutName - Layout name to load
   * @param {Array} componentTypes - Component types to load
   */
  const handleLoadLayout = useCallback((layoutName, componentTypes) => {
    form.setFieldsValue({ name: layoutName });
    setSelectedComponents(componentTypes);
    message.success(`Loaded configuration from layout: '${layoutName}'`);
  }, [form]);

  /**
   * Render preview content based on active tab
   * 
   * @returns {JSX.Element} Preview content
   */
  const renderPreviewContent = () => {
    if (!previewComponent) return null;

    switch (activeTab) {
      case 'preview':
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{previewComponent.type}</h3>
              <div className="preview-content">
                <p className="text-gray-600">Preview of {previewComponent.type} component</p>
              </div>
            </div>
          </div>
        );
      case 'fields':
        return (
          <div className="p-6">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
              {JSON.stringify(previewComponent.config, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to render fields, using ArrayFieldRenderer for array/list fields
  const renderField = (field, value, onChange) => {
    if (field.type === 'array') {
      return (
        <ArrayFieldRenderer
          field={field}
          value={value}
          onChange={onChange}
          helpers={{ getUserFriendlyLabel: (name) => name }}
          parentPath={''}
          commonClasses={'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white transition placeholder-gray-400 shadow-sm hover:border-blue-300'}
        />
      );
    }
    // ... render other field types as before ...
    return (
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white transition placeholder-gray-400 shadow-sm hover:border-blue-300'}
        placeholder={`Enter ${field.label || field.name}`}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-0">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true
        }}
        className="space-y-6"
      >
        {/* Layout Name Field */}
        <Form.Item
          name="name"
          label="Layout Name"
          rules={[
            { required: true, message: 'Please enter layout name' },
            { min: 3, message: 'Name must be at least 3 characters' },
            { max: 100, message: 'Name must not exceed 100 characters' }
          ]}
          className="mb-0 p-0"
        >
          <Input 
            placeholder="Enter layout name" 
            maxLength={100}
            showCount
          />
        </Form.Item>

        {/* Layout Selector */}
        <Form.Item
          label=""
          required
          help={existingPageLayout 
            ? `Using existing layout configuration with ${selectedComponents.length} components` 
            : ""}
        >
          <LayoutSelector
            componentTypes={componentTypes}
            selectedComponents={selectedComponents}
            onComponentSelect={handleComponentSelect}
            onPageSelect={handlePageSelect}
            selectedPage={selectedPage}
            onPreview={handlePreview}
            pages={pages}
            onLoadLayout={handleLoadLayout}
            isSelectionDisabled={isSelectionDisabled}
            existingPageLayout={existingPageLayout}
          />
        </Form.Item>

        {/* Conditional Form Fields */}
        {selectedPage && (
          <>
            {/* Existing Layout Notice */}
            {existingPageLayout && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                <p className="font-medium">Using existing layout configuration</p>
                <p className="text-sm mt-1">Components are auto-selected based on the existing layout.</p>
              </div>
            )}

            {/* Status Toggle */}
            <Form.Item
              name="isActive"
              label="Status"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                className="bg-gray-200 dark:bg-gray-700"
              />
            </Form.Item>

            {/* Action Buttons */}
            <Form.Item>
              <Space size="middle">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  {layout ? 'Update Layout' : 'Create Layout'}
                </Button>
                <Button 
                  onClick={handleReset}
                  icon={<ReloadOutlined />}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </>
        )}
      </Form>

      {/* Component Preview Modal */}
      <Modal
        title={`${previewComponent?.type} Component`}
        open={!!previewComponent}
        onCancel={() => setPreviewComponent(null)}
        width={800}
        footer={null}
        className="component-preview-modal"
        destroyOnClose
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'preview',
              label: (
                <span>
                  <EyeOutlined /> Preview
                </span>
              ),
            },
            {
              key: 'fields',
              label: (
                <span>
                  <CodeOutlined /> Fields
                </span>
              ),
            },
          ]}
        />
        {renderPreviewContent()}
      </Modal>
    </div>
  );
};

export default LayoutForm;

/* ========================================================================
 * End of File: LayoutForm.jsx
 * ======================================================================== */