// ===============================
// File: ProfileSidebar.jsx
// Description: Sidebar for profile tabs (account, password, email, customization, font styles).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaLock, FaEnvelope, FaPalette, FaFont } from 'react-icons/fa';

const tabs = [
  { id: 'account', label: 'Account', icon: <FaUser className="w-4 h-4" /> },
  { id: 'password', label: 'Password', icon: <FaLock className="w-4 h-4" /> },
  { id: 'email', label: 'Email Setup', icon: <FaEnvelope className="w-4 h-4" /> },
  { id: 'customization', label: 'Customization', icon: <FaPalette className="w-4 h-4" /> },
  { id: 'font-styles', label: 'Font Styles', icon: <FaFont className="w-4 h-4" /> }
];

/**
 * Sidebar for profile tabs
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab id
 * @param {function} props.setActiveTab - Setter for active tab
 */
const ProfileSidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64">
    <div className="sticky top-8 bg-white rounded-lg shadow-md p-4">
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

ProfileSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default ProfileSidebar;
// ===============================
// End of File: ProfileSidebar.jsx
// Description: Sidebar for profile tabs (account, password, email, customization, font styles).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 