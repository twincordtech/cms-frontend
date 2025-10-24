/**
 * LeadsManagementSkeleton.jsx
 *
 * Loading skeletons for leads management dashboard and modals. Provides animated placeholders for tables and lead details.
 * Ensures accessibility, clear structure, and production-level code quality.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';
import { Card } from 'antd';

/**
 * LeadsManagementSkeleton
 * Animated skeleton for leads management table.
 * @component
 * @returns {JSX.Element}
 */
export const LeadsManagementSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading leads management table">
    <Card>
      {/* Title */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
      </div>
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-4">
            <div className="col-span-4">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Name and Email */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="space-y-1">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Company */}
                <div className="col-span-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                {/* Status */}
                <div className="col-span-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                {/* Date */}
                <div className="col-span-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                </div>
                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  </div>
);

/**
 * LeadDetailsSkeleton
 * Animated skeleton for lead details modal.
 * @component
 * @returns {JSX.Element}
 */
export const LeadDetailsSkeleton = () => (
  <div className="animate-pulse space-y-6" role="status" aria-label="Loading lead details">
    {/* Header */}
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div className="space-y-2">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
    {/* Lead Information Grid */}
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200"></div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      {/* Right Column */}
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gray-200"></div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Status Update Section */}
    <div className="space-y-4">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-8 w-24 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-24 bg-gray-100 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default LeadsManagementSkeleton;

/**
 * @copyright Tech4biz Solutions Private
 */ 