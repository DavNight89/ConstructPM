import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Radio,
  FileText,
  GitBranch,
  BarChart3,
  Puzzle,
  Menu,
  X,
  Bell,
  Settings,
  User,
  Search,
  LogOut,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { ROLE_LABELS, ROLES } from '../config/permissions';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isWorker, canAccessModule } = usePermissions();

  // Build navigation based on user permissions
  const navigation = isWorker()
    ? [
        { name: 'My Jobs', href: '/app/my-jobs', icon: Briefcase },
        { name: 'Submit Form', href: '/app/forms/submit', icon: FileText },
        { name: 'My Profile', href: '/app/profile', icon: User },
      ]
    : [
        canAccessModule('dashboard') && { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
        canAccessModule('projects') && { name: 'Projects', href: '/app/projects', icon: FolderKanban },
        canAccessModule('dispatch') && { name: 'Dispatch Board', href: '/app/dispatch', icon: Radio },
        canAccessModule('forms') && { name: 'Form Builder', href: '/app/forms', icon: FileText },
        canAccessModule('workflows') && { name: 'Workflows', href: '/app/workflows', icon: GitBranch },
        canAccessModule('reports') && { name: 'Reports', href: '/app/reports', icon: BarChart3 },
        canAccessModule('integrations') && { name: 'Integrations', href: '/app/integrations', icon: Puzzle },
      ].filter(Boolean);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case ROLES.PROJECT_MANAGER:
        return 'bg-blue-100 text-blue-800';
      case ROLES.DISPATCHER:
        return 'bg-orange-100 text-orange-800';
      case ROLES.WORKER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to={isWorker() ? '/app/my-jobs' : '/app/dashboard'} className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary-600">
                  ConstructPM
                </span>
              </Link>
            </div>

            {/* Search Bar - Hidden for workers */}
            {!isWorker() && (
              <div className="hidden lg:block lg:pl-3 flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="Search projects, forms, jobs..."
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-primary-600" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className={`text-xs px-1.5 py-0.5 rounded ${getRoleBadgeColor(user?.role)}`}>
                      {ROLE_LABELS[user?.role] || 'Unknown Role'}
                    </div>
                  </div>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                      <Link
                        to="/app/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        My Profile
                      </Link>
                      {!isWorker() && (
                        <Link
                          to="/app/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Settings
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-2 rounded-lg group ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={active ? 'text-primary-600' : 'text-gray-500'}
                    />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Quick Stats in Sidebar - Only for non-workers */}
          {!isWorker() && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Stats
              </h3>
              <div className="mt-3 space-y-2">
                <div className="px-2 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Active Projects</div>
                  <div className="text-2xl font-bold text-gray-900">6</div>
                </div>
                <div className="px-2 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Active Jobs</div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                </div>
                <div className="px-2 py-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Field Workers</div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                </div>
              </div>
            </div>
          )}

          {/* Worker-specific info */}
          {isWorker() && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Today's Summary
              </h3>
              <div className="mt-3 space-y-2">
                <div className="px-2 py-2 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-600">Completed</div>
                  <div className="text-2xl font-bold text-green-700">2</div>
                </div>
                <div className="px-2 py-2 bg-yellow-50 rounded-lg">
                  <div className="text-xs text-yellow-600">Pending</div>
                  <div className="text-2xl font-bold text-yellow-700">3</div>
                </div>
              </div>
            </div>
          )}

          {/* Role indicator at bottom */}
          <div className="absolute bottom-4 left-3 right-3">
            <div className={`px-3 py-2 rounded-lg ${getRoleBadgeColor(user?.role)}`}>
              <div className="text-xs font-medium">Logged in as</div>
              <div className="font-semibold">{ROLE_LABELS[user?.role]}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <main className="pt-20 px-4 md:px-6 lg:px-8 py-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
