// ===============================
// File: PageForm.jsx
// Description: Form for creating or editing a CMS page (title, slug, meta, toggles).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { cmsApi } from '../../services/api';
import { message } from 'antd';
import MetaFields from '../../components/pages/MetaFields';
import ToggleFields from '../../components/pages/ToggleFields';

const PageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    isActive: true,
    isMultiPage: false,
    metaTitle: '',
    metaDescription: '',
    status: 'draft' // Add status field, default to 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchPageDetails(id);
    }
  }, [id]);

  const fetchPageDetails = async (pageId) => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await cmsApi.getPage(pageId);
      // Try both possible structures
      const data = response.data.page || response.data.data || response.data;
      setPageData(prev => ({
        ...prev,
        ...data,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || ''
      }));
    } catch (error) {
      console.error('Error fetching page details:', error);
      setError(error.response?.data?.message || 'Failed to load page details');
      message.error('Failed to load page details');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setPageData(prev => ({ ...prev, [name]: inputValue }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    
    setPageData(prev => ({ 
      ...prev, 
      title,
      slug: !prev.slug || prev.slug === generateSlug(prev.title) ? slug : prev.slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (!pageData.title || !pageData.slug || !pageData.metaTitle || !pageData.metaDescription) {
        message.error('All fields are required');
        return;
      }
      
      const response = isEditMode
        ? await cmsApi.updatePage(id, pageData)
        : await cmsApi.createPage(pageData);
      
      console.log(isEditMode ? 'Page updated:' : 'Page created:', response.data);
      message.success(isEditMode ? 'Page updated successfully' : 'Page created successfully');
      navigate('/dashboard/pages');
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} page:`, error);
      setError(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} page`);
      message.error(`Failed to ${isEditMode ? 'update' : 'create'} page`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Page' : 'Create New Page'}
      </h1>
      
      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Page Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={pageData.title}
              onChange={handleTitleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={pageData.slug}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be used in the URL: example.com/page/<strong>{pageData.slug || 'your-slug'}</strong>
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={pageData.status}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <MetaFields
            metaTitle={pageData.metaTitle}
            metaDescription={pageData.metaDescription}
            onChange={handleInputChange}
          />
          
          <ToggleFields
            isActive={pageData.isActive}
            isMultiPage={pageData.isMultiPage}
            onChange={handleInputChange}
          />
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => navigate('/dashboard/pages')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              isLoading={loading}
            >
              {isEditMode ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PageForm; 