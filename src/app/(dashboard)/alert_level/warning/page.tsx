"use client";
import AlertHistory from "@/components/alerts/AlertHistory";

export default function WarningAlertsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Warning Alerts</h1>
      <AlertHistory defaultTab="warning" />
    </div>
  );
}
