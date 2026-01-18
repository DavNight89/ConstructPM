import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import projectsApi from '../services/projectsApi';
import usersApi from '../services/usersApi';
import dispatchApi from '../services/dispatchApi';
import formsApi from '../services/formsApi';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data with graceful error handling for each endpoint
      const [projectsRes, usersRes, jobsRes, submissionsRes] = await Promise.allSettled([
        projectsApi.getAll().catch(err => {
          console.warn('Projects API failed:', err.message);
          return { data: [] };
        }),
        usersApi.getAll({ role: 'worker' }).catch(err => {
          console.warn('Users API failed:', err.message);
          return { data: [] };
        }),
        dispatchApi.getAll().catch(err => {
          console.warn('Dispatch API not available:', err.message);
          return { data: [] };
        }),
        formsApi.getAllSubmissions().catch(err => {
          console.warn('Forms submissions API failed:', err.message);
          return { data: [] };
        })
      ]);

      // Extract data from settled promises
      const projectsData = projectsRes.status === 'fulfilled' ? (projectsRes.value?.data || []) : [];
      const workersData = usersRes.status === 'fulfilled' ? (usersRes.value?.data || []) : [];
      const jobsData = jobsRes.status === 'fulfilled' ? (jobsRes.value?.data || []) : [];
      const submissionsData = submissionsRes.status === 'fulfilled' ? (submissionsRes.value?.data || []) : [];

      setProjects(projectsData);
      setWorkers(workersData);
      setJobs(jobsData);
      setSubmissions(submissionsData);

      // Calculate statistics
      calculateStats(projectsData, workersData, jobsData, submissionsData);

      // Generate chart data
      generateChartData(projectsData);

      // Get recent jobs
      getRecentJobs(jobsData, projectsData, workersData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (projects, workers, jobs, submissions) => {
    // Calculate total revenue from projects
    const totalRevenue = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

    // Count active projects
    const activeProjects = projects.filter(p =>
      p.status === 'active' || p.status === 'in-progress'
    ).length;

    // Count field workers
    const fieldWorkers = workers.filter(w => w.status === 'active').length;

    // Calculate completion rate
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const completionRate = jobs.length > 0
      ? ((completedJobs / jobs.length) * 100).toFixed(1)
      : 0;

    setStats([
      {
        name: 'Total Budget',
        value: `$${totalRevenue.toLocaleString()}`,
        change: '+12.5%',
        changeType: 'positive',
        icon: DollarSign,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      {
        name: 'Active Projects',
        value: activeProjects.toString(),
        change: `${projects.length} total`,
        changeType: 'positive',
        icon: Briefcase,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        name: 'Field Workers',
        value: fieldWorkers.toString(),
        change: `${workers.length} total`,
        changeType: 'positive',
        icon: Users,
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        name: 'Completion Rate',
        value: `${completionRate}%`,
        change: `${completedJobs}/${jobs.length} jobs`,
        changeType: 'positive',
        icon: TrendingUp,
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600'
      }
    ]);
  };

  const generateChartData = (projects) => {
    // Group projects by month from their startDate
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    projects.forEach(project => {
      if (project.startDate) {
        const date = new Date(project.startDate);
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        const key = `${monthName} ${year}`;

        if (!monthlyData[key]) {
          monthlyData[key] = { month: monthName, projects: 0, revenue: 0 };
        }

        monthlyData[key].projects += 1;
        monthlyData[key].revenue += parseFloat(project.budget) || 0;
      }
    });

    // Convert to array and sort by date
    const chartData = Object.values(monthlyData).slice(-6); // Last 6 months
    setProjectData(chartData.length > 0 ? chartData : [
      { month: 'No data', projects: 0, revenue: 0 }
    ]);
  };

  const getRecentJobs = (jobs, projects, workers) => {
    // Get the 5 most recent jobs with their project and worker info
    const recent = jobs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(job => {
        const project = projects.find(p => p.id === job.projectId);
        const worker = workers.find(w => w.id === job.assignedWorker?.id || job.workerId);

        return {
          id: job.id?.substring(0, 8) || 'N/A',
          project: project?.name || 'Unknown Project',
          worker: worker ? `${worker.firstName} ${worker.lastName}` : 'Unassigned',
          status: job.status || 'pending',
          priority: job.priority || 'medium'
        };
      });

    setRecentJobs(recent);
  };

  const generateAlerts = () => {
    const alerts = [];

    // Check for delayed projects (past end date)
    const delayedProjects = projects.filter(p => {
      if (p.endDate) {
        const endDate = new Date(p.endDate);
        return endDate < new Date() && p.status !== 'completed';
      }
      return false;
    });

    if (delayedProjects.length > 0) {
      const project = delayedProjects[0];
      const daysLate = Math.floor((new Date() - new Date(project.endDate)) / (1000 * 60 * 60 * 24));
      alerts.push({
        type: 'error',
        icon: AlertCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        title: 'Delayed Project',
        message: `${project.name} is ${daysLate} day${daysLate !== 1 ? 's' : ''} behind schedule`
      });
    }

    // Check for pending form submissions
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    if (pendingSubmissions.length > 0) {
      alerts.push({
        type: 'warning',
        icon: Clock,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        title: 'Pending Approval',
        message: `${pendingSubmissions.length} form${pendingSubmissions.length !== 1 ? 's' : ''} awaiting review`
      });
    }

    // Check for projects nearing completion (>70% progress)
    const nearCompletionProjects = projects.filter(p => p.progress >= 70 && p.status !== 'completed');
    if (nearCompletionProjects.length > 0) {
      const project = nearCompletionProjects[0];
      alerts.push({
        type: 'success',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        title: 'Milestone Reached',
        message: `${project.name} ${project.progress}% complete`
      });
    }

    // Check for active workers
    const activeWorkers = workers.filter(w => w.status === 'active');
    if (activeWorkers.length > 0) {
      alerts.push({
        type: 'info',
        icon: MapPin,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        title: 'Active Workers',
        message: `${activeWorkers.length} worker${activeWorkers.length !== 1 ? 's' : ''} currently available`
      });
    }

    // If no alerts, show a default message
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        title: 'All Clear',
        message: 'No critical alerts at this time'
      });
    }

    return alerts;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projects" fill="#0ea5e9" name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Jobs & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.worker}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AlertCircle className={`h-5 w-5 ${getPriorityColor(job.priority)}`} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No recent jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          </div>
          <div className="p-4 space-y-4">
            {generateAlerts().map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div key={index} className={`flex items-start space-x-3 p-3 ${alert.bgColor} rounded-lg`}>
                  <Icon className={`h-5 w-5 ${alert.iconColor} mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-700 mt-1">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
