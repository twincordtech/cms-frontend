// ===============================
// File: ExampleForm.jsx
// Description: Example form with auto-save, leave confirmation, accessibility, and user feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useCallback } from 'react';
import useAutoSave from '../hooks/useAutoSave';
import usePageLeaveConfirmation from '../hooks/usePageLeaveConfirmation';
import ConfirmationModal from './ui/ConfirmationModal';
import SaveProgressModal from './ui/SaveProgressModal';

/**
 * ExampleForm demonstrates a form with auto-save, leave confirmation, accessibility, and user feedback.
 * @component
 */
const ExampleForm = () => {
  // State for form data, change tracking, and save modal
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveModalState, setSaveModalState] = useState({
    isOpen: false,
    status: 'saving' // 'saving' | 'success' | 'error'
  });

  /**
   * Manually save form data and show feedback modal
   */
  const handleManualSave = async () => {
    setSaveModalState({ isOpen: true, status: 'saving' });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await handleSave(formData);
      setSaveModalState({ isOpen: true, status: 'success' });
    } catch (error) {
      setSaveModalState({ isOpen: true, status: 'error' });
    }
  };

  /**
   * Save handler (simulated API call)
   */
  const handleSave = useCallback(async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasChanges(false);
  }, []);

  // Auto-save hook
  const { isSaving, lastSaved } = useAutoSave({
    data: formData,
    onSave: handleSave,
    saveInterval: 10000, // 10 seconds
  });

  // Leave confirmation hook
  const { showModal, handleConfirm, handleCancel } = usePageLeaveConfirmation({
    shouldConfirm: hasChanges,
  });

  /**
   * Handle input changes and mark form as dirty
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  /**
   * Close the save progress modal
   */
  const closeSaveModal = () => {
    setSaveModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <main className="max-w-2xl mx-auto p-4" aria-label="Example Form">
      <form className="space-y-4" aria-labelledby="form-title">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            aria-required="true"
            aria-label="Title"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            aria-required="true"
            aria-label="Description"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500" aria-live="polite">
            {isSaving ? (
              'Saving...'
            ) : (
              lastSaved && `Last saved: ${lastSaved.toLocaleTimeString()}`
            )}
          </div>
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md text-white ${
              hasChanges 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
            aria-label="Save Changes"
          >
            Save Changes
          </button>
        </div>
      </form>
      {/* Unsaved changes confirmation modal */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        type="warning"
      />
      {/* Save progress feedback modal */}
      <SaveProgressModal
        isOpen={saveModalState.isOpen}
        status={saveModalState.status}
        onClose={closeSaveModal}
      />
    </main>
  );
};

export default ExampleForm;
// ===============================
// End of File: ExampleForm.jsx
// Description: Example form with auto-save and accessibility
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 