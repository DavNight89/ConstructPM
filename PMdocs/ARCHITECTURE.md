# Construction Project Management Platform - Architecture Documentation

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Frontend Architecture](#frontend-architecture)
5. [Application Structure](#application-structure)
6. [Feature Modules](#feature-modules)
7. [Data Models](#data-models)
8. [Integration Architecture](#integration-architecture)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Future Roadmap](#future-roadmap)

---

## Executive Summary

The Construction Project Management Platform is a comprehensive enterprise solution designed for general contractors to manage projects, field workers, forms, workflows, and integrations. The platform combines mobile data collection, real-time dispatch, workflow automation, and enterprise integrations into a unified system.

### Key Capabilities
- **Mobile-First Design**: Native iOS/Android apps + web portal
- **Real-Time Operations**: GPS tracking, live dispatch, instant notifications
- **Workflow Automation**: If/Then/Else logic for business processes
- **Enterprise Integration**: QuickBooks, Salesforce, SharePoint, SQL Server, Oracle
- **Unlimited Scale**: Unlimited forms, submissions, and data storage
- **Security**: MFA, field-level encryption, secure transport (TLS/SSL)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
├──────────────┬──────────────────┬──────────────────┬────────────┤
│  iOS Native  │  Android Native  │   Web Browser    │  Admin     │
│     App      │       App        │   (Mobile/Desktop)│  Portal    │
└──────────────┴──────────────────┴──────────────────┴────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   REST API   │  │  SOAP API    │  │  WebSocket   │         │
│  │   Endpoints  │  │   Services   │  │  Real-Time   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐     │
│  │   Project   │   Dispatch  │   Forms &   │  Workflow   │     │
│  │ Management  │   Engine    │  Submissions│   Engine    │     │
│  └─────────────┴─────────────┴─────────────┴─────────────┘     │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐     │
│  │    Auth &   │  Reporting  │ Integration │   Payment   │     │
│  │   Security  │   Engine    │   Gateway   │  Processing │     │
│  └─────────────┴─────────────┴─────────────┴─────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌──────────────┬──────────────┬──────────────┐                │
│  │  PostgreSQL  │   MongoDB    │    Redis     │                │
│  │  (Primary)   │  (Forms &    │  (Cache &    │                │
│  │              │   Documents) │   Sessions)  │                │
│  └──────────────┴──────────────┴──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Integration & Storage Layer                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │  QuickBooks  │  Salesforce  │  SharePoint  │   AWS S3/    │ │
│  │              │              │              │  Azure Blob  │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │  SQL Server  │    Oracle    │    MySQL     │  Google      │ │
│  │              │              │              │  Drive/Box   │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

**Microservices Architecture** (Planned)
- Independent, loosely-coupled services
- Service-to-service communication via REST/gRPC
- Event-driven architecture with message queues

**Multi-Tier Architecture**
- Presentation Layer: React, React Native
- API Layer: Node.js/Express or NestJS
- Business Logic Layer: Domain services and engines
- Data Layer: PostgreSQL, MongoDB, Redis
- Integration Layer: Connectors and adapters

---

## Technology Stack

### Frontend Technologies

#### Web Application
```javascript
{
  "framework": "React 18.x",
  "buildTool": "Vite 7.x",
  "routing": "React Router DOM 6.x",
  "styling": "Tailwind CSS 4.x",
  "charts": "Recharts 2.x",
  "icons": "Lucide React",
  "stateManagement": "React Query (planned)",
  "formHandling": "React Hook Form (planned)"
}
```

#### Mobile Applications (Planned)
```javascript
{
  "framework": "React Native",
  "navigation": "React Navigation",
  "stateManagement": "Redux Toolkit / Zustand",
  "networking": "Axios / React Query",
  "maps": "React Native Maps",
  "camera": "React Native Camera",
  "offline": "React Native MMKV / AsyncStorage"
}
```

### Backend Technologies (Planned)

```javascript
{
  "runtime": "Node.js 20.x LTS",
  "framework": "NestJS / Express",
  "language": "TypeScript 5.x",
  "apiDocumentation": "Swagger/OpenAPI",
  "validation": "Joi / Zod",
  "authentication": "Passport.js, JWT, OAuth2",
  "realTime": "Socket.io / WebSockets",
  "jobQueue": "Bull / BullMQ",
  "logging": "Winston / Pino"
}
```

### Database & Storage

```yaml
Primary Database:
  - PostgreSQL 15+
  - JSONB for flexible schema
  - PostGIS for geospatial data
  - Full-text search capabilities

Document Store:
  - MongoDB 7.x
  - Dynamic form schemas
  - File metadata

Caching:
  - Redis 7.x
  - Session management
  - Real-time data cache
  - Job queue backend

File Storage:
  - AWS S3 / Azure Blob Storage
  - CDN integration
  - Automatic backup
  - Encryption at rest
```

### Infrastructure & DevOps (Planned)

```yaml
Containerization:
  - Docker
  - Docker Compose (local development)

Orchestration:
  - Kubernetes (production)
  - Helm charts

CI/CD:
  - GitHub Actions / GitLab CI
  - Automated testing
  - Blue-green deployment

Monitoring:
  - Prometheus + Grafana
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Sentry for error tracking

Cloud Providers:
  - AWS / Azure / Google Cloud
  - Multi-cloud strategy
```

---

## Frontend Architecture

### Component Hierarchy

```
App (Router)
└── Layout
    ├── TopNavigation
    │   ├── SearchBar
    │   ├── NotificationBell
    │   ├── SettingsMenu
    │   └── UserProfile
    ├── Sidebar
    │   ├── NavigationMenu
    │   └── QuickStats
    └── MainContent (Outlet)
        ├── Dashboard
        ├── Projects
        ├── DispatchBoard
        ├── FormBuilder
        ├── WorkflowManagement
        ├── Reports
        └── Integrations
```

### Current File Structure

```
construct_PM_platform/
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx          # Main layout with nav and sidebar
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Dashboard with metrics & charts
    │   │   ├── Projects.jsx        # Project management (grid/list view)
    │   │   ├── DispatchBoard.jsx   # Worker tracking & dispatch
    │   │   ├── FormBuilder.jsx     # Drag-drop form builder
    │   │   ├── WorkflowManagement.jsx  # Workflow automation
    │   │   ├── Reports.jsx         # Report generation
    │   │   └── Integrations.jsx    # Third-party integrations
    │   ├── App.jsx                 # Root component with routing
    │   ├── main.jsx                # Application entry point
    │   └── index.css               # Global styles (Tailwind)
    ├── postcss.config.js           # PostCSS configuration
    ├── vite.config.js              # Vite build configuration
    └── package.json                # Dependencies
```

### State Management Strategy (Planned)

```javascript
// Global State (React Query + Context)
const AppState = {
  user: {
    profile: {},
    permissions: [],
    preferences: {}
  },
  projects: {
    list: [],
    active: {},
    filters: {}
  },
  dispatch: {
    workers: [],
    jobs: [],
    mapState: {}
  },
  forms: {
    templates: [],
    submissions: []
  },
  workflows: {
    active: [],
    history: []
  }
}
```

### Routing Structure

```javascript
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, redirect: "/dashboard" },
      { path: "dashboard", element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <ProjectDetail /> }, // Planned
      { path: "dispatch", element: <DispatchBoard /> },
      { path: "forms", element: <FormBuilder /> },
      { path: "forms/:id", element: <FormEditor /> }, // Planned
      { path: "workflows", element: <WorkflowManagement /> },
      { path: "reports", element: <Reports /> },
      { path: "integrations", element: <Integrations /> }
    ]
  },
  { path: "/login", element: <Login /> }, // Planned
  { path: "/register", element: <Register /> } // Planned
];
```

---

## Application Structure

### Project Organization (Planned Full Structure)

```
construct_PM_platform/
├── backend/                        # Backend API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication & authorization
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── guards/
│   │   │   ├── projects/          # Project management
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── projects.repository.ts
│   │   │   │   └── dto/
│   │   │   ├── dispatch/          # Dispatch & tracking
│   │   │   │   ├── dispatch.controller.ts
│   │   │   │   ├── dispatch.service.ts
│   │   │   │   ├── gps.service.ts
│   │   │   │   └── websocket.gateway.ts
│   │   │   ├── forms/             # Form builder & submissions
│   │   │   │   ├── forms.controller.ts
│   │   │   │   ├── forms.service.ts
│   │   │   │   ├── submissions.service.ts
│   │   │   │   └── validators/
│   │   │   ├── workflows/         # Workflow engine
│   │   │   │   ├── workflows.controller.ts
│   │   │   │   ├── workflow-engine.service.ts
│   │   │   │   ├── triggers/
│   │   │   │   └── actions/
│   │   │   ├── reporting/         # Reports & analytics
│   │   │   │   ├── reports.controller.ts
│   │   │   │   ├── report-generator.service.ts
│   │   │   │   └── templates/
│   │   │   ├── integrations/      # Third-party connectors
│   │   │   │   ├── integrations.controller.ts
│   │   │   │   ├── connectors/
│   │   │   │   │   ├── quickbooks.connector.ts
│   │   │   │   │   ├── salesforce.connector.ts
│   │   │   │   │   ├── sharepoint.connector.ts
│   │   │   │   │   ├── sqlserver.connector.ts
│   │   │   │   │   └── oracle.connector.ts
│   │   │   │   └── sync.service.ts
│   │   │   ├── notifications/     # Email, SMS, push notifications
│   │   │   └── payments/          # Payment processing
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── pipes/
│   │   │   └── middleware/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   └── entities/
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── app.config.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── frontend/                       # Web application (CURRENT)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── common/            # Planned: Reusable components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Form/
│   │   │   └── features/          # Planned: Feature-specific components
│   │   ├── pages/
│   │   ├── services/              # Planned: API service layer
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── projects.service.js
│   │   │   └── dispatch.service.js
│   │   ├── hooks/                 # Planned: Custom React hooks
│   │   ├── utils/                 # Planned: Utility functions
│   │   ├── constants/             # Planned: Constants & enums
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── mobile/                         # React Native app (PLANNED)
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── android/
│   ├── ios/
│   └── package.json
├── integration-gateway/            # Sync & Save connectors (PLANNED)
│   ├── connectors/
│   │   ├── quickbooks/
│   │   ├── salesforce/
│   │   ├── sharepoint/
│   │   ├── database/
│   │   └── cloud-storage/
│   └── package.json
├── database/                       # Database schemas (PLANNED)
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/                          # Documentation
│   ├── api/
│   ├── architecture/
│   └── user-guides/
├── docker-compose.yml             # PLANNED: Local development
├── .env.example
├── ARCHITECTURE.md                # THIS FILE
└── README.md
```

---

## Feature Modules

### 1. Dashboard Module

**Purpose**: Real-time overview of operations, projects, and key metrics

**Components**:
- `Dashboard.jsx` - Main dashboard container
- Statistics cards (Revenue, Projects, Workers, Completion Rate)
- Interactive charts (Project trends, Revenue trends)
- Recent jobs table
- Alerts panel

**Key Features**:
- Real-time data updates
- Responsive charts using Recharts
- Color-coded status indicators
- Priority-based job tracking
- Alert notifications

**Data Flow**:
```
API → Dashboard Service → State Management → UI Components
```

---

### 2. Projects Module

**Purpose**: Comprehensive project management and tracking

**Components**:
- `Projects.jsx` - Project list/grid view
- Project cards with progress tracking
- Project detail view (planned)
- Budget tracking
- Timeline visualization

**Key Features**:
- Grid/List view toggle
- Real-time progress tracking
- Budget vs. actual spend
- Worker assignment
- Location mapping
- Status management (Planning, In-Progress, Completed, On-Hold)
- Search and filter

**Data Model** (Planned):
```typescript
interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number; // 0-100
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  workers: string[]; // Worker IDs
  manager: string; // User ID
  priority: 'low' | 'medium' | 'high';
  documents: string[]; // Document IDs
  forms: string[]; // Form submission IDs
}
```

---

### 3. Dispatch Board Module

**Purpose**: Real-time worker tracking, job dispatch, and route optimization

**Components**:
- `DispatchBoard.jsx` - Main dispatch interface
- Interactive map with worker markers
- Worker status list
- Pending jobs queue
- Worker detail panel

**Key Features**:
- Live GPS tracking
- Real-time worker status updates
- ETA calculations based on traffic
- Job assignment workflow
- Worker communication (call, SMS)
- Map visualization
- Status tracking (Available, On-Route, On-Site, Offline)

**Real-Time Architecture** (Planned):
```javascript
// WebSocket connection for real-time updates
const dispatchSocket = {
  events: [
    'worker:location:update',
    'worker:status:change',
    'job:assigned',
    'job:completed',
    'eta:updated'
  ],

  handlers: {
    onLocationUpdate: (workerId, location) => {},
    onStatusChange: (workerId, status) => {},
    onETAUpdate: (workerId, eta) => {}
  }
}
```

**Integration Points**:
- Google Maps API / Mapbox
- Traffic data providers
- SMS gateway (Twilio/Clickatell)
- Push notifications

---

### 4. Form Builder Module

**Purpose**: Create, manage, and deploy custom forms for field data collection

**Components**:
- `FormBuilder.jsx` - Form creation interface
- Field type palette (10+ field types)
- Form canvas (drag-drop area)
- Form settings panel
- Preview mode

**Field Types**:
1. **Text Input** - Single line text
2. **Number** - Numeric input with validation
3. **Date** - Date picker
4. **Checkbox** - Boolean yes/no
5. **Dropdown** - Select from list
6. **Photo Upload** - Camera/gallery access
7. **Signature** - Digital signature capture
8. **GPS Location** - Auto-capture coordinates
9. **Text Area** - Multi-line text
10. **File Upload** - Document attachments

**Advanced Features** (Planned):
- **Logic & Relevance**: Show/hide fields based on conditions
- **Skip Logic**: If/Then/Else field navigation
- **Data Lookups**: Populate fields from database
- **Calculations**: Auto-calculate fields
- **Validation Rules**: Custom validation
- **Conditional Formatting**: Dynamic styling
- **Multi-page Forms**: Section-based forms
- **Offline Support**: Submit when connection restored

**Form Data Model** (Planned):
```typescript
interface Form {
  id: string;
  name: string;
  category: string;
  fields: FormField[];
  settings: {
    requireGPS: boolean;
    requireSignature: boolean;
    allowOffline: boolean;
    emailNotifications: boolean;
    autoSubmit: boolean;
  };
  logic: FormLogic[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    submissions: number;
  };
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: string[]; // For dropdown, radio, etc.
  defaultValue?: any;
  properties: Record<string, any>;
}
```

---

### 5. Workflow Management Module

**Purpose**: Automate business processes with triggers, conditions, and actions

**Components**:
- `WorkflowManagement.jsx` - Workflow list and builder
- Workflow cards
- Visual workflow designer (planned)
- Execution history

**Workflow Engine Architecture** (Planned):
```javascript
const WorkflowEngine = {
  triggers: [
    'form:submitted',
    'form:approved',
    'form:rejected',
    'project:status:changed',
    'job:completed',
    'worker:arrived',
    'schedule:time:reached',
    'data:threshold:exceeded'
  ],

  conditions: [
    'if:field:equals',
    'if:field:greater_than',
    'if:field:contains',
    'if:time:between',
    'if:user:role:is',
    'if:project:status:is'
  ],

  actions: [
    'send:email',
    'send:sms',
    'send:push_notification',
    'update:database',
    'create:record',
    'assign:task',
    'forward:form',
    'generate:report',
    'webhook:call',
    'integration:sync'
  ]
}
```

**Example Workflows**:

1. **Safety Inspection Approval**:
```yaml
Trigger: Form "Safety Inspection" submitted
Condition: If status = "Failed"
Actions:
  - Send email to Project Manager
  - Create incident report
  - Assign corrective action task
  - Notify safety officer
```

2. **Project Milestone Alert**:
```yaml
Trigger: Project progress >= 50%
Actions:
  - Send email to stakeholders
  - Generate progress report
  - Schedule review meeting
  - Update QuickBooks milestone
```

3. **Equipment Maintenance**:
```yaml
Trigger: Schedule - Every 30 days
Condition: If equipment usage > 100 hours
Actions:
  - Create maintenance job
  - Assign to technician
  - Send reminder 3 days before
  - Log in maintenance database
```

---

### 6. Reporting Module

**Purpose**: Generate, schedule, and export custom reports

**Components**:
- `Reports.jsx` - Report library and generator
- Report cards
- Report builder (planned)
- Export options

**Report Types**:
1. **Project Status Summary** - Dashboard style
2. **Worker Time Cards** - Time tracking
3. **Safety Incidents** - Safety compliance
4. **Budget vs Actual** - Financial analysis
5. **Equipment Utilization** - Asset tracking
6. **Form Submissions** - Data analytics

**Report Features** (Planned):
- Custom report builder
- Scheduled generation (Daily, Weekly, Monthly)
- Multiple export formats (PDF, Excel, CSV, JSON)
- Email delivery
- Data visualization
- Filtering and date ranges
- Drill-down capabilities

**Report Engine** (Planned):
```javascript
const ReportEngine = {
  dataSources: [
    'projects',
    'forms',
    'workers',
    'jobs',
    'time_tracking',
    'budgets',
    'incidents'
  ],

  aggregations: [
    'sum',
    'average',
    'count',
    'min',
    'max',
    'group_by'
  ],

  visualizations: [
    'table',
    'bar_chart',
    'line_chart',
    'pie_chart',
    'map',
    'timeline'
  ],

  exportFormats: [
    'pdf',
    'excel',
    'csv',
    'json',
    'html'
  ]
}
```

---

### 7. Integrations Module

**Purpose**: Connect with third-party services and data sources

**Components**:
- `Integrations.jsx` - Integration marketplace
- Integration cards
- Configuration panels
- Sync status monitoring

**Supported Integrations**:

#### **Accounting**
- **QuickBooks**: Invoice sync, expense tracking, financial data
- Connector: OAuth2, QuickBooks Online API

#### **CRM**
- **Salesforce**: Customer data, leads, opportunities
- Connector: OAuth2, Salesforce REST API

#### **Document Management**
- **SharePoint**: Document storage, collaboration
- Connector: OAuth2, Microsoft Graph API

#### **Databases**
- **SQL Server**: Direct database queries and sync
- **Oracle**: Enterprise database integration
- **MySQL**: Open-source database connector
- Connectors: ODBC, Native drivers

#### **Cloud Storage**
- **Google Drive**: File backup and sharing
- **Dropbox**: Cloud file storage
- **Box**: Enterprise content management
- Connectors: OAuth2, REST APIs

#### **Additional Connectors** (Planned):
- Microsoft Pack (Office 365, Teams, OneDrive)
- FTP/SFTP file transfers
- SMS (Twilio, Clickatell)
- ODBC (Universal database connector)
- Sybase ASE
- XML/REST API endpoints
- Webhooks (Incoming/Outgoing)

**Integration Gateway Architecture** (Planned):
```javascript
const IntegrationGateway = {
  // Connector interface
  connector: {
    authenticate: async (credentials) => {},
    connect: async () => {},
    disconnect: async () => {},
    sync: async (direction, data) => {},
    webhookHandler: async (event) => {}
  },

  // Sync strategies
  syncStrategies: {
    'real-time': 'Immediate sync on data change',
    'scheduled': 'Periodic sync (hourly, daily, etc.)',
    'manual': 'User-triggered sync',
    'webhook': 'Event-driven sync'
  },

  // Data mapping
  dataMapping: {
    source: 'constructpm',
    target: 'quickbooks',
    mappings: [
      { from: 'project.budget', to: 'invoice.amount' },
      { from: 'project.client', to: 'customer.name' }
    ]
  }
}
```

---

## Data Models

### Core Database Schema (Planned)

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50), -- admin, manager, worker, client
  phone VARCHAR(20),
  avatar_url TEXT,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret VARCHAR(255),
  status VARCHAR(20), -- active, inactive, suspended
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  status VARCHAR(50), -- planning, in-progress, completed, on-hold
  progress INTEGER DEFAULT 0, -- 0-100
  budget DECIMAL(15, 2),
  spent DECIMAL(15, 2),
  start_date DATE,
  end_date DATE,
  location JSONB, -- {address, lat, lng}
  priority VARCHAR(20), -- low, medium, high
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Workers Table
```sql
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(20), -- available, on-route, on-site, offline
  current_job_id UUID,
  current_location JSONB, -- {lat, lng, timestamp}
  skills TEXT[],
  certifications JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number VARCHAR(50) UNIQUE,
  project_id UUID REFERENCES projects(id),
  assigned_worker_id UUID REFERENCES workers(id),
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50), -- pending, assigned, in-progress, completed
  priority VARCHAR(20), -- low, medium, high
  scheduled_time TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  location JSONB,
  estimated_duration INTEGER, -- minutes
  actual_duration INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Forms Table (MongoDB Schema)
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  version: Number,
  fields: [
    {
      id: String,
      type: String,
      label: String,
      required: Boolean,
      validation: Object,
      properties: Object
    }
  ],
  settings: {
    requireGPS: Boolean,
    requireSignature: Boolean,
    allowOffline: Boolean,
    emailNotifications: Boolean
  },
  logic: [
    {
      condition: Object,
      actions: Array
    }
  ],
  metadata: {
    createdBy: String,
    createdAt: Date,
    updatedAt: Date,
    submissions: Number
  }
}
```

#### Form Submissions Table (MongoDB)
```javascript
{
  _id: ObjectId,
  formId: String,
  formVersion: Number,
  projectId: String,
  workerId: String,
  jobId: String,
  data: {
    // Dynamic field data
    field1: "value",
    field2: 123,
    // ...
  },
  metadata: {
    submittedAt: Date,
    gpsLocation: { lat: Number, lng: Number },
    signature: String, // Base64 or URL
    photos: [String], // URLs
    ipAddress: String,
    deviceInfo: Object
  },
  status: String, // submitted, approved, rejected
  approvals: [
    {
      userId: String,
      action: String,
      comment: String,
      timestamp: Date
    }
  ]
}
```

#### Workflows Table
```sql
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20), -- active, paused, archived
  trigger_type VARCHAR(50),
  trigger_config JSONB,
  conditions JSONB,
  actions JSONB,
  execution_count INTEGER DEFAULT 0,
  last_execution TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Workflow Executions Table
```sql
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  trigger_data JSONB,
  execution_status VARCHAR(50), -- pending, running, completed, failed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,
  logs JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Integrations Table
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  type VARCHAR(50), -- quickbooks, salesforce, sharepoint, etc.
  status VARCHAR(20), -- connected, disconnected, error
  credentials JSONB, -- Encrypted
  config JSONB,
  last_sync TIMESTAMP,
  sync_status VARCHAR(50),
  error_log TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Integration Architecture

### Integration Patterns

#### 1. REST API Integration
```javascript
// Example: QuickBooks Integration
class QuickBooksConnector {
  async authenticate(credentials) {
    // OAuth2 flow
    const token = await oauth2.getToken(credentials);
    return token;
  }

  async syncInvoices(projectId) {
    const project = await getProject(projectId);
    const invoice = {
      CustomerRef: { value: project.clientId },
      Line: [
        {
          Amount: project.budget,
          DetailType: "SalesItemLineDetail",
          SalesItemLineDetail: {
            ItemRef: { value: "Services" }
          }
        }
      ]
    };

    const response = await qbAPI.post('/invoice', invoice);
    return response.data;
  }
}
```

#### 2. Database Integration
```javascript
// Example: SQL Server Direct Connection
class SQLServerConnector {
  async connect(config) {
    this.connection = await sql.connect({
      server: config.server,
      database: config.database,
      user: config.username,
      password: config.password,
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    });
  }

  async executeQuery(query, params) {
    const request = this.connection.request();
    params.forEach(p => request.input(p.name, p.value));
    const result = await request.query(query);
    return result.recordset;
  }
}
```

#### 3. Webhook Integration
```javascript
// Incoming webhooks
app.post('/webhooks/salesforce', async (req, res) => {
  const event = req.body;

  // Verify signature
  if (!verifyWebhookSignature(req)) {
    return res.status(401).send('Unauthorized');
  }

  // Process event
  await processSalesforceEvent(event);

  res.status(200).send('OK');
});

// Outgoing webhooks
async function triggerWebhook(url, data) {
  const signature = generateHMAC(data);
  await axios.post(url, data, {
    headers: {
      'X-Webhook-Signature': signature
    }
  });
}
```

#### 4. File Transfer (FTP/SFTP)
```javascript
class FTPConnector {
  async connect(config) {
    this.client = new ftp.Client();
    await this.client.connect({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      secure: true // SFTP
    });
  }

  async uploadFile(localPath, remotePath) {
    await this.client.uploadFrom(localPath, remotePath);
  }

  async downloadFile(remotePath, localPath) {
    await this.client.downloadTo(localPath, remotePath);
  }
}
```

### Data Synchronization Strategy

```javascript
const SyncManager = {
  // Bidirectional sync
  async bidirectionalSync(source, target) {
    const sourceData = await source.getData();
    const targetData = await target.getData();

    // Conflict resolution: Last-write-wins
    const merged = mergeData(sourceData, targetData);

    await source.updateData(merged);
    await target.updateData(merged);
  },

  // One-way sync
  async oneWaySync(source, target) {
    const data = await source.getData();
    await target.updateData(data);
  },

  // Incremental sync
  async incrementalSync(source, target, lastSyncTime) {
    const changes = await source.getChangesSince(lastSyncTime);
    await target.applyChanges(changes);
  }
}
```

---

## Security Architecture

### Authentication & Authorization

#### Multi-Factor Authentication (MFA)
```javascript
const MFAService = {
  // Generate TOTP secret
  generateSecret: () => {
    return speakeasy.generateSecret({ length: 32 });
  },

  // Verify TOTP token
  verifyToken: (secret, token) => {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2
    });
  },

  // SMS-based MFA
  sendSMSCode: async (phoneNumber) => {
    const code = generateRandomCode(6);
    await smsService.send(phoneNumber, `Your code: ${code}`);
    return code;
  }
}
```

#### JWT Authentication
```javascript
const AuthService = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
  },

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
```

### Field-Level Encryption

```javascript
const EncryptionService = {
  // AES-256 encryption
  encrypt: (data, key) => {
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      key,
      crypto.randomBytes(16)
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      authTag: cipher.getAuthTag().toString('hex')
    };
  },

  decrypt: (encrypted, key, authTag) => {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(authTag, 'hex')
    );

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

### Role-Based Access Control (RBAC)

```javascript
const roles = {
  admin: {
    permissions: ['*'] // All permissions
  },
  manager: {
    permissions: [
      'projects:read',
      'projects:write',
      'projects:delete',
      'workers:read',
      'workers:assign',
      'forms:read',
      'forms:write',
      'reports:read',
      'reports:generate'
    ]
  },
  worker: {
    permissions: [
      'jobs:read',
      'jobs:update',
      'forms:submit',
      'own:profile:read',
      'own:profile:update'
    ]
  },
  client: {
    permissions: [
      'own:projects:read',
      'own:reports:read'
    ]
  }
};

// Permission check middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = roles[userRole].permissions;

    if (userPermissions.includes('*') ||
        userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};
```

### Secure Transport

```javascript
// TLS/SSL Configuration
const httpsOptions = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  ca: fs.readFileSync('ca-certificate.pem'),
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384'
  ].join(':')
};

const server = https.createServer(httpsOptions, app);
```

### Data Protection

```javascript
const SecurityMiddleware = {
  // Helmet for HTTP headers
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // Rate limiting
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }),

  // Input sanitization
  sanitizeInput: (req, res, next) => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    next();
  },

  // SQL injection prevention
  parameterizedQueries: true,

  // XSS prevention
  escapeHTML: true
}
```

---

## Deployment Architecture

### Cloud Infrastructure (Planned)

```yaml
Production Environment:
  Cloud Provider: AWS / Azure / Google Cloud

  Load Balancer:
    - SSL/TLS termination
    - Health checks
    - Auto-scaling

  Application Servers:
    - Container-based (Docker)
    - Horizontal scaling
    - Auto-healing
    - Blue-green deployment

  Database:
    - PostgreSQL (RDS or managed)
    - Read replicas
    - Automated backups
    - Point-in-time recovery

  Cache:
    - Redis (ElastiCache or managed)
    - Cluster mode
    - Automatic failover

  Storage:
    - S3 / Azure Blob / Cloud Storage
    - CDN (CloudFront / Azure CDN)
    - Lifecycle policies

  Monitoring:
    - CloudWatch / Azure Monitor
    - Custom metrics
    - Alerts and notifications

  Logging:
    - Centralized logging (ELK Stack)
    - Log retention policies
    - Log analysis
