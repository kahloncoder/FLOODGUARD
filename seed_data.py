"""
Seed script to populate the database with Punjab flood monitoring data
"""
import os
from datetime import datetime, timedelta
import random
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, MonitoringStation, WaterLevel, RainfallData, FloodForecast, District
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_districts():
    """Seed Punjab districts with approximate boundaries"""
    districts_data = [
        # Major Punjab districts with approximate center coordinates and boundaries
        ("Amritsar", 31.6340, 74.8723, 2490000, 5075.0),
        ("Ludhiana", 30.9010, 75.8573, 3498000, 3767.0),
        ("Jalandhar", 31.3260, 75.5762, 2193000, 2682.0),
        ("Patiala", 30.3398, 76.3869, 1895000, 3212.0),
        ("Bathinda", 30.2118, 74.9455, 1388000, 3385.0),
        ("Mohali", 30.7046, 76.7179, 994000, 1001.0),
        ("Firozpur", 30.9328, 74.6122, 1170000, 5305.0),
        ("Hoshiarpur", 31.5344, 75.9119, 1586000, 3386.0),
        ("Kapurthala", 31.3800, 75.3800, 815000, 1633.0),
        ("Faridkot", 30.6735, 74.7555, 617000, 1469.0),
        ("Muktsar", 30.4762, 74.5161, 901000, 2297.0),
        ("Fatehgarh Sahib", 30.6466, 76.3969, 600000, 1180.0),
        ("Pathankot", 32.2746, 75.6411, 649000, 929.0),
        ("Rupnagar", 30.9631, 76.5270, 684000, 1569.0),
        ("Sangrur", 30.2459, 75.8421, 1655000, 3635.0),
        ("Tarn Taran", 31.4532, 74.9205, 1119000, 2414.0),
        ("Gurdaspur", 32.0409, 75.4024, 2298000, 3564.0),
        ("Fazilka", 30.4028, 74.0281, 1048000, 2463.0),
        ("Barnala", 30.3804, 75.5504, 595000, 1423.0),
        ("Mansa", 29.9988, 75.3933, 769000, 2174.0),
        ("Nawanshahr", 31.1242, 76.1172, 612000, 1268.0),
        ("Moga", 30.8028, 75.1667, 995000, 2235.0)
    ]
    
    db = SessionLocal()
    try:
        for name, lat, lon, population, area in districts_data:
            # Create approximate rectangular boundary (simplified)
            boundary_wkt = f"POLYGON(({lon-0.2} {lat-0.2}, {lon+0.2} {lat-0.2}, {lon+0.2} {lat+0.2}, {lon-0.2} {lat+0.2}, {lon-0.2} {lat-0.2}))"
            
            district = District(
                name=name,
                boundary=text(f"ST_GeomFromText('{boundary_wkt}', 4326)"),
                population=population,
                area_sq_km=area
            )
            db.add(district)
        
        db.commit()
        print(f"Seeded {len(districts_data)} districts")
    except Exception as e:
        print(f"Error seeding districts: {e}")
        db.rollback()
    finally:
        db.close()

def seed_monitoring_stations():
    """Seed monitoring stations on major rivers"""
    stations_data = [
        # Sutlej River stations
        ("Sutlej at Harike", "Sutlej", 31.1656, 74.9619, "Firozpur", 248.0, 252.0, 255.0),
        ("Sutlej at Ganguwal", "Sutlej", 31.0500, 75.2000, "Ludhiana", 245.0, 249.0, 252.0),
        ("Sutlej at Ludhiana", "Sutlej", 30.9010, 75.8573, "Ludhiana", 242.0, 246.0, 249.0),
        
        # Beas River stations  
        ("Beas at Talagang", "Beas", 31.9167, 76.0167, "Hoshiarpur", 280.0, 284.0, 287.0),
        ("Beas at Sujanpur", "Beas", 31.8333, 76.5000, "Hoshiarpur", 275.0, 279.0, 282.0),
        ("Beas at Mirthal", "Beas", 31.4167, 75.3333, "Kapurthala", 230.0, 234.0, 237.0),
        
        # Ravi River stations
        ("Ravi at Madhopur", "Ravi", 32.0500, 75.5667, "Pathankot", 290.0, 294.0, 297.0),
        ("Ravi at Basantar", "Ravi", 32.2000, 75.4000, "Pathankot", 295.0, 299.0, 302.0),
        
        # Ghaggar River stations
        ("Ghaggar at Ottu", "Ghaggar", 30.2500, 76.4000, "Patiala", 210.0, 214.0, 217.0),
        ("Ghaggar at Sirsa", "Ghaggar", 29.5333, 75.0167, "Bathinda", 205.0, 209.0, 212.0),
        
        # Additional stations
        ("Choe at Kharar", "Choe", 30.7418, 76.6469, "Mohali", 300.0, 304.0, 307.0),
        ("Swan at Bajakhana", "Swan", 30.8000, 75.3000, "Hoshiarpur", 250.0, 254.0, 257.0),
    ]
    
    db = SessionLocal()
    try:
        for name, river, lat, lon, district, normal, warning, danger in stations_data:
            station = MonitoringStation(
                name=name,
                river_name=river,
                location=text(f"ST_Point({lon}, {lat})"),
                district=district,
                normal_level=normal,
                warning_level=warning,
                danger_level=danger,
                is_active=True
            )
            db.add(station)
        
        db.commit()
        print(f"Seeded {len(stations_data)} monitoring stations")
    except Exception as e:
        print(f"Error seeding stations: {e}")
        db.rollback()
    finally:
        db.close()

