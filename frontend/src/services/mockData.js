// Mock data for demo purposes when backend is not available

export const mockProjects = [
  {
    id: 1,
    name: 'Downtown Office Complex',
    client: 'Metro Development Corp',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-30',
    budget: 2500000,
    spent: 1875000,
    progress: 75,
    location: '123 Main Street, Downtown',
    projectManager: 'Sarah Johnson',
    description: 'A 12-story commercial office building with underground parking.',
  },
  {
    id: 2,
    name: 'Riverside Apartments',
    client: 'Harbor Living LLC',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2025-06-15',
    budget: 4200000,
    spent: 1260000,
    progress: 30,
    location: '456 River Road, Waterfront District',
    projectManager: 'Michael Chen',
    description: 'Luxury 8-story residential complex with 120 units.',
  },
  {
    id: 3,
    name: 'Central Mall Renovation',
    client: 'Retail Properties Inc',
    status: 'active',
    startDate: '2024-02-10',
    endDate: '2024-09-30',
    budget: 1800000,
    spent: 1620000,
    progress: 90,
    location: '789 Commerce Blvd',
    projectManager: 'Emily Rodriguez',
    description: 'Complete interior renovation and modernization of existing mall.',
  },
  {
    id: 4,
    name: 'Tech Park Phase 2',
    client: 'Innovation Campus LLC',
    status: 'planning',
    startDate: '2024-07-01',
    endDate: '2025-12-31',
    budget: 6500000,
    spent: 325000,
    progress: 5,
    location: '1000 Tech Drive',
    projectManager: 'David Kim',
    description: 'Second phase of technology campus with 3 new buildings.',
  },
  {
    id: 5,
    name: 'Heritage Hotel Restoration',
    client: 'Classic Hotels Group',
    status: 'completed',
    startDate: '2023-06-01',
    endDate: '2024-05-15',
    budget: 3200000,
    spent: 3150000,
    progress: 100,
    location: '222 Historic Ave',
    projectManager: 'Sarah Johnson',
    description: 'Historical restoration of 1920s boutique hotel.',
  },
  {
    id: 6,
    name: 'Community Recreation Center',
    client: 'City of Riverside',
    status: 'active',
    startDate: '2024-04-15',
    endDate: '2025-03-30',
    budget: 2100000,
    spent: 840000,
    progress: 40,
    location: '500 Park Lane',
    projectManager: 'Michael Chen',
    description: 'New community center with gym, pool, and event spaces.',
  },
];

export const mockUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@constructpm.com', role: 'project_manager', status: 'active' },
  { id: 2, name: 'Michael Chen', email: 'michael.chen@constructpm.com', role: 'project_manager', status: 'active' },
  { id: 3, name: 'Emily Rodriguez', email: 'emily.rodriguez@constructpm.com', role: 'project_manager', status: 'active' },
  { id: 4, name: 'David Kim', email: 'david.kim@constructpm.com', role: 'project_manager', status: 'active' },
  { id: 5, name: 'James Wilson', email: 'james.wilson@constructpm.com', role: 'worker', status: 'active' },
  { id: 6, name: 'Maria Garcia', email: 'maria.garcia@constructpm.com', role: 'worker', status: 'active' },
  { id: 7, name: 'Robert Taylor', email: 'robert.taylor@constructpm.com', role: 'worker', status: 'active' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa.anderson@constructpm.com', role: 'worker', status: 'active' },
  { id: 9, name: 'Kevin Brown', email: 'kevin.brown@constructpm.com', role: 'worker', status: 'active' },
  { id: 10, name: 'Jennifer Martinez', email: 'jennifer.martinez@constructpm.com', role: 'admin', status: 'active' },
];

