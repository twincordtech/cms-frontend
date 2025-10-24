/* ========================================================================
 * File: Dashboard.jsx
 * Description: CMS Dashboard page showing stats and recent sections.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import Card from '../../components/elements/Card';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

/**
 * StatCard Component
 * Displays a single stat card with title and value.
 * @param {Object} props
 * @param {string} props.title - Stat title
 * @param {number} props.value - Stat value
 * @param {string} props.color - Tailwind color class for value
 */
const StatCard = ({ title, value, color }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-4xl font-bold ${color}`}>{value || 0}</p>
    </div>
  </Card>
);

/**
 * Dashboard Component
 * Main dashboard page showing stats and recent sections.
 * Fetches data from API and handles loading/error states.
 * @component
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });
  const [recentSections, setRecentSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches dashboard stats and recent sections from API
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch sections stats
      const statsResponse = await api.get(`http://localhost:5000/cms/sections/stats`);
      if (statsResponse.data && statsResponse.data.success) {
        setStats({
          total: statsResponse.data.stats.total || 0,
          published: statsResponse.data.stats.published || 0,
          drafts: statsResponse.data.stats.drafts || 0
        });
      }
      // Fetch recent sections
      const recentResponse = await api.get(`http://localhost:5000/cms/sections/recent`);
      if (recentResponse.data && recentResponse.data.success) {
        setRecentSections(recentResponse.data.sections || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" aria-label="Loading Dashboard">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" role="alert">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          aria-label="Retry Fetch Dashboard Data"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" aria-label="Dashboard Page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900" tabIndex={0} aria-label="Dashboard Heading">Dashboard</h1>
        <Link
          to="/dashboard/sections/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
          aria-label="Create New Section"
        >
          <FaPlus className="mr-2" aria-hidden="true" />
          <span>New Section</span>
        </Link>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Sections" 
          value={stats.total} 
          color="text-gray-900" 
        />
        <StatCard 
          title="Published" 
          value={stats.published} 
          color="text-green-600" 
        />
        <StatCard 
          title="Drafts" 
          value={stats.drafts} 
          color="text-orange-600" 
        />
      </div>
      {/* Recent Sections */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sections</h2>
        <Card>
          {recentSections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No sections created yet</p>
              <Link
                to="/dashboard/sections/new"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-2 transition-colors"
                aria-label="Create First Section"
              >
                <FaPlus className="mr-2" aria-hidden="true" />
                <span>Create your first section</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" aria-label="Recent Sections Table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSections.map((section) => (
                    <tr key={section._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/dashboard/sections/${section._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          aria-label={`View Section ${section.data?.title || 'Untitled Section'}`}
                        >
                          {section.data?.title || 'Untitled Section'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {section.pageId ? (
                          <Link
                            to={`/dashboard/pages/${section.pageId._id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            aria-label={`View Page ${section.pageId.title || 'Untitled Page'}`}
                          >
                            {section.pageId.title || 'Untitled Page'}
                          </Link>
                        ) : (
                          'No Page'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {section.type || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          section.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {section.isActive ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {section.updatedAt ? formatDistanceToNow(new Date(section.updatedAt), { addSuffix: true }) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

/* ========================================================================
 * End of File: Dashboard.jsx
 * ======================================================================== */ 