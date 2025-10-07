"use client";
import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import { dummyDeviceStats } from "@/data/dummyData";
import { Activity, Filter } from "lucide-react";

export default function MonitorPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredDevices = dummyDeviceStats.filter(device => {
    if (filterStatus === "all") return true;
    return device.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Real-time Monitor
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Live device status and monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Updates
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          <div className="flex gap-2">
            {["all", "normal", "warning", "critical"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDevices.map((device) => (
          <DeviceCard
            key={device.device_id}
            device={device}
            onClick={() => console.log('Device selected:', device.device_id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No devices found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more devices
          </p>
        </div>
      )}
    </div>
  );
}