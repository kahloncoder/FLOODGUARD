# FloodGuard Docker Setup Guide

## Prerequisites

1. **Docker Desktop**: Install and start Docker Desktop for Windows
2. **Git**: For version control and CI/CD integration

## Docker Files Created

### 📄 Core Docker Files
- `Dockerfile` - Multi-stage build (Frontend + Backend)
- `docker-compose.yml` - Production-like setup with external database
- `docker-compose.dev.yml` - Complete local development with PostgreSQL
- `.dockerignore` - Optimizes build process

### 🛠️ Helper Scripts
- `docker-helper.ps1` - PowerShell helper script for Windows
- `docker-helper.sh` - Bash helper script for Linux/Mac

## Quick Start

### 1. Start Docker Desktop
Ensure Docker Desktop is running on your machine.

### 2. Build the Application
```powershell
# Using helper script
.\docker-helper.ps1 -Command build

# Or manually
docker build -t floodguard:latest .
```

### 3. Run with External Database (Production-like)
```powershell
# Ensure .env file exists with DATABASE_URL
.\docker-helper.ps1 -Command up

# Access at: http://localhost:5000
```

### 4. Run with Local Database (Complete Development)
```powershell
# Includes PostgreSQL + PostGIS
.\docker-helper.ps1 -Command up-dev

# Access at: http://localhost:5000
# Database: localhost:5432
```

## Docker Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Multi-Stage Build                   │
├─────────────────────────────────────────────────────┤
│ Stage 1: Frontend Builder (Node.js 20-alpine)      │
│ - npm ci (install dependencies)                    │
│ - npm run build (create static files)              │
│ - Output: /usr/src/frontend/dist                   │
├─────────────────────────────────────────────────────┤
│ Stage 2: Backend Runtime (Python 3.11-slim)       │
│ - Install geospatial system dependencies           │
│ - pip install project dependencies                 │
│ - Copy backend source code                         │
│ - Copy frontend static files from Stage 1          │
│ - Expose port 5000                                 │
└─────────────────────────────────────────────────────┘
```

## Key Features

### 🔧 System Dependencies
- **GDAL**: Geospatial Data Abstraction Library
- **GEOS**: Geometry Engine Open Source
- **PROJ**: Cartographic Projections Library
- **PostGIS**: PostgreSQL extension for geographic objects

### 🔒 Security
- Non-root user execution
- Minimal base image (slim)
- Environment variable configuration
- Health checks

### 📊 Database Options
1. **External Database**: Use your Neon PostgreSQL (production)
2. **Local Database**: PostgreSQL + PostGIS container (development)

## Environment Variables

### Required for External DB Mode
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Auto-configured for Local DB Mode
- Database: `floodguard_db`
- User: `floodguard_user`
- Password: `floodguard_pass`
- Host: `postgres` (container name)

## Commands Reference

### Helper Script Commands
```powershell
.\docker-helper.ps1 -Command build     # Build image
.\docker-helper.ps1 -Command up        # Start (external DB)
.\docker-helper.ps1 -Command up-dev    # Start (local DB)
.\docker-helper.ps1 -Command logs      # View logs
.\docker-helper.ps1 -Command down      # Stop (external DB)
.\docker-helper.ps1 -Command down-dev  # Stop (local DB)
.\docker-helper.ps1 -Command clean     # Cleanup resources
```

### Manual Docker Commands
```bash
# Build
docker build -t floodguard:latest .

# Run with external database
docker-compose up -d

# Run with local database
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Health Checks

- **Application**: `GET /health` endpoint
- **Database**: `pg_isready` command
- **Interval**: 30 seconds
- **Timeout**: 10 seconds

## Next Steps for CI/CD

1. **GitHub Actions**: Build and push to container registry
2. **VPS Deployment**: Pull and run on production server
3. **Environment Management**: Separate configs for dev/staging/prod
4. **Database Migration**: Automated schema updates
5. **Monitoring**: Application and infrastructure monitoring

## Troubleshooting

### Build Issues
- Ensure Docker Desktop is running
- Check internet connection for package downloads
- Verify .env file exists for external DB mode

### Runtime Issues
- Check health endpoints: `http://localhost:5000/health`
- View logs: `docker-compose logs -f`
- Verify database connectivity

### Port Conflicts
- Frontend: Port 3000 (development only)
- Backend: Port 5000 (production)
- Database: Port 5432 (local development only)