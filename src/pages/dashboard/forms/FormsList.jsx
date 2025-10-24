/* ========================================================================
 * File: FormsList.jsx
 * Description: Component for listing and managing forms in the dashboard.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formApi } from '../../../services/api';

/**
 * FormsList Component
 * Renders a list of forms with navigation and actions.
 * @component
 */
const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const res = await formApi.getForms();
        if (res.data.success) {
          setForms(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch forms');
        }
      } catch (err) {
        setError('Error fetching forms');
      }
      setLoading(false);
    };
    fetchForms();
  }, []);

  if (loading) return <div aria-busy="true">Loading forms...</div>;
  if (error) return <div className="text-red-500" role="alert">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4" aria-label="Forms List">
      <h2 className="text-2xl font-bold mb-4">Forms</h2>
      <Link
        to="/dashboard/form-builder"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        aria-label="Create New Form"
      >
        + Create New Form
      </Link>
      {forms.length === 0 ? (
        <div className="bg-white rounded shadow p-8 flex flex-col items-center justify-center">
          <p className="mb-4 text-gray-600">No forms found. Create your first form!</p>
          <Link
            to="/dashboard/form-builder"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            aria-label="Create New Form"
          >
            + Create New Form
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full text-left" aria-label="Forms Table">
            <thead>
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Name/ID</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => (
                <tr key={form._id} className="border-t">
                  <td className="py-2">{form.title}</td>
                  <td className="py-2">{form.name}</td>
                  <td className="py-2">
                    <Link to={`/dashboard/forms/${form._id}`} className="text-blue-600 hover:underline" aria-label={`Open form ${form.title}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormsList;

/* ========================================================================
 * End of File: FormsList.jsx
 * ======================================================================== */ 