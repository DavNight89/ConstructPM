import { useState } from 'react';
import { X } from 'lucide-react';

const FormDialog = ({ onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'inspection',
    settings: {
      requireGPS: false,
      requireSignature: true,
      allowOffline: true,
      emailNotifications: false,
      autoSubmit: false,
    },
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'inspection', label: 'Inspection' },
    { value: 'safety', label: 'Safety' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'timesheet', label: 'Timesheet' },
    { value: 'incident', label: 'Incident Report' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('settings.')) {
      const settingName = name.replace('settings.', '');
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Form name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Transform data to match backend API
    const submitData = {
      name: formData.name,
      category: formData.category,
      version: 1,
      fields: [], // Start with empty fields - user will add them in the builder
      settings: formData.settings,
      logic: [],
      metadata: {
        createdBy: 'af35a1ad-6260-4ab9-9cb8-9275df4ac70c', // Default user ID for now
      },
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Form</h3>
          <button
            onClick={onClose}
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
                Form Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="e.g., Daily Safety Inspection"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Form Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Form Settings</h4>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.requireGPS"
                  checked={formData.settings.requireGPS}
                  onChange={handleChange}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Require GPS location</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.requireSignature"
                  checked={formData.settings.requireSignature}
                  onChange={handleChange}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Require digital signature</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.allowOffline"
                  checked={formData.settings.allowOffline}
                  onChange={handleChange}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Allow offline submissions</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.emailNotifications"
                  checked={formData.settings.emailNotifications}
                  onChange={handleChange}
                  className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Send email notifications</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDialog;
