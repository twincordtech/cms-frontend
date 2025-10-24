import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormsList from './forms';
import FormBuilderPage from './FormBuilderPage';
import FormRenderPage from './FormRenderPage';

const DashboardRoutes = () => (
  <Routes>
    {/* ...other routes... */}
    <Route path="forms" element={<FormsList />} />
    <Route path="form-builder" element={<FormBuilderPage />} />
    <Route path="forms/:formId" element={<FormRenderPage />} />
  </Routes>
);

export default DashboardRoutes; 