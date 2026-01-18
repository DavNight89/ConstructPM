import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProjectForm = ({ project = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientName: '',
    clientContact: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    managerId: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form if editing existing project
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        clientName: project.clientName || '',
        clientContact: project.clientContact || '',
        status: project.status || 'planning',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        budget: project.budget || '',
        location: project.location || '',
        address: project.address || '',
        city: project.city || '',
        state: project.state || '',
        zipCode: project.zipCode || '',
        latitude: project.latitude || '',
        longitude: project.longitude || '',
        managerId: project.managerId || '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.budget || isNaN(formData.budget) || parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Budget is required and must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Transform data to match backend API
    const submitData = {
      name: formData.name,
      description: formData.description || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      managerId: formData.managerId || 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c', // Default manager ID for now
      status: formData.status || 'planning',
      priority: 'medium',
      progress: 0,
    };

    // Add location if coordinates are provided
    if (formData.latitude && formData.longitude) {
      submitData.location = {
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
        address: formData.address || formData.location,
      };
    }

    // Remove undefined fields
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
                disabled={loading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget ($)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.budget
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  disabled={loading}
                />
                {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget}</p>}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Client Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.clientName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  disabled={loading}
                />
                {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
              </div>

              <div>
                <label htmlFor="clientContact" className="block text-sm font-medium text-gray-700">
                  Client Contact
                </label>
                <input
                  type="text"
                  id="clientContact"
                  name="clientContact"
                  value={formData.clientContact}
                  onChange={handleChange}
                  placeholder="Email or phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Timeline</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.startDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  disabled={loading}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.endDate
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                  disabled={loading}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Location</h4>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location Name
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Downtown Plaza"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  placeholder="e.g., 40.7128"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  placeholder="e.g., -74.0060"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
