import { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Navigation,
  FileText,
  AlertCircle,
  Phone,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockJobs, mockProjects, mockForms, isDemoMode } from '../services/mockData';

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workerStatus, setWorkerStatus] = useState('available');

  useEffect(() => {
    fetchWorkerJobs();
  }, []);

  const fetchWorkerJobs = async () => {
    try {
      setLoading(true);

      if (isDemoMode()) {
        // Filter jobs assigned to this worker (demo uses mock data)
        const workerJobs = mockJobs.filter(
          job => job.assignedTo === user?.name || job.assignedTo === 'James Wilson'
        ).map(job => {
          const project = mockProjects.find(p => p.id === job.projectId);
          return {
            ...job,
            projectName: project?.name || 'Unknown Project',
            projectLocation: project?.location || 'No location',
          };
        });

        setJobs(workerJobs);

        // Find current active job
        const active = workerJobs.find(j => j.status === 'in_progress');
        setCurrentJob(active || null);

        if (active) {
          setWorkerStatus('on_site');
        } else if (workerJobs.some(j => j.status === 'assigned')) {
          setWorkerStatus('assigned');
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoute = (job) => {
    setWorkerStatus('en_route');
    // In real app, this would update the backend and start GPS tracking
    setJobs(prev =>
      prev.map(j =>
        j.id === job.id ? { ...j, status: 'en_route' } : j
      )
    );
  };

  const handleArrive = (job) => {
    setWorkerStatus('on_site');
    setCurrentJob(job);
    setJobs(prev =>
      prev.map(j =>
        j.id === job.id ? { ...j, status: 'in_progress' } : j
      )
    );
  };

  const handleComplete = (job) => {
    // In real app, this would open the completion form
    alert('This would open the job completion form');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'en_route':
        return 'bg-purple-100 text-purple-800';
      case 'assigned':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getWorkerStatusBadge = () => {
    switch (workerStatus) {
      case 'on_site':
        return { label: 'On Site', color: 'bg-green-500' };
      case 'en_route':
        return { label: 'En Route', color: 'bg-purple-500' };
      case 'assigned':
        return { label: 'Job Assigned', color: 'bg-yellow-500' };
      default:
        return { label: 'Available', color: 'bg-blue-500' };
    }
  };

  const statusBadge = getWorkerStatusBadge();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Hi, {user?.firstName || 'Worker'}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className={`${statusBadge.color} px-3 py-1 rounded-full`}>
            <span className="text-white text-sm font-medium">{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Current Job Card */}
      {currentJob && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-blue-900">Current Job</h2>
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              In Progress
            </span>
          </div>
          <h3 className="font-medium text-gray-900">{currentJob.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{currentJob.projectName}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            {currentJob.projectLocation}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleComplete(currentJob)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Job
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
              <Phone className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Today's Jobs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Today's Jobs ({jobs.filter(j => j.status !== 'completed').length})
        </h2>
        <div className="space-y-3">
          {jobs.filter(j => j.status !== 'completed').length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No jobs assigned for today</p>
              <p className="text-sm text-gray-400 mt-1">Check back later or contact your dispatcher</p>
            </div>
          ) : (
            jobs
              .filter(j => j.status !== 'completed')
              .map(job => (
                <div
                  key={job.id}
                  className={`bg-white rounded-lg shadow border-l-4 ${getPriorityColor(job.priority)} p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{job.projectName}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.projectLocation}
                      </div>
                      {job.dueDate && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Due: {new Date(job.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Action Buttons based on status */}
                  <div className="mt-4 flex gap-2">
                    {job.status === 'assigned' || job.status === 'pending' ? (
                      <button
                        onClick={() => handleStartRoute(job)}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center"
                      >
                        <Navigation className="h-5 w-5 mr-2" />
                        Start Route
                      </button>
                    ) : job.status === 'en_route' ? (
                      <button
                        onClick={() => handleArrive(job)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                      >
                        <MapPin className="h-5 w-5 mr-2" />
                        I've Arrived
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Completed Jobs */}
      {jobs.filter(j => j.status === 'completed').length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Completed Today ({jobs.filter(j => j.status === 'completed').length})
          </h2>
          <div className="space-y-2">
            {jobs
              .filter(j => j.status === 'completed')
              .map(job => (
                <div
                  key={job.id}
                  className="bg-gray-50 rounded-lg p-3 flex items-center"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.projectName}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center">
          <FileText className="h-5 w-5 mr-2" />
          Submit Form
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          Report Issue
        </button>
      </div>
    </div>
  );
};

export default WorkerDashboard;
