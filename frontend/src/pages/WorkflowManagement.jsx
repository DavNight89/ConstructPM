import { useState } from 'react';
import { Plus, Play, Pause, GitBranch, Zap, Mail, MessageSquare, Bell, CheckCircle } from 'lucide-react';

const WorkflowManagement = () => {
  const workflows = [
    {
      id: 1,
      name: 'Safety Inspection Approval',
      description: 'Automated approval workflow for safety inspections',
      status: 'active',
      triggers: 2,
      actions: 5,
      executions: 1234
    },
    {
      id: 2,
      name: 'Project Milestone Alerts',
      description: 'Notify stakeholders when milestones are reached',
      status: 'active',
      triggers: 1,
      actions: 3,
      executions: 456
    },
    {
      id: 3,
      name: 'Equipment Maintenance Reminder',
      description: 'Schedule and remind for equipment maintenance',
      status: 'paused',
      triggers: 1,
      actions: 2,
      executions: 89
    }
  ];

  const workflowSteps = [
    { type: 'trigger', label: 'Form Submitted', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
    { type: 'condition', label: 'If Status = Completed', icon: GitBranch, color: 'bg-blue-100 text-blue-700' },
    { type: 'action', label: 'Send Email', icon: Mail, color: 'bg-green-100 text-green-700' },
    { type: 'action', label: 'Update Project', icon: CheckCircle, color: 'bg-purple-100 text-purple-700' },
    { type: 'action', label: 'Notify Team', icon: Bell, color: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Automate processes with if/then/else logic and actions
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
          <Plus className="h-5 w-5 mr-2" />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {workflow.status}
              </span>
            </div>

            <div className="flex gap-6 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Triggers:</span>
                <span className="ml-2 font-semibold text-gray-900">{workflow.triggers}</span>
              </div>
              <div>
                <span className="text-gray-500">Actions:</span>
                <span className="ml-2 font-semibold text-gray-900">{workflow.actions}</span>
              </div>
              <div>
                <span className="text-gray-500">Executions:</span>
                <span className="ml-2 font-semibold text-gray-900">{workflow.executions}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                {workflow.status === 'active' ? <Pause className="h-4 w-4 inline mr-1" /> : <Play className="h-4 w-4 inline mr-1" />}
                {workflow.status === 'active' ? 'Pause' : 'Resume'}
              </button>
              <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Workflow</h3>
        <div className="space-y-3">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${step.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-500 capitalize">{step.type}</div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="text-gray-400">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowManagement;
