import { Alert } from '@/types';
import { AlertCircle, AlertTriangle, Info, Circle } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: number) => void;
}

export default function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'warning': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'info': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Circle;
    }
  };
  
  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h2>
        {unacknowledgedAlerts.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unacknowledgedAlerts.length}
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const IconComponent = getSeverityIcon(alert.severity);
            return (
              <div
                key={alert.id}
                className={`border-l-4 rounded-lg p-3 ${getSeverityColor(alert.severity)} ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 ${getSeverityIconColor(alert.severity)}`} />
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{alert.device_name}</span>
                      <span className="text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        {alert.alert_type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>Value: {alert.value}</span>
                      <span>•</span>
                      <span>Threshold: {alert.threshold}</span>
                    </div>
                  </div>
                  {!alert.acknowledged && onAcknowledge && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="ml-3 px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
