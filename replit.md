# Punjab Flood Monitoring System

## Overview

This is an MVP flood monitoring and simulation web application for the Punjab region. The system provides real-time monitoring of river water levels, rainfall data, and 24-hour flood forecasts through an interactive web dashboard. The application aims to serve both the general public for awareness and disaster management officials for decision-making by moving beyond reactive flood reporting to proactive flood risk prediction.

The system features an interactive map centered on Punjab with togglable data layers showing monitoring stations, rainfall intensity, and flood inundation forecasts. Key functionality includes automated alerting for high-risk areas and a responsive design that works on both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized builds  
- **Mapping Library**: Leaflet.js with React-Leaflet integration for interactive maps
- **Styling**: Tailwind CSS for responsive and modern UI components
- **State Management**: React hooks for local component state management
- **API Communication**: Axios for HTTP requests to the backend API

The frontend is structured as a single-page application with a main Dashboard component that orchestrates data fetching and manages the display of the interactive map, alert panels, and layer controls.

### Backend Architecture  
- **Framework**: FastAPI for high-performance Python API development
- **Database**: PostgreSQL with PostGIS extension for geospatial data storage
- **ORM**: SQLAlchemy for database operations and model definitions
- **Geospatial Processing**: GeoAlchemy2 for handling geographic data types

The backend follows a clean architecture with separate layers for API routes, database models, and business logic. The main application handles CORS middleware configuration and database session management.

### Data Models
- **MonitoringStation**: Stores river monitoring station locations, water level thresholds, and metadata
- **WaterLevel**: Historical and current water level readings with status indicators
- **RainfallData**: District-level rainfall measurements with intensity classifications  
- **FloodForecast**: 24-hour flood prediction polygons with risk levels and confidence scores
- **District**: Administrative boundaries for organizing geographic data

### API Design
RESTful API endpoints provide data for the frontend components:
- `/stations` - Monitoring station data with current water levels
- `/rainfall` - Recent rainfall data by district  
- `/forecasts` - 24-hour flood inundation predictions
- `/alerts` - High-priority areas requiring attention

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database for all application data
- **PostGIS**: Geospatial extension for handling geographic coordinates and polygon data

### Mapping and Geospatial Services
- **Leaflet.js**: Open-source mapping library for interactive map display
- **OpenStreetMap**: Default tile layer for base map visualization

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type checking and enhanced development experience
- **ESLint**: Code linting and style enforcement

### Potential Data Sources (for production)
The system is designed to integrate with government data feeds for:
- Real-time river water levels from gauging stations
- Weather and rainfall data from meteorological services
- Flood prediction models from disaster management authorities

Currently uses mock/sample data for MVP demonstration purposes.