// ===============================
// File: FormRenderer.jsx
// Description: Renders a dynamic form for user input and handles submission, validation, and deletion.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useEffect, useState } from 'react';
import { formApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Render a single field for the form
const renderField = (field, value, onChange) => {
  switch (field.type) {
    case 'text':
      return <input className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" type="text" name={field.name} placeholder={field.placeholder} value={value || ''} onChange={onChange} autoComplete="off" />;
    case 'textarea':
      return <textarea className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" name={field.name} placeholder={field.placeholder} value={value || ''} onChange={onChange} rows={3} />;
    case 'number':
      return <input className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" type="number" name={field.name} placeholder={field.placeholder} value={value || ''} onChange={onChange} />;
    case 'date':
      return <input className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" type="date" name={field.name} value={value || ''} onChange={onChange} />;
    case 'checkbox':
      return <input className="accent-blue-600 w-5 h-5" type="checkbox" name={field.name} checked={!!value} onChange={e => onChange({ target: { name: field.name, value: e.target.checked } })} />;
    case 'radio':
      return (
        <div className="flex gap-4">
          {(field.options || []).map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name={field.name} value={opt.value} checked={value === opt.value} onChange={onChange} className="accent-blue-600" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" name={field.name} value={value || ''} onChange={onChange}>
          <option value="">Select...</option>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'multiselect':
      return (
        <select className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400" name={field.name} multiple value={value || []} onChange={e => {
          const selected = Array.from(e.target.selectedOptions, o => o.value);
          onChange({ target: { name: field.name, value: selected } });
        }}>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'file':
      return (
        <label className="block w-full">
          <input className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" type="file" name={field.name} onChange={onChange} />
        </label>
      );
    default:
      return null;
  }
};

/**
 * FormRenderer fetches a form definition by ID, renders the form, handles user input, validation, submission, and deletion.
 */
const FormRenderer = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch form definition on mount or when formId changes
  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await formApi.getFormById(formId);
        if (res.data.success) {
          setForm(res.data.data);
          // Set default values for fields
          const defaults = {};
          (res.data.data.fields || []).forEach(f => {
            defaults[f.name] = f.defaultValue || (f.type === 'checkbox' ? false : f.type === 'multiselect' ? [] : '');
          });
          setValues(defaults);
        } else {
          setError(res.data.message || 'Form not found');
        }
      } catch (err) {
        setError('Error fetching form');
      }
      setLoading(false);
    };
    if (formId) fetchForm();
  }, [formId]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues(v => ({
      ...v,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validate required fields
    for (const field of (form.fields || [])) {
      if (field.required) {
        const val = values[field.name];
        if (
          val === undefined ||
          val === '' ||
          (Array.isArray(val) && val.length === 0) ||
          (field.type === 'file' && !val)
        ) {
          setError(`Field '${field.label}' is required.`);
          return;
        }
      }
    }
    setSubmitting(true);
    try {
      let submitData = { ...values };
      // Handle file fields
      const hasFile = (form.fields || []).some(f => f.type === 'file');
      let body, headers;
      if (hasFile) {
        body = new FormData();
        for (const key in submitData) {
          if (submitData[key] instanceof FileList) {
            body.append(key, submitData[key][0]);
          } else {
            body.append(key, submitData[key]);
          }
        }
        headers = undefined; // Let browser set multipart
      } else {
        body = JSON.stringify(submitData);
        headers = { 'Content-Type': 'application/json' };
      }
      const res = await formApi.submitForm(formId, body, headers);
      if (res.data.success) {
        setSuccess('Form submitted successfully!');
        setValues({});
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err) {
      setError('Submission error');
    }
    setSubmitting(false);
  };

  // Handle form deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this form? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await formApi.deleteForm(formId);
      navigate('/dashboard/forms');
    } catch (err) {
      setError('Failed to delete form');
    }
    setDeleting(false);
  };

  if (loading) return <div className="flex justify-center items-center h-40"><svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg></div>;
  if (error) return <div className="text-red-500 flex items-center gap-2"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>{error}</div>;
  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{form.title}</h2>
        <button
          className="text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 text-sm disabled:opacity-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Form'}
        </button>
      </div>
      {form.description && <p className="mb-4 text-gray-600">{form.description}</p>}
      <form className="space-y-6 bg-white rounded-lg shadow p-6" onSubmit={handleSubmit}>
        {form.fields.map((field, idx) => (
          <div key={field.name || idx} className="mb-2">
            <label className="block font-medium mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field, values[field.name], (e) => {
              if (field.type === 'file') {
                setValues(v => ({ ...v, [field.name]: e.target.files }));
              } else {
                handleChange(e);
              }
            })}
          </div>
        ))}
        {error && <div className="text-red-500 flex items-center gap-2"><svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>{error}</div>}
        {success && <div className="text-green-600 flex items-center gap-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{success}</div>}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default FormRenderer;
// ===============================
// End of File: FormRenderer.jsx
// Description: Dynamic form renderer
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 