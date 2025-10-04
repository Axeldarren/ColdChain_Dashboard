import { DeviceStats } from '@/types';

interface DeviceCardProps {
  device: DeviceStats;
  onClick?: () => void;
}

export default function DeviceCard({ device, onClick }: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500 dark:bg-red-600';
      case 'warning': return 'bg-orange-500 dark:bg-orange-600';
      case 'low': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'normal': return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {device.device_name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{device.device_name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{device.location}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(device.status)} text-white`}>
          {device.status}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Temperature */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Temp</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {device.current_temp.toFixed(1)}°
          </div>
        </div>

        {/* Humidity */}
        <div className="text-center border-x border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Humid</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {device.current_humidity}%
          </div>
        </div>

        {/* Power */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Power</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {device.power_consumption.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Door Status */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${device.is_door_open ? 'bg-red-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {device.is_door_open ? 'Door Open' : 'Door Closed'}
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(device.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