```

### Docker Configuration (Planned)

```dockerfile
# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/constructpm
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=constructpm
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo_data:/data/db

volumes:
  postgres_data:
  redis_data:
  mongo_data:
```

### CI/CD Pipeline (Planned)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm install
          npm run test
          npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t constructpm-frontend ./frontend
          docker build -t constructpm-backend ./backend
      - name: Push to registry
        run: |
          docker push constructpm-frontend
          docker push constructpm-backend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
          kubectl rollout status deployment/constructpm
```

---

## Future Roadmap

### Phase 1: MVP (Current)
- ✅ Frontend UI/UX design
- ✅ Dashboard with metrics and charts
- ✅ Project management interface
- ✅ Dispatch board with GPS visualization
- ✅ Form builder with drag-drop
- ✅ Workflow management UI
- ✅ Reports and integrations pages

### Phase 2: Backend Development (Next)
- [ ] REST API implementation
- [ ] Database schema and migrations
- [ ] Authentication and authorization
- [ ] Real-time WebSocket server
- [ ] Form submission engine
- [ ] Basic workflow engine
- [ ] File upload and storage

### Phase 3: Core Features
- [ ] GPS tracking service
- [ ] Real-time dispatch system
- [ ] Form logic engine (if/then/else)
- [ ] Workflow execution engine
- [ ] Report generation engine
- [ ] Email and SMS notifications
- [ ] Payment processing

