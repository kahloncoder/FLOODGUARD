import React from 'react';
import type { Alert } from '../utils/api';

interface AlertPanelProps {
  alerts: Alert[];
  isLoading: boolean;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-3">High Risk Areas</h3>
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
        High Risk Areas
      </h3>
      
      {alerts.length === 0 ? (
        <div className="text-gray-500 text-sm py-4 text-center">
          <div className="inline-block w-8 h-8 bg-green-100 rounded-full mb-2 flex items-center justify-center">
            <span className="text-green-600 text-lg">✓</span>
          </div>
          <div>All areas are currently safe</div>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-panel ${
                alert.type === 'high' ? 'alert-high' : 'alert-medium'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{alert.district}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.risks}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      alert.type === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {alert.type === 'high' ? 'HIGH RISK' : 'MEDIUM RISK'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {alerts.length < 5 && (
            <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
              Showing top {alerts.length} risk areas
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;