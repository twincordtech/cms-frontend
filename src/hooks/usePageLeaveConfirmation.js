// ===============================
// File: usePageLeaveConfirmation.js
// Description: React hook for confirming navigation away from a page with unsaved changes.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { useEffect, useState, useCallback } from 'react';

/**
 * usePageLeaveConfirmation prompts the user before leaving a page with unsaved changes.
 * @param {Object} params
 * @param {boolean} [params.shouldConfirm=false] - Whether to show confirmation
 * @returns {{ showModal: boolean, handleConfirm: function, handleCancel: function }}
 */
const usePageLeaveConfirmation = ({ shouldConfirm = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  /**
   * Handle browser beforeunload event
   */
  const handleBeforeUnload = useCallback((event) => {
    if (shouldConfirm) {
      event.preventDefault();
      event.returnValue = '';
      return '';
    }
  }, [shouldConfirm]);

  /**
   * Handle browser popstate (back/forward navigation)
   */
  const handlePopState = useCallback((event) => {
    if (shouldConfirm) {
      event.preventDefault();
      setShowModal(true);
      setPendingNavigation(event);
    }
  }, [shouldConfirm]);

  /**
   * Confirm navigation
   */
  const handleConfirm = useCallback(() => {
    setShowModal(false);
    if (pendingNavigation) {
      window.history.go(pendingNavigation.state);
    } else {
      window.location.reload();
    }
    setPendingNavigation(null);
  }, [pendingNavigation]);

  /**
   * Cancel navigation
   */
  const handleCancel = useCallback(() => {
    setShowModal(false);
    setPendingNavigation(null);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBeforeUnload, handlePopState]);

  return {
    showModal,
    handleConfirm,
    handleCancel
  };
};

export default usePageLeaveConfirmation;
// ===============================
// End of File: usePageLeaveConfirmation.js
// Description: Page leave confirmation React hook
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 