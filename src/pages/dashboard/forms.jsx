/* ========================================================================
 * File: forms.jsx
 * Description: Page for listing and managing forms in the dashboard.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formApi } from '../../services/api';
import FormsList from './forms/FormsList';


/**
 * FormsPage Component
 * Renders the forms list page.
 * @component
 */
const FormsPage = () => {
  return <FormsList />;
};

export default FormsPage;

/* ========================================================================
 * End of File: forms.jsx
 * ======================================================================== */ 