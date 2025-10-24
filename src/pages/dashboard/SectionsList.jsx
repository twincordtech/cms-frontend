// ===============================
// File: SectionsList.jsx
// Description: List and management page for content sections, including ordering, status, and actions.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaColumns, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { cmsApi } from '../../services/api';

const SectionsList = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await cmsApi.getAdminSections();
      setSections(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      try {
        await cmsApi.deleteSection(id);
        toast.success('Section deleted successfully');
        fetchSections();
      } catch (error) {
        console.error('Error deleting section:', error);
        toast.error('Failed to delete section');
      }
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await cmsApi.updateSection(id, { isActive: !currentStatus });
      toast.success(`Section ${currentStatus ? 'unpublished' : 'published'} successfully`);
      fetchSections();
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  // Handle moving section up or down in order
  const handleReorderSection = async (id, direction) => {
    try {
      setOrderLoading(true);
      const section = sections.find(s => s._id === id);
      if (!section) return;
      
      // Calculate new order based on direction
      const newOrder = direction === 'up' ? section.order - 1 : section.order + 1;
      
      // Find section that needs to swap places
      const sectionToSwap = sections.find(s => s.order === newOrder);
      if (!sectionToSwap) {
        setOrderLoading(false);
        return;
      }
      
      // Update both sections
      await Promise.all([
        cmsApi.updateSection(id, { order: newOrder }),
        cmsApi.updateSection(sectionToSwap._id, { order: section.order })
      ]);
      
      toast.success('Section order updated');
      fetchSections();
    } catch (error) {
      console.error('Error reordering section:', error);
      toast.error('Failed to reorder section');
    } finally {
      setOrderLoading(false);
    }
  };

  // Transform section data for display
  const formatSectionsForDisplay = (sections) => {
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => ({
        _id: section._id,
        title: section.data?.title || 'Untitled Section',
        published: section.isActive,
        updatedAt: section.updatedAt,
        type: section.type,
        order: section.order
      }));
  };

  const getLayoutTypeLabel = (type) => {
    switch (type) {
      case 'two-column':
        return 'Two Column';
      case 'three-column':
        return 'Three Column';
      case 'four-column':
        return 'Four Column';
      case 'content':
      default:
        return 'Standard Content';
    }
  };

  const getLayoutIcon = (type) => {
    return <FaColumns className="mr-1" />;
  };

  const displaySections = formatSectionsForDisplay(sections);
  const maxOrder = displaySections.length > 0 ? Math.max(...displaySections.map(s => s.order)) : 0;
  const minOrder = displaySections.length > 0 ? Math.min(...displaySections.map(s => s.order)) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Sections</h1>
        <Link
          to="/dashboard/sections/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> New Section
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : displaySections.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layout Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displaySections.map((section) => (
                <tr key={section._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{section.order}</span>
                      <div className="flex flex-col">
                        <button 
                          onClick={() => handleReorderSection(section._id, 'up')}
                          disabled={section.order === minOrder || orderLoading}
                          className={`text-gray-500 hover:text-blue-600 ${section.order === minOrder ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move Up"
                        >
                          <FaArrowUp size={12} />
                        </button>
                        <button 
                          onClick={() => handleReorderSection(section._id, 'down')}
                          disabled={section.order === maxOrder || orderLoading}
                          className={`text-gray-500 hover:text-blue-600 ${section.order === maxOrder ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move Down"
                        >
                          <FaArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{section.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-700">
                      {getLayoutIcon(section.type)}
                      <span>{getLayoutTypeLabel(section.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        section.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {section.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(section.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        to={`/dashboard/sections/edit/${section._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(section._id, section.published)}
                        className={`hover:text-green-800 ${section.published ? 'text-green-600' : 'text-gray-400'}`}
                        title={section.published ? 'Unpublish' : 'Publish'}
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No sections found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first section</p>
          <Link
            to="/dashboard/sections/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Create Section
          </Link>
        </div>
      )}
    </div>
  );
};

export default SectionsList; 