### Phase 4: Integrations
- [ ] QuickBooks connector
- [ ] Salesforce connector
- [ ] SharePoint connector
- [ ] SQL Server connector
- [ ] Cloud storage (Google Drive, Dropbox, Box)
- [ ] Generic REST API connector
- [ ] Webhook system

### Phase 5: Mobile Apps
- [ ] React Native setup
- [ ] iOS app development
- [ ] Android app development
- [ ] Offline mode
- [ ] Camera integration
- [ ] GPS background tracking
- [ ] Push notifications
- [ ] Barcode scanning

### Phase 6: Advanced Features
- [ ] Advanced workflow builder (visual)
- [ ] Custom report builder
- [ ] Data analytics dashboard
- [ ] Machine learning predictions
- [ ] Voice commands
- [ ] AR/VR capabilities
- [ ] IoT device integration

### Phase 7: Enterprise Features
- [ ] Multi-tenant architecture
- [ ] White-labeling
- [ ] Custom branding
- [ ] API marketplace
- [ ] Plugin system
- [ ] Advanced security (SSO, SAML)
- [ ] Compliance certifications

### Phase 8: Scale & Performance
- [ ] Microservices refactor
- [ ] Global CDN
- [ ] Edge computing
- [ ] Performance optimization
- [ ] Load testing
- [ ] Disaster recovery
- [ ] Multi-region deployment

