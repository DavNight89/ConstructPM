import { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  CheckCircle,
  Circle,
  AlertCircle,
  Filter,
  Send,
  MoreVertical
} from 'lucide-react';

const DispatchBoard = () => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  const workers = [
    {
      id: 1,
      name: 'Mike Johnson',
      status: 'on-route',
      currentJob: 'Downtown Plaza - Foundation Inspection',
      location: { lat: 40.7128, lng: -74.0060, address: '123 Main St' },
      eta: '15 min',
      phone: '(555) 123-4567',
      completedToday: 3,
      assignedJobs: 2
    },
    {
      id: 2,
      name: 'Sarah Williams',
      status: 'on-site',
      currentJob: 'Harbor Bridge - Welding Work',
      location: { lat: 40.7580, lng: -73.9855, address: '456 Harbor Ave' },
      eta: 'On Site',
      phone: '(555) 234-5678',
      completedToday: 2,
      assignedJobs: 3
    },
    {
      id: 3,
      name: 'David Brown',
      status: 'available',
      currentJob: null,
      location: { lat: 40.7489, lng: -73.9680, address: 'Company HQ' },
      eta: 'Available',
      phone: '(555) 345-6789',
      completedToday: 4,
      assignedJobs: 0
    },
    {
      id: 4,
      name: 'Lisa Anderson',
      status: 'on-route',
      currentJob: 'City Hall - HVAC Installation',
      location: { lat: 40.7614, lng: -73.9776, address: '789 City Plaza' },
      eta: '8 min',
      phone: '(555) 456-7890',
      completedToday: 1,
      assignedJobs: 2
    },
    {
      id: 5,
      name: 'James Wilson',
      status: 'on-site',
      currentJob: 'Metro Station - Electrical Work',
      location: { lat: 40.7527, lng: -73.9772, address: '321 Metro Way' },
      eta: 'On Site',
      phone: '(555) 567-8901',
      completedToday: 2,
      assignedJobs: 1
    }
  ];

  const pendingJobs = [
    {
      id: 'J-2401',
      project: 'Park Avenue Tower',
      task: 'Plumbing Inspection',
      priority: 'high',
      scheduledTime: '10:00 AM',
      duration: '2h',
      address: '500 Park Ave'
    },
    {
      id: 'J-2402',
      project: 'Riverside Apartments',
      task: 'Safety Audit',
      priority: 'medium',
      scheduledTime: '1:00 PM',
      duration: '1.5h',
      address: '200 River Rd'
    },
    {
      id: 'J-2403',
      project: 'Downtown Plaza',
      task: 'Material Delivery',
      priority: 'high',
      scheduledTime: '11:30 AM',
      duration: '1h',
      address: '123 Main St'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on-route':
        return 'bg-blue-100 text-blue-800';
      case 'on-site':
        return 'bg-purple-100 text-purple-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'on-route':
        return <Navigation className="h-4 w-4" />;
      case 'on-site':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time tracking and job assignment for field workers
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <Send className="h-4 w-4 mr-2" />
            Dispatch Job
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {workers.filter(w => w.status === 'available').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Route</p>
              <p className="text-2xl font-bold text-gray-900">
                {workers.filter(w => w.status === 'on-route').length}
              </p>
            </div>
            <Navigation className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Site</p>
              <p className="text-2xl font-bold text-gray-900">
                {workers.filter(w => w.status === 'on-site').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{pendingJobs.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Live Worker Locations</h3>
          </div>
          <div className="relative h-[600px] bg-gray-100">
            {/* Map Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">
                  Google Maps integration would display here
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Showing {workers.length} workers in real-time
                </p>
              </div>
            </div>

            {/* Map Markers Preview */}
            <div className="absolute inset-0 pointer-events-none">
              {workers.map((worker, index) => (
                <div
                  key={worker.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${
                        worker.status === 'available'
                          ? 'bg-green-500'
                          : worker.status === 'on-route'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }`}
                      onClick={() => setSelectedWorker(worker)}
                    >
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap text-xs font-medium">
                      {worker.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workers List & Pending Jobs */}
        <div className="space-y-6">
          {/* Active Workers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Workers</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedWorker?.id === worker.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedWorker(worker)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{worker.name}</h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                          {getStatusIcon(worker.status)}
                          {worker.status}
                        </span>
                      </div>
                      {worker.currentJob && (
                        <p className="text-xs text-gray-600 mb-1">{worker.currentJob}</p>
                      )}
                      <div className="flex items-center text-xs text-gray-500 gap-3 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {worker.eta}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {worker.completedToday} done
                        </span>
                      </div>
                    </div>
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Jobs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pending Jobs</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">{job.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{job.task}</h4>
                      <p className="text-xs text-gray-600 mb-2">{job.project}</p>
                      <div className="flex items-center text-xs text-gray-500 gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.address}
                        </span>
                      </div>
                    </div>
                    <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="mt-3 w-full px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded hover:bg-primary-100">
                    Assign Worker
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Worker Details */}
      {selectedWorker && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedWorker.name}</h3>
              <p className="text-sm text-gray-500">{selectedWorker.location.address}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Phone className="h-4 w-4 inline mr-1" />
                Call
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                <Send className="h-4 w-4 inline mr-1" />
                Send Message
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">{selectedWorker.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ETA</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWorker.eta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Today</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWorker.completedToday} jobs</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Assigned Jobs</p>
              <p className="text-sm font-semibold text-gray-900">{selectedWorker.assignedJobs} pending</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchBoard;
