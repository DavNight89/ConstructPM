import api from './api';

const WORKFLOWS_BASE = '/workflows';

export const workflowsApi = {
  /**
   * Get all workflows with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.triggerType) params.append('triggerType', filters.triggerType);

    const response = await api.get(`${WORKFLOWS_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single workflow by ID
   */
  getById: async (id) => {
    const response = await api.get(`${WORKFLOWS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new workflow
   */
  create: async (workflowData) => {
    const response = await api.post(WORKFLOWS_BASE, workflowData);
    return response.data;
  },

  /**
   * Update existing workflow
   */
  update: async (id, workflowData) => {
    const response = await api.patch(`${WORKFLOWS_BASE}/${id}`, workflowData);
    return response.data;
  },

  /**
   * Delete workflow
   */
  delete: async (id) => {
    const response = await api.delete(`${WORKFLOWS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Execute workflow manually
   */
  execute: async (id, triggerData) => {
    const response = await api.post(`${WORKFLOWS_BASE}/${id}/execute`, triggerData);
    return response.data;
  },

  /**
   * Update workflow status (activate/deactivate)
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${WORKFLOWS_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Get workflow executions history
   */
  getExecutions: async (id, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`${WORKFLOWS_BASE}/${id}/executions?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single execution details
   */
  getExecution: async (workflowId, executionId) => {
    const response = await api.get(`${WORKFLOWS_BASE}/${workflowId}/executions/${executionId}`);
    return response.data;
  },

  /**
   * Get workflow statistics
   */
  getStatistics: async (id) => {
    const response = await api.get(`${WORKFLOWS_BASE}/${id}/statistics`);
    return response.data;
  },

  /**
   * Test workflow without saving execution
   */
  test: async (id, testData) => {
    const response = await api.post(`${WORKFLOWS_BASE}/${id}/test`, testData);
    return response.data;
  },
};

export default workflowsApi;
