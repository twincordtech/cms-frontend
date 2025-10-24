/**
 * PageSelect.jsx
 *
 * Page selection component for section assignment. Allows users to select a page for section placement.
 * Handles loading, error, and empty states with user feedback and accessibility.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../elements/Card';
import { cmsApi } from '../../services/api';

/**
 * PageSelect Component
 *
 * Displays a list of pages for selection. Handles loading, error, and empty states.
 * Provides accessible UI and clear user feedback.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onSelectPage - Callback when a page is selected
 * @param {string} props.selectedPageId - Currently selected page ID
 * @returns {JSX.Element} Page selection UI
 */
const PageSelect = ({ onSelectPage, selectedPageId }) => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches the list of pages from the API
   * Handles loading and error states
   * @async
   */
  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cmsApi.getAdminPages();
      setPages(response.data.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8" role="status" aria-label="Loading pages">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" role="alert" aria-live="assertive">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPages}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          aria-label="Retry loading pages"
        >
          Retry
        </button>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-8" role="alert" aria-live="polite">
        <p className="text-gray-600 mb-4">No pages available. Please create a page first.</p>
        <button
          onClick={() => navigate('/dashboard/pages/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          aria-label="Create a new page"
        >
          Create Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Page</h2>
        <p className="text-gray-600 mb-4">Choose the page where this section will appear.</p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pages.map(page => (
            <Card
              key={page._id}
              className={`cursor-pointer transition-all ${
                selectedPageId === page._id
                  ? 'border-2 border-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onSelectPage(page._id)}
              aria-selected={selectedPageId === page._id}
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectPage(page._id);
                }
              }}
            >
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{page.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {page.slug}
                </p>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded ${
                    page.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.isActive ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSelect;

/**
 * @copyright Tech4biz Solutions Private
 */ 