export const mockForms = [
  {
    id: 1,
    name: 'Daily Safety Inspection',
    description: 'Daily site safety checklist and hazard reporting',
    category: 'Safety',
    status: 'active',
    submissionCount: 156,
    lastUpdated: '2024-06-15',
    fields: [
      { id: 'f1', type: 'text', label: 'Site Location', name: 'site_location', required: true },
      { id: 'f2', type: 'date', label: 'Inspection Date', name: 'inspection_date', required: true },
      { id: 'f3', type: 'select', label: 'Weather Conditions', name: 'weather', required: true, options: ['Clear', 'Cloudy', 'Rain', 'Snow'] },
      { id: 'f4', type: 'checkbox', label: 'PPE Compliance Check', name: 'ppe_check', options: ['Hard Hats', 'Safety Vests', 'Steel Toe Boots', 'Safety Glasses', 'Gloves'] },
      { id: 'f5', type: 'textarea', label: 'Hazards Identified', name: 'hazards', required: false },
      { id: 'f6', type: 'select', label: 'Overall Safety Rating', name: 'rating', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
    ],
  },
  {
    id: 2,
    name: 'Material Delivery Receipt',
    description: 'Document incoming material deliveries and verify quantities',
    category: 'Logistics',
    status: 'active',
    submissionCount: 89,
    lastUpdated: '2024-06-18',
    fields: [
      { id: 'f1', type: 'text', label: 'Supplier Name', name: 'supplier', required: true },
      { id: 'f2', type: 'text', label: 'PO Number', name: 'po_number', required: true },
      { id: 'f3', type: 'date', label: 'Delivery Date', name: 'delivery_date', required: true },
      { id: 'f4', type: 'textarea', label: 'Materials Received', name: 'materials', required: true },
      { id: 'f5', type: 'select', label: 'Condition', name: 'condition', required: true, options: ['Good', 'Damaged', 'Partial'] },
      { id: 'f6', type: 'text', label: 'Received By', name: 'received_by', required: true },
    ],
  },
  {
    id: 3,
    name: 'Equipment Maintenance Log',
    description: 'Track equipment maintenance and service records',
    category: 'Equipment',
    status: 'active',
    submissionCount: 45,
    lastUpdated: '2024-06-10',
    fields: [
      { id: 'f1', type: 'text', label: 'Equipment ID', name: 'equipment_id', required: true },
      { id: 'f2', type: 'text', label: 'Equipment Type', name: 'equipment_type', required: true },
      { id: 'f3', type: 'select', label: 'Service Type', name: 'service_type', required: true, options: ['Routine', 'Repair', 'Emergency', 'Inspection'] },
      { id: 'f4', type: 'textarea', label: 'Work Performed', name: 'work_performed', required: true },
      { id: 'f5', type: 'number', label: 'Hours/Mileage', name: 'hours', required: false },
      { id: 'f6', type: 'text', label: 'Technician', name: 'technician', required: true },
    ],
  },
  {
    id: 4,
    name: 'Incident Report',
    description: 'Document workplace incidents and near-misses',
    category: 'Safety',
    status: 'active',
    submissionCount: 12,
    lastUpdated: '2024-06-01',
    fields: [
      { id: 'f1', type: 'date', label: 'Incident Date', name: 'incident_date', required: true },
      { id: 'f2', type: 'text', label: 'Location', name: 'location', required: true },
      { id: 'f3', type: 'select', label: 'Incident Type', name: 'incident_type', required: true, options: ['Injury', 'Near Miss', 'Property Damage', 'Environmental'] },
      { id: 'f4', type: 'textarea', label: 'Description', name: 'description', required: true },
      { id: 'f5', type: 'text', label: 'Persons Involved', name: 'persons_involved', required: false },
      { id: 'f6', type: 'textarea', label: 'Corrective Actions', name: 'corrective_actions', required: true },
    ],
  },
  {
    id: 5,
    name: 'Progress Report',
    description: 'Weekly project progress and milestone tracking',
    category: 'Reporting',
    status: 'active',
    submissionCount: 67,
    lastUpdated: '2024-06-17',
    fields: [
      { id: 'f1', type: 'select', label: 'Project', name: 'project', required: true, options: ['Downtown Office Complex', 'Riverside Apartments', 'Central Mall Renovation'] },
      { id: 'f2', type: 'date', label: 'Report Week Ending', name: 'week_ending', required: true },
      { id: 'f3', type: 'number', label: 'Percent Complete', name: 'percent_complete', required: true },
      { id: 'f4', type: 'textarea', label: 'Work Completed', name: 'work_completed', required: true },
      { id: 'f5', type: 'textarea', label: 'Issues/Delays', name: 'issues', required: false },
      { id: 'f6', type: 'textarea', label: 'Next Week Plan', name: 'next_week', required: true },
    ],
  },
];

export const mockJobs = [
  { id: 1, projectId: 1, title: 'Foundation Inspection', assignedTo: 'James Wilson', status: 'completed', priority: 'high', dueDate: '2024-06-10' },
  { id: 2, projectId: 1, title: 'Electrical Rough-In Floor 5', assignedTo: 'Maria Garcia', status: 'in_progress', priority: 'medium', dueDate: '2024-06-22' },
  { id: 3, projectId: 1, title: 'HVAC Installation Floor 6', assignedTo: 'Robert Taylor', status: 'pending', priority: 'medium', dueDate: '2024-06-28' },
  { id: 4, projectId: 2, title: 'Plumbing Rough-In Building A', assignedTo: 'Lisa Anderson', status: 'in_progress', priority: 'high', dueDate: '2024-06-20' },
  { id: 5, projectId: 2, title: 'Framing Unit 101-110', assignedTo: 'Kevin Brown', status: 'completed', priority: 'high', dueDate: '2024-06-15' },
  { id: 6, projectId: 3, title: 'Storefront Glass Installation', assignedTo: 'James Wilson', status: 'in_progress', priority: 'high', dueDate: '2024-06-21' },
  { id: 7, projectId: 3, title: 'Final Paint Touch-ups', assignedTo: 'Maria Garcia', status: 'pending', priority: 'low', dueDate: '2024-06-30' },
  { id: 8, projectId: 6, title: 'Pool Equipment Installation', assignedTo: 'Robert Taylor', status: 'pending', priority: 'medium', dueDate: '2024-07-15' },
];

export const mockSubmissions = [
  { id: 1, formId: 1, submittedBy: 'James Wilson', submittedAt: '2024-06-18T08:30:00', projectId: 1 },
  { id: 2, formId: 1, submittedBy: 'Maria Garcia', submittedAt: '2024-06-18T09:15:00', projectId: 2 },
  { id: 3, formId: 2, submittedBy: 'Robert Taylor', submittedAt: '2024-06-17T14:20:00', projectId: 1 },
  { id: 4, formId: 5, submittedBy: 'Sarah Johnson', submittedAt: '2024-06-17T16:00:00', projectId: 1 },
  { id: 5, formId: 1, submittedBy: 'Lisa Anderson', submittedAt: '2024-06-17T08:45:00', projectId: 3 },
  { id: 6, formId: 3, submittedBy: 'Kevin Brown', submittedAt: '2024-06-16T11:30:00', projectId: 2 },
];

// Helper to check if we should use mock data (when API fails or in demo mode)
export const isDemoMode = () => {
  // Always use demo mode on GitHub Pages (no backend available)
  return import.meta.env.BASE_URL !== '/';
};

// Dashboard statistics derived from mock data
export const getMockDashboardStats = () => {
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalWorkers = mockUsers.filter(u => u.role === 'worker').length;
  const pendingJobs = mockJobs.filter(j => j.status === 'pending').length;
  const todaySubmissions = mockSubmissions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.submittedAt).toDateString() === today;
  }).length || 3; // Show 3 if none today for demo

  return {
    activeProjects,
    totalWorkers,
    pendingJobs,
    todaySubmissions,
  };
};

// Chart data for dashboard
export const getMockChartData = () => {
  return mockProjects
    .filter(p => p.status === 'active')
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      progress: p.progress,
      budget: Math.round(p.budget / 1000),
      spent: Math.round(p.spent / 1000),
    }));
};

// Alerts for dashboard
export const getMockAlerts = () => {
  return [
    { id: 1, type: 'warning', message: 'Central Mall Renovation at 90% completion - final inspection due', project: 'Central Mall Renovation' },
    { id: 2, type: 'info', message: 'New safety inspection form submitted for Downtown Office Complex', project: 'Downtown Office Complex' },
    { id: 3, type: 'success', message: 'Heritage Hotel Restoration completed successfully', project: 'Heritage Hotel Restoration' },
    { id: 4, type: 'warning', message: '3 pending dispatch jobs require assignment', project: null },
  ];
};
