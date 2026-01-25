import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Briefcase,
  Truck,
  HardHat,
  Shield,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../config/permissions';

const Login = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  const roleOptions = [
    {
      role: ROLES.ADMIN,
      label: ROLE_LABELS[ROLES.ADMIN],
      icon: Shield,
      description: 'Full system access. Manage users, projects, and all settings.',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      hoverColor: 'hover:border-purple-500',
    },
    {
      role: ROLES.PROJECT_MANAGER,
      label: ROLE_LABELS[ROLES.PROJECT_MANAGER],
      icon: Briefcase,
      description: 'Manage projects, view reports, approve forms, coordinate teams.',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      hoverColor: 'hover:border-blue-500',
    },
    {
      role: ROLES.DISPATCHER,
      label: ROLE_LABELS[ROLES.DISPATCHER],
      icon: Truck,
      description: 'Assign jobs to workers, manage schedules, track field teams.',
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      hoverColor: 'hover:border-orange-500',
    },
    {
      role: ROLES.WORKER,
      label: ROLE_LABELS[ROLES.WORKER],
      icon: HardHat,
      description: 'View assigned jobs, submit forms, update job status.',
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      hoverColor: 'hover:border-green-500',
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole) {
      const redirectPath = loginAsRole(selectedRole);
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Building2 className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ConstructPM</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Demo Login</h1>
            <p className="mt-2 text-gray-600">
              Select a role to explore ConstructPM with different permission levels
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.role;

              return (
                <button
                  key={option.role}
                  onClick={() => handleRoleSelect(option.role)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? `${option.borderColor} bg-white shadow-md`
                      : `border-gray-200 bg-white ${option.hoverColor} hover:shadow-sm`
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`${option.color} p-2 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    {isSelected && (
                      <div className={`${option.color} rounded-full p-1`}>
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
              selectedRole
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedRole ? (
              <>
                Continue as {ROLE_LABELS[selectedRole]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              'Select a role to continue'
            )}
          </button>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Demo Mode</h4>
            <p className="text-sm text-blue-700">
              This is a demonstration of ConstructPM's role-based access control. Each role has
              different permissions and sees different features. In production, users would
              log in with their credentials and their role would be assigned by an administrator.
            </p>
          </div>

          {/* Permission Preview */}
          {selectedRole && (
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {ROLE_LABELS[selectedRole]} can access:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedRole === ROLES.ADMIN && (
                  <>
                    <div className="flex items-center text-green-600">✓ Dashboard</div>
                    <div className="flex items-center text-green-600">✓ Projects</div>
                    <div className="flex items-center text-green-600">✓ Dispatch Board</div>
                    <div className="flex items-center text-green-600">✓ Form Builder</div>
                    <div className="flex items-center text-green-600">✓ Reports</div>
                    <div className="flex items-center text-green-600">✓ User Management</div>
                    <div className="flex items-center text-green-600">✓ Workflows</div>
                    <div className="flex items-center text-green-600">✓ Settings</div>
                  </>
                )}
                {selectedRole === ROLES.PROJECT_MANAGER && (
                  <>
                    <div className="flex items-center text-green-600">✓ Dashboard</div>
                    <div className="flex items-center text-green-600">✓ Projects</div>
                    <div className="flex items-center text-green-600">✓ Dispatch Board</div>
                    <div className="flex items-center text-green-600">✓ Form Builder</div>
                    <div className="flex items-center text-green-600">✓ Reports</div>
                    <div className="flex items-center text-green-600">✓ Workflows</div>
                    <div className="flex items-center text-gray-400">✗ User Management</div>
                    <div className="flex items-center text-gray-400">✗ Settings (limited)</div>
                  </>
                )}
                {selectedRole === ROLES.DISPATCHER && (
                  <>
                    <div className="flex items-center text-green-600">✓ Dashboard (limited)</div>
                    <div className="flex items-center text-green-600">✓ Projects (view only)</div>
                    <div className="flex items-center text-green-600">✓ Dispatch Board</div>
                    <div className="flex items-center text-green-600">✓ Forms (view only)</div>
                    <div className="flex items-center text-gray-400">✗ Reports</div>
                    <div className="flex items-center text-gray-400">✗ Workflows</div>
                    <div className="flex items-center text-gray-400">✗ User Management</div>
                    <div className="flex items-center text-gray-400">✗ Settings</div>
                  </>
                )}
                {selectedRole === ROLES.WORKER && (
                  <>
                    <div className="flex items-center text-green-600">✓ My Jobs</div>
                    <div className="flex items-center text-green-600">✓ Submit Forms</div>
                    <div className="flex items-center text-green-600">✓ My Profile</div>
                    <div className="flex items-center text-gray-400">✗ Dashboard</div>
                    <div className="flex items-center text-gray-400">✗ Projects</div>
                    <div className="flex items-center text-gray-400">✗ Reports</div>
                    <div className="flex items-center text-gray-400">✗ Workflows</div>
                    <div className="flex items-center text-gray-400">✗ Settings</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
