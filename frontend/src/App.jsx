import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import DispatchBoard from './pages/DispatchBoard';
import FormBuilder from './pages/FormBuilder';
import WorkflowManagement from './pages/WorkflowManagement';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';
import WorkerDashboard from './pages/WorkerDashboard';
import { ProtectedRoute, RequireRole, RoleBasedRedirect } from './components/ProtectedRoute';
import { ROLES } from './config/permissions';

const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <AuthProvider>
      <Router basename={basename}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Role-based redirect for /app */}
            <Route index element={<RoleBasedRedirect />} />

            {/* Admin & PM Routes */}
            <Route
              path="dashboard"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.DISPATCHER]}>
                  <Dashboard />
                </RequireRole>
              }
            />
            <Route
              path="projects"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.DISPATCHER]}>
                  <Projects />
                </RequireRole>
              }
            />
            <Route
              path="reports"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER]}>
                  <Reports />
                </RequireRole>
              }
            />
            <Route
              path="workflows"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER]}>
                  <WorkflowManagement />
                </RequireRole>
              }
            />
            <Route
              path="integrations"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER]}>
                  <Integrations />
                </RequireRole>
              }
            />

            {/* Dispatcher Routes */}
            <Route
              path="dispatch"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.DISPATCHER]}>
                  <DispatchBoard />
                </RequireRole>
              }
            />

            {/* Form Routes - Different access levels */}
            <Route
              path="forms"
              element={
                <RequireRole roles={[ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.DISPATCHER]}>
                  <FormBuilder />
                </RequireRole>
              }
            />
            <Route path="forms/submit" element={<FormBuilder />} />

            {/* Worker Routes */}
            <Route
              path="my-jobs"
              element={
                <RequireRole roles={[ROLES.WORKER]}>
                  <WorkerDashboard />
                </RequireRole>
              }
            />

            {/* Shared Routes */}
            <Route path="profile" element={<div className="p-4"><h1 className="text-2xl font-bold">My Profile</h1><p className="text-gray-500 mt-2">Profile settings coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-4"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-500 mt-2">Settings page coming soon...</p></div>} />
          </Route>

          {/* Redirect old routes to new /app routes */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
          <Route path="/dispatch" element={<Navigate to="/app/dispatch" replace />} />
          <Route path="/forms" element={<Navigate to="/app/forms" replace />} />
          <Route path="/workflows" element={<Navigate to="/app/workflows" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/integrations" element={<Navigate to="/app/integrations" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
