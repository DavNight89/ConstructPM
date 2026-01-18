import api from './api';

const DISPATCH_BASE = '/dispatch';

export const dispatchApi = {
  /**
   * Get all dispatch tasks with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.projectId) params.append('projectId', filters.projectId);

    const response = await api.get(`${DISPATCH_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single dispatch task by ID
   */
  getById: async (id) => {
    const response = await api.get(`${DISPATCH_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new dispatch task
   */
  create: async (dispatchData) => {
    const response = await api.post(DISPATCH_BASE, dispatchData);
    return response.data;
  },

  /**
   * Update existing dispatch task
   */
  update: async (id, dispatchData) => {
    const response = await api.patch(`${DISPATCH_BASE}/${id}`, dispatchData);
    return response.data;
  },

  /**
   * Delete dispatch task
   */
  delete: async (id) => {
    const response = await api.delete(`${DISPATCH_BASE}/${id}`);
    return response.data;
  },

  /**
   * Assign task to worker
   */
  assign: async (id, workerId) => {
    const response = await api.patch(`${DISPATCH_BASE}/${id}/assign`, { workerId });
    return response.data;
  },

  /**
   * Update task status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${DISPATCH_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update task location
   */
  updateLocation: async (id, location) => {
    const response = await api.patch(`${DISPATCH_BASE}/${id}/location`, location);
    return response.data;
  },

  /**
   * Get task history/timeline
   */
  getHistory: async (id) => {
    const response = await api.get(`${DISPATCH_BASE}/${id}/history`);
    return response.data;
  },

  /**
   * Get dispatch statistics
   */
  getStatistics: async () => {
    const response = await api.get(`${DISPATCH_BASE}/statistics`);
    return response.data;
  },

  /**
   * Get active tasks for a specific worker
   */
  getWorkerTasks: async (workerId, status = 'active') => {
    const response = await api.get(`${DISPATCH_BASE}/worker/${workerId}?status=${status}`);
    return response.data;
  },
};

export default dispatchApi;