def seed_sample_data():
    """Seed sample water level and rainfall data"""
    db = SessionLocal()
    try:
        # Get all stations
        stations = db.query(MonitoringStation).all()
        
        # Generate sample water level data for last 48 hours
        for station in stations:
            base_time = datetime.utcnow() - timedelta(hours=48)
            
            for hour in range(48):
                timestamp = base_time + timedelta(hours=hour)
                
                # Generate realistic water levels with some variation
                base_level = station.normal_level
                variation = random.uniform(-2.0, 4.0)  # Some stations may be above normal
                level = base_level + variation
                
                # Determine status
                if level >= station.danger_level:
                    status = "danger"
                elif level >= station.warning_level:
                    status = "warning"
                else:
                    status = "normal"
                
                water_level = WaterLevel(
                    station_id=station.id,
                    level=level,
                    timestamp=timestamp,
                    status=status
                )
                db.add(water_level)
        
        # Generate sample rainfall data
        districts = [
            "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", 
            "Mohali", "Firozpur", "Hoshiarpur", "Kapurthala", "Faridkot"
        ]
        
        for district in districts:
            # Get district center (simplified)
            district_coords = {
                "Amritsar": (31.6340, 74.8723),
                "Ludhiana": (30.9010, 75.8573),
                "Jalandhar": (31.3260, 75.5762),
                "Patiala": (30.3398, 76.3869),
                "Bathinda": (30.2118, 74.9455),
                "Mohali": (30.7046, 76.7179),
                "Firozpur": (30.9328, 74.6122),
                "Hoshiarpur": (31.5344, 75.9119),
                "Kapurthala": (31.3800, 75.3800),
                "Faridkot": (30.6735, 74.7555),
            }
            
            if district in district_coords:
                lat, lon = district_coords[district]
                
                # Generate rainfall data for last 24 hours
                base_time = datetime.utcnow() - timedelta(hours=24)
                for hour in range(0, 24, 6):  # Every 6 hours
                    timestamp = base_time + timedelta(hours=hour)
                    rainfall = random.uniform(0, 15.0)  # 0-15mm rainfall
                    
                    rainfall_data = RainfallData(
                        district=district,
                        location=text(f"ST_Point({lon}, {lat})"),
                        rainfall_mm=rainfall,
                        duration_hours=6,
                        timestamp=timestamp
                    )
                    db.add(rainfall_data)
        
        # Generate sample flood forecasts
        high_risk_areas = [
            ("Firozpur", 30.9328, 74.6122, "high"),
            ("Ludhiana", 30.9010, 75.8573, "medium"),
            ("Kapurthala", 31.3800, 75.3800, "high"),
        ]
        
        forecast_time = datetime.utcnow() + timedelta(hours=24)
        
        for district, lat, lon, risk in high_risk_areas:
            # Create a sample flood area polygon
            polygon_wkt = f"POLYGON(({lon-0.1} {lat-0.1}, {lon+0.1} {lat-0.1}, {lon+0.1} {lat+0.1}, {lon-0.1} {lat+0.1}, {lon-0.1} {lat-0.1}))"
            
            forecast = FloodForecast(
                forecast_area=text(f"ST_GeomFromText('{polygon_wkt}', 4326)"),
                district=district,
                risk_level=risk,
                forecast_time=forecast_time,
                confidence=random.uniform(0.7, 0.95),
                affected_population=random.randint(1000, 50000)
            )
            db.add(forecast)
        
        db.commit()
        print("Seeded sample water level, rainfall, and forecast data")
        
    except Exception as e:
        print(f"Error seeding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting database seeding...")
    seed_districts()
    seed_monitoring_stations()
    seed_sample_data()
    print("Database seeding completed!")