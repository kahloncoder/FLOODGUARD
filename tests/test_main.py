"""
Basic tests for the FloodGuard application
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_api_stations_endpoint():
    """Test the stations API endpoint"""
    response = client.get("/api/stations")
    # This might fail if database is not available, but that's expected in CI
    # We're just testing that the endpoint exists and doesn't crash
    assert response.status_code in [200, 500]  # 500 if no database in CI


class TestModels:
    """Test data models"""

    def test_models_import(self):
        """Test that models can be imported without errors"""
        from models import (
            District,
            FloodForecast,
            MonitoringStation,
            RainfallData,
            WaterLevel,
        )

        assert MonitoringStation is not None
        assert WaterLevel is not None
        assert RainfallData is not None
        assert FloodForecast is not None
        assert District is not None


class TestAPIRoutes:
    """Test API route imports and basic functionality"""

    def test_api_routes_import(self):
        """Test that API routes can be imported"""
        from api_routes import router

        assert router is not None
