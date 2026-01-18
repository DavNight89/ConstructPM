import api from './api';

const PROJECTS_BASE = '/projects';

export const projectsApi = {
  /**
   * Get all projects with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`${PROJECTS_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single project by ID
   */
  getById: async (id) => {
    const response = await api.get(`${PROJECTS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new project
   */
  create: async (projectData) => {
    const response = await api.post(PROJECTS_BASE, projectData);
    return response.data;
  },

  /**
   * Update existing project
   */
  update: async (id, projectData) => {
    const response = await api.patch(`${PROJECTS_BASE}/${id}`, projectData);
    return response.data;
  },

  /**
   * Delete project
   */
  delete: async (id) => {
    const response = await api.delete(`${PROJECTS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Update project status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${PROJECTS_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Assign manager to project
   */
  assignManager: async (id, managerId) => {
    const response = await api.patch(`${PROJECTS_BASE}/${id}/assign-manager`, { managerId });
    return response.data;
  },

  /**
   * Get project statistics
   */
  getStatistics: async () => {
    const response = await api.get(`${PROJECTS_BASE}/statistics`);
    return response.data;
  },
};

export default projectsApi;
