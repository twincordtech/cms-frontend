/**
 * ProfileSkeleton.jsx
 * 
 * Loading skeleton components for profile page sections.
 * Provides smooth loading states with proper accessibility and animations.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React from 'react';

/**
 * ProfileSkeleton Component
 * 
 * Main skeleton component for account information section.
 * Provides loading state with proper accessibility attributes.
 * 
 * @component
 * @returns {JSX.Element} Profile skeleton component
 */
export const ProfileSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading account information">
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-6">
        {/* Email Information Skeleton */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-100 rounded-md border border-gray-200"></div>
        </div>
        
        {/* Role Information Skeleton */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="h-10 w-32 bg-gray-100 rounded-md mr-3"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * PasswordSkeleton Component
 * 
 * Loading skeleton for password change section.
 * Includes form field placeholders and button skeleton.
 * 
 * @component
 * @returns {JSX.Element} Password skeleton component
 */
export const PasswordSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading password form">
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
      </div>
      
      {/* Alert Skeleton */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-blue-200 rounded mt-1"></div>
          <div className="flex-1">
            <div className="h-4 w-32 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-blue-200 rounded mb-1"></div>
            <div className="h-3 w-3/4 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-12 w-full bg-gray-100 rounded-md"></div>
          </div>
        ))}
        
        {/* Password Requirements Skeleton */}
        <div className="mt-4">
          <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button Skeleton */}
        <div className="h-12 w-full bg-gray-200 rounded-md"></div>
      </div>
      
      {/* Security Tips Skeleton */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-blue-200 rounded mt-1"></div>
          <div className="flex-1">
            <div className="h-4 w-32 bg-blue-200 rounded mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-3 w-full bg-blue-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * ThemeSkeleton Component
 * 
 * Loading skeleton for theme customization section.
 * Includes color picker, slider, and preview area placeholders.
 * 
 * @component
 * @returns {JSX.Element} Theme skeleton component
 */
export const ThemeSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading theme customization">
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Theme Cards Skeleton */}
      <div className="space-y-6">
        {/* Theme Mode Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Color Settings Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Layout Settings Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Area Skeleton */}
      <div className="mt-8 p-6 border rounded-lg bg-gray-50">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="p-6 rounded-lg border bg-white">
          <div className="space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="flex space-x-3">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * EmailConfigSkeleton Component
 * 
 * Loading skeleton for email configuration section.
 * Includes form fields and notification preferences placeholders.
 * 
 * @component
 * @returns {JSX.Element} Email configuration skeleton component
 */
export const EmailConfigSkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading email configuration">
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-blue-200 rounded"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Email Address Card */}
      <div className="bg-white border-0 shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-blue-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-100 rounded-md"></div>
          <div className="h-3 w-64 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
      
      {/* Notification Preferences Card */}
      <div className="bg-white border-0 shadow-sm rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-blue-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Information Section */}
      <div className="bg-blue-50 border-0 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 bg-blue-200 rounded mt-1"></div>
          <div className="flex-1">
            <div className="h-4 w-40 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-blue-200 rounded mb-1"></div>
            <div className="h-3 w-3/4 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * TypographySkeleton Component
 * 
 * Loading skeleton for typography settings section.
 * Includes font selection, size controls, and preview area.
 * 
 * @component
 * @returns {JSX.Element} Typography skeleton component
 */
export const TypographySkeleton = () => (
  <div className="animate-pulse" role="status" aria-label="Loading typography settings">
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Typography Cards */}
      <div className="space-y-6">
        {/* Font Family Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
        
        {/* Font Size Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
        
        {/* Font Weight Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Font Style Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Text Decoration Card */}
        <div className="bg-white/50 backdrop-blur-sm border-0 shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-blue-200 rounded"></div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Typography Preview */}
      <div className="mt-8 p-6 border rounded-lg bg-gray-50">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="p-6 rounded-lg border bg-white">
          <div className="space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-3 w-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * @copyright Tech4biz Solutions Private
 */ 