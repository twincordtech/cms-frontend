/* ========================================================================
 * File: FormRenderPage.jsx
 * Description: Page for rendering a form using the FormRenderer component.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import FormRenderer from '../../components/dynamic/FormRenderer';

/**
 * FormRenderPage Component
 * Renders a form based on the formId from the URL using FormRenderer.
 * @component
 */
const FormRenderPage = () => {
  const { formId } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 p-4" aria-label="Form Render Page">
      <div className="mb-4">
        <Link to="/dashboard/forms" className="text-blue-600 hover:underline" aria-label="Back to Forms">&larr; Back to Forms</Link>
      </div>
      <FormRenderer formId={formId} />
    </div>
  );
};

export default FormRenderPage;

/* ========================================================================
 * End of File: FormRenderPage.jsx
 * ======================================================================== */ 