// ===============================
// File: ProfileTabContent.jsx
// Description: Renders the content for the active profile tab.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import AccountSection from './AccountSection';
import PasswordSection from './PasswordSection';
import EmailSetupSection from './EmailSetupSection';
import CustomizationSection from './CustomizationSection';
import FontStylesSection from './FontStyles';

/**
 * Renders the content for the active profile tab
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab id
 */
const ProfileTabContent = ({ activeTab }) => {
  switch (activeTab) {
    case 'account':
      return <AccountSection />;
    case 'password':
      return <PasswordSection />;
    case 'email':
      return <EmailSetupSection />;
    case 'customization':
      return <CustomizationSection />;
    case 'font-styles':
      return <FontStylesSection />;
    default:
      return null;
  }
};

ProfileTabContent.propTypes = {
  activeTab: PropTypes.string.isRequired
};

export default ProfileTabContent;
// ===============================
// End of File: ProfileTabContent.jsx
// Description: Renders the content for the active profile tab.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 