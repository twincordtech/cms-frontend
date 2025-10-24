// ===============================
// File: FieldEditor.jsx
// Description: Field editor for dynamic form builder, allowing editing of individual form fields and their options.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';

/**
 * FieldEditor component allows editing of a single form field, including its label, name, type, required status, placeholder, default value, and options.
 * Supports moving, removing, and editing options for select, radio, and multiselect fields.
 */
const FieldEditor = ({ field, fieldTypes, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [local, setLocal] = useState(field);

  // Sync local state with parent field prop
  React.useEffect(() => { setLocal(field); }, [field]);

  // Handle input changes for field properties
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...local,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle changes to options for select/radio/multiselect fields
  const handleOptionsChange = (idx, key, value) => {
    const newOptions = [...(local.options || [])];
    newOptions[idx][key] = value;
    onChange({ ...local, options: newOptions });
  };

  // Add a new option
  const addOption = () => {
    onChange({ ...local, options: [...(local.options || []), { label: '', value: '' }] });
  };

  // Remove an option
  const removeOption = (idx) => {
    const newOptions = [...(local.options || [])];
    newOptions.splice(idx, 1);
    onChange({ ...local, options: newOptions });
  };

  return (
    <div className="border p-4 rounded bg-white shadow flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {/* Field label input */}
        <input
          className="border p-2 rounded w-1/3"
          name="label"
          placeholder="Field Label"
          value={local.label}
          onChange={handleChange}
        />
        {/* Field name input */}
        <input
          className="border p-2 rounded w-1/3"
          name="name"
          placeholder="Field Name (unique)"
          value={local.name}
          onChange={handleChange}
        />
        {/* Field type selector */}
        <select
          className="border p-2 rounded w-1/4"
          name="type"
          value={local.type}
          onChange={handleChange}
        >
          {fieldTypes.map(ft => (
            <option key={ft.value} value={ft.value}>{ft.label}</option>
          ))}
        </select>
        {/* Required checkbox */}
        <label className="flex items-center gap-1 ml-2">
          <input
            type="checkbox"
            name="required"
            checked={local.required}
            onChange={handleChange}
          />
          Required
        </label>
        {/* Remove field button */}
        <button className="ml-2 text-red-500 hover:underline" onClick={onRemove} type="button">Remove</button>
      </div>
      <div className="flex gap-2">
        {/* Placeholder input */}
        <input
          className="border p-2 rounded w-1/2"
          name="placeholder"
          placeholder="Placeholder"
          value={local.placeholder}
          onChange={handleChange}
        />
        {/* Default value input */}
        <input
          className="border p-2 rounded w-1/2"
          name="defaultValue"
          placeholder="Default Value"
          value={local.defaultValue}
          onChange={handleChange}
        />
      </div>
      {/* Options editor for select, radio, and multiselect fields */}
      {(local.type === 'select' || local.type === 'radio' || local.type === 'multiselect') && (
        <div className="bg-gray-50 p-2 rounded mt-2">
          <div className="font-medium mb-1">Options</div>
          {(local.options || []).map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input
                className="border p-1 rounded w-1/3"
                placeholder="Label"
                value={opt.label}
                onChange={e => handleOptionsChange(idx, 'label', e.target.value)}
              />
              <input
                className="border p-1 rounded w-1/3"
                placeholder="Value"
                value={opt.value}
                onChange={e => handleOptionsChange(idx, 'value', e.target.value)}
              />
              <button className="text-red-500" onClick={() => removeOption(idx)} type="button">Remove</button>
            </div>
          ))}
          <button className="bg-blue-500 text-white px-2 py-1 rounded mt-1" onClick={addOption} type="button">+ Add Option</button>
        </div>
      )}
      {/* Move field up/down buttons */}
      <div className="flex gap-2 mt-2">
        <button className="bg-gray-200 px-2 py-1 rounded" onClick={onMoveUp} disabled={isFirst} type="button">↑</button>
        <button className="bg-gray-200 px-2 py-1 rounded" onClick={onMoveDown} disabled={isLast} type="button">↓</button>
      </div>
    </div>
  );
};

export default FieldEditor;
// ===============================
// End of File: FieldEditor.jsx
// Description: Field editor for form builder
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
