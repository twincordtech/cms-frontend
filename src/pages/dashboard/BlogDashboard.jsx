/* ========================================================================
 * File: BlogDashboard.jsx
 * Description: Dashboard page for managing blog posts (CRUD, search, publish, preview).
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaCheck, FaTimes, FaClock, FaBook, FaCalendarAlt, FaUserEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Modal, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { cmsApi, authorApi } from '../../services/api';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import { BlogDashboardSkeleton } from '../../components/skeletons/DashboardSkeletons';
import BlogForm from './BlogForm';
import debounce from 'lodash/debounce';
import { format, formatDistanceToNow } from 'date-fns';

const { confirm } = Modal;

/**
 * BlogDashboard
 * Dashboard page for listing, searching, creating, editing, publishing, and deleting blogs.
 * @component
 * @returns {JSX.Element}
 */
const BlogDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [authorLoading, setAuthorLoading] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  // Debounce the search to prevent jerky page updates
  /**
   * Debounced fetch for blogs based on search term and page.
   * Uses lodash.debounce to limit API calls.
   */
  const debouncedFetchBlogs = useCallback(
    debounce(async (term, page) => {
      try {
        setLoading(true);
        const response = await cmsApi.getBlogs({
          page,
          search: term,
          limit: 10 // Add limit to control items per page
        });
        if (response.data) {
          setBlogs(response.data.data || []);
          setTotalPages(response.data.pagination?.pages || 1);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Search error:', error);
        setError(error.response?.data?.message || 'Failed to fetch blogs');
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchBlogs(searchTerm, currentPage);
    return () => debouncedFetchBlogs.cancel();
  }, [currentPage, searchTerm, debouncedFetchBlogs]);

  /**
   * Fetches blogs for the current page and search term.
   */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await cmsApi.getBlogs({
        page: currentPage,
        search: searchTerm,
        limit: 10
      });
      if (response.data) {
        setBlogs(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Fetch error:', error);
      setError(error.response?.data?.message || 'Failed to fetch blogs');
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Shows a confirmation modal before deleting a blog.
   * @param {object} blog - The blog to delete.
   */
  const showDeleteConfirm = (blog) => {
    confirm({
      title: 'Are you sure you want to delete this blog?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete "${blog.title}". This action cannot be undone.`,
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk: async () => {
        try {
          setActionLoading(true);
          await cmsApi.deleteBlog(blog._id);
          toast.success('Blog deleted successfully');
          setBlogs(prevBlogs => prevBlogs.filter(b => b._id !== blog._id));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Delete error:', error);
          toast.error(error.response?.data?.message || 'Failed to delete blog');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  /**
   * Shows a confirmation modal before publishing/unpublishing a blog.
   * @param {object} blog - The blog to publish/unpublish.
   * @param {string} action - 'publish' or 'unpublish'.
   */
  const showPublishConfirm = (blog, action) => {
    const isPublish = action === 'publish';
    confirm({
      title: `Are you sure you want to ${action} this blog?`,
      icon: <ExclamationCircleOutlined />,
      content: isPublish 
        ? 'This will make the blog visible to the public.'
        : 'This will hide the blog from the public.',
      okText: `Yes, ${action} it`,
      okType: isPublish ? 'primary' : 'default',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setActionLoading(true);
          const response = await (isPublish ? cmsApi.publishBlog(blog._id) : cmsApi.unpublishBlog(blog._id));
          if (response.data) {
            toast.success(`Blog ${isPublish ? 'published' : 'unpublished'} successfully`);
            setBlogs(prevBlogs => 
              prevBlogs.map(b => 
                b._id === blog._id ? { ...b, status: isPublish ? 'published' : 'draft' } : b
              )
            );
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`${action} error:`, error);
          toast.error(error.response?.data?.message || `Failed to ${action} blog`);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  /**
   * Handler for deleting a blog.
   * @param {object} blog
   */
  const handleDelete = (blog) => {
    showDeleteConfirm(blog);
  };

  /**
   * Handler for publishing a blog.
   * @param {object} blog
   */
  const handlePublish = (blog) => {
    showPublishConfirm(blog, 'publish');
  };

  /**
   * Handler for unpublishing a blog.
   * @param {object} blog
   */
  const handleUnpublish = (blog) => {
    showPublishConfirm(blog, 'unpublish');
  };

  /**
   * Handler for editing a blog (opens the form).
   * @param {object} blog
   */
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  /**
   * Handler for closing the blog form modal.
   */
  const handleFormClose = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  /**
   * Handler for submitting the blog form (create or update).
   * @param {object} formData
   */
  const handleFormSubmit = async (formData) => {
    try {
      setActionLoading(true);
      if (editingBlog) {
        await cmsApi.updateBlog(editingBlog._id, formData);
        toast.success('Blog updated successfully');
      } else {
        await cmsApi.createBlog(formData);
        toast.success('Blog created successfully');
      }
      handleFormClose();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handler for search input changes.
   * @param {string} value
   */
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  /**
   * Handler for previewing a blog.
   * @param {object} blog
   */
  const handlePreview = (blog) => {
    setPreviewBlog(blog);
    setShowPreviewModal(true);
  };

  /**
   * Calculates reading time and word count for a blog's content.
   * @param {string} content
   * @returns {{wordCount: number, readingTime: number}}
   */
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/)?.length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return { wordCount, readingTime };
  };

  // Fetch authors for select
  const fetchAuthors = async () => {
    try {
      setAuthorLoading(true);
      const res = await authorApi.getAuthors();
      setAuthors(res.data.data || []);
    } catch (e) {
      toast.error('Failed to fetch authors');
    } finally {
      setAuthorLoading(false);
    }
  };
  useEffect(() => { fetchAuthors(); }, []);

  // Add new author and refresh authors list, then select new author
  const handleAuthorAdded = async (name) => {
    const res = await authorApi.createAuthor({ name, email: `${name.replace(/\s+/g, '').toLowerCase()}@example.com` });
    await fetchAuthors();
    setSelectedAuthorId(res.data.data.id);
  };

  if (loading && blogs.length === 0) {
    // Show skeleton loader while loading
    return <BlogDashboardSkeleton />;
  }

  if (error && blogs.length === 0) {
    // Show error message and retry button if fetch fails
    return (
      <div className="text-center py-8" role="alert">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchBlogs} className="mt-4" aria-label="Retry Fetch Blogs">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto px-4 py-8" aria-label="Blog Dashboard">
      {/* Header and search/create controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Blog Management</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 bg-white text-sm"
              aria-label="Search Blogs"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 gap-2 font-medium shadow-sm hover:shadow-md whitespace-nowrap"
            aria-label="Create Blog"
          >
            <FaPlus className="w-4 h-4" aria-hidden="true" />
            Create Blog
          </button>
        </div>
      </div>

      {/* Main content: table or empty state */}
      {loading && blogs.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto" aria-label="No Blogs State">
          <div className="mb-6">
            {searchTerm ? (
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaSearch className="w-8 h-8 text-gray-400" aria-hidden="true" />
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <FaPlus className="w-8 h-8 text-blue-600" aria-hidden="true" />
              </div>
            )}
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {searchTerm ? 'No Blogs Found' : 'Create Your First Blog'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm ? (
                <>
                  No blogs found matching "<span className="font-medium">{searchTerm}</span>".
                  Try adjusting your search terms.
                </>
              ) : (
                'Start creating your first blog post to engage with your audience.'
              )}
            </p>
          </div>

          {searchTerm ? (
            <div className="flex flex-col gap-4 items-center">
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 gap-2 font-medium"
                aria-label="Clear Search"
              >
                Clear Search
              </button>
              <span className="text-gray-400">or</span>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 gap-2 font-medium"
                aria-label="Create New Blog"
              >
                <FaPlus className="w-4 h-4" aria-hidden="true" />
                Create New Blog
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 gap-2 font-medium"
              aria-label="Create Your First Blog"
            >
              <FaPlus className="w-4 h-4" aria-hidden="true" />
              Create Your First Blog
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Blog table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" aria-label="Blog List Table">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Blog Details</span>
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</span>
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</span>
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Published</span>
                      </div>
                    </th>
                    <th className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs.map((blog, index) => {
                    const { wordCount, readingTime } = calculateReadingTime(blog.content);
                    return (
                      <tr 
                        key={blog._id} 
                        className={`group transition-all duration-200 hover:bg-blue-50/30 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                        tabIndex={0}
                        aria-label={`Blog row for ${blog.title}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {blog.title}
                            </span>
                            <div className="flex items-center gap-3 mt-0.5">
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <FaBook className="w-3 h-3" aria-hidden="true" />
                                <span className="text-xs">{wordCount} words</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <FaClock className="w-3 h-3" aria-hidden="true" />
                                <span className="text-xs">{readingTime} min read</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-md">
                              {(blog.author?.name || 'U')[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {blog.author?.name || 'Unknown'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {blog.author?.role || 'No role'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${
                              blog.status === 'published'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}
                            aria-label={blog.status === 'published' ? 'Published' : 'Draft'}
                          >
                            {blog.status === 'published' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                Published
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
                                Draft
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-900">
                              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(blog.createdAt), 'h:mm a')}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {blog.publishedAt ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-gray-900">
                                {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(blog.publishedAt), 'h:mm a')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Not published</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(blog)}
                                className="relative z-10 w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
                                title="Edit"
                                aria-label={`Edit blog ${blog.title}`}
                              >
                                <FaEdit className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => handlePreview(blog)}
                                className="relative z-20 w-8 h-8 flex items-center justify-center text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
                                title="Preview"
                                aria-label={`Preview blog ${blog.title}`}
                              >
                                <FaEye className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => blog.status === 'published' ? handleUnpublish(blog) : handlePublish(blog)}
                                className={`relative z-30 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md ${
                                  blog.status === 'published'
                                    ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                                    : 'text-green-600 bg-green-50 hover:bg-green-100'
                                }`}
                                title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                aria-label={blog.status === 'published' ? `Unpublish blog ${blog.title}` : `Publish blog ${blog.title}`}
                                disabled={actionLoading}
                              >
                                {blog.status === 'published' ? (
                                  <FaTimes className="w-3.5 h-3.5" aria-hidden="true" />
                                ) : (
                                  <FaCheck className="w-3.5 h-3.5" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => handleDelete(blog)}
                              className="w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md ml-1"
                              title="Delete"
                              aria-label={`Delete blog ${blog.title}`}
                              disabled={actionLoading}
                            >
                              <FaTrash className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4 bg-gray-50 border-t border-gray-100">
                <nav className="flex gap-1" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </>
      )}

      {/* Blog form modal */}
      {showForm && (
        <Modal
          visible={showForm}
          onCancel={handleFormClose}
          footer={null}
          width={800}
          className="blog-form-modal"
          destroyOnClose
          aria-label="Blog Form Modal"
        >
          <BlogForm
            blog={editingBlog}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            authors={authors}
            onAuthorAdded={handleAuthorAdded}
          />
        </Modal>
      )}

      {/* Blog preview modal */}
      {showPreviewModal && previewBlog && (
        <Modal
          visible={showPreviewModal}
          onCancel={() => setShowPreviewModal(false)}
          footer={null}
          width={1000}
          className="blog-preview-modal"
          aria-label="Blog Preview Modal"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{previewBlog.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">
                By {previewBlog.author?.name || 'Unknown'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {new Date(previewBlog.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
          </div>
        </Modal>
      )}

      {/* Custom modal styles */}
      <style jsx>{`
        .blog-form-modal .ant-modal-content,
        .blog-preview-modal .ant-modal-content {
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .blog-form-modal .ant-modal-header,
        .blog-preview-modal .ant-modal-header {
          border-bottom: none;
          padding: 1.5rem;
        }
        
        .blog-form-modal .ant-modal-body,
        .blog-preview-modal .ant-modal-body {
          padding: 0 1.5rem 1.5rem;
        }
        
        .blog-form-modal .ant-modal-close,
        .blog-preview-modal .ant-modal-close {
          top: 1rem;
          right: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BlogDashboard; 