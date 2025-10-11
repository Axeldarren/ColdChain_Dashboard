"use client";

import { useEffect, useMemo, useState } from "react";

export type Severity = "warning" | "critical";
export type Metric = "temperature" | "humidity" | "doorOpen";

export type AlertItem = {
  id: string;
  ts: number;                        // epoch ms
  severity: Severity;
  metric: Metric;
  location: string;                  // e.g., "Warehouse North"
  value: number;                     // temp °C, humidity %, or seconds for door
  message: string;
  acknowledged?: boolean;
};

const KEY = "coldchain.alertFeed.v1";

/** seed a few examples the very first time so the pages aren't empty */
const SEED: AlertItem[] = [
  {
    id: "seed-1",
    ts: Date.now() - 1000 * 60 * 12,
    severity: "critical",
    metric: "temperature",
    location: "Warehouse South",
    value: -8.2,
    message: "Temperature -8.2°C (critical) at Warehouse South",
  },
  {
    id: "seed-2",
    ts: Date.now() - 1000 * 60 * 55,
    severity: "warning",
    metric: "doorOpen",
    location: "Storage Area",
    value: 54,
    message: "Door open 54s (warning) at Storage Area",
  },
];

function read(): AlertItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(items: AlertItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useAlertFeed() {
  const [items, setItems] = useState<AlertItem[]>([]);

  useEffect(() => {
    setItems(read());
  }, []);

  const api = useMemo(() => {
    return {
      refresh() {
        setItems(read());
      },
      acknowledge(id: string) {
        const next = read().map((a) =>
          a.id === id ? { ...a, acknowledged: true } : a
        );
        write(next);
        setItems(next);
      },
      clearAcknowledged() {
        const next = read().filter((a) => !a.acknowledged);
        write(next);
        setItems(next);
      },
      /** Helper for manual testing in the console */
      push(test: Omit<AlertItem, "id" | "ts"> & { id?: string; ts?: number }) {
        const next = [{ id: crypto.randomUUID(), ts: Date.now(), ...test }, ...read()];
        write(next as AlertItem[]);
        setItems(next as AlertItem[]);
      },
    };
  }, []);

  return { items, ...api };
}

// --- below the useAlertFeed() export --- //

export type DateRange = { start?: number | null; end?: number | null };

export function filterByRange(items: AlertItem[], range: DateRange) {
  const { start, end } = range || {};
  return items.filter(a => {
    if (start && a.ts < start) return false;
    if (end && a.ts > end) return false;
    return true;
  });
}

export function summarize(items: AlertItem[]) {
  const bySeverity = { warning: 0, critical: 0 } as Record<Severity, number>;
  const byMetric: Record<Metric, number> = { temperature: 0, humidity: 0, doorOpen: 0 };
  const byLocation: Record<string, number> = {};
  for (const a of items) {
    bySeverity[a.severity]++; 
    byMetric[a.metric]++; 
    byLocation[a.location] = (byLocation[a.location] ?? 0) + 1;
  }
  return { total: items.length, bySeverity, byMetric, byLocation };
}

export function toCSV(items: AlertItem[]): string {
  const hdr = ["id","timestamp","severity","metric","location","value","message","acknowledged"];
  const rows = items.map(a => [
    a.id,
    new Date(a.ts).toISOString(),
    a.severity,
    a.metric,
    a.location,
    a.value,
    a.message.replace(/"/g,'""'),
    a.acknowledged ? "yes" : "no",
  ]);
  const esc = (x: unknown) => `"${String(x ?? "").replace(/"/g,'""')}"`;
  return [hdr.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))].join("\n");
}
