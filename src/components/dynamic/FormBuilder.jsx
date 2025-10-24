// ===============================
// File: FormBuilder.jsx
// Description: Dynamic form builder for creating and managing custom forms with drag-and-drop fields.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormPreview from './FormPreview';
import FieldEditor from './formBuilder/FieldEditor';
import { generateFormName } from '../../utils/formUtils';
import { formApi } from '../../services/api';

// Supported field types for the form builder
const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'date', label: 'Date Picker' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'select', label: 'Dropdown (Select)' },
  { value: 'multiselect', label: 'Multi-select' },
  { value: 'file', label: 'File Upload' },
];

// Supported form types
const FORM_TYPES = [
  { value: 'contact', label: 'Contact' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'job_application', label: 'Job Application' },
  { value: 'custom', label: 'Custom' },
];

// Default field template
const defaultField = () => ({
  id: uuidv4(),
  label: '',
  name: '',
  type: 'text',
  required: false,
  placeholder: '',
  defaultValue: '',
  options: [],
  order: 0,
});

/**
 * FormBuilder provides a UI for building dynamic forms by adding, editing, and reordering fields.
 * Supports preview and saving of forms.
 */
const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState('custom');
  const [showPreview, setShowPreview] = useState(false);

  // Add a new field to the form
  const addField = () => {
    setFields([...fields, { ...defaultField(), order: fields.length }]);
  };

  // Update a field's properties
  const updateField = (id, updated) => {
    setFields(fields.map(f => (f.id === id ? { ...f, ...updated } : f)));
  };

  // Remove a field from the form
  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  // Move a field up or down in the order
  const moveField = (id, direction) => {
    const idx = fields.findIndex(f => f.id === id);
    if (idx < 0) return;
    const newFields = [...fields];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= fields.length) return;
    [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]];
    setFields(newFields.map((f, i) => ({ ...f, order: i })));
  };

  // Save the form to the backend
  const handleSave = async () => {
    const formName = generateFormName(formTitle);
    const payload = {
      name: formName,
      title: formTitle,
      description: formDescription,
      type: formType,
      fields: fields.map(({ id, ...rest }) => rest),
    };
    try {
      const res = await formApi.createForm(payload);
      if (res.data.success) {
        alert('Form saved!');
      } else {
        alert('Error: ' + (res.data.message || 'Failed to save form.'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dynamic Form Builder</h2>
      <div className="mb-4 flex gap-4 items-center">
        {/* Form type selector */}
        <select
          className="border p-2 rounded bg-white"
          value={formType}
          onChange={e => setFormType(e.target.value)}
        >
          {FORM_TYPES.map(ft => (
            <option key={ft.value} value={ft.value}>{ft.label}</option>
          ))}
        </select>
        {/* Form title input */}
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Form Title"
          value={formTitle}
          onChange={e => setFormTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        {/* Form description input */}
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Form Description"
          value={formDescription}
          onChange={e => setFormDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        {/* Add field button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={addField}
        >
          + Add Field
        </button>
      </div>
      <div className="space-y-4">
        {/* List of field editors */}
        {fields.map((field, idx) => (
          <FieldEditor
            key={field.id}
            field={field}
            fieldTypes={FIELD_TYPES}
            onChange={updated => updateField(field.id, updated)}
            onRemove={() => removeField(field.id)}
            onMoveUp={() => moveField(field.id, 'up')}
            onMoveDown={() => moveField(field.id, 'down')}
            isFirst={idx === 0}
            isLast={idx === fields.length - 1}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        {/* Preview and save buttons */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Preview Form'}
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Form
        </button>
      </div>
      {/* Form preview section */}
      {showPreview && (
        <div className="mt-8 border-t pt-8">
          <FormPreview
            title={formTitle}
            description={formDescription}
            fields={fields}
          />
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
// ===============================
// End of File: FormBuilder.jsx
// Description: Dynamic form builder
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 