// ===============================
// File: PagesList.jsx
// Description: Admin dashboard page for listing, creating, and deleting CMS pages.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaExternalLinkAlt, FaLink } from 'react-icons/fa';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import { PagesListSkeleton } from '../../components/skeletons/DashboardSkeletons';
import { cmsApi } from '../../services/api';
import { FEATURES, UI_CONFIG } from '../../config';
import { message } from 'antd';
import { Pagination } from 'antd';
import DeletePageModal from '../../components/pages/DeletePageModal';

const PagesList = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cmsApi.getAdminPages();
      setPages(response.data.data);
      message.success('Pages loaded successfully');
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError(error.response?.data?.message || 'Failed to load pages');
      
      // Use mock data if enabled and API fails
      if (FEATURES.ENABLE_MOCK_DATA) {
        const mockPages = [
          { _id: '1', title: 'Home Page', slug: 'home', isActive: true, createdAt: new Date() },
          { _id: '2', title: 'About Us', slug: 'about', isActive: true, createdAt: new Date() },
          { _id: '3', title: 'Services', slug: 'services', isActive: false, createdAt: new Date() },
        ];
        setPages(mockPages);
        message.warning('Using sample pages (API connection failed)');
      } else {
        message.error('Failed to load pages');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  // Delete a page
  const handleDeletePage = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await cmsApi.deletePage(deleteId);
      setPages(prevPages => prevPages.filter(page => page._id !== deleteId));
      message.success('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
      setError(error.response?.data?.message || 'Failed to delete page');
      message.error('Failed to delete page');
    } finally {
      setLoading(false);
      setDeleteId(null);
      setShowDeleteConfirm(false);
    }
  };

  const copyEndpoint = (slug) => {
    const endpoint = `/api/cms/pages/${slug}/content`;
    navigator.clipboard.writeText(endpoint);
    message.success('API endpoint copied to clipboard');
  };

  // Format date using the config
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', UI_CONFIG.DATE_FORMAT.LONG).format(date);
  };

  // Pagination logic
  const paginatedPages = pages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading && pages.length === 0) {
    return <PagesListSkeleton />;
  }

  return (
    <div className="container max-w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Pages</h1>
        <Button
          onClick={() => navigate('/dashboard/pages/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Page
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeletePageModal
          isOpen={showDeleteConfirm}
          onCancel={cancelDelete}
          onConfirm={handleDeletePage}
          loading={loading}
        />
      )}

      {/* Pages List */}
      <Card>
        {pages.length === 0 ? (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2">No Pages Yet</h2>
            <p className="text-gray-600 mb-4">Create your first page to get started</p>
            <Button
              onClick={() => navigate('/dashboard/pages/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center"
            >
              <FaPlus className="mr-2" /> Create New Page
            </Button>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                 
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPages.map((page) => (
                  <tr key={page._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {page.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.isMultiPage 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {page.isMultiPage ? 'Dynamic' : 'Static'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 font-mono">{page.apiEndpoint}</span>
                        <button onClick={() => copyEndpoint(page.slug)} className="ml-2 text-blue-500 hover:text-blue-700" title="Copy API Endpoint">
                          <FaLink />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(page.createdAt)}</div>
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                       
                        <Link 
                          to={`/dashboard/pages/edit/${page._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit page"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => confirmDelete(page._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete page"
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
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={pages.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
          </>
        )}
      </Card>

      {/* Debug info if there was an API error */}
      {error && (
        <Card className="mt-6 bg-yellow-50 border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">API Debugging Info</h3>
          <p className="text-xs text-yellow-700">{error}</p>
        </Card>
      )}
    </div>
  );
};

export default PagesList; 