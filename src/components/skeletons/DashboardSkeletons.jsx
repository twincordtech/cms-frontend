/**
 * DashboardSkeletons.jsx
 *
 * Loading skeleton components for dashboard pages and tables. Provides animated placeholders for stats, charts, tables, and dashboards.
 * Ensures accessibility, clear structure, and production-level code quality.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';

/**
 * StatCardSkeleton
 * Animated skeleton for dashboard stat cards.
 * @component
 * @returns {JSX.Element}
 */
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 animate-pulse" role="status" aria-label="Loading stat card">
    <div className="flex justify-between items-start">
      <div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-20 bg-gray-300 rounded mb-2"></div>
        <div className="flex items-center">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="p-3 bg-gray-200 rounded-lg h-10 w-10"></div>
    </div>
  </div>
);

/**
 * ChartSkeleton
 * Animated skeleton for dashboard charts.
 * @component
 * @returns {JSX.Element}
 */
export const ChartSkeleton = () => (
  <div className="bg-white rounded-xl p-6 animate-pulse" role="status" aria-label="Loading chart">
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 w-32 bg-gray-200 rounded"></div>
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="h-[300px] bg-gray-100 rounded-lg"></div>
  </div>
);

/**
 * NewsletterSkeleton
 * Animated skeleton for newsletter list/table.
 * @component
 * @returns {JSX.Element}
 */
export const NewsletterSkeleton = () => (
  <div className="bg-white rounded-xl p-6 animate-pulse" role="status" aria-label="Loading newsletter list">
    <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="p-4 border border-gray-100 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-grow">
              <div className="flex items-center gap-3">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * LeadTableSkeleton
 * Animated skeleton for leads table.
 * @component
 * @returns {JSX.Element}
 */
export const LeadTableSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse" role="status" aria-label="Loading leads table">
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="grid grid-cols-5 gap-6">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="px-6 py-4">
          <div className="grid grid-cols-5 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div>
              <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * PagesListSkeleton
 * Animated skeleton for pages list/table.
 * @component
 * @returns {JSX.Element}
 */
export const PagesListSkeleton = () => (
  <div className="container mx-auto p-6 animate-pulse" role="status" aria-label="Loading pages list">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-10 w-36 bg-gray-200 rounded"></div>
    </div>
    {/* Table */}
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {['Title', 'Slug', 'Type', 'Status', 'API Endpoint', 'Created', 'Actions'].map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/**
 * LayoutDashboardSkeleton
 * Animated skeleton for layout dashboard table.
 * @component
 * @returns {JSX.Element}
 */
export const LayoutDashboardSkeleton = () => (
  <div className="p-6 animate-pulse" role="status" aria-label="Loading layout dashboard">
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-9 w-32 bg-gray-200 rounded"></div>
      </div>
      {/* Table */}
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr>
              {['Name', 'Page', 'Components', 'Status', 'Created', 'Actions'].map((_, index) => (
                <th key={index} className="pb-3">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((item) => (
              <tr key={item} className="border-t border-gray-100">
                <td className="py-4">
                  <div className="h-5 w-36 bg-gray-200 rounded"></div>
                </td>
                <td className="py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </td>
                <td className="py-4">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </td>
                <td className="py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/**
 * ContentDashboardSkeleton
 * Animated skeleton for content dashboard table.
 * @component
 * @returns {JSX.Element}
 */
export const ContentDashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse" role="status" aria-label="Loading content dashboard">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="flex space-x-4">
        <div className="h-10 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 w-36 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* Filter Buttons */}
    <div className="mb-4 flex space-x-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-10 w-32 bg-gray-200 rounded"></div>
      ))}
    </div>
    {/* Filters Grid */}
    <div className="mb-6 grid grid-cols-3 gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
    {/* Content Table */}
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {['Name', 'Page', 'Type', 'Components', 'Status', 'Created', 'Actions'].map((_, index) => (
              <th key={index} className="px-6 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="border-b border-gray-100">
              <td className="px-6 py-4">
                <div className="h-5 w-36 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-28 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * NewsletterDashboardSkeleton
 * Animated skeleton for newsletter dashboard table.
 * @component
 * @returns {JSX.Element}
 */
export const NewsletterDashboardSkeleton = () => (
  <div className="p-6 animate-pulse" role="status" aria-label="Loading newsletter dashboard">
    {/* Header with Stats */}
    <div className="mb-8">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-10 w-40 bg-gray-200 rounded"></div>
    </div>
    {/* Newsletter Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {['Subject', 'Status', 'Schedule', 'Created', 'Sent To', 'Actions'].map((_, index) => (
              <th key={index} className="px-6 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item} className="border-t border-gray-100">
              <td className="px-6 py-4">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * BlogDashboardSkeleton
 * Animated skeleton for blog dashboard table.
 * @component
 * @returns {JSX.Element}
 */
export const BlogDashboardSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse" role="status" aria-label="Loading blog dashboard">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-1 md:w-64">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* Blog Table */}
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {['Blog Details', 'Author', 'Status', 'Created', 'Published', 'Actions'].map((_, index) => (
              <th key={index} className="px-6 py-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <tr key={item}>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * @copyright Tech4biz Solutions Private
 */ 