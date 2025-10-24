/* ========================================================================
 * File: ContentDashboard.jsx
 * Description: Dashboard page for managing content layouts and their instances.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaCube, FaClone, FaCog } from 'react-icons/fa';
import { getLayouts, deleteLayout } from '../../services/api';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../../components/global/DeleteConfirmModal';
import { ContentDashboardSkeleton } from '../../components/skeletons/DashboardSkeletons';
import { Trash2 } from 'lucide-react';

/**
 * InstancesTable
 * Table for displaying and managing layout instances.
 * @component
 * @param {object} props
 * @param {Array} props.instances - List of all instances.
 * @param {object} props.selectedLayout - The selected layout object.
 * @param {function} props.handleManageInstance - Handler for managing an instance.
 * @param {function} props.handleDeleteInstance - Handler for deleting an instance.
 * @returns {JSX.Element}
 */
const InstancesTable = ({ instances, selectedLayout, handleManageInstance, handleDeleteInstance }) => {
  const layoutInstances = instances.filter(i => i.layoutId === selectedLayout._id);
  return (
    <table className="min-w-full divide-y divide-gray-200" aria-label="Instances Table">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instance Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {layoutInstances.length > 0 ? (
          layoutInstances.map((instance) => (
            <tr key={instance.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{instance.title}</div>
                <div className="text-xs text-gray-500">{instance.pageSlug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  instance.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {instance.status?.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(instance.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleManageInstance(selectedLayout._id, instance.id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Manage Content"
                    aria-label={`Manage instance ${instance.title}`}
                  >
                    <FaCog className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteInstance(selectedLayout._id, instance.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Instance"
                    aria-label={`Delete instance ${instance.title}`}
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
              No instances found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const tagStyles = {
  dynamic: {
    color: '#9333EA',
    backgroundColor: '#F3E8FF',
    border: '1px solid #E9D5FF',
    borderRadius: '9999px',
    padding: '2px 12px'
  },
  static: {
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    border: '1px solid #DBEAFE',
    borderRadius: '9999px',
    padding: '2px 12px'
  }
};

/**
 * ContentDashboard
 * Dashboard page for managing content layouts and their instances.
 * @component
 * @returns {JSX.Element}
 */
const ContentDashboard = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLayoutId, setDeleteLayoutId] = useState(null);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [instanceTitle, setInstanceTitle] = useState('');
  const [instances, setInstances] = useState([]);
  const [layoutFilter, setLayoutFilter] = useState('all');
  const [selectedPage, setSelectedPage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLayouts();
    // Load instances from localStorage
    const savedInstances = localStorage.getItem('pageInstances');
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    }
  }, []);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      console.log('Fetching layouts...');
      const response = await getLayouts();
      console.log('API Response:', response);
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setLayouts(response.data);
        } 
        else if (response.data.data && Array.isArray(response.data.data)) {
          setLayouts(response.data.data);
        } 
        else if (response.data.success && Array.isArray(response.data.data)) {
          setLayouts(response.data.data);
        } 
        else {
          setLayouts([]);
        }
      } else {
        setLayouts([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching layouts:', err);
      setError('Failed to fetch layouts');
      toast.error('Failed to fetch layouts');
      setLayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      // Extract unique pages from layouts
      const uniquePages = Array.from(
        new Map(
          layouts
            .filter(layout => layout.page)
            .map(layout => [layout.page._id, layout.page])
        ).values()
      );
      setPages(uniquePages);
    } catch (error) {
      console.error('Error processing pages:', error);
    }
  };

  // Update useEffect to fetch pages after layouts are loaded
  useEffect(() => {
    if (layouts.length > 0) {
      fetchPages();
    }
  }, [layouts]);

  const handleDeleteLayout = (id) => {
    setDeleteLayoutId(id);
  };

  const handleConfirmDeleteLayout = async () => {
    if (deleteLayoutId) {
      try {
        await deleteLayout(deleteLayoutId);
        toast.success('Layout deleted successfully');
        fetchLayouts();
      } catch (error) {
        console.error('Error deleting layout:', error);
        toast.error('Failed to delete layout');
      } finally {
        setDeleteLayoutId(null);
      }
    }
  };

  const handleManageInstances = (layout) => {
    setSelectedLayout(layout);
    setShowInstanceModal(true);
  };

  const handleAddInstance = (layout) => {
    setSelectedLayout(layout);
    setShowTitleModal(true);
  };

  const handleTitleSubmit = () => {
    if (!instanceTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const instanceId = Date.now().toString();

    // Initialize empty fields for components
    const initialFields = {};
    selectedLayout.components?.forEach(component => {
      const fieldValues = {};
      component.fields?.forEach(field => {
        fieldValues[field.name] = field.default || '';
      });
      initialFields[component.name] = fieldValues;
    });

    // Create complete instance data
    const newInstanceData = {
      id: instanceId,
      title: instanceTitle,
      layoutId: selectedLayout._id,
      layoutName: selectedLayout.name,
      pageId: selectedLayout.page?._id,
      pageTitle: selectedLayout.page?.title,
      pageSlug: selectedLayout.page?.slug,
      status: 'draft',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: selectedLayout.createdBy,
      components: selectedLayout.components,
      fields: initialFields
    };

    // Update instances array
    const updatedInstances = [...instances, newInstanceData];
    setInstances(updatedInstances);
    localStorage.setItem('pageInstances', JSON.stringify(updatedInstances));

    setShowInstanceModal(false);
    setShowTitleModal(false);
    setInstanceTitle('');

    // Navigate to edit view with complete instance data
    navigate(`/dashboard/content/view/${selectedLayout._id}`, {
      state: {
        layout: selectedLayout,
        instance: newInstanceData,
        isNewInstance: true
      }
    });
  };

  const handleManageInstance = (layoutId, instanceId) => {
    const layout = layouts.find(l => l._id === layoutId);
    const instance = instances.find(i => i.id === instanceId);
    
    if (layout && instance) {
      navigate(`/dashboard/content/view/${layoutId}`, {
        state: {
          layout,
          instance,
          isNewInstance: false
        }
      });
    }
  };

  const handleDeleteInstance = (layoutId, instanceId) => {
    // Remove instance from array
    const updatedInstances = instances.filter(i => i.id !== instanceId);
    setInstances(updatedInstances);
    localStorage.setItem('pageInstances', JSON.stringify(updatedInstances));
    toast.success('Instance deleted successfully');
  };

  const getInstanceStatus = (instance) => {
    const instanceData = localStorage.getItem(`layoutInstance_${instance.layoutId}_${instance.id}`);
    if (instanceData) {
      const parsedData = JSON.parse(instanceData);
      return parsedData.status;
    }
    return instance.status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRowClick = (layout) => {
    // Navigate to view for all layout types
    navigate(`/dashboard/content/view/${layout._id}`, { state: { layout } });
  };

  // Update the getFilteredLayouts function to include all filters
  const getFilteredLayouts = () => {
    return layouts.filter(layout => {
      // Type filter (static/dynamic)
      const matchesType = layoutFilter === 'all' 
        ? true 
        : layoutFilter === 'static' 
          ? !layout.page?.isMultiPage 
          : layout.page?.isMultiPage;

      // Page filter
      const matchesPage = selectedPage === 'all' 
        ? true 
        : layout.page?._id === selectedPage;

      // Status filter
      const matchesStatus = statusFilter === 'all'
        ? true
        : statusFilter === 'active'
          ? layout.isActive
          : !layout.isActive;

      // Search query
      const matchesSearch = searchQuery === ''
        ? true
        : layout.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesPage && matchesStatus && matchesSearch;
    });
  };

  // Add this new function to get filtered pages based on layout type
  const getFilteredPages = () => {
    return Array.from(
      new Map(
        layouts
          .filter(layout => {
            if (layoutFilter === 'static') {
              return !layout.page?.isMultiPage;
            } else if (layoutFilter === 'dynamic') {
              return layout.page?.isMultiPage;
            }
            return true; // Show all pages when layoutFilter is 'all'
          })
          .filter(layout => layout.page)
          .map(layout => [layout.page._id, layout.page])
      ).values()
    );
  };

  // Reset selected page when layout filter changes
  useEffect(() => {
    setSelectedPage('all');
  }, [layoutFilter]);

  if (loading && layouts.length === 0) {
    return <ContentDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto px-4 py-8" aria-label="Content Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>

      {/* Filter buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setLayoutFilter('all')}
          className={`px-4 py-2 rounded-md ${
            layoutFilter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Layouts
        </button>
        <button
          onClick={() => setLayoutFilter('static')}
          className={`px-4 py-2 rounded-md ${
            layoutFilter === 'static'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Static Pages
        </button>
        <button
          onClick={() => setLayoutFilter('dynamic')}
          className={`px-4 py-2 rounded-md ${
            layoutFilter === 'dynamic'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Dynamic Pages
        </button>
      </div>

      {/* Additional filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Page Select */}
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">
            {layoutFilter === 'all' 
              ? 'All Pages' 
              : layoutFilter === 'static' 
                ? 'All Static Pages' 
                : 'All Dynamic Pages'
            }
          </option>
          {getFilteredPages().map(page => (
            <option key={page._id} value={page._id}>
              {page.title}
            </option>
          ))}
        </select>

        {/* Status Select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Components
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getFilteredLayouts().length > 0 ? (
              getFilteredLayouts().map((layout) => (
                <tr 
                  key={layout._id}
                  onClick={() => handleRowClick(layout)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{layout.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {layout.page?.title || 'No page assigned'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {layout.page?.slug || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span style={layout.page?.isMultiPage ? tagStyles.dynamic : tagStyles.static}>
                      {layout.page?.isMultiPage ? 'Dynamic' : 'Static'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCube className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {layout.components?.length || 0} components
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      layout.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {layout.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(layout.createdAt)}
                    </div>
                    <div className="text-xs text-gray-400">
                      by {layout.createdBy?.email || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center" onClick={(e) => e.stopPropagation()}>
                     
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLayout(layout._id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Layout"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  {layoutFilter === 'all' 
                    ? 'No layouts found'
                    : `No ${layoutFilter} layouts found`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Instance Management Modal */}
      {showInstanceModal && selectedLayout && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Manage Instances - {selectedLayout.name}
              </h2>
              <button
                onClick={() => setShowInstanceModal(false)}
                className="text-gray-400 hover:text-gray-500"
                aria-label="Close Instance Modal"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Instances</h3>
                <button
                  onClick={() => handleAddInstance(selectedLayout)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  aria-label="Add New Instance"
                >
                  <FaPlus className="mr-2" />
                  Add New Instance
                </button>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <InstancesTable
                  instances={instances}
                  selectedLayout={selectedLayout}
                  handleManageInstance={handleManageInstance}
                  handleDeleteInstance={handleDeleteInstance}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowInstanceModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Close Instance Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Input Modal */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add New Instance
              </h2>
              <button
                onClick={() => setShowTitleModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label htmlFor="instanceTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Instance Title
              </label>
              <input
                type="text"
                id="instanceTitle"
                value={instanceTitle}
                onChange={(e) => setInstanceTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter instance title"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTitleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTitleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteLayoutId !== null}
        onClose={() => setDeleteLayoutId(null)}
        onConfirm={handleConfirmDeleteLayout}
        title="Delete Layout"
        message="Are you sure you want to delete this layout? This action cannot be undone."
      />
    </div>
  );
};

export default ContentDashboard;

/* ========================================================================
 * End of file: ContentDashboard.jsx
 * ======================================================================== */ 