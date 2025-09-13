# Docker helper script for FloodGuard project (PowerShell)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("build", "up", "up-dev", "logs", "down", "down-dev", "clean", "help")]
    [string]$Command
)

switch ($Command) {
    "build" {
        Write-Host "🏗️  Building Docker image..." -ForegroundColor Yellow
        docker build -t floodguard:latest .
        Write-Host "✅ Build completed!" -ForegroundColor Green
    }
    
    "up" {
        Write-Host "🚀 Starting FloodGuard with external database..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "✅ Application started on http://localhost:5000" -ForegroundColor Green
    }
    
    "up-dev" {
        Write-Host "🚀 Starting FloodGuard with local PostgreSQL database..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml up -d
        Write-Host "✅ Application started on http://localhost:5000" -ForegroundColor Green
        Write-Host "📊 Database available on localhost:5432" -ForegroundColor Blue
    }
    
    "logs" {
        Write-Host "📝 Showing application logs..." -ForegroundColor Yellow
        docker-compose logs -f floodguard-app
    }
    
    "down" {
        Write-Host "🛑 Stopping FloodGuard..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "✅ Application stopped!" -ForegroundColor Green
    }
    
    "down-dev" {
        Write-Host "🛑 Stopping FloodGuard and database..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml down
        Write-Host "✅ Application and database stopped!" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow
        docker-compose down -v
        docker system prune -f
        Write-Host "✅ Cleanup completed!" -ForegroundColor Green
    }
    
    "help" {
        Write-Host "🚀 FloodGuard Docker Helper" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage: .\docker-helper.ps1 -Command <command>" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  build     - Build the Docker image" -ForegroundColor Gray
        Write-Host "  up        - Start with external database (requires .env)" -ForegroundColor Gray
        Write-Host "  up-dev    - Start with local PostgreSQL database" -ForegroundColor Gray
        Write-Host "  logs      - Show application logs" -ForegroundColor Gray
        Write-Host "  down      - Stop application (external DB mode)" -ForegroundColor Gray
        Write-Host "  down-dev  - Stop application and database" -ForegroundColor Gray
        Write-Host "  clean     - Clean up all Docker resources" -ForegroundColor Gray
    }
}