import { TimeSeriesData } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface EnvironmentChartProps {
  data: TimeSeriesData[];
  title?: string;
  showHumidity?: boolean;
}

export default function EnvironmentChart({ 
  data, 
  title = 'Environmental Data', 
  showHumidity = true 
}: EnvironmentChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            stroke="#9ca3af"
            width={45}
          />
          {showHumidity && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#9ca3af"
              width={45}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={false}
            name="Temperature (°C)"
          />
          {showHumidity && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              name="Humidity (%)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
