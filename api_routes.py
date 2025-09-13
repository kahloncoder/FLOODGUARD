import json
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db

# Import mock data for development
try:
    import mock_data  # noqa: F401
    USE_MOCK_DATA = True
except ImportError:
    USE_MOCK_DATA = False

router = APIRouter()


@router.get("/stations")
async def get_monitoring_stations(db: Session = Depends(get_db)):
    """Get all active monitoring stations with their current water levels"""
    try:
        # Query stations with latest water level data
        query = text(
            """
            SELECT
                ms.id, ms.name, ms.river_name, ms.district,
                ST_X(ms.location) as longitude, ST_Y(ms.location) as latitude,
                ms.normal_level, ms.warning_level, ms.danger_level,
                COALESCE(wl.level, ms.normal_level) as current_level,
                COALESCE(wl.status, 'normal') as current_status,
                COALESCE(wl.timestamp, NOW()) as last_updated
            FROM monitoring_stations ms
            LEFT JOIN LATERAL (
                SELECT level, status, timestamp
                FROM water_levels
                WHERE station_id = ms.id
                ORDER BY timestamp DESC
                LIMIT 1
            ) wl ON true
            WHERE ms.is_active = true
            ORDER BY ms.name
        """
        )

        result = db.execute(query)
        stations = []

        for row in result:
            stations.append(
                {
                    "id": row.id,
                    "name": row.name,
                    "river": row.river_name,
                    "district": row.district,
                    "coordinates": [row.longitude, row.latitude],
                    "levels": {
                        "normal": row.normal_level,
                        "warning": row.warning_level,
                        "danger": row.danger_level,
                        "current": row.current_level,
                    },
                    "status": row.current_status,
                    "lastUpdated": (
                        row.last_updated.isoformat() if row.last_updated else None
                    ),
                }
            )

        return {"stations": stations}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching stations: {str(e)}"
        )


@router.get("/rainfall")
async def get_rainfall_data(hours: int = 24, db: Session = Depends(get_db)):
    """Get rainfall data for the last N hours"""
    try:
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)

        query = text(
            """
            SELECT
                district,
                ST_X(location) as longitude,
                ST_Y(location) as latitude,
                SUM(rainfall_mm) as total_rainfall,
                MAX(timestamp) as latest_timestamp
            FROM rainfall_data
            WHERE timestamp >= :cutoff_time
            GROUP BY district, ST_X(location), ST_Y(location)
            ORDER BY total_rainfall DESC
        """
        )

        result = db.execute(query, {"cutoff_time": cutoff_time})
        rainfall_data = []

        for row in result:
            intensity = "low"
            if row.total_rainfall > 50:
                intensity = "high"
            elif row.total_rainfall > 25:
                intensity = "medium"

            rainfall_data.append(
                {
                    "district": row.district,
                    "coordinates": [row.longitude, row.latitude],
                    "rainfall": row.total_rainfall,
                    "intensity": intensity,
                    "lastUpdated": (
                        row.latest_timestamp.isoformat()
                        if row.latest_timestamp
                        else None
                    ),
                }
            )

        return {"rainfall": rainfall_data}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching rainfall data: {str(e)}"
        )


@router.get("/forecast")
async def get_flood_forecast(db: Session = Depends(get_db)):
    """Get current 24-hour flood forecasts"""
    try:
        # Get forecasts for next 24 hours
        forecast_time = datetime.utcnow() + timedelta(hours=24)

        query = text(
            """
            SELECT
                district,
                risk_level,
                ST_AsGeoJSON(forecast_area) as area_geojson,
                forecast_time,
                confidence,
                affected_population,
                created_at
            FROM flood_forecasts
            WHERE forecast_time <= :forecast_time
            AND created_at >= NOW() - INTERVAL '24 hours'
            ORDER BY risk_level DESC, created_at DESC
        """
        )

        result = db.execute(query, {"forecast_time": forecast_time})
        forecasts = []

        for row in result:
            forecasts.append(
                {
                    "district": row.district,
                    "riskLevel": row.risk_level,
                    "area": json.loads(row.area_geojson),
                    "forecastTime": row.forecast_time.isoformat(),
                    "confidence": row.confidence,
                    "affectedPopulation": row.affected_population,
                    "createdAt": row.created_at.isoformat(),
                }
            )

        return {"forecasts": forecasts}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching forecasts: {str(e)}"
        )


@router.get("/alerts")
async def get_current_alerts(db: Session = Depends(get_db)):
    """Get top 5 high-risk areas for alerts panel"""
    try:
        # Combine current water levels and flood forecasts to determine highest risk areas
        query = text(
            """
            WITH station_risks AS (
                SELECT
                    ms.district,
                    CASE
                        WHEN wl.level >= ms.danger_level THEN 'danger'
                        WHEN wl.level >= ms.warning_level THEN 'warning'
                        ELSE 'normal'
                    END as risk_level,
                    wl.level,
                    ms.danger_level,
                    1 as priority_score
                FROM monitoring_stations ms
                LEFT JOIN LATERAL (
                    SELECT level, status, timestamp
                    FROM water_levels
                    WHERE station_id = ms.id
                    ORDER BY timestamp DESC
                    LIMIT 1
                ) wl ON true
                WHERE ms.is_active = true
            ),
            forecast_risks AS (
                SELECT
                    district,
                    risk_level,
                    CASE risk_level
                        WHEN 'critical' THEN 4
                        WHEN 'high' THEN 3
                        WHEN 'medium' THEN 2
                        ELSE 1
                    END as priority_score
                FROM flood_forecasts
                WHERE forecast_time <= NOW() + INTERVAL '24 hours'
                AND created_at >= NOW() - INTERVAL '2 hours'
            )
            SELECT
                district,
                MAX(priority_score) as max_priority,
                STRING_AGG(DISTINCT risk_level, ', ') as combined_risk
            FROM (
                SELECT district, risk_level, priority_score FROM station_risks WHERE risk_level != 'normal'
                UNION ALL
                SELECT district, risk_level, priority_score FROM forecast_risks
            ) combined
            GROUP BY district
            ORDER BY max_priority DESC, district
            LIMIT 5
        """
        )

        result = db.execute(query)
        alerts = []

        for row in result:
            alert_type = "high" if row.max_priority >= 3 else "medium"
            alerts.append(
                {
                    "district": row.district,
                    "type": alert_type,
                    "risks": row.combined_risk,
                    "priority": row.max_priority,
                }
            )

        return {"alerts": alerts}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching alerts: {str(e)}")


@router.get("/districts")
async def get_districts(db: Session = Depends(get_db)):
    """Get Punjab district boundaries"""
    try:
        query = text(
            """
            SELECT
                name,
                ST_AsGeoJSON(boundary) as boundary_geojson,
                population,
                area_sq_km
            FROM districts
            ORDER BY name
        """
        )

        result = db.execute(query)
        districts = []

        for row in result:
            districts.append(
                {
                    "name": row.name,
                    "boundary": json.loads(row.boundary_geojson),
                    "population": row.population,
                    "area": row.area_sq_km,
                }
            )

        return {"districts": districts}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching districts: {str(e)}"
        )
