/**
 * PrivateRoute.jsx
 *
 * Route guard for authenticated-only pages. Ensures only logged-in users can access child routes.
 * Handles loading, authentication, and user feedback with accessibility.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * PrivateRoute Component
 *
 * Protects routes that require authentication. Redirects unauthenticated users to login.
 * Shows a loading spinner while authentication state is loading.
 *
 * @component
 * @returns {JSX.Element} Protected private route
 */
const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading private route">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect unauthenticated users to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

/**
 * @copyright Tech4biz Solutions Private
 */ 