---

## Technology Decisions & Rationale

### Why React?
- Large ecosystem and community
- Component reusability
- Virtual DOM performance
- Strong TypeScript support
- React Native code sharing

### Why Node.js?
- JavaScript full-stack
- Non-blocking I/O for real-time features
- Large package ecosystem (npm)
- Excellent for WebSocket/real-time
- Easy integration with frontend

### Why PostgreSQL?
- ACID compliance
- JSONB for flexible schemas
- PostGIS for geospatial data
- Excellent performance
- Mature and reliable

### Why MongoDB?
- Flexible schema for dynamic forms
- Horizontal scalability
- Document-oriented (perfect for forms)
- Fast writes for submissions

### Why Redis?
- In-memory speed
- Pub/Sub for real-time
- Session management
- Job queue backend (Bull)

### Why Tailwind CSS?
- Utility-first approach
- Rapid development
- Consistent design system
- Excellent mobile support
- Small production bundle

---

## Performance Considerations

### Frontend Optimization
- Code splitting (React.lazy)
- Image optimization
- Lazy loading
- Service workers for offline
- Webpack bundle analysis
- Tree shaking
- Minification and compression

### Backend Optimization
- Database indexing
- Query optimization
- Caching strategy (Redis)
- Connection pooling
- Rate limiting
- Compression (gzip/brotli)
- CDN for static assets

