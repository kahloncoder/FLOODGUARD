import axios from 'axios';

// Get the backend API URL from environment or use localhost for development
a const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface MonitoringStation {
  id: number;
  name: string;
  river: string;
  district: string;
  coordinates: [number, number]; // [longitude, latitude]
  levels: {
    normal: number;
    warning: number;
    danger: number;
    current: number;
  };
  status: 'normal' | 'warning' | 'danger';
  lastUpdated: string;
}

export interface RainfallData {
  district: string;
  coordinates: [number, number];
  rainfall: number;
  intensity: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface FloodForecast {
  district: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  area: GeoJSON.Geometry;
  forecastTime: string;
  confidence: number;
  affectedPopulation: number;
  createdAt: string;
}

export interface Alert {
  district: string;
  type: 'high' | 'medium';
  risks: string;
  priority: number;
}

export interface District {
  name: string;
  boundary: GeoJSON.Geometry;
  population: number;
  area: number;
}

// API functions
export const apiClient = {
  // Get monitoring stations with current water levels
  getStations: async (): Promise<{ stations: MonitoringStation[] }> => {
    const response = await api.get('/stations');
    return response.data;
  },

  // Get rainfall data for the last N hours
  getRainfallData: async (hours: number = 24): Promise<{ rainfall: RainfallData[] }> => {
    const response = await api.get(`/rainfall?hours=${hours}`);
    return response.data;
  },

  // Get current flood forecasts
  getFloodForecasts: async (): Promise<{ forecasts: FloodForecast[] }> => {
    const response = await api.get('/forecast');
    return response.data;
  },

  // Get current high-risk alerts
  getAlerts: async (): Promise<{ alerts: Alert[] }> => {
    const response = await api.get('/alerts');
    return response.data;
  },

  // Get district boundaries
  getDistricts: async (): Promise<{ districts: District[] }> => {
    const response = await api.get('/districts');
    return response.data;
  },
};

// Helper function to get station marker color based on status
export const getStationColor = (status: string): string => {
  switch (status) {
    case 'danger':
      return '#dc2626'; // red-600
    case 'warning':
      return '#d97706'; // amber-600
    case 'normal':
    default:
      return '#059669'; // emerald-600
  }
};

// Helper function to get rainfall intensity color
export const getRainfallColor = (intensity: string): string => {
  switch (intensity) {
    case 'high':
      return '#1e40af'; // blue-800
    case 'medium':
      return '#3b82f6'; // blue-500
    case 'low':
    default:
      return '#93c5fd'; // blue-300
  }
};

// Helper function to format timestamps
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};