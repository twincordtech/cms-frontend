// ===============================
// File: Profile.jsx
// Description: User profile page with tabbed sections for account, password, email, customization, and font styles.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileTabContent from '../../components/profile/ProfileTabContent';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="container mx-auto max-w-full px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="flex gap-6">
        {/* Mini Sidebar */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Content Area */}
        <div className="flex-1">
          <div className="h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <ProfileTabContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
// ===============================
// End of File: Profile.jsx
// Description: User profile page with tabbed sections for account, password, email, customization, and font styles.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 