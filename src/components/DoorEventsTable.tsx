import { DoorEvent } from '@/types';

interface DoorEventsTableProps {
  events: DoorEvent[];
}

export default function DoorEventsTable({ events }: DoorEventsTableProps) {
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return 'Ongoing';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Door Events</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Device</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Location</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Opened</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Duration</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 px-3 text-sm font-medium text-gray-900 dark:text-white">
                  {event.device_name}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                  {event.location}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(event.opened_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                  {formatDuration(event.duration)}
                </td>
                <td className="py-3 px-3">
                  {event.closed_at ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Closed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 animate-pulse">
                      Open
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
