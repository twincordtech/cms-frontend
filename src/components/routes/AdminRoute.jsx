/**
 * AdminRoute.jsx
 *
 * Route guard for admin-only pages. Ensures only authenticated admin users can access child routes.
 * Handles loading, authentication, and authorization with user feedback and accessibility.
 *
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * AdminRoute Component
 *
 * Protects routes that require admin privileges. Redirects unauthenticated users to login,
 * and non-admin users to the dashboard. Shows a loading spinner while authentication state is loading.
 *
 * @component
 * @returns {JSX.Element} Protected admin route
 */
const AdminRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-label="Loading admin route">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admin users to dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes for authenticated admin users
  return <Outlet />;
};

export default AdminRoute;

/**
 * @copyright Tech4biz Solutions Private
 */ 