# ConstructPM - Construction Project Management Platform

A comprehensive, enterprise-grade construction project management platform designed for general contractors. Combines mobile data collection, real-time worker tracking, dynamic forms, workflow automation, and enterprise integrations.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Version](https://img.shields.io/badge/version-0.35.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Capabilities
- **📱 Mobile-First Design** - Native iOS/Android apps + responsive web
- **📍 Real-Time GPS Tracking** - Live worker location and dispatch
- **📋 Dynamic Form Builder** - Unlimited custom forms with 10+ field types
- **⚙️ Workflow Automation** - If/Then/Else logic for business processes
- **🔗 Enterprise Integrations** - QuickBooks, Salesforce, SharePoint, SQL Server, Oracle
- **📊 Advanced Reporting** - Custom reports with PDF/Excel export
- **🔐 Enterprise Security** - JWT authentication, MFA, field-level encryption
- **☁️ Unlimited Scale** - Unlimited forms, submissions, and data storage

### Key Features by Module

#### Dashboard
- Real-time metrics (Revenue, Projects, Workers, Completion Rate)
- Interactive charts and graphs
- Recent jobs tracking
- Alert notifications

#### Projects
- Project lifecycle management
- Budget tracking and forecasting
- Timeline visualization
- Worker assignment
- Progress tracking
- Location mapping

#### Dispatch Board
- Live worker tracking on map
- Real-time status updates (Available, On-Route, On-Site)
- Job assignment and scheduling
- ETA calculations with traffic data
- Route optimization
- Worker communication

#### Form Builder
- Drag-and-drop interface
- 10+ field types (text, number, date, dropdown, photo, signature, GPS, etc.)
- Conditional logic (show/hide fields)
- Data validation rules
- Offline submission support
- Photo and signature capture
- GPS auto-stamping

#### Workflows
- Visual workflow builder
- Trigger system (form submit, status change, schedule)
- Action system (email, SMS, database updates)
- If/Then/Else conditions
- Execution history

#### Reports
- Custom report builder
- Scheduled reports (daily, weekly, monthly)
- Multiple export formats (PDF, Excel, CSV)
- Email delivery
- Data aggregation

#### Integrations
- QuickBooks (invoice sync, expense tracking)
- Salesforce (CRM data sync)
- SharePoint (document management)
- SQL Server / Oracle / MySQL (direct database access)
- Google Drive / Dropbox / Box (cloud storage)
- Custom webhooks
- REST/SOAP APIs

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS 4
- React Router 6
- Recharts (data visualization)

**Backend**:
- Node.js 20 LTS
- NestJS 10 framework
- TypeScript 5
- PostgreSQL 15 (primary database)
- MongoDB 7 (forms & documents)
- Redis 7 (cache & queues)

**Mobile** (Planned):
- React Native
- Expo (optional)

**Infrastructure**:
- Docker & Docker Compose
- AWS / Azure / Google Cloud
- Kubernetes (production)

### System Architecture

```
┌─────────────────────────────────────────────┐
│         Client Layer                        │
│  iOS | Android | Web Browser | Admin       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         API Gateway (NestJS)                │
│  REST | SOAP | WebSocket                    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Business Logic Layer                │
│  Projects | Dispatch | Forms | Workflows   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Data Layer                          │
│  PostgreSQL | MongoDB | Redis               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Integration Layer                   │
│  QuickBooks | Salesforce | SharePoint      │
└─────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- Docker Desktop
- Git

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd construct_PM_platform
```

2. **Start databases** (Docker):
```bash
docker-compose up -d postgres mongodb redis
```

3. **Install and run backend**:
```bash
cd backend
npm install
npm run start:dev
```

Backend will be available at:
- API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs

4. **Install and run frontend**:
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5174

### Using Docker Compose (All Services)

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 📖 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Complete technical architecture (800+ lines)
- [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) - Backend implementation guide
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current project status and roadmap
- API Documentation: http://localhost:3000/api/docs (when backend is running)

## 🎯 Current Status

### ✅ Completed (35%)
- [x] Complete architecture documentation
- [x] Frontend UI (all 7 pages)
- [x] Backend foundation (NestJS setup)
- [x] Database schemas (PostgreSQL + MongoDB)
- [x] Authentication module (JWT + MFA)
- [x] Docker Compose configuration
- [x] API documentation (Swagger)

### 🚧 In Progress
- [ ] Projects CRUD API
- [ ] Dispatch WebSocket gateway
- [ ] Forms API with file upload
- [ ] Workflow execution engine

### 📋 Planned
- [ ] Reports generation (PDF/Excel)
- [ ] Integration connectors
- [ ] Notifications (Email/SMS)
- [ ] Mobile apps (React Native)
- [ ] Production deployment

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed progress.

## 📱 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Dispatch Board
![Dispatch](docs/screenshots/dispatch.png)

### Form Builder
![Forms](docs/screenshots/forms.png)

*Note: Screenshots to be added*

## 🔐 Security

- **Authentication**: JWT with access & refresh tokens
- **MFA**: TOTP-based multi-factor authentication
- **Encryption**: AES-256 for sensitive data
- **Transport**: TLS/SSL for all communications
- **Authorization**: Role-based access control (RBAC)
- **Passwords**: Bcrypt hashing with salt

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Development
```bash
docker-compose up
```

### Production
See [ARCHITECTURE.md](ARCHITECTURE.md) for complete deployment guide.

Recommended:
- Kubernetes for orchestration
- AWS/Azure/GCP for cloud infrastructure
- CloudFlare for CDN
- GitHub Actions for CI/CD

## 🛣️ Roadmap

### Phase 1: MVP (Weeks 1-6) 🚧 Current
- [x] Architecture & design
- [x] Frontend UI
- [x] Backend foundation
- [ ] Core API modules (Projects, Dispatch, Forms)
- [ ] Basic integrations

### Phase 2: Advanced Features (Weeks 7-12)
- [ ] Workflow engine
- [ ] Advanced reporting
- [ ] Mobile apps (iOS/Android)
- [ ] Additional integrations
- [ ] Performance optimization

### Phase 3: Enterprise (Weeks 13-20)
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] White-labeling
- [ ] SSO/SAML
- [ ] Compliance certifications

