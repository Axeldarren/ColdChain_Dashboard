"use client";
import { useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import AlertsPanel from "@/components/AlertsPanel";
import EnvironmentChart from "@/components/EnvironmentChart";
import DoorEventsTable from "@/components/DoorEventsTable";
import StatsCard from "@/components/StatsCard";
import {
  dummyDeviceStats,
  dummyAlerts,
  generateTimeSeriesData,
  dummyDoorEvents,
  dummySummary,
} from "@/data/dummyData";
import { Thermometer, DoorOpen, Smartphone, AlertTriangle } from "lucide-react";

export default function HomePage() {
  const [selectedDevice, setSelectedDevice] = useState("ARD-001");
  const [alerts, setAlerts] = useState(dummyAlerts);

  const handleAcknowledgeAlert = (alertId: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const timeSeriesData = generateTimeSeriesData(selectedDevice, 24);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Real-time cold chain monitoring system
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Devices"
          value={dummySummary.active_devices}
          icon={Smartphone}
          color="blue"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Critical Alerts"
          value={dummySummary.critical_alerts}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Avg Temperature"
          value={`${dummySummary.average_temperature.toFixed(1)}°C`}
          icon={Thermometer}
          color="orange"
        />
        <StatsCard
          title="Door Openings Today"
          value={dummySummary.total_door_openings_today}
          icon={DoorOpen}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - 2 columns */}
        <div className="lg:col-span-2">
          <EnvironmentChart
            data={timeSeriesData}
            title={`${dummyDeviceStats.find(d => d.device_id === selectedDevice)?.device_name || 'Device'} - Last 24 Hours`}
            showHumidity={true}
          />
        </div>

        {/* Alerts Panel - 1 column */}
        <div className="lg:col-span-1">
          <AlertsPanel
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
          />
        </div>
      </div>

      {/* Device Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device Status
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

      {/* Door Events Table */}
      <DoorEventsTable events={dummyDoorEvents} />
    </div>
  );
}