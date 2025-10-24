// ===============================
// File: FormPreview.jsx
// Description: Preview component for displaying a read-only version of a dynamic form.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';

// Render a single field in preview mode
const renderField = (field) => {
  switch (field.type) {
    case 'text':
      return <input className="border p-2 w-full rounded" type="text" placeholder={field.placeholder} disabled />;
    case 'textarea':
      return <textarea className="border p-2 w-full rounded" placeholder={field.placeholder} disabled />;
    case 'number':
      return <input className="border p-2 w-full rounded" type="number" placeholder={field.placeholder} disabled />;
    case 'date':
      return <input className="border p-2 w-full rounded" type="date" disabled />;
    case 'checkbox':
      return <input className="mr-2" type="checkbox" disabled />;
    case 'radio':
      return (
        <div className="flex gap-4">
          {(field.options || []).map(opt => (
            <label key={opt.value} className="flex items-center gap-1">
              <input type="radio" name={field.name} disabled /> {opt.label}
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select className="border p-2 w-full rounded" disabled>
          <option value="">Select...</option>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'multiselect':
      return (
        <select className="border p-2 w-full rounded" multiple disabled>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'file':
      return <input className="border p-2 w-full rounded" type="file" disabled />;
    default:
      return null;
  }
};

/**
 * FormPreview displays a read-only preview of a form, showing all fields as they would appear to the user.
 */
const FormPreview = ({ title, description, fields }) => (
  <div className="bg-gray-50 p-6 rounded shadow">
    {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
    {description && <p className="mb-4 text-gray-600">{description}</p>}
    <form className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.name || idx} className="">
          <label className="block font-medium mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}
    </form>
  </div>
);

export default FormPreview;
// ===============================
// End of File: FormPreview.jsx
// Description: Form preview component
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
