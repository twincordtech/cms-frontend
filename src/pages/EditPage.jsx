import React, { useState } from 'react';
import useAutoSave from '../hooks/useAutoSave';
import usePageLeaveConfirmation from '../hooks/usePageLeaveConfirmation';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const EditPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    // ... other form fields
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = async (data) => {
    try {
      // API call to save the data
      await saveToAPI(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const { isSaving, lastSaved, onFieldEdit } = useAutoSave({
    data: formData,
    onSave: handleSave,
    interval: 10000, // 10 seconds
    enabled: true,
    debounceDelay: 500,
  });

  const { showModal, handleConfirm, handleCancel } = usePageLeaveConfirmation({
    shouldConfirm: hasUnsavedChanges,
    onConfirm: () => {
      // Optionally save changes before leaving
      if (hasUnsavedChanges) {
        handleSave(formData);
      }
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    onFieldEdit(); // Notify auto-save about the edit
  };

  return (
    <div className="edit-page">
      <h1>Edit Page</h1>
      
      <div className="save-status">
        {isSaving ? (
          <span>Saving...</span>
        ) : (
          lastSaved && <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
        )}
      </div>

      <form>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>
      </form>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Leave Page?"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        type="warning"
      />
    </div>
  );
};

export default EditPage; 