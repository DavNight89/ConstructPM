import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, DollarSign, Users, MoreVertical, AlertCircle } from 'lucide-react';
import projectsApi from '../services/projectsApi';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsApi.getAll(filters);
      // Handle paginated response from backend and transform data
      const transformedProjects = (response.data || []).map(project => ({
        ...project,
        client: project.manager ? `${project.manager.firstName} ${project.manager.lastName}` : 'Unassigned',
        manager: project.manager ? `${project.manager.firstName} ${project.manager.lastName}` : 'Unassigned',
        location: project.location?.address || 'No location set',
        workers: project.jobs?.length || 0,
        startDate: new Date(project.startDate).toLocaleDateString(),
        endDate: new Date(project.endDate).toLocaleDateString(),
        budget: parseFloat(project.budget),
        spent: parseFloat(project.spent),
      }));
      setProjects(transformedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProjects({ search: value, status: statusFilter });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchProjects({ search: searchTerm, status });
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (selectedProject) {
        // Update existing project
        await projectsApi.update(selectedProject.id, formData);
      } else {
        // Create new project
        await projectsApi.create(formData);
      }
      setShowForm(false);
      setSelectedProject(null);
      fetchProjects({ search: searchTerm, status: statusFilter });
    } catch (err) {
      console.error('Error saving project:', err);
      alert(err.response?.data?.message || 'Failed to save project. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-hold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your construction projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search projects..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'grid'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchProjects()}
            className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projects.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </div>
                  <button
                    onClick={() => handleEditProject(project)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Edit project"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {project.startDate} - {project.endDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {project.workers} workers
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                    {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500">PM: {project.manager}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects List */}
      {!loading && !error && projects.length > 0 && viewMode === 'list' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(project.budget)}</div>
                    <div className="text-xs text-gray-500">Spent: {formatCurrency(project.spent)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.workers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.manager}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={selectedProject}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default Projects;
