import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3 } from 'lucide-react';

const Reports = () => {
  const reports = [
    { id: 1, name: 'Project Status Summary', type: 'Dashboard', lastGenerated: '2024-01-15 10:30 AM', schedule: 'Daily' },
    { id: 2, name: 'Worker Time Cards', type: 'Time Tracking', lastGenerated: '2024-01-15 09:00 AM', schedule: 'Weekly' },
    { id: 3, name: 'Safety Incidents', type: 'Safety', lastGenerated: '2024-01-14 05:00 PM', schedule: 'Monthly' },
    { id: 4, name: 'Budget vs Actual', type: 'Financial', lastGenerated: '2024-01-15 08:00 AM', schedule: 'Weekly' },
    { id: 5, name: 'Equipment Utilization', type: 'Operations', lastGenerated: '2024-01-13 03:00 PM', schedule: 'Monthly' },
    { id: 6, name: 'Form Submissions', type: 'Data', lastGenerated: '2024-01-15 11:00 AM', schedule: 'Daily' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and schedule custom reports
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <BarChart3 className="h-5 w-5 mr-2" />
            New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                {report.schedule}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.type}</p>

            <div className="text-xs text-gray-500 mb-4">
              Last generated: {report.lastGenerated}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Calendar className="h-4 w-4 inline mr-1" />
                Schedule
              </button>
              <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                <Download className="h-4 w-4 inline mr-1" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-500">Reports Generated</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-500">Scheduled Reports</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3">
              <Download className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">2.4k</div>
            <div className="text-sm text-gray-500">Total Exports</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
