# ConstructPM Documentation Index

This folder contains all project documentation, technical specifications, and development notes.

## 📚 Core Documentation

### Project Overview
- **[README.md](./README.md)** - Main project overview and quick start guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture and technical design
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current development status and progress tracking

### Component Documentation
- **[BACKEND_README.md](./BACKEND_README.md)** - Backend setup, configuration, and API documentation
- **[BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)** - Backend implementation summary and module overview
- **[FRONTEND_README.md](./FRONTEND_README.md)** - Frontend setup, structure, and component documentation

### Module Documentation
- **[MODULE_WORKFLOWS.md](./MODULE_WORKFLOWS.md)** - Workflows module with execution engine, actions, and conditional logic

### Infrastructure
- **[docker-compose.yml](./docker-compose.yml)** - Docker services configuration (PostgreSQL, MongoDB, Redis)

### Guidelines
- **[DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)** - Documentation standards and best practices

## 📝 Development Notes

All technical summaries, implementation notes, and update logs should be placed in this folder.

### Naming Conventions

- **Architecture docs**: `ARCHITECTURE_*.md`
- **API documentation**: `API_*.md`
- **Module summaries**: `MODULE_*.md`
- **Development notes**: `NOTES_*.md`
- **Update logs**: `UPDATE_*.md`
- **Meeting notes**: `MEETING_YYYY-MM-DD.md`

## 🗂️ Organization

```
PMdocs/
├── INDEX.md                       # This file
├── DOCUMENTATION_GUIDELINES.md    # Documentation standards
├── README.md                      # Main project overview
├── ARCHITECTURE.md                # System architecture
├── PROJECT_STATUS.md              # Development status
├── BACKEND_README.md              # Backend documentation
├── BACKEND_SUMMARY.md             # Backend implementation summary
├── FRONTEND_README.md             # Frontend documentation
├── MODULE_WORKFLOWS.md            # Workflows module documentation
├── docker-compose.yml             # Infrastructure config
└── [Future documentation files]
```

## 🔄 Update Guidelines

When adding new documentation:

1. Place all `.md` files in this `PMdocs` folder
2. Use descriptive, UPPERCASE filenames with underscores
3. Update this INDEX.md with the new file
4. Keep documentation organized by category
5. Date-stamp meeting notes and update logs

## 📦 Excluded from Documentation

The following should NOT be placed in this folder:
- `node_modules/` documentation (auto-generated)
- Build artifacts
- Temporary files
- IDE-specific files

---

**Last Updated**: November 3, 2025
