/* ========================================================================
 * File: ActivityHistoryPage.jsx
 * Description: Dashboard page for displaying user activity history.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import ActivityHistory from '../../components/ActivityHistory';

/**
 * ActivityHistoryPage
 * Dashboard page that renders the ActivityHistory component.
 * @component
 * @returns {JSX.Element} The rendered activity history page.
 */
const ActivityHistoryPage = () => {
  return (
    <div className="p-6" aria-label="Activity History Page">
      {/* ActivityHistory displays a list of user or system activities */}
      <ActivityHistory />
    </div>
  );
};

export default ActivityHistoryPage;

/* ========================================================================
 * End of file: ActivityHistoryPage.jsx
 * ======================================================================== */ 