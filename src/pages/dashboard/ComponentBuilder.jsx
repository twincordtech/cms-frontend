/* ========================================================================
 * File: ComponentBuilder.jsx
 * Description: Builder page for creating and editing dynamic components with custom fields.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Card, Form, message, Spin, Select, Typography, Radio, Checkbox, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { createComponent, getComponents, updateComponent, deleteComponent } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../../components/global/DeleteConfirmModal';
import { FaThLarge } from 'react-icons/fa';
import FieldTypeSelector from './components/ComponentBuilder/FieldTypeSelector';
import SelectFieldForm from './components/ComponentBuilder/SelectFieldForm';
import ArrayFieldForm from './components/ComponentBuilder/ArrayFieldForm';

const FIELD_TYPES = [
  {
    type: 'text',
    icon: '📝',
    label: 'Text Field',
    description: 'Single line text input',
    fieldType: 'text',
    isList: false
  },
  {
    type: 'textarea',
    icon: '📄',
    label: 'Text Area',
    description: 'Multi-line text input',
    fieldType: 'textarea',
    isList: false
  },
  {
    type: 'richText',
    icon: '📑',
    label: 'Rich Text',
    description: 'Rich text editor with formatting',
    fieldType: 'richText',
    isList: false
  },
  {
    type: 'number',
    icon: '🔢',
    label: 'Number',
    description: 'Numeric input field',
    fieldType: 'number',
    isList: false
  },
  {
    type: 'image',
    icon: '🖼️',
    label: 'Image',
    description: 'Image upload field',
    fieldType: 'image',
    isList: false
  },
  {
    type: 'boolean',
    icon: '✅',
    label: 'Boolean',
    description: 'True/False toggle',
    fieldType: 'boolean',
    isList: false
  },
  {
    type: 'date',
    icon: '📅',
    label: 'Date',
    description: 'Date picker',
    fieldType: 'date',
    isList: false
  },
  {
    type: 'select',
    icon: '📋',
    label: 'Select',
    description: 'Dropdown selection with options',
    fieldType: 'select',
    isList: false
  },
  {
    type: 'array',
    icon: '📚',
    label: 'Array',
    description: 'List of items with multiple fields',
    fieldType: 'array',
    isList: true
  },
  {
    type: 'object',
    icon: '📦',
    label: 'Object',
    description: 'Nested object with fields',
    fieldType: 'object',
    isList: true
  }
];

/**
 * ComponentBuilder
 * Main builder page for creating and editing dynamic components with custom fields.
 * Handles field management, repeatable groups, and component CRUD.
 * @component
 * @param {object} props
 * @param {object} [props.componentToEdit] - The component to edit (if any).
 * @param {function} [props.onClose] - Callback to close the builder.
 * @returns {JSX.Element}
 */
