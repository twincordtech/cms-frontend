// ===============================
// File: SectionForm.jsx
// Description: Form for creating or editing a content section with fields, lists, and media.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaPlus, FaList, FaTrash, FaImage, FaTimes, FaFileAlt, FaFile } from 'react-icons/fa';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SectionLayoutSelect from '../../components/sections/SectionLayoutSelect';
import SectionLayoutFields from '../../components/sections/SectionLayoutFields';
import SectionPreview from '../../components/sections/SectionPreview';
import MediaSelector from '../../components/MediaSelector';
import { API_CONFIG, FEATURES } from '../../config';
import { cmsApi } from '../../services/api';
import PageSelect from '../../components/sections/PageSelect';

const LAYOUTS = {
  'two-column': { name: '2 Column Layout', fields: 2 },
  'three-column': { name: '3 Column Layout', fields: 3 },
  'four-column': { name: '4 Column Layout', fields: 4 }
};

const SectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Wizard steps
  const [currentStep, setCurrentStep] = useState(1);
  
  // Preview mode toggle
  const [showPreview, setShowPreview] = useState(false);
  
  // Section data
  const [formData, setFormData] = useState({
    sectionTitle: '',
    sectionDescription: '',
    fields: [],
    lists: []
  });
  const [layoutType, setLayoutType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [error, setError] = useState(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);

  useEffect(() => {
    // Fetch available pages when the component loads
    fetchPages();

    if (isEditMode) {
      fetchSectionData();
    }
  }, [id]);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await cmsApi.getAdminPages();
      const pages = response.data.data || [];
      setPages(pages);
      
      // If there's at least one page, select the first one by default for new sections
      if (pages.length > 0 && !isEditMode) {
        setSelectedPageId(pages[0]._id);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages');
      
      // Use mock data if enabled
      if (FEATURES.ENABLE_MOCK_DATA) {
        const mockPages = [
          { _id: '1', title: 'Home Page', slug: 'home', isActive: true },
          { _id: '2', title: 'About Us', slug: 'about', isActive: true },
          { _id: '3', title: 'Services', slug: 'services', isActive: false },
        ];
        setPages(mockPages);
        setSelectedPageId('1');
        toast.warning('Using sample pages (API connection failed)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await cmsApi.getSection(id);
      const section = response.data.data;

      setLayoutType(section.type || '');
      setSelectedPageId(section.pageId);
      
      // Initialize fields array based on the section data
      const fields = section.data.fields || [];
      const lists = section.data.lists || [];
      
      setFormData({
        sectionTitle: section.data.title || '',
        sectionDescription: section.data.description || '',
        fields: fields.map(field => ({
          title: field.title || '',
          content: field.content || '',
          type: field.type || 'text'
        })),
        lists: lists.map(list => ({
          id: list.id || Date.now(),
          items: list.items || []
        }))
      });
      
      // Move to the configure content step since we have all data
      setCurrentStep(3);
    } catch (error) {
      console.error('Error fetching section:', error);
      setError('Failed to fetch section data');
      toast.error('Failed to load section data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sectionTitle' || name === 'sectionDescription') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFieldChange = (e, index, type = 'field', listIndex = null) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (type === 'field') {
        const fieldsCopy = [...(prev.fields || [])];
        if (name.includes('Title')) {
          fieldsCopy[index] = { ...fieldsCopy[index], title: value };
        } else if (name.includes('Content')) {
          fieldsCopy[index] = { ...fieldsCopy[index], content: value };
        }
        newData.fields = fieldsCopy;
      } else if (type === 'list') {
        const listsCopy = [...(prev.lists || [])];
        if (listIndex !== null && listsCopy[listIndex]) {
          const items = [...(listsCopy[listIndex].items || [])];
          if (name.includes('Title')) {
            items[index] = { ...items[index], title: value };
          } else if (name.includes('Content')) {
            items[index] = { ...items[index], content: value };
          }
          listsCopy[listIndex] = { ...listsCopy[listIndex], items };
          newData.lists = listsCopy;
        }
      }
      
      return newData;
    });
  };

  const handlePageSelect = (pageId) => {
    setSelectedPageId(pageId);
    setCurrentStep(3);
  };

  const handleLayoutSelect = (type) => {
    setLayoutType(type);
    initializeFieldsForLayout(type);
    setCurrentStep(2);
  };

  const initializeFieldsForLayout = (type) => {
    const layout = LAYOUTS[type];
    if (!layout) return;

    const newFields = Array(layout.fields).fill(null).map(() => ({
      title: '',
      content: '',
      type: 'text'
    }));

    setFormData(prev => ({
      ...prev,
      fields: newFields,
      lists: []
    }));
  };

  const addNewField = (type = 'text') => {
    setFormData(prev => ({
      ...prev,
      fields: [...(prev.fields || []), { title: '', content: '', type }]
    }));
  };

  const addNewList = () => {
    setFormData(prev => ({
      ...prev,
      lists: [...(prev.lists || []), {
        id: Date.now(),
        items: [{ title: '', content: '' }]
      }]
    }));
  };

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const removeList = (listIndex) => {
    setFormData(prev => ({
      ...prev,
      lists: prev.lists.filter((_, i) => i !== listIndex)
    }));
  };

  const addItemToList = (listIndex) => {
    setFormData(prev => {
      const newLists = [...prev.lists];
      newLists[listIndex].items.push({ title: '', content: '' });
      return { ...prev, lists: newLists };
    });
  };

  const removeItemFromList = (listIndex, itemIndex) => {
    setFormData(prev => {
      const newLists = [...prev.lists];
      newLists[listIndex].items = newLists[listIndex].items.filter((_, i) => i !== itemIndex);
      return { ...prev, lists: newLists };
    });
  };

  const handleMediaSelect = (file) => {
    if (editingFieldIndex !== null) {
      setFormData(prev => {
        const newFields = [...prev.fields];
        newFields[editingFieldIndex] = {
          ...newFields[editingFieldIndex],
          content: file,
          type: 'media'
        };
        return { ...prev, fields: newFields };
      });
    }
    setShowMediaSelector(false);
    setEditingFieldIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (!selectedPageId) {
        toast.error('Please select a page for this section');
        return;
      }

      if (!layoutType) {
        toast.error('Please select a layout type');
        return;
      }

      if (!formData.sectionTitle) {
        toast.error('Section title is required');
        return;
      }

      const sectionData = {
        pageId: selectedPageId,
        type: layoutType,
        data: {
          title: formData.sectionTitle,
          description: formData.sectionDescription,
          fields: formData.fields,
          lists: formData.lists
        }
      };

      if (isEditMode) {
        await cmsApi.updateSection(id, sectionData);
        toast.success('Section updated successfully');
      } else {
        await cmsApi.createSection(sectionData);
        toast.success('Section created successfully');
      }

      navigate('/dashboard/sections');
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error(error.response?.data?.message || 'Failed to save section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">
            {isEditMode ? 'Edit Section' : 'Create New Section'}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`flex-1 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              1. Choose Layout
            </div>
            <div className={`flex-1 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              2. Select Page
            </div>
            <div className={`flex-1 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              3. Configure Content
            </div>
          </div>

          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(LAYOUTS).map(([type, layout]) => (
                  <button
                    key={type}
                    onClick={() => handleLayoutSelect(type)}
                    className={`p-6 border rounded-lg hover:border-blue-500 transition-colors ${
                      layoutType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{layout.name}</h3>
                    <p className="text-gray-600">
                      {layout.fields} Columns
                    </p>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Select Page</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.map(page => (
                    <button
                      key={page._id}
                      onClick={() => handlePageSelect(page._id)}
                      className={`p-4 border rounded-lg hover:border-blue-500 transition-colors ${
                        selectedPageId === page._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-sm text-gray-500">{page.slug}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section Title</label>
                    <input
                      type="text"
                      name="sectionTitle"
                      value={formData.sectionTitle}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="sectionDescription"
                      value={formData.sectionDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={() => addNewField('text')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" />
                    Add Field
                  </button>
                  <button
                    type="button"
                    onClick={() => addNewField('media')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaImage className="mr-2" />
                    Add Media
                  </button>
                  <button
                    type="button"
                    onClick={addNewList}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <FaList className="mr-2" />
                    Add List
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Fields */}
                  {formData.fields && formData.fields.map((field, index) => (
                    <div key={`field-${index}`} className="bg-gray-50 p-4 rounded-lg relative">
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Field {index + 1} Title
                        </label>
                        <input
                          type="text"
                          name={`field${index}Title`}
                          value={field.title || ''}
                          onChange={(e) => handleFieldChange(e, index, 'field')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter title for field ${index + 1}`}
                        />
                      </div>
                      {field.type === 'media' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Media Content
                          </label>
                          {field.content?.url ? (
                            <div className="relative w-48 h-48 border rounded-lg overflow-hidden bg-gray-50">
                              {field.content.type === 'image' ? (
                                <img
                                  src={field.content.url}
                                  alt={field.content.name || 'Selected media'}
                                  className="w-full h-full object-cover"
                                />
                              ) : field.content.type === 'video' ? (
                                <video
                                  src={field.content.url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                  <FaFile className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-48 h-48 border rounded-lg flex items-center justify-center bg-gray-50">
                              <FaImage className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingFieldIndex(index);
                                setShowMediaSelector(true);
                              }}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50"
                            >
                              {field.content?.url ? 'Change Media' : 'Select Media'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Field {index + 1} Content
                          </label>
                          <textarea
                            name={`field${index}Content`}
                            value={field.content || ''}
                            onChange={(e) => handleFieldChange(e, index, 'field')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder={`Enter content for field ${index + 1}`}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Lists */}
                  {formData.lists && formData.lists.map((list, listIndex) => (
                    <div key={`list-${list.id}`} className="bg-gray-50 p-4 rounded-lg relative">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">List {listIndex + 1}</h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => addItemToList(listIndex)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Add Item
                          </button>
                          <button
                            type="button"
                            onClick={() => removeList(listIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {list.items && list.items.map((item, itemIndex) => (
                        <div key={`list-${list.id}-item-${itemIndex}`} className="mb-4 bg-white p-4 rounded-lg relative">
                          <button
                            type="button"
                            onClick={() => removeItemFromList(listIndex, itemIndex)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Item {itemIndex + 1} Title
                            </label>
                            <input
                              type="text"
                              name={`list${listIndex}Item${itemIndex}Title`}
                              value={item.title || ''}
                              onChange={(e) => handleFieldChange(e, itemIndex, 'list', listIndex)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`Enter title for item ${itemIndex + 1}`}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Item {itemIndex + 1} Content
                            </label>
                            <textarea
                              name={`list${listIndex}Item${itemIndex}Content`}
                              value={item.content || ''}
                              onChange={(e) => handleFieldChange(e, itemIndex, 'list', listIndex)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows="4"
                              placeholder={`Enter content for item ${itemIndex + 1}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md ml-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : isEditMode ? 'Update Section' : 'Create Section'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Card>

      {showMediaSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MediaSelector
              onSelect={handleMediaSelect}
              onClose={() => {
                setShowMediaSelector(false);
                setEditingFieldIndex(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionForm;