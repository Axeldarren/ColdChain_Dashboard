"use client";
import AlertHistory from "@/components/alerts/AlertHistory";

export default function WarningAlertsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Warning Alerts</h1>
      <AlertHistory defaultTab="warning" />
    </div>
  );
}
