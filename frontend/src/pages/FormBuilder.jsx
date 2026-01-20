import { useState, useEffect } from 'react';
import {
  Plus,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  List,
  Image,
  FileText,
  MapPin,
  Camera,
  Trash2,
  Copy,
  Settings,
  Eye,
  Save,
  Upload,
  AlertCircle
} from 'lucide-react';
import formsApi from '../services/formsApi';
import FormDialog from '../components/FormDialog';
import FieldConfigDialog from '../components/FieldConfigDialog';
import { mockForms, isDemoMode } from '../services/mockData';

const FormBuilder = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [draggedFieldType, setDraggedFieldType] = useState(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);

  // Fetch forms on mount
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're in demo mode (GitHub Pages deployment)
      if (isDemoMode()) {
        console.log('Running in demo mode - using mock forms');
        const transformedMockForms = mockForms.map(form => ({
          ...form,
          fieldCount: form.fields.length,
          submissions: form.submissionCount || 0,
          lastModified: form.lastUpdated,
        }));
        setForms(transformedMockForms);
        setLoading(false);
        return;
      }

      const response = await formsApi.getAll();
      // Transform backend data to match UI expectations
      let transformedForms = (response.data || []).map(form => ({
        ...form,
        id: form._id,
        fieldCount: form.fields.length, // Store count separately
        // Keep the actual fields array for editing
        submissions: form.metadata?.submissions || 0,
        lastModified: new Date(form.updatedAt).toLocaleDateString(),
      }));

      // Fall back to mock data if API returned empty
      if (transformedForms.length === 0) {
        transformedForms = mockForms.map(form => ({
          ...form,
          fieldCount: form.fields.length,
          submissions: form.submissionCount || 0,
          lastModified: form.lastUpdated,
        }));
      }

      setForms(transformedForms);
    } catch (err) {
      console.error('Error fetching forms:', err);
      // Fall back to mock data on error
      const transformedMockForms = mockForms.map(form => ({
        ...form,
        fieldCount: form.fields.length,
        submissions: form.submissionCount || 0,
        lastModified: form.lastUpdated,
      }));
      setForms(transformedMockForms);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = () => {
    setShowFormDialog(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setSaving(true);
      const newForm = await formsApi.create(formData);
      setShowFormDialog(false);
      // Refresh forms list
      await fetchForms();
      // Optionally, open the newly created form for editing
      setSelectedForm({
        ...newForm,
        id: newForm._id,
        fieldCount: newForm.fields.length,
        // Keep the actual fields array for editing
        submissions: newForm.metadata?.submissions || 0,
        lastModified: new Date(newForm.updatedAt).toLocaleDateString(),
      });
    } catch (err) {
      console.error('Error creating form:', err);
      alert(err.response?.data?.message || 'Failed to create form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFormCancel = () => {
    setShowFormDialog(false);
  };

  // Field manipulation handlers
  const handleAddFieldClick = (fieldType) => {
    setEditingField({
      type: fieldType.type,
      label: fieldType.label,
    });
    setShowFieldDialog(true);
  };

  const handleEditFieldClick = (field) => {
    setEditingField(field);
    setShowFieldDialog(true);
  };

  const handleFieldSave = (fieldData) => {
    setSelectedForm(prev => {
      const updatedFields = editingField?.id && prev.fields.find(f => f.id === editingField.id)
        ? prev.fields.map(f => f.id === editingField.id ? fieldData : f)
        : [...(prev.fields || []), fieldData];

      return {
        ...prev,
        fields: updatedFields,
        fieldCount: updatedFields.length,
      };
    });
    setShowFieldDialog(false);
    setEditingField(null);
  };

  const handleFieldCancel = () => {
    setShowFieldDialog(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      setSelectedForm(prev => {
        const updatedFields = prev.fields.filter(f => f.id !== fieldId);
        return {
          ...prev,
          fields: updatedFields,
          fieldCount: updatedFields.length,
        };
      });
    }
  };

  const handleDuplicateField = (field) => {
    const duplicatedField = {
      ...field,
      id: `field_${Date.now()}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
    };
    setSelectedForm(prev => {
      const updatedFields = [...(prev.fields || []), duplicatedField];
      return {
        ...prev,
        fields: updatedFields,
        fieldCount: updatedFields.length,
      };
    });
  };

  // Drag and drop handlers for field palette
  const handleFieldTypeDragStart = (fieldType) => {
    setDraggedFieldType(fieldType);
  };

  const handleFieldTypeDragEnd = () => {
    setDraggedFieldType(null);
  };

  // Drag and drop handlers for field reordering
  const handleFieldDragStart = (index) => {
    setDraggedFieldIndex(index);
  };

  const handleFieldDragOver = (e) => {
    e.preventDefault();
  };

  const handleFieldDrop = (dropIndex) => {
    if (draggedFieldIndex === null) return;

    setSelectedForm(prev => {
      const updatedFields = [...prev.fields];
      const [movedField] = updatedFields.splice(draggedFieldIndex, 1);
      updatedFields.splice(dropIndex, 0, movedField);

      return {
        ...prev,
        fields: updatedFields,
      };
    });
    setDraggedFieldIndex(null);
  };

  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    if (draggedFieldType) {
      handleAddFieldClick(draggedFieldType);
      setDraggedFieldType(null);
    }
  };

  const handleDropZoneDragOver = (e) => {
    e.preventDefault();
  };

  // Save form changes to API
  const handleSaveForm = async () => {
    try {
      setSaving(true);
      const updateData = {
        name: selectedForm.name,
        category: selectedForm.category,
        version: selectedForm.version,
        fields: selectedForm.fields,
        settings: selectedForm.settings,
        logic: selectedForm.logic || [],
        metadata: selectedForm.metadata || {},
      };
      await formsApi.update(selectedForm._id, updateData);
      alert('Form saved successfully!');
      await fetchForms();
    } catch (err) {
      console.error('Error saving form:', err);
      alert(err.response?.data?.message || 'Failed to save form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: Type, description: 'Single line text' },
    { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input' },
    { type: 'date', label: 'Date', icon: Calendar, description: 'Date picker' },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Yes/No option' },
    { type: 'select', label: 'Dropdown', icon: List, description: 'Select from list' },
    { type: 'file', label: 'Photo Upload', icon: Camera, description: 'Camera/gallery' },
    { type: 'signature', label: 'Signature', icon: FileText, description: 'Digital signature' },
    { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text' },
    { type: 'email', label: 'Email', icon: Type, description: 'Email input' },
    { type: 'phone', label: 'Phone', icon: Hash, description: 'Phone number' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage custom forms for field data collection
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateForm}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green- bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Form
          </button>
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
              <h3 className="text-sm font-medium text-red-800">Error loading forms</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchForms()}
            className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-300 bg-white hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && forms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new form.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateForm}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-700 bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Form
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !selectedForm && forms.length > 0 && (
        /* Form Templates List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 cursor-pointer"
              onClick={() => setSelectedForm(form)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.name}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Fields:</span>
                    <span className="font-medium text-gray-900">{form.fieldCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submissions:</span>
                    <span className="font-medium text-gray-900">{form.submissions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Modified:</span>
                    <span className="font-medium text-gray-900">{form.lastModified}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <Eye className="h-4 w-4 inline mr-1" />
                    Preview
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && selectedForm && (
        /* Form Builder Interface */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field Types Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Field Types</h3>
              <div className="space-y-2">
                {fieldTypes.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div
                      key={field.type}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 cursor-pointer transition-colors"
                      draggable
                      onDragStart={() => handleFieldTypeDragStart(field)}
                      onDragEnd={handleFieldTypeDragEnd}
                      onClick={() => handleAddFieldClick(field)}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{field.label}</div>
                          <div className="text-xs text-gray-500">{field.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Builder Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedForm.name}</h3>
                  <p className="text-sm text-gray-500">Drag fields from the left to build your form</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button
                    onClick={handleSaveForm}
                    disabled={saving}
                    className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4 inline mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="p-6 min-h-[600px] bg-gray-50">
                {previewMode ? (
                  /* Preview Mode */
                  <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{selectedForm.name}</h2>
                    <div className="space-y-4">
                      {(selectedForm.fields || []).map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {field.type === 'text' && (
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                          )}
                          {field.type === 'date' && (
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                          )}
                          {field.type === 'select' && (
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                              <option value="">Select...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-600">Yes</label>
                            </div>
                          )}
                          {field.type === 'textarea' && (
                            <textarea
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            />
                          )}
                          {field.type === 'photo' && (
                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-primary-400">
                              <div className="text-center">
                                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Tap to capture photo</p>
                              </div>
                            </div>
                          )}
                          {field.type === 'signature' && (
                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-primary-400">
                              <div className="text-center">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Tap to sign</p>
                              </div>
                            </div>
                          )}
                          {field.type === 'gps' && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
                              <MapPin className="h-5 w-5 text-primary-600" />
                              <span className="text-sm text-gray-600">GPS coordinates will be captured automatically</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium">
                      Submit Form
                    </button>
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="space-y-3">
                    {(selectedForm.fields || []).map((field, index) => {
                      const fieldType = fieldTypes.find(ft => ft.type === field.type);
                      const Icon = fieldType?.icon || FileText;
                      return (
                        <div
                          key={field.id}
                          draggable
                          onDragStart={() => handleFieldDragStart(index)}
                          onDragOver={handleFieldDragOver}
                          onDrop={() => handleFieldDrop(index)}
                          className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-colors cursor-move"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2">
                              <div className="text-gray-400 text-sm">{index + 1}</div>
                              <Icon className="h-5 w-5 text-primary-600" />
                            </div>
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleEditFieldClick(field)}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{field.label}</div>
                                  <div className="text-xs text-gray-500 mt-1">{fieldType?.label}</div>
                                </div>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => handleDuplicateField(field)}
                                    className="p-1 text-gray-400 hover:text-primary-600"
                                    title="Duplicate field"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteField(field.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                    title="Delete field"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              {field.required && (
                                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onDragOver={handleDropZoneDragOver}
                      onDrop={handleDropZoneDrop}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Drag field types here or click field types to add</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Form Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Form Name
                  </label>
                  <input
                    type="text"
                    value={selectedForm.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 text-sm">
                    <option>Inspection</option>
                    <option>Safety</option>
                    <option>Inventory</option>
                    <option>Maintenance</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Enable GPS tracking</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Require signature</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 mr-2" />
                      <span className="text-sm text-gray-700">Allow offline submission</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-primary-600 mr-2" defaultChecked />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fields:</span>
                      <span className="font-medium text-gray-900">{selectedForm.fields?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Required Fields:</span>
                      <span className="font-medium text-gray-900">
                        {selectedForm.fields?.filter(f => f.required).length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submissions:</span>
                      <span className="font-medium text-gray-900">{selectedForm.submissions}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedForm(null)}
                  className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Forms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Creation Dialog */}
      {showFormDialog && (
        <FormDialog
          onClose={handleFormCancel}
          onSubmit={handleFormSubmit}
          loading={saving}
        />
      )}

      {/* Field Configuration Dialog */}
      {showFieldDialog && (
        <FieldConfigDialog
          field={editingField}
          onClose={handleFieldCancel}
          onSave={handleFieldSave}
          loading={false}
        />
      )}
    </div>
  );
};

export default FormBuilder;
