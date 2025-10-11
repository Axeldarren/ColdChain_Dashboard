"use client";
import AlertHistory from "@/components/alerts/AlertHistory";

export default function CriticalAlertsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Critical Alerts</h1>
      <AlertHistory defaultTab="critical" />
    </div>
  );
}
