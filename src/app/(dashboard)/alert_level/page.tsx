"use client";
import AlertHistory from "@/components/alerts/AlertHistory";

export default function AlertLevelIndex() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Alert History</h1>
      <AlertHistory defaultTab="all" />
    </div>
  );
}
