// ===============================
// File: useAutoSave.js
// Description: React hook for auto-saving data at intervals with error handling and feedback.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { useState, useEffect, useRef } from 'react';

/**
 * useAutoSave automatically saves data at a specified interval if changes are detected.
 * @param {Object} params
 * @param {any} params.data - The data to watch for changes
 * @param {function} params.onSave - The save function to call
 * @param {number} [params.saveInterval=10000] - Interval in ms between saves
 * @returns {{ isSaving: boolean, lastSaved: Date|null }}
 */
const useAutoSave = ({ data, onSave, saveInterval = 10000 }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);
  const isEditingRef = useRef(false);
  const lastDataRef = useRef(data);

  /**
   * Save the data if it has changed
   */
  const save = async () => {
    if (!isSaving && JSON.stringify(data) !== JSON.stringify(lastDataRef.current)) {
      try {
        setIsSaving(true);
        await onSave(data);
        setLastSaved(new Date());
        lastDataRef.current = data;
      } catch (error) {
        // Log error for debugging; could add user feedback if needed
        // Optionally integrate with error monitoring
        // console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    const startAutoSave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!isEditingRef.current) {
        timeoutRef.current = setTimeout(save, saveInterval);
      }
    };
    startAutoSave();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveInterval]);

  return {
    isSaving,
    lastSaved,
  };
};

export default useAutoSave;
// ===============================
// End of File: useAutoSave.js
// Description: Auto-save React hook
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 