from datetime import datetime

from geoalchemy2 import Geometry
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class MonitoringStation(Base):
    """River water level monitoring stations"""

    __tablename__ = "monitoring_stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    river_name = Column(String(50), nullable=False)  # Sutlej, Beas, Ravi, etc.
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    district = Column(String(50), nullable=False)
    normal_level = Column(Float, nullable=False)  # Normal water level in meters
    warning_level = Column(Float, nullable=False)  # Warning threshold in meters
    danger_level = Column(Float, nullable=False)  # Danger threshold in meters
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WaterLevel(Base):
    """Current and historical water level readings"""

    __tablename__ = "water_levels"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, nullable=False)  # Reference to MonitoringStation
    level = Column(Float, nullable=False)  # Water level in meters
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), nullable=False)  # "normal", "warning", "danger"


class RainfallData(Base):
    """Rainfall data by district"""

    __tablename__ = "rainfall_data"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String(50), nullable=False)
    location = Column(
        Geometry("POINT", srid=4326), nullable=False
    )  # District center point
    rainfall_mm = Column(Float, nullable=False)  # Rainfall in millimeters
    duration_hours = Column(
        Integer, nullable=False
    )  # Duration over which rainfall was measured
    timestamp = Column(DateTime, default=datetime.utcnow)


class FloodForecast(Base):
    """24-hour flood inundation forecasts"""

    __tablename__ = "flood_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    forecast_area = Column(Geometry("POLYGON", srid=4326), nullable=False)
    district = Column(String(50), nullable=False)
    risk_level = Column(
        String(20), nullable=False
    )  # "low", "medium", "high", "critical"
    forecast_time = Column(DateTime, nullable=False)  # When forecast is for (24h ahead)
    created_at = Column(DateTime, default=datetime.utcnow)
    confidence = Column(Float, default=0.0)  # Forecast confidence percentage
    affected_population = Column(Integer, default=0)  # Estimated affected population


class District(Base):
    """Punjab districts with boundaries"""

    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    boundary = Column(Geometry("POLYGON", srid=4326), nullable=False)
    population = Column(Integer, default=0)
    area_sq_km = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