### Phase 4: Scale (Ongoing)
- [ ] Microservices refactor
- [ ] Global CDN
- [ ] Machine learning features
- [ ] IoT device integration

## 🤝 Contributing

This is a proprietary project. For contribution guidelines, contact the project maintainers.

## 📄 License

Copyright © 2024 ConstructPM. All rights reserved.

## 👥 Team

- **Architecture**: Claude AI + Development Team
- **Frontend**: React + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **DevOps**: Docker + Cloud Infrastructure

## 📞 Support

For support and questions:
- Email: support@constructpm.com
- Documentation: [ARCHITECTURE.md](ARCHITECTURE.md)
- API Docs: http://localhost:3000/api/docs

## 🎓 Resources

### External Dependencies
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [TypeORM Documentation](https://typeorm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Native](https://reactnative.dev/)

### API Integrations
- [QuickBooks API](https://developer.intuit.com/)
- [Salesforce API](https://developer.salesforce.com/)
- [Microsoft Graph (SharePoint)](https://learn.microsoft.com/en-us/graph/)
- [Google Maps Platform](https://developers.google.com/maps)

## 🔧 Development

### Project Structure
```
construct_PM_platform/
├── frontend/          # React web application
├── backend/           # NestJS API server
├── mobile/           # React Native apps (planned)
├── docs/             # Documentation
├── docker-compose.yml
└── README.md         # This file
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=constructpm
DB_PASSWORD=***

# JWT
JWT_SECRET=***
JWT_REFRESH_SECRET=***

# Integrations
QUICKBOOKS_CLIENT_ID=***
SALESFORCE_CLIENT_ID=***
# ... etc
```

### Scripts

**Backend**:
```bash
npm run start         # Production
npm run start:dev     # Development with watch
npm run start:debug   # Debug mode
npm run build         # Build for production
npm run test          # Run tests
npm run lint          # Lint code
```

**Frontend**:
```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Lint code
```

## 🌟 Key Differentiators

1. **Unlimited Everything**: No limits on forms, submissions, or data storage
2. **Mobile-First**: Native apps for iOS and Android
3. **Real-Time**: Live GPS tracking and dispatch
4. **Enterprise Ready**: Integrations with QuickBooks, Salesforce, SharePoint
5. **Flexible Forms**: Drag-and-drop builder with conditional logic
6. **Workflow Automation**: Powerful if/then/else engine
7. **Secure**: MFA, encryption, and enterprise-grade security

## 💼 Use Cases

- General contractors managing multiple projects
- Field service companies with mobile workforce
- Construction companies needing real-time tracking
- Enterprises requiring custom forms and workflows
- Organizations needing accounting/CRM integrations
- Companies with complex approval processes

---

**Built with** ❤️ **using modern web technologies**

**Status**: In Active Development 🚀
**Version**: 0.35.0 (Foundation Release)
**Last Updated**: November 2, 2024
