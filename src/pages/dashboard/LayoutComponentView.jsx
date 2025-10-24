/* ========================================================================
 * File: LayoutComponentView.jsx
 * Description: Dashboard page for editing layout components and their fields, with autosave, media, and instance support.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalendar, FaImage, FaTrash, FaSave, FaEye, FaTimes, FaArrowLeft, FaGripVertical, FaPlus } from 'react-icons/fa';
import { MenuOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import { Table, Collapse, Tooltip } from 'antd';
import MediaSelector from '../../components/MediaSelector';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SaveProgressModal from '../../components/ui/SaveProgressModal';
import { updateLayout } from '../../services/api';
import { BASE_URL } from '../../config';
import InstanceSelector from '../../components/InstanceSelector';
import axios from 'axios';
import { Typography, Card, Button, Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, FileTextOutlined, PictureOutlined, UnorderedListOutlined, CalendarOutlined, CheckSquareOutlined, NumberOutlined, EditOutlined } from '@ant-design/icons';
import SidebarComponentList from '../../components/layout/SidebarComponentList';
import ComponentFieldRenderer from '../../components/layout/ComponentFieldRenderer';
import { getUserFriendlyLabel } from '../../utils/layoutHelpers';
import ArrayFieldRenderer from '../../components/layout/ArrayFieldRenderer';
import ImagePreviewModal from '../../components/layout/ImagePreviewModal';
import useLayoutAutoSave from '../../hooks/useLayoutAutoSave';
import FieldIcon from '../../components/layout/FieldIcon';


/**
 * LayoutComponentView Component
 * Dashboard page for editing layout components and their fields, with autosave, media, and instance support.
 * Handles field rendering, autosave, image/media, and navigation.
 * @component
 */
const LayoutComponentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentValues, setComponentValues] = useState({});
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const [saveModalState, setSaveModalState] = useState({
    isOpen: false,
    status: 'saving',
    data: null
  });
  const [currentInstance, setCurrentInstance] = useState(null);
  const [instanceContent, setInstanceContent] = useState({});
  const [orderedComponents, setOrderedComponents] = useState([]);
  const [accordionActiveKeys, setAccordionActiveKeys] = useState({});

  /**
   * Returns the full image URL for a given path or URL.
   * @param {string} url
   * @returns {string}
   */
  const getImageUrl = (url) => {
    console.log('getImageUrl called with:', url, 'BASE_URL:', BASE_URL);
    
    if (!url) {
      console.log('getImageUrl: No URL provided, returning empty string');
      return '';
    }
    if (typeof url !== 'string') {
      console.log('getImageUrl: URL is not a string, returning empty string');
      return '';
    }
    
    // Check if URL is already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('getImageUrl: URL is already absolute, returning as is:', url);
      return url;
    }
    
    // Check if URL starts with a slash
    if (url.startsWith('/')) {
      const fullUrl = `${BASE_URL}${url}`;
      console.log('getImageUrl: URL starts with slash, returning:', fullUrl);
      return fullUrl;
    }
    
    // Add a slash if needed
    const fullUrl = `${BASE_URL}/${url}`;
    console.log('getImageUrl: Adding slash, returning:', fullUrl);
    return fullUrl;
  };

  const commonClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-base bg-gray-50 transition";

  useEffect(() => {
    const layoutData = location.state?.layout;
    console.log('Received Layout Data:', layoutData);
    
    if (layoutData && layoutData.components && Array.isArray(layoutData.components)) {
      console.log('Layout components:', layoutData.components.map(comp => ({
        id: comp._id,
        name: comp.name,
        type: comp.type,
        fieldsCount: comp.fields?.length || 0,
        fields: comp.fields
      })));
      
      // Check if components have fields, if not, fetch them from API
      const componentsWithFields = layoutData.components.filter(comp => comp.fields && comp.fields.length > 0);
      const componentsWithoutFields = layoutData.components.filter(comp => !comp.fields || comp.fields.length === 0);
      
      if (componentsWithoutFields.length > 0) {
        console.log('Components without fields detected, fetching from API...');
        // Fetch the layout again from the API to get complete field data
        fetchLayoutWithFields(layoutData._id);
        return;
      }
      
      setLayout(layoutData);
      
      // Initialize component values with instance data if available
      const initialValues = {};
      layoutData.components.forEach(comp => {
        if (comp._id && comp.fields && Array.isArray(comp.fields)) {
          initialValues[comp._id] = {};
          comp.fields.forEach(field => {
            if (field.name) {
              const instanceValue = currentInstance?.content?.[comp._id]?.[field.name];
              if (field.type === 'array' && field.itemStructure) {
                initialValues[comp._id][field.name] = {
                  value: instanceValue?.value || comp.data?.[field.name]?.value || [],
                  type: field.type,
                  fieldType: field.fieldType || field.type,
                  itemStructure: field.itemStructure
                };
              } else {
                initialValues[comp._id][field.name] = {
                  value: instanceValue?.value || comp.data?.[field.name]?.value || field.default || '',
                  type: field.type,
                  fieldType: field.fieldType || field.type
                };
              }
            }
          });
        }
      });
      setComponentValues(initialValues);

      // Select the first component by default
      if (layoutData.components.length > 0) {
        const firstComponent = layoutData.components[0];
        console.log('Selecting first component:', firstComponent);
        handleComponentSelect(firstComponent);
      }

      setLoading(false);
    } else {
      console.error('Invalid layout data:', layoutData);
      toast.error('Invalid layout data');
      navigate('/dashboard/content');
    }
  }, [location.state, navigate, currentInstance]);

  /**
   * Fetch layout with complete field data from API
   * @param {string} layoutId - Layout ID to fetch
   */
  const fetchLayoutWithFields = async (layoutId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/layouts/${layoutId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('Fetched layout with fields from API:', data.data);
        setLayout(data.data);
        
        // Initialize component values
        const initialValues = {};
        data.data.components.forEach(comp => {
          if (comp._id && comp.fields && Array.isArray(comp.fields)) {
            initialValues[comp._id] = {};
            comp.fields.forEach(field => {
              if (field.name) {
                const instanceValue = currentInstance?.content?.[comp._id]?.[field.name];
                if (field.type === 'array' && field.itemStructure) {
                  initialValues[comp._id][field.name] = {
                    value: instanceValue?.value || comp.data?.[field.name]?.value || [],
                    type: field.type,
                    fieldType: field.fieldType || field.type,
                    itemStructure: field.itemStructure
                  };
                } else {
                  initialValues[comp._id][field.name] = {
                    value: instanceValue?.value || comp.data?.[field.name]?.value || field.default || '',
                    type: field.type,
                    fieldType: field.fieldType || field.type
                  };
                }
              }
            });
          }
        });
        setComponentValues(initialValues);

        // Select the first component by default
        if (data.data.components.length > 0) {
          const firstComponent = data.data.components[0];
          console.log('Selecting first component from API data:', firstComponent);
          handleComponentSelect(firstComponent);
        }
      } else {
        console.error('Failed to fetch layout from API:', data);
        toast.error('Failed to load layout data');
        navigate('/dashboard/content');
      }
    } catch (error) {
      console.error('Error fetching layout from API:', error);
      toast.error('Failed to load layout data');
      navigate('/dashboard/content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (layout?.components) {
      const componentsWithIds = layout.components.map((comp, index) => ({
        ...comp,
        index,
        key: comp._id || `comp-${index}`
      }));
      setOrderedComponents(componentsWithIds);
    }
  }, [layout]);

  /**
   * Handles selecting a component from the sidebar.
   * @param {object} component
   */
  const handleComponentSelect = (component) => {
    console.log('Raw Component Data:', component);
    console.log('Component fields before transformation:', component.fields);
    
    // Validate component data
    if (!component || !component._id) {
      console.error('Invalid component data:', component);
      return;
    }

    // Transform fields to match the component response structure
    const transformedFields = Array.isArray(component.fields) ? component.fields.map(field => {
      if (field.type === 'array') {
        console.log('Array field detected:', field.name, field);
        
        // For Services component, add predefined itemStructure
        if (component.type === 'Services' && field.name === 'services') {
          return {
            ...field,
            fieldType: field.fieldType || field.type,
            itemStructure: [
              { name: 'icon', type: 'string', fieldType: 'text' },
              { name: 'title', type: 'string', fieldType: 'text' },
              { name: 'description', type: 'text', fieldType: 'textarea' }
            ]
          };
        }
        
        // For other array fields, use existing itemStructure or subFields
        let itemStructure = field.itemStructure || field.subFields?.map(subField => ({
          name: subField.name,
          type: subField.type,
          fieldType: subField.fieldType || subField.type
        })) || [];
        
        // If no itemStructure is defined, try to infer from common field names
        if (itemStructure.length === 0) {
          console.log('No itemStructure found for array field:', field.name, 'trying to infer...');
          
          // Common predefined item structures for array fields
          const predefinedStructures = {
            'members': [
              { name: 'name', type: 'string', fieldType: 'text' },
              { name: 'role', type: 'string', fieldType: 'text' },
              { name: 'photo', type: 'image', fieldType: 'image' },
              { name: 'bio', type: 'text', fieldType: 'textarea' }
            ],
            'testimonials': [
              { name: 'name', type: 'string', fieldType: 'text' },
              { name: 'position', type: 'string', fieldType: 'text' },
              { name: 'message', type: 'text', fieldType: 'textarea' },
              { name: 'image', type: 'image', fieldType: 'image' }
            ],
            'services': [
              { name: 'icon', type: 'string', fieldType: 'text' },
              { name: 'title', type: 'string', fieldType: 'text' },
              { name: 'description', type: 'text', fieldType: 'textarea' }
            ],
            'images': [
              { name: 'image', type: 'image', fieldType: 'image' },
              { name: 'caption', type: 'string', fieldType: 'text' },
              { name: 'alt', type: 'string', fieldType: 'text' }
            ],
            'features': [
              { name: 'title', type: 'string', fieldType: 'text' },
              { name: 'description', type: 'text', fieldType: 'textarea' },
              { name: 'icon', type: 'string', fieldType: 'text' }
            ],
            'faqs': [
              { name: 'question', type: 'string', fieldType: 'text' },
              { name: 'answer', type: 'text', fieldType: 'textarea' }
            ]
          };
          
          if (predefinedStructures[field.name]) {
            itemStructure = predefinedStructures[field.name];
            console.log('Using predefined structure for field:', field.name);
          } else {
            console.warn('No predefined structure found for array field:', field.name);
            // Create a basic structure with common fields
            itemStructure = [
              { name: 'title', type: 'string', fieldType: 'text' },
              { name: 'description', type: 'text', fieldType: 'textarea' },
              { name: 'image', type: 'image', fieldType: 'image' }
            ];
            console.log('Created basic structure for field:', field.name);
          }
        }
        
        return {
          ...field,
          fieldType: field.fieldType || field.type,
          itemStructure: itemStructure
        };
      }
      return {
        ...field,
        fieldType: field.fieldType || field.type,
        options: field.options, // Preserve options for select fields
        default: field.default, // Preserve default values
        min: field.min, // Preserve min values
        max: field.max, // Preserve max values
        step: field.step // Preserve step values
      };
    }) : [];

    const validComponent = {
      ...component,
      fields: transformedFields
    };

    console.log('Selected Component:', {
      id: validComponent._id,
      name: validComponent.name,
      type: validComponent.type,
      fields: validComponent.fields,
      fieldsCount: validComponent.fields?.length || 0,
      currentValues: componentValues[validComponent._id]
    });

    setSelectedComponent(validComponent);
  };

  /**
   * Checks if there are unsaved changes in the form.
   * @returns {boolean}
   */
  const checkUnsavedChanges = useCallback(() => {
    const currentData = JSON.stringify(componentValues);
    return currentData !== lastSavedDataRef.current;
  }, [componentValues]);

  // Handle page leave/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        // Show our custom modal
        setShowConfirmModal(true);
        // Prevent default browser behavior
        e.preventDefault();
        // Required for Chrome
        e.returnValue = undefined;
        // Stop the event from propagating
        e.stopPropagation();
        // Return undefined to prevent the browser dialog
        return undefined;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, { capture: true });
    };
  }, [hasUnsavedChanges]);

  /**
   * Handles autosaving the layout if there are unsaved changes.
   */
  const handleAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || isAutoSaving) return;

    try {
      setIsAutoSaving(true);
      
      const updatedLayout = {
        ...layout,
        components: layout.components.map(comp => {
          const compValues = componentValues[comp._id];
          if (!compValues) return comp;

          const transformedData = {};
          comp.fields.forEach(field => {
            if (field.type === 'array' && compValues[field.name]) {
              transformedData[field.name] = {
                value: compValues[field.name].value || [],
                type: field.type,
                fieldType: field.fieldType,
                itemStructure: field.itemStructure
              };
            } else {
              const existingValue = comp.data?.[field.name]?.value;
              transformedData[field.name] = compValues[field.name] || {
                value: existingValue ?? field.default ?? '',
                type: field.type,
                fieldType: field.fieldType || field.type
              };
            }
          });
          
          return {
            ...comp,
            data: transformedData
          };
        })
      };

      await updateLayout(layout._id, updatedLayout);
      lastSavedDataRef.current = JSON.stringify(componentValues);
      setHasUnsavedChanges(false);
      
      // Show toast with fixed positioning
      toast.success('Auto-saved successfully', { 
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          top: '80px'
        }
      });
    } catch (error) {
      console.error('Auto-save error:', error);
      toast.error('Failed to auto-save', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          top: '80px'
        }
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [layout, componentValues, hasUnsavedChanges, isAutoSaving]);

  // Use the hook:
  useLayoutAutoSave({ hasUnsavedChanges, isAutoSaving, handleAutoSave });

  /**
   * Handles field value changes for a component.
   * @param {string} fieldName
   * @param {any} value
   * @param {string} type
   * @param {string} fieldType
   * @param {Array|null} itemStructure
   */
  const handleFieldChange = (fieldName, value, type, fieldType, itemStructure = null) => {
    if (!selectedComponent) return;
    
    setHasUnsavedChanges(true);
    
    if (type === 'array') {
      // Handle array type fields
      const transformedValue = value.map(item => {
        if (typeof item === 'object') {
          const transformedItem = {};
          // Convert each item's fields to the correct format
          Object.keys(item).forEach(key => {
            // Check if the value is already in the correct format
            if (item[key] && typeof item[key] === 'object' && 'value' in item[key]) {
              transformedItem[key] = item[key];
            } else {
              // If not, transform it to the correct format
              const fieldDef = itemStructure?.find(f => f.name === key);
              transformedItem[key] = {
                value: item[key] || '',
                type: fieldDef?.type || 'text',
                fieldType: fieldDef?.fieldType || 'text'
              };
            }
          });
          return transformedItem;
        }
        return item;
      });

      setComponentValues(prev => ({
        ...prev,
        [selectedComponent._id]: {
          ...prev[selectedComponent._id],
          [fieldName]: {
            value: transformedValue,
            type,
            fieldType,
            itemStructure
          }
        }
      }));
    } else {
      // Handle non-array fields
      setComponentValues(prev => ({
        ...prev,
        [selectedComponent._id]: {
          ...prev[selectedComponent._id],
          [fieldName]: {
            value: value,
            type,
            fieldType: fieldType || type
          }
        }
      }));
    }
  };

  /**
   * Handles opening the media selector for a field.
   * @param {string} fieldName
   */
  const handleOpenMediaSelector = (fieldName) => {
    console.log('Opening media selector for field:', fieldName);
    setCurrentImageField(fieldName);
    setIsMediaSelectorOpen(true);
  };

  /**
   * Handles selecting a media file for a field.
   * @param {object} file
   */
  const handleMediaSelect = (file) => {
    if (!currentImageField || !selectedComponent) {
      console.log('Media selection failed: No current image field or selected component');
      return;
    }
    
    console.log('Media selected:', file);
    console.log('Current image field:', currentImageField);
    
    // Check if this is an array field image - handle both [index] and .index notation
    if (currentImageField.includes('[') || /\.\d+\./.test(currentImageField)) {
      try {
        let fieldName, indexStr, subFieldName;
        
        // Handle bracket notation: "members[0].photo"
    if (currentImageField.includes('[')) {
          [fieldName, indexStr, subFieldName] = currentImageField.match(/(.+?)\[(\d+)\]\.(.+)/).slice(1);
        } 
        // Handle dot notation: "list.0.icon"
        else {
          const parts = currentImageField.split('.');
          // Find the part that's a number (the index)
          const indexPosition = parts.findIndex(part => !isNaN(parseInt(part)));
          if (indexPosition > 0 && indexPosition < parts.length - 1) {
            fieldName = parts.slice(0, indexPosition).join('.');
            indexStr = parts[indexPosition];
            subFieldName = parts.slice(indexPosition + 1).join('.');
          } else {
            throw new Error(`Invalid array field format: ${currentImageField}`);
          }
        }
        
        console.log(`Parsed array field path: fieldName=${fieldName}, index=${indexStr}, subField=${subFieldName}`);
        
      const index = parseInt(indexStr);
      
      const currentValue = componentValues[selectedComponent._id]?.[fieldName]?.value || [];
      const newValue = [...currentValue];
      
      if (!newValue[index]) {
        newValue[index] = {};
      }
      
        // Ensure proper structure for nested image
      newValue[index] = {
        ...newValue[index],
        [subFieldName]: {
          value: file.url,
          type: 'image',
          fieldType: 'image'
        }
      };

        console.log(`Setting array image field ${fieldName}[${index}].${subFieldName} to ${file.url}`);
        console.log('Updated array item:', newValue[index]);
        
        // First handle field change on the entire array
      handleFieldChange(
        fieldName,
        newValue,
        'array',
        'array',
        componentValues[selectedComponent._id]?.[fieldName]?.itemStructure
      );
        
        // Then also ensure the specific item field is updated correctly
        handleArrayItemChange(
          fieldName,
          index,
          subFieldName,
          {
            value: file.url,
            type: 'image',
            fieldType: 'image'
          },
          '' // No parent path for top-level arrays
        );
      } catch (error) {
        console.error('Error processing array field image:', error);
        console.error('Field path that caused error:', currentImageField);
        toast.error('Failed to update array field image');
      }
    } else {
      // Handle regular image field - ensure consistent structure
      console.log(`Setting image field ${currentImageField} to ${file.url}`);
      
    handleFieldChange(
      currentImageField,
      file.url,
      'image',
      'image'
    );
    }
    
    setIsMediaSelectorOpen(false);
    setCurrentImageField(null);
  };

  /**
   * Handles removing an image from a field.
   * @param {string} fieldName
   */
  const handleRemoveImage = (fieldName) => {
    console.log('handleRemoveImage called with fieldName:', fieldName);
    if (!selectedComponent) {
      console.log('No selected component, returning');
      return;
    }
    
    console.log('Removing image from field:', fieldName);
    handleFieldChange(
      fieldName,
      '',
      'image',
      'image'
    );
  };

  /**
   * Handles previewing an image in a modal.
   * @param {string} imageUrl
   */
  const handleImagePreview = (imageUrl) => {
    console.log('handleImagePreview called with imageUrl:', imageUrl);
    if (!imageUrl) {
      console.log('No image URL provided');
      return;
    }
    
    // Process the image URL to ensure it's properly formatted
    const processedImageUrl = getImageUrl(imageUrl);
    console.log('Processed image URL:', processedImageUrl);
    
    setPreviewImage(processedImageUrl);
    setShowImagePreview(true);
    console.log('Image preview modal should be open now');
    
    // Debug: Check state after a short delay
    setTimeout(() => {
      console.log('Modal state after setting:', { showImagePreview: true, previewImage: processedImageUrl });
    }, 100);
  };
 

  /**
   * Handles saving the layout and/or instance data.
   */
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveModalState({ isOpen: true, status: 'saving', data: null });
      
      const updatedLayout = {
        ...layout,
        components: layout.components.map(comp => {
          const compValues = componentValues[comp._id];
          if (!compValues) return comp;

          const transformedData = {};
          comp.fields.forEach(field => {
            if (field.type === 'array' && compValues[field.name]) {
              // Get the array value, ensuring it's properly structured
              let arrayValue = compValues[field.name].value;
              
              // If array value is not actually an array, try to handle it
              if (!Array.isArray(arrayValue)) {
                if (compValues[field.name].value && Array.isArray(compValues[field.name].value)) {
                  arrayValue = compValues[field.name].value;
                } else {
                  arrayValue = [];
                  console.warn(`Array field ${field.name} has invalid value:`, compValues[field.name]);
                }
              }
              
              // Process each array item to ensure proper structure
              const processedValue = arrayValue.map(item => {
                // Process each item according to itemStructure
                if (field.itemStructure && typeof item === 'object') {
                  const processedItem = {};
                  
                  field.itemStructure.forEach(subField => {
                    // If the item has the subfield with proper format, use it
                    if (item[subField.name] && typeof item[subField.name] === 'object' && 'value' in item[subField.name]) {
                      // Special handling for image fields to guarantee proper structure
                      if (subField.type === 'image' || subField.fieldType === 'image') {
                        processedItem[subField.name] = {
                          value: item[subField.name].value || '',
                          type: 'image',
                          fieldType: 'image'
                        };
                        // Debug log the image field
                        console.log(`Processing image in array: ${field.name}[].${subField.name} = ${item[subField.name].value || ''}`);
                      }
                      // For nested arrays, recursively process the array value
                      else if (subField.type === 'array' && Array.isArray(item[subField.name].value)) {
                        processedItem[subField.name] = {
                          value: item[subField.name].value.map(nestedItem => {
                            // Process each nested item
                            if (subField.itemStructure && typeof nestedItem === 'object') {
                              const processedNestedItem = {};
                              
                              subField.itemStructure.forEach(nestedSubField => {
                                if (nestedItem[nestedSubField.name] && typeof nestedItem[nestedSubField.name] === 'object' && 'value' in nestedItem[nestedSubField.name]) {
                                  processedNestedItem[nestedSubField.name] = nestedItem[nestedSubField.name];
                                } else {
                                  processedNestedItem[nestedSubField.name] = {
                                    value: nestedItem[nestedSubField.name] || nestedSubField.defaultValue || '',
                                    type: nestedSubField.type,
                                    fieldType: nestedSubField.fieldType || nestedSubField.type
                                  };
                                }
                              });
                              
                              return processedNestedItem;
                            }
                            return nestedItem;
                          }),
                          type: subField.type,
                          fieldType: subField.fieldType || 'array',
                          itemStructure: subField.itemStructure
                        };
                      } else {
                        processedItem[subField.name] = item[subField.name];
                      }
                    } 
                    // Otherwise create proper structure
                    else {
                      if (subField.type === 'array') {
                        // Initialize empty array with proper structure
                        processedItem[subField.name] = {
                          value: [],
                          type: subField.type,
                          fieldType: subField.fieldType || 'array',
                          itemStructure: subField.itemStructure
                        };
                      } else {
                        processedItem[subField.name] = {
                          value: item[subField.name] || subField.defaultValue || '',
                          type: subField.type,
                          fieldType: subField.fieldType || subField.type
                        };
                      }
                    }
                  });
                  
                  return processedItem;
                }
                return item;
              });
              
              transformedData[field.name] = {
                value: processedValue,
                type: field.type,
                fieldType: field.fieldType || 'array',
                itemStructure: field.itemStructure
              };
            } else {
              const existingValue = comp.data?.[field.name]?.value;
              transformedData[field.name] = compValues[field.name] || {
                value: existingValue ?? field.default ?? '',
                type: field.type,
                fieldType: field.fieldType || field.type
              };
            }
          });
          
          return {
            ...comp,
            data: transformedData
          };
        })
      };

      // If we have a current instance, update the instance content
      if (currentInstance) {
        const instanceData = {
          ...currentInstance,
          content: componentValues
        };
        
        // Log the instance data payload
        console.log('▶️ DEBUG - Instance data being sent to server:', JSON.stringify(instanceData, null, 2));
        console.log('▶️ DEBUG - Component values:', JSON.stringify(componentValues, null, 2));
        
        await axios.put(`/api/pages/${layout.page}/instances/${currentInstance._id}`, instanceData);
      } else {
        // Log the layout update payload
        console.log('▶️ DEBUG - Layout data being sent to server:', JSON.stringify(updatedLayout, null, 2));
        
        // For debugging image fields specifically
        const imageFieldsInComponents = updatedLayout.components.map(comp => {
          const imageFields = {};
          Object.entries(comp.data || {}).forEach(([key, field]) => {
            // Check regular image fields
            if (field.fieldType === 'image' || field.type === 'image') {
              imageFields[key] = field;
            }
            
            // Check image fields within arrays
            if (field.type === 'array' && Array.isArray(field.value)) {
              field.value.forEach((item, idx) => {
                if (typeof item === 'object') {
                  Object.entries(item).forEach(([itemKey, itemValue]) => {
                    if (itemValue?.fieldType === 'image' || itemValue?.type === 'image') {
                      imageFields[`${key}[${idx}].${itemKey}`] = itemValue;
                    }
                  });
                }
              });
            }
          });
          return { componentId: comp._id, componentName: comp.name, imageFields };
        }).filter(comp => Object.keys(comp.imageFields).length > 0);
        
        console.log('▶️ DEBUG - Image fields in payload:', JSON.stringify(imageFieldsInComponents, null, 2));
        
        // Otherwise update the layout
        await updateLayout(layout._id, updatedLayout);
      }

      lastSavedDataRef.current = JSON.stringify(componentValues);
      setHasUnsavedChanges(false);

      setSaveModalState({
        isOpen: true,
        status: 'success',
        data: {
          message: 'Your content has been successfully updated',
          components: updatedLayout.components,
          changesByType: updatedLayout.components.reduce((acc, comp) => {
            acc[comp.type] = acc[comp.type] || [];
            acc[comp.type].push(comp);
            return acc;
          }, {}),
          summary: {
            totalComponents: updatedLayout.components.length,
            modifiedFields: updatedLayout.components.reduce((sum, comp) => 
              sum + comp.fields.length, 0
            ),
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error saving:', error);
      setSaveModalState({
        isOpen: true,
        status: 'error',
        data: {
          error: error.response?.data?.message || 'Failed to save content. Please try again.',
          details: error.message
        }
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles navigation back to the content dashboard, with unsaved changes check.
   */
  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      setShowConfirmModal(true);
    } else {
      navigate('/dashboard/content');
    }
  };

  /**
   * Handles sorting components in the sidebar.
   */
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(orderedComponents.slice(), oldIndex, newIndex).map((el, index) => ({
        ...el,
        index
      }));
      setOrderedComponents(newData);
      
      // Update the layout with new order
      const updatedLayout = {
        ...layout,
        components: newData
      };
      setLayout(updatedLayout);
      setHasUnsavedChanges(true);
    }
  };

  /**
   * Handles changing an item in an array field.
   */
  const handleArrayItemChange = (fieldName, index, itemFieldName, value, parentPath = '') => {
    if (!selectedComponent) return;

    const componentId = selectedComponent._id;
    const currentComponentValues = componentValues[componentId] || {};
    
    // Create a deep copy of the current values
    const updatedValues = JSON.parse(JSON.stringify(currentComponentValues));
    
    // Build the full path to the field
    const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    
    console.log('handleArrayItemChange:', {
      fieldName,
      index,
      itemFieldName,
      value: typeof value === 'object' ? 'object' : value,
      parentPath,
      fullPath
    });
    
    // Get the array at the specified path
    const getNestedArray = (obj, path) => {
      if (!path) return obj;
      
      try {
        // Split the path into parts and handle each part
        const parts = path.split('.');
        let current = obj;
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          
          // If the current object is undefined or null, return an empty array
          if (!current) return [];
          
          // If we're at the last part, check if it exists
          if (i === parts.length - 1) {
            // If the property exists and has a value property, return that
            if (current[part] && typeof current[part] === 'object' && 'value' in current[part]) {
              return Array.isArray(current[part].value) ? current[part].value : [];
            }
            // Otherwise return the direct property if it's an array
            return Array.isArray(current[part]) ? current[part] : [];
          }
          
          // If we're at an intermediate part
          if (current[part] === undefined) {
            // Create the path if it doesn't exist
            current[part] = {};
          } else if (current[part] && typeof current[part] === 'object' && 'value' in current[part]) {
            // If the current part has a value property
            if (typeof current[part].value !== 'object') {
              // Convert to object if it's not already one
              current[part].value = {};
            }
            current = current[part].value;
            continue;
          }
          
          // Move to the next part
          current = current[part];
        }
        
        return [];
      } catch (error) {
        console.error('Error getting nested array:', error);
        return [];
      }
    };

    // Set value at the specified path
    const setNestedValue = (obj, path, value) => {
      if (!path) {
        return value;
      }
      
      try {
      const parts = path.split('.');
        let current = obj;
        
        // Navigate to the parent object
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          
          // Create path if it doesn't exist
          if (!current[part]) {
            current[part] = {};
          }
          
          // If current part has a value property and it's an object, navigate to it
          if (current[part] && typeof current[part] === 'object' && 'value' in current[part]) {
            if (typeof current[part].value !== 'object') {
              current[part].value = {};
            }
            current = current[part].value;
          } else {
            current = current[part];
          }
        }
        
        const lastPart = parts[parts.length - 1];
        
        // Find field definition to determine type
        let fieldDef;
        if (parentPath) {
          // For nested fields, we need to find the parent field first
          const parentParts = parentPath.split('.');
          const parentField = selectedComponent.fields.find(f => f.name === parentParts[0]);
          
          if (parentField && parentField.itemStructure) {
            // Navigate through the itemStructure to find the right field definition
            let currentStructure = parentField.itemStructure;
            for (let i = 1; i < parentParts.length; i++) {
              const part = parentParts[i];
              const nestedField = currentStructure.find(f => f.name === part);
              if (nestedField && nestedField.itemStructure) {
                currentStructure = nestedField.itemStructure;
              } else {
                break;
              }
            }
            
            // Find the field in the current structure
            const fieldParts = fieldName.split('.');
            const targetFieldName = fieldParts[fieldParts.length - 1];
            fieldDef = currentStructure.find(f => f.name === targetFieldName);
          }
        } else {
          // For top-level fields, just find it directly
          fieldDef = selectedComponent.fields.find(f => f.name === fieldName);
        }
        
        // Determine if this field is an array
        const isArrayField = fieldDef && fieldDef.type === 'array';
        const isImageField = fieldDef && (fieldDef.type === 'image' || fieldDef.fieldType === 'image');
        
        // If the target exists and has a value property
        if (current[lastPart] && typeof current[lastPart] === 'object' && 'value' in current[lastPart]) {
          current[lastPart].value = value;
        } else if (isArrayField) {
          // If it's an array field but doesn't have the right structure
          current[lastPart] = {
            value: value,
            type: 'array',
            fieldType: fieldDef?.fieldType || 'array',
            itemStructure: fieldDef?.itemStructure || []
          };
        } else if (isImageField) {
          // Special handling for image fields to ensure consistency
          current[lastPart] = {
            value: value,
            type: 'image',
            fieldType: 'image'
          };
        } else {
          // For other fields
          current[lastPart] = value;
        }
        
      return obj;
      } catch (error) {
        console.error('Error setting nested value:', error);
        return obj;
      }
    };

    // Get the current array
    let currentArray = getNestedArray(updatedValues, fullPath);
    if (!Array.isArray(currentArray)) currentArray = [];

    // Create or update the item at the specified index
    let updatedItem;
    if (itemFieldName === 'new') {
      // Just use the value directly for new items - they should already be properly formatted
      updatedItem = value;
      console.log('Adding new item to array:', { index, arrayLength: currentArray.length });
    } else {
      // For existing items, update only the specific field
      updatedItem = { ...(currentArray[index] || {}) };
      if (itemFieldName.includes('.')) {
        // Handle nested field updates
        const fieldParts = itemFieldName.split('.');
        let current = updatedItem;
        for (let i = 0; i < fieldParts.length - 1; i++) {
          if (!current[fieldParts[i]]) current[fieldParts[i]] = {};
          
          // If this part has a value property and it's an object, navigate to it
          if (current[fieldParts[i]] && typeof current[fieldParts[i]] === 'object' && 'value' in current[fieldParts[i]]) {
            if (typeof current[fieldParts[i]].value !== 'object') {
              current[fieldParts[i]].value = {};
            }
            current = current[fieldParts[i]].value;
          } else {
          current = current[fieldParts[i]];
        }
        }
        
        // Format the field value properly
        const lastPart = fieldParts[fieldParts.length - 1];
        
        // Determine if this is an array field or image field
        const fullFieldPath = `${fieldName}.${index}.${itemFieldName}`;
        const fieldDef = findFieldDefinition(fullFieldPath, parentPath);
        const isArrayField = fieldDef && fieldDef.type === 'array';
        const isImageField = fieldDef && (fieldDef.type === 'image' || fieldDef.fieldType === 'image');
        
        if (current[lastPart] && typeof current[lastPart] === 'object' && 'value' in current[lastPart]) {
          current[lastPart].value = value;
        } else if (isArrayField) {
          // If it's an array field, ensure proper structure
          current[lastPart] = {
            value: value,
            type: 'array',
            fieldType: fieldDef?.fieldType || 'array',
            itemStructure: fieldDef?.itemStructure || []
          };
        } else if (isImageField || (typeof value === 'object' && value?.type === 'image')) {
          // For image fields, ensure consistent structure
          const imageValue = typeof value === 'object' && 'value' in value ? value.value : value;
          current[lastPart] = {
            value: imageValue,
            type: 'image',
            fieldType: 'image'
          };
      } else {
          current[lastPart] = {
            value: value,
            type: fieldDef?.type || 'text',
            fieldType: fieldDef?.fieldType || 'text'
          };
        }
      } else {
        // Format direct field updates properly
        const fieldDef = findFieldDefinition(`${fieldName}.${itemFieldName}`, parentPath);
        const isArrayField = fieldDef && fieldDef.type === 'array';
        const isImageField = fieldDef && (fieldDef.type === 'image' || fieldDef.fieldType === 'image');
        
        if (updatedItem[itemFieldName] && typeof updatedItem[itemFieldName] === 'object' && 'value' in updatedItem[itemFieldName]) {
          updatedItem[itemFieldName].value = value;
        } else if (isArrayField) {
          // If it's an array field, ensure proper structure
          updatedItem[itemFieldName] = {
            value: value,
            type: 'array',
            fieldType: fieldDef?.fieldType || 'array',
            itemStructure: fieldDef?.itemStructure || []
          };
        } else if (isImageField || (typeof value === 'object' && value?.type === 'image')) {
          // For image fields, ensure consistent structure
          const imageValue = typeof value === 'object' && 'value' in value ? value.value : value;
          updatedItem[itemFieldName] = {
            value: imageValue,
            type: 'image',
            fieldType: 'image'
          };
        } else {
          updatedItem[itemFieldName] = {
            value: value,
            type: fieldDef?.type || 'text',
            fieldType: fieldDef?.fieldType || 'text'
          };
        }
      }
    }

    // Make sure we have a valid array
    if (!Array.isArray(currentArray)) {
      currentArray = [];
    }

    // Update the array
    const newArray = [...currentArray];
    
    // Make sure the index is valid
    if (index >= 0 && index <= newArray.length) {
    newArray[index] = updatedItem;
    } else {
      console.warn('Invalid array index:', index, 'for array length:', newArray.length);
      // Add to the end as a fallback
      newArray.push(updatedItem);
    }

    // Set the updated array back in the values object
    setNestedValue(updatedValues, fullPath, newArray);

    console.log('Updated array values:', {
      path: fullPath,
      index,
      itemField: itemFieldName,
      value: typeof value === 'object' ? 'object' : value,
      newArray
    });

    setComponentValues(prev => ({
      ...prev,
      [componentId]: updatedValues
    }));
  };
  
  /**
   * Finds a field definition by path.
   */
  const findFieldDefinition = (fieldPath, parentPath = '') => {
    if (!selectedComponent || !selectedComponent.fields) return null;
    
    // For top-level fields
    if (!parentPath && !fieldPath.includes('.')) {
      return selectedComponent.fields.find(f => f.name === fieldPath);
    }
    
    // For nested fields, we need to navigate through the structure
    try {
      // Combine parent path and field path
      const fullPath = parentPath ? `${parentPath}.${fieldPath}` : fieldPath;
      const parts = fullPath.split('.');
      
      // Start with the top-level field
      let currentField = selectedComponent.fields.find(f => f.name === parts[0]);
      if (!currentField) return null;
      
      // Navigate through the path
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        
        // If this is an index (number), skip it
        if (!isNaN(parseInt(part))) continue;
        
        // Check if we have item structure
        if (!currentField.itemStructure) return null;
        
        // Find the field in the current structure
        currentField = currentField.itemStructure.find(f => f.name === part);
        if (!currentField) return null;
      }
      
      return currentField;
    } catch (error) {
      console.error('Error finding field definition:', error);
      return null;
    }
  };

  /**
   * Returns a user-friendly label for a field name.
   */
  const getUserFriendlyLabel = (fieldName, parentFieldName = '') => {
    // Remove technical prefixes like "list." or numbers
    const cleanName = fieldName.replace(/^list\.|^\d+\.|\.\d+\./g, '');
    
    // Split by dots and take the last part
    const parts = cleanName.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Convert camelCase to spaces
    const spacedName = lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();

    // Special cases for common field names
    const specialCases = {
      'one': 'First Item',
      'two': 'Second Item',
      'three': 'Third Item',
      'title': 'Title',
      'description': 'Description',
      'name': 'Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'address': 'Address',
      'url': 'Website URL',
      'image': 'Image',
      'content': 'Content',
      'date': 'Date',
      'price': 'Price',
      'quantity': 'Quantity'
    };

    return specialCases[lastPart] || spacedName;
  };

  /**
   * Renders a field input based on its type and definition.
   * @param {object} field
   */
  const renderField = (field) => {
    const fieldData = componentValues[selectedComponent._id]?.[field.name] || {
      value: field.type === 'array' ? [] : '',
      type: field.type,
      fieldType: field.fieldType || field.type,
      ...(field.itemStructure && { itemStructure: field.itemStructure })
    };
    let value;
    if (field.value !== undefined) {
      value = field.value;
    } else if (typeof fieldData.value !== 'undefined') {
      value = fieldData.value;
    } else {
      value = field.type === 'array' ? [] : '';
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      try {
        if (!('value' in value)) {
          if (field.fieldType === 'text' || field.fieldType === 'string' || field.fieldType === 'textarea') {
            value = JSON.stringify(value);
          }
        } else {
          value = value.value;
        }
      } catch (error) {
        value = '';
      }
    }
    const fieldType = field.fieldType || fieldData.fieldType || field.type;
    const friendlyLabel = getUserFriendlyLabel(field.name);
    const modernInput =
      'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base bg-white transition placeholder-gray-400 shadow-sm hover:border-blue-300';
    // Use custom renderArrayField for array fields
    if (fieldType === 'array') {
      return renderArrayField(field, '');
    }
    switch (fieldType) {
      case 'text':
      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              if (field.onChange) {
                field.onChange(e.target.value);
              } else {
                handleFieldChange(field.name, e.target.value, field.type, fieldType);
              }
            }}
            className={modernInput}
            placeholder={`Enter ${field.label || friendlyLabel}`}
            autoFocus={!!field.autoFocus}
          />
        );
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => {
            if (field.onChange) {
              field.onChange(e.target.value);
            } else {
              handleFieldChange(field.name, e.target.value, field.type, fieldType);
            }
          }}
          className={`${modernInput} min-h-[100px]`}
          rows={4}
          placeholder={`Write your ${field.label || friendlyLabel.toLowerCase()} here...`}
          autoFocus={!!field.autoFocus}
        />
      );
    case 'richText':
      return (
        <div className="rich-text-editor">
          <ReactQuill
            value={value || ''}
            onChange={(content) => {
              if (field.onChange) {
                field.onChange(content);
              } else {
                handleFieldChange(field.name, content, field.type, fieldType);
              }
            }}
            placeholder={`Start writing your ${field.label || friendlyLabel.toLowerCase()}...`}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: [] }, { background: [] }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
      );
    case 'number':
      return (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => {
            const numValue = Number(e.target.value);
            if (field.onChange) {
              field.onChange(numValue);
            } else {
              handleFieldChange(field.name, numValue, field.type, fieldType);
            }
          }}
          className={modernInput}
          placeholder={`Enter ${field.label || friendlyLabel.toLowerCase()}`}
          autoFocus={!!field.autoFocus}
        />
      );
    case 'boolean':
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => {
              if (field.onChange) {
                field.onChange(e.target.checked);
              } else {
                handleFieldChange(field.name, e.target.checked, field.type, fieldType);
              }
            }}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition shadow-sm"
            autoFocus={!!field.autoFocus}
          />
          <span className="ml-3 text-base text-gray-700 font-medium">
            {field.label || field.name}
          </span>
        </div>
      );
    case 'date':
      return (
        <div className="relative">
          <input
            type="date"
            value={value || ''}
            onChange={(e) => {
              if (field.onChange) {
                field.onChange(e.target.value);
              } else {
                handleFieldChange(field.name, e.target.value, field.type, fieldType);
              }
            }}
            className={modernInput}
            placeholder={`Select ${field.label || friendlyLabel.toLowerCase()}`}
            autoFocus={!!field.autoFocus}
          />
        </div>
      );
    case 'select':
      console.log('Rendering select field:', field.name, 'with options:', field.options);
      
      // Handle different option formats
      let selectOptions = [];
      if (field.options) {
        if (Array.isArray(field.options)) {
          // If options is already an array of objects with label/value
          if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0].label && field.options[0].value) {
            selectOptions = field.options;
          } else if (field.options.length > 0 && typeof field.options[0] === 'object' && field.options[0].value) {
            // If options is an array of objects with just value, use value as label too
            selectOptions = field.options.map(option => ({
              value: option.value,
              label: option.label || option.value
            }));
          } else if (typeof field.options[0] === 'string') {
            // If options is an array of strings, convert to objects
            selectOptions = field.options.map(option => ({
              value: option,
              label: option
            }));
          }
        }
      }
      
      console.log('Processed select options:', selectOptions);
      
      return (
        <select
          value={value || ''}
          onChange={(e) => {
            if (field.onChange) {
              field.onChange(e.target.value);
            } else {
              handleFieldChange(field.name, e.target.value, field.type, fieldType);
            }
          }}
          className={modernInput}
        >
          <option value="">Choose {field.label || friendlyLabel.toLowerCase()}</option>
          {selectOptions.length > 0 ? (
            selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <option value="" disabled>No options available</option>
          )}
        </select>
      );
    case 'image':
      return (
        <div className="space-y-3">
          {/* Image preview */}
          {value && (
            <div className="relative">
              <img
                src={getImageUrl(value)}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Preview button clicked for field:', field.name, 'value:', value);
                  handleImagePreview(value);
                }}
                className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1 rounded-full shadow-sm transition-all z-10"
                title="Preview Image"
              >
                <FaEye className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Remove button clicked for field:', field.name);
                  handleRemoveImage(field.name);
                }}
                className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm transition-all z-10"
                title="Remove Image"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Image selection buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Media selector button clicked for field:', field.name);
                handleOpenMediaSelector(field.name);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaImage className="w-4 h-4" />
              {value ? 'Change Image' : 'Select Image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Remove button (bottom) clicked for field:', field.name);
                  handleRemoveImage(field.name);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <FaTrash className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
          
          {/* Hidden input for form compatibility */}
          <input
            type="hidden"
            value={value || ''}
            onChange={(e) => {
              if (field.onChange) {
                field.onChange(e.target.value);
              } else {
                handleFieldChange(field.name, e.target.value, field.type, fieldType);
              }
            }}
          />
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => {
            if (field.onChange) {
              field.onChange(e.target.value);
            } else {
              handleFieldChange(field.name, e.target.value, field.type, fieldType);
            }
          }}
          className={modernInput}
          placeholder={`Enter ${field.label || friendlyLabel}`}
          autoFocus={!!field.autoFocus}
        />
      );
    }
  };



  /**
   * Renders an array field and its items.
   * @param {object} field
   * @param {string} parentPath
   */
  const renderArrayField = (field, parentPath = '') => {
    if (!selectedComponent) {
      return null;
    }
    
    const componentId = selectedComponent._id;
    const fullPath = parentPath ? `${parentPath}.${field.name}` : field.name;
    const friendlyLabel = getUserFriendlyLabel(field.name, parentPath);
    
    console.log('Rendering array field:', field.name, 'with itemStructure:', field.itemStructure?.length || 0, 'items');
    const getNestedValue = (obj, path) => {
      if (!path) return [];
      try {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!current) return [];
          if (current[part] === undefined) return [];
          current = current[part];
          if (current && typeof current === 'object' && 'value' in current) {
            if (i === parts.length - 1 || !Array.isArray(current.value)) {
              current = current.value;
            } else {
              current = current.value;
            }
          }
        }
        return Array.isArray(current) ? current : [];
      } catch (error) {
        return [];
      }
    };
    const arrayValue = getNestedValue(componentValues[componentId] || {}, fullPath);
    console.log('Array value for field:', field.name, 'has', arrayValue.length, 'items');
    const handleAddItem = () => {
      const newItem = {};
      field.itemStructure.forEach((subField, idx) => {
        if (subField.type === 'array') {
          newItem[subField.name] = {
            value: [],
            type: 'array',
            fieldType: subField.fieldType || 'array',
            itemStructure: subField.itemStructure
          };
        } else {
          newItem[subField.name] = {
            value: subField.defaultValue || '',
            type: subField.type,
            fieldType: subField.fieldType || subField.type
          };
        }
      });
      const updatedArray = [...arrayValue, newItem];
      handleArrayItemChange(field.name, updatedArray.length - 1, 'new', newItem, parentPath);
      
      // Close all other accordions and open only the new one
      const newItemKey = `${fullPath}-${updatedArray.length - 1}`;
      setAccordionActiveKeys(prev => ({
        ...prev,
        [fullPath]: [newItemKey]
      }));
      
      setTimeout(() => {
        const firstInput = document.querySelector(
          `[data-autofocus="${fullPath}-${updatedArray.length - 1}"] input, [data-autofocus="${fullPath}-${updatedArray.length - 1}"] textarea`
        );
        if (firstInput) firstInput.focus();
      }, 100);
    };
    const handleRemoveItem = (index) => {
      const updatedArray = arrayValue.filter((_, i) => i !== index);
      const updatedValues = { ...componentValues[componentId] };
      const parts = fullPath.split('.');
      let current = updatedValues;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        if (current[parts[i]] && typeof current[parts[i]] === 'object' && 'value' in current[parts[i]]) {
          if (typeof current[parts[i]].value === 'object') {
            current = current[parts[i]].value;
          } else {
            current[parts[i]].value = {};
            current = current[parts[i]].value;
          }
        } else {
        current = current[parts[i]];
      }
      }
      const lastPart = parts[parts.length - 1];
      if (current[lastPart] && typeof current[lastPart] === 'object' && 'value' in current[lastPart]) {
        current[lastPart].value = updatedArray;
      } else {
        current[lastPart] = updatedArray;
      }
      setComponentValues(prev => ({
        ...prev,
        [componentId]: updatedValues
      }));
      
      // Update accordion active keys to remove the deleted item
      setAccordionActiveKeys(prev => {
        const currentKeys = prev[fullPath] || [];
        const updatedKeys = currentKeys.filter(key => key !== `${fullPath}-${index}`);
        return {
          ...prev,
          [fullPath]: updatedKeys
        };
      });
    };
    const handleNestedFieldChange = (index, subField, nestedValue) => {
      console.log('handleNestedFieldChange:', { index, subField: subField.name, subFieldType: subField.type, nestedValue });
      
      if (subField.type === 'image' || subField.fieldType === 'image') {
        let imageValue = nestedValue;
        if (typeof nestedValue === 'object' && 'value' in nestedValue) {
          imageValue = nestedValue.value;
        }
        const properImageField = {
          value: imageValue,
          type: 'image',
          fieldType: 'image'
        };
        console.log('Processing image field:', { subFieldName: subField.name, imageValue, properImageField });
        handleArrayItemChange(
          field.name,
          index,
          subField.name,
          properImageField,
          parentPath
        );
        return;
      }
      if (subField.type === 'array') {
        let currentItem = arrayValue[index] || {};
        let updatedItem = { ...currentItem };
        if (!updatedItem[subField.name] || typeof updatedItem[subField.name] !== 'object') {
          updatedItem[subField.name] = {
            value: [],
            type: 'array',
            fieldType: subField.fieldType || 'array',
            itemStructure: subField.itemStructure
          };
        }
        updatedItem[subField.name].value = nestedValue;
        const updatedArray = [...arrayValue];
        updatedArray[index] = updatedItem;
        handleArrayItemChange(
          field.name,
          index,
          subField.name,
          updatedItem[subField.name],
          parentPath
        );
      } else {
        handleArrayItemChange(
          field.name,
          index,
          subField.name,
          nestedValue,
          parentPath
        );
      }
    };
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 text-base mr-2">{friendlyLabel}</span>
          <Tooltip title={`Add new ${friendlyLabel}`}>
            <button
              type="button"
              onClick={handleAddItem}
              className="ml-auto inline-flex items-center px-3 py-1.5 border border-primary-200 text-xs font-semibold rounded-full text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
            >
              <PlusOutlined className="mr-1" /> Add
            </button>
          </Tooltip>
        </div>
                <Collapse 
          bordered={false} 
          ghost={false} 
          activeKey={accordionActiveKeys[fullPath] || []}
          onChange={(keys) => {
            setAccordionActiveKeys(prev => ({
              ...prev,
              [fullPath]: keys
            }));
          }}
        >
          {arrayValue.map((item, index) => (
            <Collapse.Panel
              key={`${fullPath}-${index}`}
              header={
                <div className="flex items-center w-full group">
                  <span className="font-medium text-gray-800">{friendlyLabel} #{index + 1}</span>
                  <Tooltip title="Remove">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); handleRemoveItem(index); }}
                      className="ml-auto inline-flex items-center p-1 border-none text-red-500 bg-transparent hover:bg-red-50 rounded-full transition"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              }
              showArrow={true}
              collapsible="header"
            >
                <div className="space-y-3" data-autofocus={`${fullPath}-${index}`}> {/* For auto-focus */}
                  {field.itemStructure && field.itemStructure.length > 0 ? (
                    field.itemStructure.map((subField, subIdx) => (
                      <div key={`${fullPath}-${index}-${subField.name}`} className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          {subField.label || getUserFriendlyLabel(subField.name)}
                        </label>
                        {renderField({
                          ...subField,
                          name: `${field.name}.${index}.${subField.name}`,
                          value: item[subField.name]?.value !== undefined 
                            ? item[subField.name].value 
                            : (typeof item[subField.name] === 'string' ? item[subField.name] : ''),
                          onChange: (value) => handleNestedFieldChange(index, subField, value),
                          parentPath: parentPath,
                          autoFocus: subIdx === 0 // Auto-focus first field
                        })}
                      </div>
                    ))
                  ) : (
                    <div className="text-red-500 text-sm">
                      No item structure defined for this array field. Please check the field configuration.
                    </div>
                  )}
                </div>
              </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  const columns = [
    {
      title: 'Component',
      dataIndex: 'name',
      className: 'p-0',
      render: (text, record) => (
        <div
          className={`px-2 py-1 rounded cursor-pointer transition-colors duration-150 ${
            selectedComponent?._id === record._id ? 'bg-primary-600 text-white font-semibold shadow' : 'hover:bg-gray-100 text-gray-800'
          }`}
          style={{ margin: selectedComponent?._id === record._id ? '8px 0' : '0' }}
          onClick={() => handleComponentSelect(record)}
        >
          {text}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!layout || !layout.components || !Array.isArray(layout.components)) {
    return (
      <div className="text-center text-red-600 p-4">
        Invalid layout data
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackNavigation}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Back to Content"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Layout</h1>
          {isAutoSaving && (
            <span className="ml-3 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">Auto-saving...</span>
          )}
          {hasUnsavedChanges && !isAutoSaving && (
            <span className="ml-3 text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Unsaved changes</span>
          )}
        </div>
        <button
          disabled={saving}
          className={`flex items-center px-5 py-2 rounded text-white text-base font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleSave}
        >
          <FaSave className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)] w-full">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">Components</h2>
          </div>
          <SidebarComponentList
            components={orderedComponents}
            selectedComponentId={selectedComponent?._id}
            onSelectComponent={handleComponentSelect}
          />
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto p-8 bg-gray-50">
          {selectedComponent ? (
            <div className="max-w-full mx-auto w-full">
              <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">{selectedComponent.name}</h2>
              <div className="flex flex-col gap-6">
                {selectedComponent.fields?.map((field) => (
                  <div
                    key={field.name}
                    className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-base font-semibold text-gray-800">
                        {field.label || field.name}
                      </label>
                      {field.description && (
                        <span className="text-xs text-gray-400 ml-2">{field.description}</span>
                      )}
                    </div>
                    <div className="mt-0.5">
                      {renderField(field)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg mt-20">Select a component from the sidebar to edit</div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ImagePreviewModal 
        isOpen={showImagePreview} 
        imageUrl={previewImage} 
        onClose={() => {
          console.log('Closing image preview modal');
          setShowImagePreview(false);
          setPreviewImage(null);
        }} 
      />
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => {
          setIsMediaSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleMediaSelect}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          if (window.location.href.includes('refresh=true')) {
            window.onbeforeunload = null;
            window.location.reload();
          } else {
            navigate('/dashboard/content');
          }
        }}
        title={window.location.href.includes('refresh=true') ? "Confirm Page Refresh" : "Confirm Navigation"}
        message={
          window.location.href.includes('refresh=true')
            ? "You have unsaved changes. Are you sure you want to refresh the page? All unsaved changes will be lost."
            : "You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost."
        }
        confirmText={window.location.href.includes('refresh=true') ? "Refresh" : "Leave"}
        cancelText="Cancel"
        type="warning"
      />
      <SaveProgressModal
        isOpen={saveModalState.isOpen}
        status={saveModalState.status}
        savedData={saveModalState.data}
        onClose={() => {
          setSaveModalState(prev => ({ ...prev, isOpen: false }));
          if (saveModalState.status === 'error') {
            return;
          }
          if (saveModalState.status === 'success') {
            navigate('/dashboard/content');
          }
        }}
      />
    </div>
  );
};

export default LayoutComponentView;

/* ========================================================================
 * End of LayoutComponentView.jsx
 * Description: End of layout component view component. Designed and developed by Tech4biz Solutions. Copyright © Tech4biz Solutions Private.
 * ======================================================================== */ 