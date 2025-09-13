# 🌊 FloodGuard - Punjab Flood Monitoring System

A real-time flood monitoring and simulation web application for the Punjab region, featuring interactive mapping, water level monitoring, and 24-hour flood forecasting let add more .

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │ ── │  FastAPI Backend │ ── │ PostgreSQL + GIS │
│   (Port 3000)   │    │   (Port 5000)   │    │   (Neon Cloud)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Features

- 🗺️ **Interactive Map Dashboard** - Leaflet.js powered mapping
- 📊 **Real-time Water Level Monitoring** - River stations with color-coded status
- 🌧️ **Rainfall Data Visualization** - District-wise precipitation heatmaps
- 🔮 **24-Hour Flood Forecasting** - Predictive inundation areas
- 🚨 **Alert System** - Priority-based risk notifications
- 📱 **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Local Development

1. **Clone & Setup**
   ```bash
   git clone https://github.com/kahloncoder/FLOODGUARD.git
   cd floodguard
   ```

2. **Backend Setup**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -e .
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file with your database URL
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

5. **Run Application**
   ```bash
   # Backend
   uvicorn main:app --reload

   # Frontend (new terminal)
   cd frontend && npm run dev
   ```

### Docker Development

```bash
# Build and run with Docker
docker-compose up -d

# Or with local database
docker-compose -f docker-compose.dev.yml up -d
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy + GeoAlchemy2** - ORM with geospatial support
- **PostgreSQL + PostGIS** - Geospatial database
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Leaflet.js** - Interactive mapping
- **Tailwind CSS** - Styling

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **GitHub Container Registry** - Image storage

## 📦 Deployment

### Automated Deployment (Recommended)
1. Fork this repository
2. Set up GitHub Secrets (see [CICD_DEPLOYMENT_GUIDE.md](CICD_DEPLOYMENT_GUIDE.md))
3. Push to main branch → Automatic deployment

### Manual Docker Deployment
```bash
# Build and run
docker build -t floodguard .
docker run -p 5000:5000 --env-file .env floodguard
```

## 📁 Project Structure

```
FloodGuard/
├── 📄 main.py              # FastAPI application entry point
├── 📄 api_routes.py        # API endpoints
├── 📄 models.py            # Database models
├── 📄 seed_data.py         # Sample data seeding
├── 🐳 Dockerfile           # Container configuration
├── 🐳 docker-compose.yml   # Development orchestration
├── 🔧 pyproject.toml       # Python dependencies
├── 📁 frontend/            # React application
│   ├── 📁 src/components/  # UI components
│   ├── 📁 src/utils/       # API utilities
│   └── 📄 package.json     # Node dependencies
├── 📁 .github/workflows/   # CI/CD pipeline
└── 📁 tests/               # Test suite
```

## 🧪 Testing

```bash
# Run backend tests
pytest

# Run frontend tests
cd frontend && npm test

# Run linting
black . && ruff check .
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

## 📚 Documentation

- [Docker Setup Guide](DOCKER_SETUP.md)
- [CI/CD Deployment Guide](CICD_DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an [Issue](https://github.com/kahloncoder/FLOODGUARD/issues) for bug reports
- Start a [Discussion](https://github.com/kahloncoder/FLOODGUARD/discussions) for questions

---

**Built with ❤️ for Punjab flood monitoring and disaster management**