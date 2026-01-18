import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Search
} from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/app/projects', icon: FolderKanban },
    { name: 'Dispatch Board', href: '/app/dispatch', icon: Radio },
    { name: 'Form Builder', href: '/app/forms', icon: FileText },
    { name: 'Workflows', href: '/app/workflows', icon: GitBranch },
    { name: 'Reports', href: '/app/reports', icon: BarChart3 },
    { name: 'Integrations', href: '/app/integrations', icon: Puzzle },
  ];

  const isActive = (path) => location.pathname === path;

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
              <Link to="/app/dashboard" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-primary-600">
                  ConstructPM
                </span>
              </Link>
            </div>

            {/* Search Bar */}
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

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                <Settings size={20} />
              </button>
              <button className="flex items-center gap-2 p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                <User size={20} />
                <span className="hidden md:block text-sm font-medium">John Doe</span>
              </button>
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

          {/* Quick Stats in Sidebar */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Stats
            </h3>
            <div className="mt-3 space-y-2">
              <div className="px-2 py-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Active Projects</div>
                <div className="text-2xl font-bold text-gray-900">24</div>
              </div>
              <div className="px-2 py-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Active Jobs</div>
                <div className="text-2xl font-bold text-gray-900">157</div>
              </div>
              <div className="px-2 py-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Field Workers</div>
                <div className="text-2xl font-bold text-gray-900">48</div>
              </div>
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
