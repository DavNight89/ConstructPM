import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { ROLE_DEFAULT_ROUTE } from '../config/permissions';

// Requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};

// Requires specific roles
export const RequireRole = ({ roles, children, fallbackPath = null }) => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(...roles)) {
    // Redirect to user's default route if they don't have permission
    const defaultRoute = fallbackPath || ROLE_DEFAULT_ROUTE[user.role] || '/app/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return children || <Outlet />;
};

// Requires specific permission
export const RequirePermission = ({ module, action, children, fallback = null }) => {
  const { can } = usePermissions();

  if (!can(module, action)) {
    return fallback || null;
  }

  return children;
};

// Redirects authenticated users based on role
export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const defaultRoute = ROLE_DEFAULT_ROUTE[user?.role] || '/app/dashboard';
  return <Navigate to={defaultRoute} replace />;
};

// Public route - redirects to app if already authenticated
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const defaultRoute = ROLE_DEFAULT_ROUTE[user?.role] || '/app/dashboard';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
