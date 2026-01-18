import api from './api';

const USERS_BASE = '/users';

export const usersApi = {
  /**
   * Get all users with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`${USERS_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single user by ID
   */
  getById: async (id) => {
    const response = await api.get(`${USERS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (userData) => {
    const response = await api.post(USERS_BASE, userData);
    return response.data;
  },

  /**
   * Update existing user
   */
  update: async (id, userData) => {
    const response = await api.patch(`${USERS_BASE}/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user (soft delete)
   */
  delete: async (id) => {
    const response = await api.delete(`${USERS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Hard delete user (permanent)
   */
  hardDelete: async (id) => {
    const response = await api.delete(`${USERS_BASE}/${id}/hard`);
    return response.data;
  },

  /**
   * Update user status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${USERS_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (id, passwordData) => {
    const response = await api.patch(`${USERS_BASE}/${id}/password`, passwordData);
    return response.data;
  },

  /**
   * Get user statistics
   */
  getStatistics: async () => {
    const response = await api.get(`${USERS_BASE}/statistics`);
    return response.data;
  },
};

export default usersApi;
