#!/bin/bash
# Docker helper script for FloodGuard project

set -e

case "$1" in
  "build")
    echo "🏗️  Building Docker image..."
    docker build -t floodguard:latest .
    echo "✅ Build completed!"
    ;;
  
  "up")
    echo "🚀 Starting FloodGuard with external database..."
    docker-compose up -d
    echo "✅ Application started on http://localhost:5000"
    ;;
  
  "up-dev")
    echo "🚀 Starting FloodGuard with local PostgreSQL database..."
    docker-compose -f docker-compose.dev.yml up -d
    echo "✅ Application started on http://localhost:5000"
    echo "📊 Database available on localhost:5432"
    ;;
  
  "logs")
    echo "📝 Showing application logs..."
    docker-compose logs -f floodguard-app
    ;;
  
  "down")
    echo "🛑 Stopping FloodGuard..."
    docker-compose down
    echo "✅ Application stopped!"
    ;;
  
  "down-dev")
    echo "🛑 Stopping FloodGuard and database..."
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Application and database stopped!"
    ;;
  
  "clean")
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup completed!"
    ;;
  
  *)
    echo "🚀 FloodGuard Docker Helper"
    echo ""
    echo "Usage: $0 {build|up|up-dev|logs|down|down-dev|clean}"
    echo ""
    echo "Commands:"
    echo "  build     - Build the Docker image"
    echo "  up        - Start with external database (requires .env)"
    echo "  up-dev    - Start with local PostgreSQL database"
    echo "  logs      - Show application logs"
    echo "  down      - Stop application (external DB mode)"
    echo "  down-dev  - Stop application and database"
    echo "  clean     - Clean up all Docker resources"
    ;;
esac