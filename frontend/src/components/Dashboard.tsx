import React, { useState, useEffect } from 'react';
import FloodMap from './FloodMap';
import AlertPanel from './AlertPanel';
import LayerControls from './LayerControls';
import { apiClient } from '../utils/api';
import type { MonitoringStation, RainfallData, FloodForecast, Alert } from '../utils/api';

const Dashboard: React.FC = () => {
  // Data state
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [rainfall, setRainfall] = useState<RainfallData[]>([]);
  const [forecasts, setForecasts] = useState<FloodForecast[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Layer visibility states
  const [showStations, setShowStations] = useState(true);
  const [showRainfall, setShowRainfall] = useState(true);
  const [showForecasts, setShowForecasts] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [stationsData, rainfallData, forecastsData, alertsData] = await Promise.all([
        apiClient.getStations(),
        apiClient.getRainfallData(24),
        apiClient.getFloodForecasts(),
        apiClient.getAlerts(),
      ]);

      setStations(stationsData.stations);
      setRainfall(rainfallData.rainfall);
      setForecasts(forecastsData.forecasts);
      setAlerts(alertsData.alerts);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Get summary statistics
  const getStats = () => {
    const dangerStations = stations.filter(s => s.status === 'danger').length;
    const warningStations = stations.filter(s => s.status === 'warning').length;
    const highRiskForecasts = forecasts.filter(f => f.riskLevel === 'high' || f.riskLevel === 'critical').length;
    const totalRainfall = rainfall.reduce((sum, r) => sum + r.rainfall, 0);
    
    return {
      dangerStations,
      warningStations,
      highRiskForecasts,
      averageRainfall: rainfall.length > 0 ? (totalRainfall / rainfall.length).toFixed(1) : '0'
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Punjab Flood Monitoring System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time water levels, rainfall data, and 24-hour flood forecasting
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.dangerStations}</div>
              <div className="text-sm text-red-800">Stations at Danger Level</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{stats.warningStations}</div>
              <div className="text-sm text-amber-800">Stations at Warning Level</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.highRiskForecasts}</div>
              <div className="text-sm text-orange-800">High Risk Flood Areas</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.averageRainfall}mm</div>
              <div className="text-sm text-blue-800">Average Rainfall (24h)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-200px)] gap-4 p-4">
        {/* Left Sidebar */}
        <div className="w-80 space-y-4 overflow-y-auto">
          <AlertPanel alerts={alerts} isLoading={isLoading} />
          <LayerControls
            showStations={showStations}
            showRainfall={showRainfall}
            showForecasts={showForecasts}
            onToggleStations={() => setShowStations(!showStations)}
            onToggleRainfall={() => setShowRainfall(!showRainfall)}
            onToggleForecasts={() => setShowForecasts(!showForecasts)}
            stationsCount={stations.length}
            rainfallCount={rainfall.length}
            forecastsCount={forecasts.length}
          />
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading flood monitoring data...</p>
              </div>
            </div>
          ) : (
            <FloodMap
              stations={stations}
              rainfall={rainfall}
              forecasts={forecasts}
              showStations={showStations}
              showRainfall={showRainfall}
              showForecasts={showForecasts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;