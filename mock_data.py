"""
Mock data for development without database
"""
from datetime import datetime, timedelta
import json

# Mock monitoring stations
MOCK_STATIONS = [
    {
        "id": 1,
        "name": "Sutlej at Harike",
        "river": "Sutlej",
        "district": "Firozpur",
        "coordinates": [74.9619, 31.1656],
        "levels": {
            "normal": 248.0,
            "warning": 252.0,
            "danger": 255.0,
            "current": 253.5  # Warning level
        },
        "status": "warning",
        "lastUpdated": (datetime.now() - timedelta(minutes=15)).isoformat()
    },
    {
        "id": 2,
        "name": "Beas at Talagang",
        "river": "Beas",
        "district": "Hoshiarpur",
        "coordinates": [76.0167, 31.9167],
        "levels": {
            "normal": 280.0,
            "warning": 284.0,
            "danger": 287.0,
            "current": 285.2  # Warning level
        },
        "status": "warning",
        "lastUpdated": (datetime.now() - timedelta(minutes=10)).isoformat()
    },
    {
        "id": 3,
        "name": "Sutlej at Ludhiana",
        "river": "Sutlej",
        "district": "Ludhiana",
        "coordinates": [75.8573, 30.9010],
        "levels": {
            "normal": 242.0,
            "warning": 246.0,
            "danger": 249.0,
            "current": 250.1  # Danger level
        },
        "status": "danger",
        "lastUpdated": (datetime.now() - timedelta(minutes=5)).isoformat()
    },
    {
        "id": 4,
        "name": "Ravi at Madhopur",
        "river": "Ravi",
        "district": "Pathankot",
        "coordinates": [75.5667, 32.0500],
        "levels": {
            "normal": 290.0,
            "warning": 294.0,
            "danger": 297.0,
            "current": 291.5  # Normal level
        },
        "status": "normal",
        "lastUpdated": (datetime.now() - timedelta(minutes=20)).isoformat()
    }
]

# Mock rainfall data
MOCK_RAINFALL = [
    {
        "district": "Ludhiana",
        "coordinates": [75.8573, 30.9010],
        "rainfall": 45.2,
        "intensity": "high",
        "lastUpdated": (datetime.now() - timedelta(hours=1)).isoformat()
    },
    {
        "district": "Firozpur", 
        "coordinates": [74.6122, 30.9328],
        "rainfall": 32.1,
        "intensity": "medium",
        "lastUpdated": (datetime.now() - timedelta(hours=2)).isoformat()
    },
    {
        "district": "Hoshiarpur",
        "coordinates": [75.9119, 31.5344],
        "rainfall": 28.5,
        "intensity": "medium", 
        "lastUpdated": (datetime.now() - timedelta(hours=1)).isoformat()
    },
    {
        "district": "Pathankot",
        "coordinates": [75.6411, 32.2746],
        "rainfall": 15.3,
        "intensity": "low",
        "lastUpdated": (datetime.now() - timedelta(hours=3)).isoformat()
    },
    {
        "district": "Jalandhar",
        "coordinates": [75.5762, 31.3260],
        "rainfall": 38.7,
        "intensity": "high",
        "lastUpdated": (datetime.now() - timedelta(hours=1)).isoformat()
    }
]

# Mock flood forecasts
MOCK_FORECASTS = [
    {
        "district": "Ludhiana",
        "riskLevel": "high",
        "area": {
            "type": "Polygon",
            "coordinates": [[
                [75.7573, 30.8010],
                [75.9573, 30.8010], 
                [75.9573, 31.0010],
                [75.7573, 31.0010],
                [75.7573, 30.8010]
            ]]
        },
        "forecastTime": (datetime.now() + timedelta(hours=24)).isoformat(),
        "confidence": 0.85,
        "affectedPopulation": 25000,
        "createdAt": datetime.now().isoformat()
    },
    {
        "district": "Firozpur",
        "riskLevel": "medium",
        "area": {
            "type": "Polygon",
            "coordinates": [[
                [74.5122, 30.8328],
                [74.7122, 30.8328],
                [74.7122, 31.0328], 
                [74.5122, 31.0328],
                [74.5122, 30.8328]
            ]]
        },
        "forecastTime": (datetime.now() + timedelta(hours=24)).isoformat(),
        "confidence": 0.72,
        "affectedPopulation": 15000,
        "createdAt": datetime.now().isoformat()
    }
]

# Mock alerts
MOCK_ALERTS = [
    {
        "district": "Ludhiana",
        "type": "high",
        "risks": "danger, high", 
        "priority": 4
    },
    {
        "district": "Firozpur", 
        "type": "medium",
        "risks": "warning, medium",
        "priority": 3
    },
    {
        "district": "Hoshiarpur",
        "type": "medium", 
        "risks": "warning, medium",
        "priority": 3
    }
]
