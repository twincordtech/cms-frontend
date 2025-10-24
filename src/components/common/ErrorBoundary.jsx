// ===============================
// File: ErrorBoundary.jsx
// Description: React error boundary component for catching and displaying errors in child components. Provides user-friendly error UI and reset functionality.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import { Alert, Button } from 'antd';

/**
 * ErrorBoundary is a React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * This improves the user experience by preventing the entire app from crashing due to a single error.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track error status and error details
    this.state = { hasError: false, error: null };
  }

  // Update state when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details for debugging (could be extended to send to external logging service)
  componentDidCatch(error, errorInfo) {
    // TODO: Integrate with external error logging/monitoring service for production
    // Example: Sentry, LogRocket, etc.
    // console.error('Error caught by boundary:', error, errorInfo);
  }

  // Reset error state and reload the page when user clicks 'Retry'
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI with error message and retry button
      return (
        <div style={{ padding: '20px' }}>
          <Alert
            message="Something went wrong"
            description={
              <div>
                <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                <Button type="primary" onClick={this.handleReset}>
                  Retry
                </Button>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
// ===============================
// End of File: ErrorBoundary.jsx
// Description: Error boundary for React components
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 