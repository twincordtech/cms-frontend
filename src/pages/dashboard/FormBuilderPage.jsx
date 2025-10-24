/* ========================================================================
 * File: FormBuilderPage.jsx
 * Description: Page for building new forms using the FormBuilder component.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { Link } from 'react-router-dom';
import FormBuilder from '../../components/dynamic/FormBuilder';

/**
 * FormBuilderPage Component
 * Renders the form builder page with navigation and the FormBuilder component.
 * @component
 */
const FormBuilderPage = () => (
  <div className="min-h-screen bg-gray-50 p-4" aria-label="Form Builder Page">
    <div className="mb-4">
      <Link to="/dashboard/forms" className="text-blue-600 hover:underline" aria-label="Back to Forms">&larr; Back to Forms</Link>
    </div>
    <FormBuilder />
  </div>
);

export default FormBuilderPage;

/* ========================================================================
 * End of File: FormBuilderPage.jsx
 * ======================================================================== */ 