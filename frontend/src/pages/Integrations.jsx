import { Database, Cloud, DollarSign, Users, FileText, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const Integrations = () => {
  const integrations = [
    {
      id: 1,
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Sync invoices, expenses, and financial data',
      icon: DollarSign,
      status: 'connected',
      lastSync: '2 hours ago',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      name: 'Salesforce',
      category: 'CRM',
      description: 'Manage customer relationships and leads',
      icon: Users,
      status: 'connected',
      lastSync: '1 hour ago',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      name: 'SharePoint',
      category: 'Document Management',
      description: 'Store and share documents securely',
      icon: FileText,
      status: 'connected',
      lastSync: '30 minutes ago',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      name: 'SQL Server',
      category: 'Database',
      description: 'Direct database integration for custom queries',
      icon: Database,
      status: 'not-connected',
      lastSync: 'Never',
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 5,
      name: 'Oracle Database',
      category: 'Database',
      description: 'Enterprise database connectivity',
      icon: Database,
      status: 'not-connected',
      lastSync: 'Never',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 6,
      name: 'Google Drive',
      category: 'Cloud Storage',
      description: 'Backup and sync files to Google Drive',
      icon: Cloud,
      status: 'connected',
      lastSync: '5 minutes ago',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 7,
      name: 'Dropbox',
      category: 'Cloud Storage',
      description: 'Cloud file storage and sharing',
      icon: Cloud,
      status: 'connected',
      lastSync: '15 minutes ago',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 8,
      name: 'Box',
      category: 'Cloud Storage',
      description: 'Enterprise content management',
      icon: Cloud,
      status: 'not-connected',
      lastSync: 'Never',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with third-party services and data sources
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Integrations</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'not-connected').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Connectors</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${integration.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    integration.status === 'connected'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {integration.status === 'connected' ? 'Connected' : 'Available'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{integration.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{integration.category}</p>
                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                {integration.status === 'connected' && (
                  <div className="text-xs text-gray-500 mb-4">
                    Last sync: {integration.lastSync}
                  </div>
                )}

                <div className="flex gap-2">
                  {integration.status === 'connected' ? (
                    <>
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <Settings className="h-4 w-4 inline mr-1" />
                        Configure
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button className="w-full px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Connectors</h3>
        <p className="text-sm text-gray-600 mb-4">
          Premium connectors available for advanced integrations:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Microsoft Pack</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>FTP/SFTP</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>SMS (Clickatell)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>MySQL</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>ODBC</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>SyBase ASE</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>XML/REST API</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Webhooks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
