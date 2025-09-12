import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import { divIcon, LatLngBounds } from 'leaflet';
import { 
  getStationColor, 
  getRainfallColor,
  formatTimestamp 
} from '../utils/api';
import type { 
  MonitoringStation, 
  RainfallData, 
  FloodForecast 
} from '../utils/api';

// Punjab region bounds [southWest, northEast]
const PUNJAB_BOUNDS: [[number, number], [number, number]] = [
  [29.5, 73.5], // Southwest corner
  [32.8, 77.0]  // Northeast corner
];

// Custom icons for monitoring stations
const createStationIcon = (status: string, size = 'medium') => {
  const color = getStationColor(status);
  const sizeMap = {
    small: 20,
    medium: 30,
    large: 40
  };
  const iconSize = sizeMap[size as keyof typeof sizeMap];
  
  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${iconSize}px;
        height: ${iconSize}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          width: ${iconSize * 0.4}px;
          height: ${iconSize * 0.4}px;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2]
  });
};

// Component to fit map to Punjab bounds
const FitToPunjab: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    const bounds = new LatLngBounds(PUNJAB_BOUNDS[0], PUNJAB_BOUNDS[1]);
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map]);
  
  return null;
};

interface FloodMapProps {
  stations: MonitoringStation[];
  rainfall: RainfallData[];
  forecasts: FloodForecast[];
  showStations: boolean;
  showRainfall: boolean;
  showForecasts: boolean;
}

const FloodMap: React.FC<FloodMapProps> = ({
  stations,
  rainfall,
  forecasts,
  showStations,
  showRainfall,
  showForecasts
}) => {
  // Get forecast polygon style based on risk level
  const getForecastStyle = (riskLevel: string) => {
    const baseStyle = {
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
    };
    
    switch (riskLevel) {
      case 'critical':
        return { ...baseStyle, color: '#dc2626', fillColor: '#fca5a5' };
      case 'high':
        return { ...baseStyle, color: '#d97706', fillColor: '#fde68a' };
      case 'medium':
        return { ...baseStyle, color: '#ca8a04', fillColor: '#fef3c7' };
      case 'low':
      default:
        return { ...baseStyle, color: '#059669', fillColor: '#bbf7d0' };
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[31.0, 75.5]} // Center of Punjab
        zoom={8}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <FitToPunjab />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Monitoring Stations */}
        {showStations && stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates[1], station.coordinates[0]]} // [lat, lon]
            icon={createStationIcon(station.status)}
          >
            <Popup>
              <div className="p-3 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{station.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">River:</span>
                    <span className="font-semibold">{station.river}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span>{station.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Level:</span>
                    <span className="font-semibold">{station.levels.current.toFixed(2)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      station.status === 'danger' ? 'text-red-600' :
                      station.status === 'warning' ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {station.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-gray-500">Normal</div>
                        <div className="font-medium">{station.levels.normal}m</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Warning</div>
                        <div className="font-medium text-amber-600">{station.levels.warning}m</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Danger</div>
                        <div className="font-medium text-red-600">{station.levels.danger}m</div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Last updated: {formatTimestamp(station.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rainfall Data */}
        {showRainfall && rainfall.map((data, index) => {
          const color = getRainfallColor(data.intensity);
          const size = data.intensity === 'high' ? 'large' : 
                      data.intensity === 'medium' ? 'medium' : 'small';
          
          const rainfallIcon = divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: ${size === 'large' ? 25 : size === 'medium' ? 20 : 15}px;
                height: ${size === 'large' ? 25 : size === 'medium' ? 20 : 15}px;
                border-radius: 2px;
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                opacity: 0.8;
              "></div>
            `,
            className: 'rainfall-icon',
            iconSize: [size === 'large' ? 25 : size === 'medium' ? 20 : 15, 
                      size === 'large' ? 25 : size === 'medium' ? 20 : 15],
            iconAnchor: [size === 'large' ? 12 : size === 'medium' ? 10 : 7, 
                        size === 'large' ? 12 : size === 'medium' ? 10 : 7]
          });

          return (
            <Marker
              key={`rainfall-${index}`}
              position={[data.coordinates[1], data.coordinates[0]]}
              icon={rainfallIcon}
            >
              <Popup>
                <div className="p-3">
                  <h3 className="font-bold mb-2">{data.district} District</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rainfall:</span>
                      <span className="font-semibold">{data.rainfall.toFixed(1)}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intensity:</span>
                      <span className={`font-semibold capitalize ${
                        data.intensity === 'high' ? 'text-blue-800' :
                        data.intensity === 'medium' ? 'text-blue-600' :
                        'text-blue-400'
                      }`}>
                        {data.intensity}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Last updated: {formatTimestamp(data.lastUpdated)}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Flood Forecast Polygons */}
        {showForecasts && forecasts.map((forecast, index) => (
          <GeoJSON
            key={`forecast-${index}`}
            data={forecast.area}
            style={getForecastStyle(forecast.riskLevel)}
          >
            <Popup>
              <div className="p-3">
                <h3 className="font-bold mb-2">Flood Forecast - {forecast.district}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className={`font-semibold capitalize ${
                      forecast.riskLevel === 'critical' ? 'text-red-600' :
                      forecast.riskLevel === 'high' ? 'text-orange-600' :
                      forecast.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {forecast.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold">{(forecast.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affected Population:</span>
                    <span className="font-semibold">{forecast.affectedPopulation.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Forecast for: {formatTimestamp(forecast.forecastTime)}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </GeoJSON>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h4 className="font-bold mb-2">Legend</h4>
        
        {showStations && (
          <div className="mb-2">
            <div className="text-sm font-medium mb-1">Water Levels</div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span>Danger</span>
              </div>
            </div>
          </div>
        )}

        {showRainfall && (
          <div className="mb-2">
            <div className="text-sm font-medium mb-1">Rainfall Intensity</div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-300"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-800"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        )}

        {showForecasts && (
          <div>
            <div className="text-sm font-medium mb-1">Flood Risk</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 border border-green-600"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-200 border border-yellow-600"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-200 border border-orange-600"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 border border-red-600"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloodMap;