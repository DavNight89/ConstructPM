import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS, ROLES, NAVIGATION_ITEMS, WORKER_NAVIGATION } from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  // Check if user has a specific permission for a module
  const can = (module, action) => {
    if (!user?.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role]?.[module] || [];
    return permissions.includes(action);
  };

  // Check if user can access a module at all (has any permission)
  const canAccessModule = (module) => {
    if (!user?.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role]?.[module] || [];
    return permissions.length > 0;
  };

  // Check if user has any of the specified permissions
  const canAny = (module, actions) => {
    if (!user?.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role]?.[module] || [];
    return actions.some(action => permissions.includes(action));
  };

  // Check if user has all of the specified permissions
  const canAll = (module, actions) => {
    if (!user?.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role]?.[module] || [];
    return actions.every(action => permissions.includes(action));
  };

  // Check if user has one of the specified roles
  const hasRole = (...roles) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  // Check if user is admin
  const isAdmin = () => hasRole(ROLES.ADMIN);

  // Check if user is a worker
  const isWorker = () => hasRole(ROLES.WORKER);

  // Get navigation items for current user
  const getNavigation = () => {
    if (!user?.role) return [];

    // Workers get a different navigation
    if (user.role === ROLES.WORKER) {
      return WORKER_NAVIGATION;
    }

    // Other roles get filtered navigation based on permissions
    return NAVIGATION_ITEMS.filter(item => canAccessModule(item.module));
  };

  // Check if user can view only their own items (worker restriction)
  const canOnlyViewOwn = (module) => {
    if (!user?.role) return true;
    const permissions = ROLE_PERMISSIONS[user.role]?.[module] || [];
    return permissions.includes('view_own') && !permissions.includes('view');
  };

  return {
    can,
    canAccessModule,
    canAny,
    canAll,
    hasRole,
    isAdmin,
    isWorker,
    getNavigation,
    canOnlyViewOwn,
    role: user?.role,
    permissions: user?.role ? ROLE_PERMISSIONS[user.role] : {},
  };
};

export default usePermissions;
