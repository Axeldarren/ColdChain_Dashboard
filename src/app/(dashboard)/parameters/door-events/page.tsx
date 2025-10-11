"use client";
import { useState } from "react";
import DoorEventsTable from "@/components/DoorEventsTable";
import StatsCard from "@/components/StatsCard";
import { dummyDoorEvents, dummyDeviceStats } from "@/data/dummyData";
import { DoorOpen, Clock, AlertTriangle, TrendingUp } from "lucide-react";

export default function DoorEventsPage() {
  const [filterDevice, setFilterDevice] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredEvents = dummyDoorEvents.filter(event => {
    const deviceMatch = filterDevice === "all" || event.device_id === filterDevice;
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "open" && event.closed_at === null) ||
      (filterStatus === "closed" && event.closed_at !== null);
    return deviceMatch && statusMatch;
  });

  // Calculate statistics
  const totalEvents = dummyDoorEvents.length;
  const openEvents = dummyDoorEvents.filter(e => e.closed_at === null).length;
  const avgDuration = Math.round(
    dummyDoorEvents
      .filter(e => e.duration !== null)
      .reduce((sum, e) => sum + (e.duration || 0), 0) / 
    dummyDoorEvents.filter(e => e.duration !== null).length
  );
  const longDurationEvents = dummyDoorEvents.filter(e => (e.duration || 0) > 60).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Door Events
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor door opening and closing events across all devices
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Events Today"
          value={totalEvents}
          icon={DoorOpen}
          color="blue"
        />
        <StatsCard
          title="Currently Open"
          value={openEvents}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Avg Duration"
          value={`${avgDuration}s`}
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Long Duration (>60s)"
          value={longDurationEvents}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Device Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Device:
            </label>
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Devices</option>
              {dummyDeviceStats.map((device) => (
                <option key={device.device_id} value={device.device_id}>
                  {device.device_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status:
            </label>
            <div className="flex gap-1">
              {["all", "open", "closed"].map((status) => (
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
          </div>

          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alert Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Door Open Duration (seconds)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="60"
              placeholder="60"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Alert when door is open longer than this duration
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Opening Limit
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue="50"
              placeholder="50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Alert when daily openings exceed this number
            </p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Save Configuration
        </button>
      </div>

      {/* Events Table */}
      <DoorEventsTable events={filteredEvents} />

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <DoorOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No door events found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more events
          </p>
        </div>
      )}
    </div>
  );
}