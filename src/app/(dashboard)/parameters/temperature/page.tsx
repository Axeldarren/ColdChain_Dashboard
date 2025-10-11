"use client";
import { useState } from "react";
import EnvironmentChart from "@/components/EnvironmentChart";
import DeviceCard from "@/components/DeviceCard";
import StatsCard from "@/components/StatsCard";
import { generateTimeSeriesData, dummyDeviceStats } from "@/data/dummyData";
import { Thermometer, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function TemperaturePage() {
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
  const temperatures = timeSeriesData.map(d => d.temperature);
  const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1);
  const minTemp = Math.min(...temperatures).toFixed(1);
  const maxTemp = Math.max(...temperatures).toFixed(1);
  const currentTemp = temperatures[temperatures.length - 1].toFixed(1);

  // Count devices by temperature status
  const criticalDevices = dummyDeviceStats.filter(d => 
    d.current_temp > 8 || d.current_temp < -25
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Temperature Monitoring
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time temperature tracking and analysis
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Current Temperature"
          value={`${currentTemp}°C`}
          icon={Thermometer}
          color="orange"
        />
        <StatsCard
          title="Average (24h)"
          value={`${avgTemp}°C`}
          icon={TrendingUp}
          color="blue"
        />
        <StatsCard
          title="Min / Max"
          value={`${minTemp}° / ${maxTemp}°`}
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

      {/* Temperature Chart */}
      <EnvironmentChart
        data={timeSeriesData}
        title={`${dummyDeviceStats.find(d => d.device_id === selectedDevice)?.device_name || 'Device'} - Temperature Trend`}
        showHumidity={false}
      />

      {/* Threshold Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Temperature Thresholds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Safe Temperature (°C)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="-25"
              placeholder="-25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Safe Temperature (°C)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="-15"
              placeholder="-15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Warning Tolerance (°C)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="2"
              placeholder="2"
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
          All Devices Temperature Status
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