### Database Optimization
- Proper indexing
- Query optimization
- Read replicas
- Connection pooling
- Partitioning large tables
- Materialized views
- VACUUM and ANALYZE

---

## Monitoring & Observability

### Metrics to Track
```javascript
const metrics = {
  application: [
    'request_rate',
    'response_time',
    'error_rate',
    'active_users',
    'api_latency'
  ],

  business: [
    'active_projects',
    'form_submissions',
    'worker_utilization',
    'job_completion_rate',
    'workflow_executions'
  ],

  infrastructure: [
    'cpu_usage',
    'memory_usage',
    'disk_io',
    'network_throughput',
    'database_connections'
  ]
}
```

### Alerting Strategy
- Error rate > 1%
- Response time > 1s
- Database connection pool exhausted
- Disk usage > 80%
- Failed workflow executions
- Integration sync failures

---

## Compliance & Standards

### Data Privacy
- GDPR compliance (planned)
- Data encryption at rest and in transit
- Right to be forgotten
- Data export capabilities
- Privacy policy

### Industry Standards
- OWASP Top 10 security
- PCI DSS (for payments)
- SOC 2 Type II (planned)
- ISO 27001 (planned)

---

## Cost Estimation (Monthly)

```yaml
Development Phase:
  - Cloud Infrastructure: $500-1000
  - Third-party APIs: $200-500
  - Development Tools: $100-200
  Total: ~$1000-2000/month

Production (Small Scale - 100 users):
  - Cloud Servers: $500-800
  - Database: $300-500
  - Storage: $100-200
  - CDN: $50-100
  - Third-party APIs: $300-600
  - Monitoring: $100-200
  Total: ~$1500-2500/month

Production (Medium Scale - 1000 users):
  - Cloud Servers: $2000-3000
  - Database: $1000-1500
  - Storage: $500-800
  - CDN: $200-400
  - Third-party APIs: $1000-2000
  - Monitoring: $300-500
  Total: ~$5000-8000/month

Production (Large Scale - 10000+ users):
  - Cloud Servers: $8000-15000
  - Database: $4000-8000
  - Storage: $2000-4000
  - CDN: $1000-2000
  - Third-party APIs: $5000-10000
  - Monitoring: $1000-2000
  Total: ~$20000-40000/month
```

---

## Conclusion

The Construction Project Management Platform is architected as a modern, scalable, enterprise-grade solution that combines mobile data collection, real-time operations, workflow automation, and comprehensive integrations. The current frontend implementation demonstrates the complete user interface and user experience, providing a solid foundation for backend development and mobile app creation.

The architecture is designed to scale from small contractors to enterprise deployments, with security, performance, and reliability as core principles.

---

**Document Version**: 1.0
**Last Updated**: November 2, 2024
**Author**: Construction PM Platform Team
**Status**: Active Development