const ComponentBuilder = ({ componentToEdit, onClose = () => {} }) => {
  const [componentName, setComponentName] = useState(componentToEdit?.name || '');
  const [fields, setFields] = useState(componentToEdit?.fields || []);
  const [showFieldTypeSelector, setShowFieldTypeSelector] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showArrayFieldModal, setShowArrayFieldModal] = useState(false);
  const [showSelectFieldModal, setShowSelectFieldModal] = useState(false);
  const [selectedFieldType, setSelectedFieldType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteFieldIndex, setDeleteFieldIndex] = useState(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [componentType, setComponentType] = useState(componentToEdit?.fieldType || null);
  const [existingComponents, setExistingComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [showConfirmSelection, setShowConfirmSelection] = useState(false);
  const [selectedComponentData, setSelectedComponentData] = useState(null);
  const [showDeleteComponentModal, setShowDeleteComponentModal] = useState(false);
  const [isRepeatable, setIsRepeatable] = useState(false);
  const [showRepeatableModal, setShowRepeatableModal] = useState(false);
  const [selectedFieldsForRepeat, setSelectedFieldsForRepeat] = useState([]);
  const [isRepeatableEnabled, setIsRepeatableEnabled] = useState(false);
  const [repeatGroupName, setRepeatGroupName] = useState('list');

  /**
   * Clear all modals and reset state
   */
  const clearAllModals = () => {
    setShowTypeModal(false);
    setShowFieldTypeSelector(false);
    setShowArrayFieldModal(false);
    setShowSelectFieldModal(false);
    setShowFieldModal(false);
    setShowPreviewModal(false);
    setShowRepeatableModal(false);
    setShowConfirmSelection(false);
    setShowDeleteComponentModal(false);
    setShowCancelConfirm(false);
    setSelectedFieldType(null);
    setEditingFieldIndex(null);
    setIsRepeatable(false);
  };

  /**
   * Reset repeatable group states
   */
  const resetRepeatableGroupStates = () => {
    setShowRepeatableModal(false);
    setSelectedFieldsForRepeat([]);
    setIsRepeatableEnabled(false);
    setRepeatGroupName('list');
  };

  useEffect(() => {
    if (componentType === 'existing') {
      fetchExistingComponents();
    }
  }, [componentType]);

  const fetchExistingComponents = async () => {
    try {
      setLoadingComponents(true);
      const response = await getComponents();
      setExistingComponents(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching components:', error);
      message.error('Failed to fetch existing components');
    } finally {
      setLoadingComponents(false);
    }
  };

  const handleComponentSelect = (component) => {
    setSelectedComponentData(component);
    setShowConfirmSelection(true);
  };

  const handleTypeSelect = (type) => {
    setComponentType(type);
    if (type === 'new') {
      setShowTypeModal(false);
      setShowFieldTypeSelector(true);
    }
  };

  const handleAddField = (fieldType) => {
    setSelectedFieldType(fieldType);
    setShowFieldTypeSelector(false);
    
    if (fieldType.type === 'array') {
      setShowArrayFieldModal(true);
    } else if (fieldType.type === 'select') {
      setShowSelectFieldModal(true);
    } else {
      setShowFieldModal(true);
    }
  };

  const prepareFieldData = (field) => {
    const preparedField = {
      name: field.name,
      type: field.type,
      description: field.description || '',
      required: field.required || false,
      allowedTags: [],
      allowedTypes: [],
      options: field.type === 'select' ? (field.options || []) : [],
      subFields: []
    };

    // Handle nested fields for array and object types
    if ((field.type === 'array' || field.type === 'object') && Array.isArray(field.subFields)) {
      preparedField.subFields = field.subFields.map(subField => prepareFieldData(subField));
    }

    return preparedField;
  };

  const prepareComponentData = () => {
    try {
      if (!componentName.trim()) {
        throw new Error('Component name is required');
      }

      if (!fields || fields.length === 0) {
        throw new Error('At least one field is required');
      }

      // Process fields to ensure proper structure
      const processedFields = fields.map(field => prepareFieldData(field));

      // Get the field type from the first field
      const fieldType = fields[0]?.type || 'text';

      // Prepare the final data structure
      const componentData = {
        name: componentName.trim(),
        fieldType,
        fields: processedFields,
        isActive: true
      };

      return componentData;
    } catch (error) {
      console.error('Error preparing component data:', error);
      throw error;
    }
  };

  const handlePreviewSubmit = () => {
    try {
      if (!componentName.trim()) {
        message.error('Please enter a component name');
        return;
      }

      if (fields.length === 0) {
        message.error('Please add at least one field');
      return;
    }

      // Validate field names are unique
      const fieldNames = fields.map(f => f.name);
      if (new Set(fieldNames).size !== fieldNames.length) {
        message.error('Field names must be unique');
      return;
    }

      const componentData = prepareComponentData();
      console.log('Preview data:', componentData); // Debug log
      setPreviewData(componentData);
      setSubmissionData(componentData); // Store for submission
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error in preview:', error);
      message.error('Failed to prepare preview: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setSubmissionError(null);

      const componentData = submissionData || prepareComponentData();
      console.log('Submitting component data:', componentData);

      let response;
      if (componentToEdit) {
        // Update existing component
        response = await updateComponent(componentToEdit._id, componentData);
        if (response.data.success) {
          message.success('Component updated successfully');
          clearAllModals();
          if (typeof onClose === 'function') {
            onClose();
          } else {
            navigate('/dashboard/components');
          }
        } else {
          throw new Error(response.data.message || 'Failed to update component');
        }
      } else {
        // Create new component
        response = await createComponent(componentData);
        if (response.data.success) {
          message.success('Component created successfully');
          clearAllModals();
          if (typeof onClose === 'function') {
            onClose();
          } else {
            navigate('/dashboard/components');
          }
        } else {
          throw new Error(response.data.message || 'Failed to create component');
        }
      }
    } catch (error) {
      console.error('Error creating/updating component:', error);
      setSubmissionError(error.message);
      message.error(error.response?.data?.message || error.message || 'Failed to create/update component');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSubmit = (values) => {
    const newField = {
      name: values.name.trim(),
      type: values.fieldType,
      fieldType: values.fieldType,
      required: values.required === true,
      description: values.description?.trim() || '',
      repeatable: isRepeatable
    };

    if (editingFieldIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = newField;
      setFields(updatedFields);
      setEditingFieldIndex(null);
    } else {
      setFields([...fields, newField]);
    }

    setShowFieldModal(false);
    setSelectedFieldType(null);
    setIsRepeatable(false);
  };

  const handleArrayFieldSubmit = (values) => {
    const processArrayField = (field) => {
      return {
        ...field,
        subFields: field.subFields?.map(subField => ({
          name: subField.name,
          type: subField.type,
          required: subField.required || false,
          description: subField.description || '',
          options: subField.type === 'select' ? (subField.options || []) : undefined,
          subFields: subField.type === 'array' || subField.type === 'object' 
            ? (subField.subFields || []).map(sf => processArrayField(sf))
            : []
        })) || []
      };
    };

    const newField = {
      name: values.name.trim(),
      type: 'array',
      required: values.required === true,
      description: values.description?.trim() || '',
      subFields: values.subFields?.map(subField => processArrayField(subField)) || []
    };

    if (editingFieldIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = newField;
      setFields(updatedFields);
      setEditingFieldIndex(null);
    } else {
      setFields([...fields, newField]);
    }

    setShowArrayFieldModal(false);
    setSelectedFieldType(null);
  };

  const handleSelectFieldSubmit = (values) => {
    const newField = {
      name: values.name.trim(),
      type: 'select',
      required: values.required === true,
      description: values.description?.trim() || '',
      options: values.options.map(option => ({
        label: option.label.trim(),
        value: option.value.trim()
      }))
    };

    if (editingFieldIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingFieldIndex] = newField;
      setFields(updatedFields);
      setEditingFieldIndex(null);
    } else {
      setFields([...fields, newField]);
    }

    // Reset form and close modal
    setShowSelectFieldModal(false);
    // Reset selectedFieldType after adding field
    setSelectedFieldType(null);
  };

  // Add this new function to handle modal closing
  const handleModalClose = (modalType) => {
    switch (modalType) {
      case 'field':
        setShowFieldModal(false);
        break;
      case 'array':
        setShowArrayFieldModal(false);
        break;
      case 'select':
        setShowSelectFieldModal(false);
        break;
      default:
        break;
    }
    setSelectedFieldType(null);
    setEditingFieldIndex(null);
    setIsRepeatable(false);
  };

  const handleEditField = (field, index) => {
    setEditingFieldIndex(index);
    setIsRepeatable(!!field.repeatable);
    
    // Determine which modal to open based on field type
    if (field.type === 'array') {
      setSelectedFieldType({ type: 'array', fieldType: 'array' });
      setShowArrayFieldModal(true);
    } else if (field.type === 'select') {
      setSelectedFieldType({ type: 'select', fieldType: 'select' });
      setShowSelectFieldModal(true);
    } else {
      setSelectedFieldType({ type: field.type, fieldType: field.type });
      setShowFieldModal(true);
    }
  };

  // Add function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return componentName.trim() !== '' || fields.length > 0;
  };

  // Add function to handle cancel click
  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setShowCancelConfirm(true);
    } else {
      handleConfirmedCancel();
    }
  };

  // Add function to handle confirmed navigation
  const handleConfirmedCancel = () => {
    clearAllModals();
    
    if (typeof onClose === 'function') {
      console.log('onClose function exists');
      onClose();
    } else {
      console.log('onClose function does not exist');
      navigate('/dashboard/components');
    }
  };

  const handleConfirmComponentSelection = () => {
    if (selectedComponentData) {
      // Add new fields while preserving existing ones
      const newFields = selectedComponentData.fields.map(field => ({
        ...field,
        id: Math.random().toString(36).substr(2, 9),
        sourceComponent: selectedComponentData.name // Track where the field came from
      }));
      
      setFields(prevFields => [...prevFields, ...newFields]);
      
      // Only update component name if it's not set yet
      if (!componentName) {
        setComponentName(selectedComponentData.name + ' (Copy)');
      }
      
      setShowConfirmSelection(false);
      setShowTypeModal(false);
      setSelectedComponentData(null);
      
      // Show success message
      message.success(`Added ${newFields.length} fields from ${selectedComponentData.name}`);
    }
  };

  const getComponentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'banner':
        return <FaThLarge className="text-red-500 text-2xl" />;
      case 'about':
        return <FaThLarge className="text-blue-500 text-2xl" />;
      case 'testimonials':
        return <FaThLarge className="text-purple-500 text-2xl" />;
      case 'team':
        return <FaThLarge className="text-indigo-500 text-2xl" />;
      case 'services':
        return <FaThLarge className="text-green-500 text-2xl" />;
      case 'gallery':
        return <FaThLarge className="text-yellow-500 text-2xl" />;
      case 'pricing':
        return <FaThLarge className="text-emerald-500 text-2xl" />;
      case 'tabs':
        return <FaThLarge className="text-orange-500 text-2xl" />;
      default:
        return null;
    }
  };

  // Component Selection Confirmation Modal
  const renderConfirmSelectionModal = () => (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="text-2xl">📋</div>
            <div>
            <h3 className="text-xl font-medium">Add Fields from {selectedComponentData?.name}</h3>
          </div>
        </div>
      }
      open={showConfirmSelection}
      onCancel={() => {
        setShowConfirmSelection(false);
        setSelectedComponentData(null);
      }}
      footer={[
                <Button
          key="back" 
          onClick={() => {
            setShowConfirmSelection(false);
            setSelectedComponentData(null);
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleConfirmComponentSelection}
        >
          Add Fields
                </Button>
      ]}
      width={600}
    >
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedComponentData?.fields?.length || 0} fields will be added to your component
            </p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {fields.length} existing fields
            </span>
              </div>

          {selectedComponentData?.fields?.length > 0 && (
            <div className="border border-gray-200 rounded-lg bg-white">
              <div className="px-4 py-2 border-b border-gray-200">
                <h4 className="font-medium">Fields to be added:</h4>
              </div>
              <ul className="divide-y divide-gray-200">
                {selectedComponentData.fields.map((field, index) => (
                  <li key={index} className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{field.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                    </div>
                    {field.required && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These fields will be added to your existing fields. You can modify or remove them after adding.
          </p>
        </div>
      </div>
    </Modal>
  );

  // Update the type selection modal
  const renderTypeSelectionModal = () => (
    <Modal
      title="Select Field Type"
      open={showTypeModal}
      onCancel={() => setShowTypeModal(false)}
      footer={null}
      closable={true}
      maskClosable={false}
      backdrop
      width={950}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div 
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-500 ${
              componentType === 'new' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'
            }`}
            onClick={() => handleTypeSelect('new')}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <div className="text-3xl">🆕</div>
                <div className="absolute -top-2 -right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">NEW</span>
                </div>
              </div>
              <h3 className="text-lg font-medium">Create New Field</h3>
              <p className="text-sm text-gray-500">
                Add a new custom field from scratch
              </p>
            </div>
          </div>

          <div 
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-500 ${
              componentType === 'existing' ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'
            }`}
            onClick={() => handleTypeSelect('existing')}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="text-3xl">📋</div>
              <h3 className="text-lg font-medium">Use Existing Component</h3>
              <p className="text-sm text-gray-500">
                Copy all fields from an existing component
              </p>
            </div>
          </div>
        </div>

        {componentType === 'existing' && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-medium">Select Component</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingComponents.map((component) => (
                <div
                  key={component._id}
                  className={`group relative p-6 rounded-lg border cursor-pointer transition-all hover:border-blue-500 ${
                    selectedComponentData?._id === component._id 
                      ? 'border-blue-500 bg-blue-50/10' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleComponentSelect(component)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                      {getComponentIcon(component.name)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{component.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {component.fields?.length || 0} fields
                      </p>
                    </div>
                    {component.isPredefined && (
                      <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Predefined
                      </span>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      Fields: {component.fields?.map(f => f.name).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );

  // Update the field display to show source
  const renderField = (field, index) => (
                  <motion.div
      key={field.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{field.name}</h3>
            {field.sourceComponent && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                From: {field.sourceComponent}
              </span>
            )}
            {field.repeatable && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">
                Repeatable
              </span>
            )}
          </div>
                        <p className="text-sm text-gray-600">
                          Type: {field.type}
                          {field.required && ' • Required'}
                        </p>
                        {field.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {field.description}
                          </p>
                        )}
                        {field.type === 'select' && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Options:</p>
                            <ul className="list-disc list-inside text-sm text-gray-500">
                              {field.options.map((option, i) => (
                                <li key={i}>{option.label}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {field.type === 'array' && field.subFields && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">Sub-fields:</p>
                            <ul className="list-disc list-inside text-sm text-gray-500">
                              {field.subFields.map((subField, i) => (
                                <li key={i}>
                                  {subField.name} ({subField.type})
                                  {subField.type === 'select' && subField.options && subField.options.length > 0 && (
                                    <div className="ml-4 mt-1">
                                      <span className="text-xs text-gray-400">Options: </span>
                                      <span className="text-xs text-gray-500">
                                        {subField.options.map(opt => opt.label).join(', ')}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditField(field, index)}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setDeleteFieldIndex(index)}
                        />
                      </div>
                    </div>
                  </motion.div>
  );

  // Add new function to handle field selection for repeatable group
  const handleFieldSelectionForRepeat = (fieldIndex) => {
    setSelectedFieldsForRepeat(prev => {
      if (prev.includes(fieldIndex)) {
        return prev.filter(index => index !== fieldIndex);
      }
      return [...prev, fieldIndex];
    });
  };

  // Update createRepeatableGroup to use the group name
  const createRepeatableGroup = () => {
    if (selectedFieldsForRepeat.length < 2) {
      message.warning('Please select at least 2 fields to create a repeatable group');
      return;
    }
    const selectedFields = selectedFieldsForRepeat.map(index => fields[index]);
    const groupName = repeatGroupName.trim() || 'list';
    // Create new array field with selected fields as subFields
    const newArrayField = {
      name: groupName,
      type: 'array',
      description: `Repeatable group: ${groupName}`,
      subFields: selectedFields.map(field => ({
        ...field,
        // Use only the original field name
        name: field.name
      }))
    };
    // Remove original fields and add the new array field
    const updatedFields = fields.filter((_, index) => !selectedFieldsForRepeat.includes(index));
    setFields([...updatedFields, newArrayField]);
    // Reset repeatable group states
    resetRepeatableGroupStates();
  };

  // Move RepeatableFieldsModal outside of any render function
  const RepeatableFieldsModal = ({
    visible,
    onCancel,
    onOk,
    groupName,
    setGroupName,
    fields,
    selectedFieldsForRepeat,
    handleFieldSelectionForRepeat
  }) => (
    <Modal
      title="Select Fields for Repeatable Group"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Create Repeatable Group"
      width={600}
      maskClosable={false}
      destroyOnClose={false}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Select the fields you want users to be able to add multiple entries for. <br/>
          These fields will be grouped together as a repeatable section.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
          <Input
            placeholder="Enter a simple name for this group (e.g. list, items, blocks)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            maxLength={32}
          />
          <div className="text-xs text-gray-500 mt-1">This will be the key for the repeatable array in your data.</div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {fields.map((field, index) => (
            <div 
              key={index}
              className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all ${
                selectedFieldsForRepeat.includes(index)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleFieldSelectionForRepeat(index)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{field.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                </div>
                <Checkbox checked={selectedFieldsForRepeat.includes(index)} readOnly />
              </div>
              {field.description && (
                <p className="text-sm text-gray-500 mt-1">{field.description}</p>
              )}
            </div>
          ))}
        </div>
        {selectedFieldsForRepeat.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected {selectedFieldsForRepeat.length} field{selectedFieldsForRepeat.length > 1 ? 's' : ''} for repeatable group
            </p>
          </div>
        )}
      </div>
    </Modal>
  );

  // Update the fields section to include the repeatable toggle
  const renderFieldsSection = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fields
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {fields.length} fields total
          </p>
        </div>
        <div className="flex space-x-4">
          <Switch
            checked={isRepeatableEnabled}
            onChange={checked => {
              setIsRepeatableEnabled(checked);
              if (checked) {
                setShowRepeatableModal(true);
              }
            }}
            checkedChildren="Repeatable Mode"
            unCheckedChildren="Normal Mode"
          />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setShowTypeModal(true)}
          >
            Add Field
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => renderField(field, index))}

        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500">No fields added yet</p>
            <Button
              type="link"
              onClick={() => setShowTypeModal(true)}
            >
              Add your first field
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const handleDeleteComponent = async () => {
    if (!componentToEdit) return;
    try {
      setLoading(true);
      const response = await deleteComponent(componentToEdit._id || componentToEdit.name);
      if (response.data.success) {
        message.success('Component deleted successfully');
        clearAllModals();
        navigate('/dashboard/components');
      } else {
        throw new Error(response.data.message || 'Failed to delete component');
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message || 'Failed to delete component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-full max-h-[80vh] overflow-y-auto mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">

          <div className="space-y-8">
          <div className="sticky top-0 bg-white p-4 rounded-t-2xl" style={{ zIndex: 1000 }}>
          <h1 className="text-3xl font-extrabold mb-8 text-blue-700 flex items-center gap-2">
              <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-lg mr-2">+</span>
              {componentToEdit ? 'Edit Component' : 'Create New Component'}
            </h1>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Component Name
                </label>
                <Input
                  placeholder="Enter component name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className="max-w-md rounded-lg border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  disabled={componentToEdit}
                  size="large"
                />
              </div>
          </div>
            {renderFieldsSection()}
            <div className="flex justify-end space-x-4 pt-6 sticky bottom-0 bg-white p-4 rounded-b-2xl" style={{ zIndex: 1000 }}>
              <Button onClick={handleCancelClick} className="rounded-lg px-6 py-2">
                Cancel
              </Button>
              <Button
                type="default"
                onClick={handlePreviewSubmit}
                disabled={!componentName.trim() || fields.length === 0}
                className="rounded-lg px-6 py-2 border-blue-200 hover:border-blue-400"
              >
                Preview Data
              </Button>

              <Button 
                type="primary" 
                onClick={handleSubmit}
                loading={loading}
                disabled={!componentName.trim() || fields.length === 0}
                className="rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                {componentToEdit ? 'Update Component' : 'Create Component'}
              </Button>
            </div>
          </div>
        </div>
      </div>

        {showTypeModal && renderTypeSelectionModal()}
        {showConfirmSelection && renderConfirmSelectionModal()}

      <FieldTypeSelector
        visible={showFieldTypeSelector}
        onClose={() => setShowFieldTypeSelector(false)}
        onSelect={handleAddField}
        FIELD_TYPES={FIELD_TYPES}
      />

      <Modal
        title={editingFieldIndex !== null ? "Edit Field" : "Add Field"}
        open={showFieldModal}
        onCancel={() => handleModalClose('field')}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          layout="vertical"
          onFinish={handleFieldSubmit}
          initialValues={
            editingFieldIndex !== null 
              ? {
                  name: fields[editingFieldIndex].name,
                  // description: fields[editingFieldIndex].description, // Remove from modal UI
                  fieldType: fields[editingFieldIndex].type,
                  required: fields[editingFieldIndex].required
                }
              : {
                  fieldType: selectedFieldType?.fieldType
                }
          }
          preserve={false}
        >
          <Form.Item
            name="name"
            label="Field Name"
            rules={[{ required: true, message: 'Please enter field name' }]}
          >
            <Input placeholder="Enter field name" />
          </Form.Item>

          {/* Description field is now optional and removed from modal UI after field type selection */}

          <Form.Item
            name="fieldType"
            label="Field Type"
            rules={[{ required: true, message: 'Please select field type' }]}
            initialValue={selectedFieldType?.fieldType}
          >
            <Select placeholder="Select field type">
              {FIELD_TYPES.filter(type => !type.isList).map(type => (
                <Select.Option key={type.type} value={type.fieldType}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="required"
            valuePropName="checked"
          >
            <Select>
              <Select.Option value={true}>Required</Select.Option>
              <Select.Option value={false}>Optional</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFieldIndex !== null ? "Update Field" : "Add Field"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <DeleteConfirmModal
        isOpen={deleteFieldIndex !== null}
        onClose={() => setDeleteFieldIndex(null)}
        onConfirm={() => {
          const updatedFields = fields.filter((_, index) => index !== deleteFieldIndex);
          setFields(updatedFields);
          setDeleteFieldIndex(null);
        }}
        title="Delete Field"
        message="Are you sure you want to delete this field? This action cannot be undone."
      />

      <Modal
        title="Component Data Preview"
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowPreviewModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (!previewData?.fields || previewData.fields.length === 0) {
                message.error('No fields found in preview data');
                return;
              }
              setShowPreviewModal(false);
              handleSubmit();
            }}
            loading={loading}
          >
            Confirm & Create
          </Button>
        ]}
        width={800}
        className="preview-modal max-h-[80vh] overflow-y-auto"
      >
        <div className="space-y-4">
          <div>
            {/* <Typography.Title level={5}>Component Data to be Submitted:</Typography.Title> */}
            <div className="bg-gray-900 rounded-lg p-4 mt-2">
              <pre className="text-gray-100 overflow-auto max-h-[380px] whitespace-pre-wrap">
                {previewData ? JSON.stringify(previewData, null, 2) : 'No data to preview'}
              </pre>
            </div>
          </div>
          
          {submissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Typography.Text type="danger">
                <strong>Error:</strong> {submissionError}
              </Typography.Text>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography.Text type="secondary">
              <div className="text-blue-800">
                <strong>Debug Information:</strong>
                <ul className="list-disc list-inside mt-2">
                  <li>Component name: <code>{componentName}</code></li>
                  <li>Number of fields: <code>{fields.length}</code></li>
                  <li>Fields structure valid: <code>{Array.isArray(fields) ? 'Yes' : 'No'}</code></li>
                  <li>Data ready for submission: <code>{Boolean(previewData?.fields?.length) ? 'Yes' : 'No'}</code></li>
                </ul>
              </div>
            </Typography.Text>
          </div>
        </div>
      </Modal>

      <ArrayFieldForm
        visible={showArrayFieldModal}
        onCancel={() => handleModalClose('array')}
        onSubmit={handleArrayFieldSubmit}
        initialValues={
          editingFieldIndex !== null && fields[editingFieldIndex].type === 'array'
            ? {
                name: fields[editingFieldIndex].name,
                description: fields[editingFieldIndex].description,
                required: fields[editingFieldIndex].required,
                subFields: fields[editingFieldIndex].subFields
              }
            : undefined
        }
        FIELD_TYPES={FIELD_TYPES}
      />

      <SelectFieldForm
        visible={showSelectFieldModal}
        onCancel={() => handleModalClose('select')}
        onSubmit={handleSelectFieldSubmit}
        initialValues={
          editingFieldIndex !== null && fields[editingFieldIndex].type === 'select'
            ? {
                name: fields[editingFieldIndex].name,
                description: fields[editingFieldIndex].description,
                required: fields[editingFieldIndex].required,
                options: fields[editingFieldIndex].options
              }
            : undefined
        }
      />

      <Modal
        title="Confirm Cancel"
        open={showCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setShowCancelConfirm(false)}>
            Continue Editing
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger
            onClick={handleConfirmedCancel}
          >
            Discard Changes
          </Button>,
        ]}
      >
        <div className="py-4">
          <p className="text-gray-600">
            You have unsaved changes. Are you sure you want to cancel? All your changes will be lost.
          </p>
          {componentName && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">
                <strong>Component Name:</strong> {componentName}
              </p>
            </div>
          )}
          {fields.length > 0 && (
            <div className="mt-2 bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">
                <strong>Fields Added:</strong> {fields.length}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {componentToEdit && (
        <Modal
          title="Delete Component"
          open={showDeleteComponentModal}
          onCancel={() => setShowDeleteComponentModal(false)}
          onOk={handleDeleteComponent}
          okText="Delete"
          okButtonProps={{ danger: true, loading }}
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this component? This action cannot be undone.</p>
        </Modal>
      )}

      <RepeatableFieldsModal
        visible={showRepeatableModal}
        onCancel={resetRepeatableGroupStates}
        onOk={createRepeatableGroup}
        groupName={repeatGroupName}
        setGroupName={setRepeatGroupName}
        fields={fields}
        selectedFieldsForRepeat={selectedFieldsForRepeat}
        handleFieldSelectionForRepeat={handleFieldSelectionForRepeat}
      />
    </div>
    
  );
};

export default ComponentBuilder; 

/* ========================================================================
 * End of file: ComponentBuilder.jsx
 * ======================================================================== */ 