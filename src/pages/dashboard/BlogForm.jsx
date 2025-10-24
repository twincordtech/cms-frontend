/* ========================================================================
 * File: BlogForm.jsx
 * Description: Form component for creating and editing blog posts, with validation, media selection, and preview.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Select from '../../components/elements/Select';
import MediaSelector from '../../components/MediaSelector';
import { Link } from 'react-router-dom';
import BlogPreview from '../../components/BlogPreview';
import PropTypes from 'prop-types';

/**
 * BlogForm
 * Form for creating or editing a blog post, with validation, media selection, and preview.
 * @component
 * @param {object} props
 * @param {object} [props.blog] - The blog to edit (if any).
 * @param {function} props.onClose - Callback to close the form.
 * @param {function} props.onSubmit - Callback to submit the form data.
 * @returns {JSX.Element}
 */
const BlogForm = ({ blog, onClose, onSubmit, authors = [], onAuthorAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    status: 'draft',
    pageName: '',
    authorName: '',
    authorRole: '',
    excerpt: '',
    featuredImage: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [authorLoading, setAuthorLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        slug: blog.slug || '',
        status: blog.status || 'draft',
        pageName: blog.pageName || '',
        authorName: blog.author?.name || '',
        authorRole: blog.author?.role || '',
        excerpt: blog.excerpt || '',
        featuredImage: blog.featuredImage || null,
        seo: {
          metaTitle: blog.seo?.metaTitle || '',
          metaDescription: blog.seo?.metaDescription || '',
          keywords: blog.seo?.keywords || [],
          ogImage: blog.seo?.ogImage || ''
        }
      });
      // Set preview URL for existing blog
      if (blog.slug) {
        setPreviewUrl(`/preview/blog/${blog.slug}`);
      }
    }
  }, [blog]);

  // Update preview URL when slug changes
  useEffect(() => {
    if (formData.slug) {
      setPreviewUrl(`/preview/blog/${formData.slug}`);
    } else {
      setPreviewUrl('');
    }
  }, [formData.slug]);

  /**
   * Validates the form fields and sets errors if any required fields are missing.
   * @returns {boolean} True if valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};
    // Only validate required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles changes to input fields, including nested SEO fields and auto-generates slug from title.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    // Auto-generate slug from title
    if (name === 'title' && !blog) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
        seo: {
          ...prev.seo,
          metaTitle: value
        }
      }));
    }
  };

  /**
   * Handles changes to the blog content (rich text editor).
   * @param {string} content
   */
  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content
    }));
  };

  /**
   * Handles selection of a featured image from the media selector.
   * @param {object} file - The selected file object.
   */
  const handleMediaSelect = (file) => {
    // Ensure we have the full URL for the image
    const imageUrl = file.url.startsWith('http') 
      ? file.url 
      : `http://localhost:5000${file.url}`;
    setFormData(prev => ({
      ...prev,
      featuredImage: {
        url: imageUrl,
        alt: file.name,
        caption: ''
      }
    }));
    setShowMediaSelector(false);
  };

  // Add new author handler
  const handleAddAuthor = async () => {
    if (!newAuthorName.trim()) return;
    try {
      setAuthorLoading(true);
      await onAuthorAdded(newAuthorName);
      setShowAuthorModal(false);
      setNewAuthorName('');
    } catch (e) {
      toast.error('Failed to add author');
    } finally {
      setAuthorLoading(false);
    }
  };

  /**
   * Handles form submission, validates fields, and calls onSubmit with the prepared data.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) {
        toast.error('Please fix the validation errors');
        setLoading(false);
        return;
      }
      // Prepare the data for submission
      const submitData = {
        title: formData.title,
        content: formData.content,
        slug: formData.slug,
        status: formData.status,
        author: {
          name: formData.authorName || undefined,
          role: formData.authorRole || undefined
        }
      };
      // Only add optional fields if they have values
      if (formData.excerpt) submitData.excerpt = formData.excerpt;
      if (formData.pageName) submitData.pageName = formData.pageName;
      if (formData.featuredImage) submitData.featuredImage = formData.featuredImage;
      // Add SEO data if any field has a value
      const seoData = Object.entries(formData.seo).reduce((acc, [key, value]) => {
        if (value && (typeof value === 'string' ? value.trim() : value.length > 0)) {
          acc[key] = value;
        }
        return acc;
      }, {});
      if (Object.keys(seoData).length > 0) {
        submitData.seo = seoData;
      }
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  if (showPreview) {
    // Show blog preview mode
    return (
      <div>
        <div className="">
          <button
            onClick={() => setShowPreview(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            aria-label="Back to Edit Blog"
          >
            Back to Edit
          </button>
        </div>
        <div className="mt-0">
          <BlogPreview blog={formData} />
        </div>
      </div>
    );
  }

  // Utility class for consistent input styling
  const inputClass = "block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-gray-900 placeholder-gray-400 text-sm transition";
  const selectClass = "block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-gray-900 text-sm transition";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" aria-label="Blog Form Modal Overlay">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {blog ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <div className="space-x-4">
            <Button
              onClick={() => setShowPreview(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              aria-label="Preview Blog"
            >
              Preview
            </Button>
            <Button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close Blog Form"
            >
              <FaTimes />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Blog Form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
              placeholder="Enter blog title"
              className="w-full"
              aria-label="Blog Title"
            />
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={errors.slug}
              required
              placeholder="Enter URL slug"
              className="w-full"
              aria-label="Blog Slug"
            />
            <Input
              label="Page Name"
              name="pageName"
              value={formData.pageName}
              onChange={handleChange}
              placeholder="Enter page name (optional)"
              className="w-full"
              aria-label="Page Name"
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <div className="flex items-center gap-2">
                <select
                  className={selectClass}
                  value={formData.authorName}
                  onChange={e => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  aria-label="Select Author"
                >
                  <option value="">Select author</option>
                  {authors.map(a => (
                    <option key={a._id || a.id} value={a.name}>{a.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 transition"
                  onClick={() => setShowAuthorModal(true)}
                  aria-label="Add Author"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <Input
              label="Author Role"
              name="authorRole"
              value={formData.authorRole}
              onChange={handleChange}
              placeholder="Enter author role (optional)"
              className="w-full"
              aria-label="Author Role"
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' }
              ]}
              className="w-full"
              aria-label="Blog Status"
            />
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              {formData.featuredImage ? (
                <div className="relative group">
                  <img
                    src={formData.featuredImage.url}
                    alt={formData.featuredImage.alt}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      // eslint-disable-next-line no-console
                      console.error('Image load error:', e);
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 text-gray-400">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      `);
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                    <div className="space-x-2">
                      <Button
                        type="button"
                        onClick={() => setShowMediaSelector(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-sm transition-all duration-200"
                        aria-label="Change Featured Image"
                      >
                        Change Image
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: null }))}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm transition-all duration-200"
                        aria-label="Remove Featured Image"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => setShowMediaSelector(true)}
                    className="bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 border border-gray-300"
                    aria-label="Select Featured Image"
                  >
                    <FaImage className="text-blue-500" aria-hidden="true" />
                    Select Featured Image
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Input
                label="Meta Title"
                name="seo.metaTitle"
                value={formData.seo.metaTitle}
                onChange={handleChange}
                error={errors['seo.metaTitle']}
                placeholder="Enter meta title (optional)"
                maxLength={60}
                className="w-full"
                aria-label="Meta Title"
              />
              <Input
                label="Meta Description"
                name="seo.metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleChange}
                error={errors['seo.metaDescription']}
                placeholder="Enter meta description (optional)"
                maxLength={160}
                className="w-full"
                aria-label="Meta Description"
              />
              <Input
                label="Excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                error={errors.excerpt}
                placeholder="Enter excerpt (optional)"
                maxLength={500}
                className="w-full"
                aria-label="Excerpt"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                className="bg-white"
                theme="snow"
                placeholder="Write your blog content here..."
                style={{ minHeight: 200 }}
                aria-label="Blog Content Editor"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                <div className="flex items-center">
                  <Link 
                    to={previewUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    aria-label="View Blog Preview"
                  >
                    <FaEye className="text-sm" aria-hidden="true" />
                    View Blog Preview
                  </Link>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-sm text-gray-500">
                    {previewUrl}
                  </span>
                  {formData.status === 'draft' && (
                    <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Draft Preview
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md"
              disabled={loading}
              aria-label="Save Blog"
            >
              <FaSave className="text-sm" aria-hidden="true" />
              {loading ? 'Saving...' : 'Save Blog'}
            </Button>
          </div>
        </form>
      </Card>
      {showMediaSelector && (
        <MediaSelector
          isOpen={showMediaSelector}
          onClose={() => setShowMediaSelector(false)}
          onSelect={handleMediaSelect}
        />
      )}
      {showAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add Author</h3>
            <input
              className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-gray-900 placeholder-gray-400 text-sm transition"
              placeholder="Author Name"
              value={newAuthorName}
              onChange={e => setNewAuthorName(e.target.value)}
              disabled={authorLoading}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowAuthorModal(false)}
                disabled={authorLoading}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddAuthor}
                disabled={authorLoading || !newAuthorName.trim()}
              >{authorLoading ? 'Adding...' : 'Add Author'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

BlogForm.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
    content: PropTypes.string,
    excerpt: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string
    }),
    featuredImage: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
      caption: PropTypes.string
    }),
    seo: PropTypes.shape({
      metaTitle: PropTypes.string,
      metaDescription: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string),
      ogImage: PropTypes.string
    })
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  authors: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string
  })),
  onAuthorAdded: PropTypes.func
};

export default BlogForm;

/* ========================================================================
 * End of file: BlogForm.jsx
 * ======================================================================== */ 