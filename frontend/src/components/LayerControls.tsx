import React from 'react';

interface LayerControlsProps {
  showStations: boolean;
  showRainfall: boolean;
  showForecasts: boolean;
  onToggleStations: () => void;
  onToggleRainfall: () => void;
  onToggleForecasts: () => void;
  stationsCount: number;
  rainfallCount: number;
  forecastsCount: number;
}

const LayerControls: React.FC<LayerControlsProps> = ({
  showStations,
  showRainfall,
  showForecasts,
  onToggleStations,
  onToggleRainfall,
  onToggleForecasts,
  stationsCount,
  rainfallCount,
  forecastsCount,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-3">Data Layers</h3>
      
      <div className="space-y-3">
        {/* River Water Levels */}
        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-1"></div>
              <div className="w-3 h-3 rounded-full bg-amber-600 mr-1"></div>
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
            </div>
            <div>
              <div className="font-medium">River Water Levels</div>
              <div className="text-sm text-gray-500">{stationsCount} stations</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showStations}
              onChange={onToggleStations}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Rainfall Data */}
        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-3 h-3 bg-blue-300 mr-1"></div>
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <div className="w-3 h-3 bg-blue-800"></div>
            </div>
            <div>
              <div className="font-medium">Rainfall Data</div>
              <div className="text-sm text-gray-500">{rainfallCount} districts</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showRainfall}
              onChange={onToggleRainfall}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Flood Forecasts */}
        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-3 h-3 bg-green-200 border border-green-600 mr-1"></div>
              <div className="w-3 h-3 bg-yellow-200 border border-yellow-600 mr-1"></div>
              <div className="w-3 h-3 bg-red-200 border border-red-600"></div>
            </div>
            <div>
              <div className="font-medium">24h Flood Forecast</div>
              <div className="text-sm text-gray-500">{forecastsCount} areas predicted</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showForecasts}
              onChange={onToggleForecasts}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Toggle layers to show/hide on map</div>
          <div>Click markers for detailed information</div>
        </div>
      </div>
    </div>
  );
};

export default LayerControls;