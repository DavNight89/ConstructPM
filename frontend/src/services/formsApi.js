import api from './api';

const FORMS_BASE = '/forms';

export const formsApi = {
  /**
   * Get all forms with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`${FORMS_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single form by ID
   */
  getById: async (id) => {
    const response = await api.get(`${FORMS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new form
   */
  create: async (formData) => {
    const response = await api.post(FORMS_BASE, formData);
    return response.data;
  },

  /**
   * Update existing form
   */
  update: async (id, formData) => {
    const response = await api.put(`${FORMS_BASE}/${id}`, formData);
    return response.data;
  },

  /**
   * Delete form
   */
  delete: async (id) => {
    const response = await api.delete(`${FORMS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Submit a form response
   */
  submitResponse: async (submissionData) => {
    const response = await api.post(`${FORMS_BASE}/submissions`, submissionData);
    return response.data;
  },

  /**
   * Get all form submissions with filters
   */
  getAllSubmissions: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.formId) params.append('formId', filters.formId);
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.workerId) params.append('workerId', filters.workerId);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`${FORMS_BASE}/submissions/all?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single submission by ID
   */
  getSubmission: async (submissionId) => {
    const response = await api.get(`${FORMS_BASE}/submissions/${submissionId}`);
    return response.data;
  },

  /**
   * Update form status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${FORMS_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Duplicate a form
   */
  duplicate: async (id, userId) => {
    const response = await api.post(`${FORMS_BASE}/${id}/duplicate`, { userId });
    return response.data;
  },

  /**
   * Get form statistics
   */
  getStatistics: async (id) => {
    const response = await api.get(`${FORMS_BASE}/${id}/stats`);
    return response.data;
  },
};

export default formsApi;
