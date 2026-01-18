import api from './api';

const REPORTS_BASE = '/reports';

export const reportsApi = {
  /**
   * Get all reports with optional filters
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);

    const response = await api.get(`${REPORTS_BASE}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single report by ID
   */
  getById: async (id) => {
    const response = await api.get(`${REPORTS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Create new report
   */
  create: async (reportData) => {
    const response = await api.post(REPORTS_BASE, reportData);
    return response.data;
  },

  /**
   * Update existing report
   */
  update: async (id, reportData) => {
    const response = await api.patch(`${REPORTS_BASE}/${id}`, reportData);
    return response.data;
  },

  /**
   * Delete report
   */
  delete: async (id) => {
    const response = await api.delete(`${REPORTS_BASE}/${id}`);
    return response.data;
  },

  /**
   * Generate/execute a report
   */
  generate: async (id, options = {}) => {
    const response = await api.post(`${REPORTS_BASE}/${id}/generate`, options, {
      responseType: options.download ? 'blob' : 'json',
    });

    // If downloading, create a blob URL and trigger download
    if (options.download && response.data instanceof Blob) {
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = options.filename || `report-${id}-${Date.now()}.${options.format || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Report downloaded successfully' };
    }

    return response.data;
  },

  /**
   * Get report executions history
   */
  getExecutions: async (id, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`${REPORTS_BASE}/${id}/executions?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single execution details
   */
  getExecution: async (reportId, executionId) => {
    const response = await api.get(`${REPORTS_BASE}/${reportId}/executions/${executionId}`);
    return response.data;
  },

  /**
   * Download report execution file
   */
  downloadExecution: async (reportId, executionId, format) => {
    const response = await api.get(
      `${REPORTS_BASE}/${reportId}/executions/${executionId}/download/${format}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${reportId}-${executionId}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Report downloaded successfully' };
  },

  /**
   * Update report status
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`${REPORTS_BASE}/${id}/status`, { status });
    return response.data;
  },

  /**
   * Schedule a report
   */
  schedule: async (id, scheduleData) => {
    const response = await api.post(`${REPORTS_BASE}/${id}/schedule`, scheduleData);
    return response.data;
  },

  /**
   * Get report statistics
   */
  getStatistics: async (id) => {
    const response = await api.get(`${REPORTS_BASE}/${id}/statistics`);
    return response.data;
  },

  /**
   * Preview report data without generating file
   */
  preview: async (id, parameters = {}) => {
    const response = await api.post(`${REPORTS_BASE}/${id}/preview`, parameters);
    return response.data;
  },
};

export default reportsApi;
