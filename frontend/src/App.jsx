import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import DispatchBoard from './pages/DispatchBoard';
import FormBuilder from './pages/FormBuilder';
import WorkflowManagement from './pages/WorkflowManagement';
import Reports from './pages/Reports';
import Integrations from './pages/Integrations';

const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        {/* Landing Page - Public */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes - Protected */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="dispatch" element={<DispatchBoard />} />
          <Route path="forms" element={<FormBuilder />} />
          <Route path="workflows" element={<WorkflowManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>

        {/* Redirect old routes to new /app routes */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
        <Route path="/dispatch" element={<Navigate to="/app/dispatch" replace />} />
        <Route path="/forms" element={<Navigate to="/app/forms" replace />} />
        <Route path="/workflows" element={<Navigate to="/app/workflows" replace />} />
        <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
        <Route path="/integrations" element={<Navigate to="/app/integrations" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
