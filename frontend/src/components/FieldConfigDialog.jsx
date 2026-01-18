import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FieldConfigDialog = ({ field, onClose, onSave, loading = false }) => {
  const [formData, setFormData] = useState({
    id: field?.id || `field_${Date.now()}`,
    type: field?.type || 'text',
    label: field?.label || '',
    name: field?.name || '',
    placeholder: field?.placeholder || '',
    required: field?.required || false,
    validation: field?.validation || {},
    options: field?.options || [],
  });

  const [errors, setErrors] = useState({});
  const [optionInput, setOptionInput] = useState('');

  // Auto-generate field name from label
  useEffect(() => {
    if (!field && formData.label && !formData.name) {
      const generatedName = formData.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setFormData(prev => ({ ...prev, name: generatedName }));
    }
  }, [formData.label, field, formData.name]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, optionInput.trim()],
      }));
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Field label is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required';
    }

    if ((formData.type === 'select' || formData.type === 'checkbox') && formData.options.length === 0) {
      newErrors.options = 'At least one option is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSave(formData);
  };

  const requiresOptions = formData.type === 'select' || formData.type === 'checkbox';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {field ? 'Edit Field' : 'Add Field'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field Label */}
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700">
              Field Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.label ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              placeholder="e.g., Inspector Name"
              disabled={loading}
            />
            {errors.label && (
              <p className="mt-1 text-sm text-red-600">{errors.label}</p>
            )}
          </div>

          {/* Field Name (ID) */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Field Name/ID <span className="text-red-500">*</span>
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
              placeholder="e.g., inspector_name"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Used to identify this field in submissions (auto-generated from label)
            </p>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Placeholder */}
          {['text', 'email', 'phone', 'textarea', 'number'].includes(formData.type) && (
            <div>
              <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700">
                Placeholder Text
              </label>
              <input
                type="text"
                id="placeholder"
                name="placeholder"
                value={formData.placeholder}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="e.g., Enter your name"
                disabled={loading}
              />
            </div>
          )}

          {/* Options for Select and Checkbox */}
          {requiresOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter option and press Enter"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              {formData.options.length > 0 && (
                <div className="space-y-1 mt-2">
                  {formData.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-gray-900">{option}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.options && (
                <p className="mt-1 text-sm text-red-600">{errors.options}</p>
              )}
            </div>
          )}

          {/* Required Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="required"
                checked={formData.required}
                onChange={handleChange}
                className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Required field</span>
            </label>
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
              {loading ? 'Saving...' : field ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldConfigDialog;
