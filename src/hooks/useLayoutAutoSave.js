/* ========================================================================
 * File: useLayoutAutoSave.js
 * Description: Custom React hook for managing auto-save logic in layout editing.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import { useEffect, useRef } from 'react';

/**
 * useLayoutAutoSave Hook
 * Manages auto-save timer and effect for layout editing.
 * @param {object} params
 * @param {boolean} params.hasUnsavedChanges - Whether there are unsaved changes
 * @param {boolean} params.isAutoSaving - Whether auto-save is in progress
 * @param {function} params.handleAutoSave - Function to call for auto-saving
 */
const useLayoutAutoSave = ({ hasUnsavedChanges, isAutoSaving, handleAutoSave }) => {
  const autoSaveTimeoutRef = useRef(null);

  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(handleAutoSave, 10000); // 10 seconds
    }
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, handleAutoSave, isAutoSaving]);
};

export default useLayoutAutoSave;

/* ========================================================================
 * End of File: useLayoutAutoSave.js
 * ======================================================================== */ 