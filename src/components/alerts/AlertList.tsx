"use client";

import { useEffect, useState } from "react";
import { useAlertFeed, Severity } from "./useAlertFeed";

function formatTs(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "warning" | "critical" | "metric" }) {
  const palette = {
    warning: "bg-amber-500/15 text-amber-300 border-amber-600/40",
    critical: "bg-rose-500/15 text-rose-300 border-rose-600/40",
    metric: "bg-sky-500/10 text-sky-300 border-sky-600/40",
  }[tone];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${palette}`}>{children}</span>;
}

export default function AlertList({ filter }: { filter?: Severity }) {
  const { items, acknowledge, clearAcknowledged, push } = useAlertFeed();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (window as unknown as { __pushAlert?: typeof push }).__pushAlert = push;
    return () => { delete (window as unknown as { __pushAlert?: typeof push }).__pushAlert; };
  }, [push]);

  if (!mounted) {
    return <div className="p-6 text-slate-400">Loading…</div>;
  }

  const filtered = (items ?? [])
    .filter((a) => (filter ? a.severity === filter : true))
    .sort((a, b) => b.ts - a.ts);

  if (!filtered.length) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400">
        No {filter ? filter : ""} alerts right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((a) => (
        <div
          key={a.id}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge tone={a.severity}>{a.severity.toUpperCase()}</Badge>
              <Badge tone="metric">{a.metric}</Badge>
              <span className="text-slate-400 text-xs">{formatTs(a.ts)}</span>
            </div>
            <div className="text-slate-200 text-sm">{a.message}</div>
            <div className="text-slate-400 text-xs">
              Location: <span className="text-slate-300">{a.location}</span> • Value:{" "}
              <span className="text-slate-300">
                {a.metric === "doorOpen" ? `${a.value}s` : a.metric === "humidity" ? `${a.value}%` : `${a.value}°C`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {a.acknowledged ? (
              <span className="text-xs text-slate-500 italic">Acknowledged</span>
            ) : (
              <button
                onClick={() => acknowledge(a.id)}
                className="rounded-lg px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => clearAcknowledged()}
          className="rounded-lg px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
        >
          Clear acknowledged
        </button>
      </div>
    </div>
  );
}
