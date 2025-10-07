"use client";
import { useState } from "react";
import EnvironmentChart from "@/components/EnvironmentChart";
import { generateTimeSeriesData, dummyDeviceStats } from "@/data/dummyData";
import { TrendingUp, Calendar, Download } from "lucide-react";

export default function AnalyticsPage() {
  const [selectedDevice, setSelectedDevice] = useState("ARD-001");
  const [timeRange, setTimeRange] = useState("24h");

  const getHours = () => {
    switch (timeRange) {
      case "1h": return 1;
      case "24h": return 24;
      case "7d": return 168;
      case "30d": return 720;
      default: return 24;
    }
  };

  const timeSeriesData = generateTimeSeriesData(selectedDevice, getHours());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Historical data analysis and trends
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Device Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Device:</label>
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

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              {["1h", "24h", "7d", "30d"].map((range) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <EnvironmentChart
          data={timeSeriesData}
          title={`${dummyDeviceStats.find(d => d.device_id === selectedDevice)?.device_name || 'Device'} - Temperature & Humidity Trends`}
          showHumidity={true}
        />

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Temperature</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">-18.5°C</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Within safe range</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg Humidity</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">64%</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Optimal levels</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">99.8%</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Excellent performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}