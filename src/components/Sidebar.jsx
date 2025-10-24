// ===============================
// File: Sidebar.jsx
// Description: Sidebar navigation with admin links, accessibility, and modern UI/UX.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { FaNewspaper, FaImage, FaEnvelope, FaCubes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Sidebar displays navigation links, including admin-only links.
 * Includes accessibility, keyboard navigation, and modern UI/UX.
 * @component
 */
const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="sidebar" aria-label="Sidebar Navigation">
      {/* ... existing sidebar content ... */}
      {user?.isAdmin && (
        <>
          {/* ... existing admin links ... */}
          <Link
            to="/dashboard/newsletter"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/dashboard/newsletter'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-900 hover:bg-gray-100'
            }`}
            aria-current={location.pathname === '/dashboard/newsletter' ? 'page' : undefined}
            tabIndex={0}
          >
            <FaNewspaper className="w-5 h-5 mr-3" aria-hidden="true" />
            Newsletter
          </Link>
        </>
      )}
      {/* ... rest of sidebar content ... */}
    </aside>
  );
};

export default Sidebar;
// ===============================
// End of File: Sidebar.jsx
// Description: Sidebar navigation with admin links and accessibility
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 