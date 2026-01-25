// Role-based permissions configuration

export const ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  DISPATCHER: 'dispatcher',
  WORKER: 'worker',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.PROJECT_MANAGER]: 'Project Manager',
  [ROLES.DISPATCHER]: 'Dispatcher',
  [ROLES.WORKER]: 'Field Worker',
};

// Permission matrix for each role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    dashboard: ['view', 'export'],
    projects: ['view', 'create', 'edit', 'delete', 'archive'],
    dispatch: ['view', 'assign', 'reassign', 'cancel'],
    forms: ['view', 'create', 'edit', 'delete', 'submit', 'approve'],
    workers: ['view', 'create', 'edit', 'deactivate'],
    reports: ['view', 'create', 'export'],
    workflows: ['view', 'create', 'edit', 'delete'],
    integrations: ['view', 'configure'],
    settings: ['view', 'edit'],
  },

  [ROLES.PROJECT_MANAGER]: {
    dashboard: ['view', 'export'],
    projects: ['view', 'create', 'edit'],
    dispatch: ['view', 'assign', 'reassign'],
    forms: ['view', 'create', 'edit', 'approve'],
    workers: ['view'],
    reports: ['view', 'export'],
    workflows: ['view', 'create', 'edit'],
    integrations: ['view'],
    settings: ['view'],
  },

  [ROLES.DISPATCHER]: {
    dashboard: ['view'],
    projects: ['view'],
    dispatch: ['view', 'assign', 'reassign', 'cancel'],
    forms: ['view'],
    workers: ['view'],
    reports: [],
    workflows: [],
    integrations: [],
    settings: [],
  },

  [ROLES.WORKER]: {
    dashboard: [],
    projects: [],
    dispatch: ['view_own'],
    forms: ['view_assigned', 'submit'],
    workers: [],
    reports: [],
    workflows: [],
    integrations: [],
    settings: ['view_own', 'edit_own'],
  },
};

// Navigation items with their required modules
export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/app/dashboard', module: 'dashboard', icon: 'LayoutDashboard' },
  { name: 'Projects', href: '/app/projects', module: 'projects', icon: 'FolderKanban' },
  { name: 'Dispatch', href: '/app/dispatch', module: 'dispatch', icon: 'Truck' },
  { name: 'Forms', href: '/app/forms', module: 'forms', icon: 'FileText' },
  { name: 'Workflows', href: '/app/workflows', module: 'workflows', icon: 'GitBranch' },
  { name: 'Reports', href: '/app/reports', module: 'reports', icon: 'BarChart3' },
  { name: 'Integrations', href: '/app/integrations', module: 'integrations', icon: 'Plug' },
];

// Worker-specific navigation
export const WORKER_NAVIGATION = [
  { name: 'My Jobs', href: '/app/my-jobs', icon: 'Briefcase' },
  { name: 'Submit Form', href: '/app/forms/submit', icon: 'FileText' },
  { name: 'My Profile', href: '/app/profile', icon: 'User' },
];

// Default landing page per role
export const ROLE_DEFAULT_ROUTE = {
  [ROLES.ADMIN]: '/app/dashboard',
  [ROLES.PROJECT_MANAGER]: '/app/dashboard',
  [ROLES.DISPATCHER]: '/app/dispatch',
  [ROLES.WORKER]: '/app/my-jobs',
};
