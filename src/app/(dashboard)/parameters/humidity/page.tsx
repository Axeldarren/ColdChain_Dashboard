"use client";
import { useState } from "react";
import EnvironmentChart from "@/components/EnvironmentChart";
import DeviceCard from "@/components/DeviceCard";
import StatsCard from "@/components/StatsCard";
import { generateTimeSeriesData, dummyDeviceStats } from "@/data/dummyData";
import { Droplets, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function HumidityPage() {
  const [selectedDevice, setSelectedDevice] = useState("ARD-001");
  const [timeRange, setTimeRange] = useState("24h");

  const getHours = () => {
    switch (timeRange) {
      case "1h": return 1;
      case "24h": return 24;
      case "7d": return 168;
      default: return 24;
    }
  };

  const timeSeriesData = generateTimeSeriesData(selectedDevice, getHours());

  // Calculate statistics
  const humidityValues = timeSeriesData.map(d => d.humidity);
  const avgHumidity = (humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length).toFixed(0);
  const minHumidity = Math.min(...humidityValues).toFixed(0);
  const maxHumidity = Math.max(...humidityValues).toFixed(0);
  const currentHumidity = humidityValues[humidityValues.length - 1].toFixed(0);

  // Count devices by humidity status
  const criticalDevices = dummyDeviceStats.filter(d => 
    d.current_humidity > 75 || d.current_humidity < 45
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Humidity Monitoring
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time humidity tracking and analysis
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current Humidity"
          value={`${currentHumidity}%`}
          icon={Droplets}
          color="blue"
        />
        <StatsCard
          title="Average (24h)"
          value={`${avgHumidity}%`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Min / Max"
          value={`${minHumidity}% / ${maxHumidity}%`}
          icon={TrendingDown}
          color="purple"
        />
        <StatsCard
          title="Critical Alerts"
          value={criticalDevices}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Device Selector & Time Range */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Device:
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dummyDeviceStats.map((device) => (
                <option key={device.device_id} value={device.device_id}>
                  {device.device_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range:
            </label>
            <div className="flex gap-1">
              {["1h", "24h", "7d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Humidity Chart */}
      <EnvironmentChart
        data={timeSeriesData}
        title={`${dummyDeviceStats.find(d => d.device_id === selectedDevice)?.device_name || 'Device'} - Humidity Trend`}
        showHumidity={true}
      />

      {/* Humidity Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Optimal Humidity Levels
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Frozen Storage:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">50-65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Refrigerated:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">60-75%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Average:</span>
              <span className={`text-sm font-semibold ${
                Number(avgHumidity) >= 50 && Number(avgHumidity) <= 75
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {avgHumidity}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Humidity Impact
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Too high: Frost buildup and ice formation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Too low: Product dehydration and freezer burn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Optimal: Preserves product quality and energy efficiency</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Humidity Thresholds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Safe Humidity (%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="45"
              placeholder="45"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Safe Humidity (%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="75"
              placeholder="75"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Warning Tolerance (%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="5"
              placeholder="5"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Save Configuration
        </button>
      </div>

      {/* Device Status Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Devices Humidity Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dummyDeviceStats.map((device) => (
            <DeviceCard
              key={device.device_id}
              device={device}
              onClick={() => setSelectedDevice(device.device_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}