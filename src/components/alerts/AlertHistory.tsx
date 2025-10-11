"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAlertFeed,
  DateRange,
  filterByRange,
  summarize,
  toCSV,
} from "./useAlertFeed";

type Tab = "all" | "critical" | "warning";

export default function AlertHistory({ defaultTab = "all" as Tab }) {
  const { items, acknowledge, clearAcknowledged } = useAlertFeed();

  // range state (persist in URL and localStorage)
  const now = Date.now();
  const [from, setFrom] = useState<string>(() => {
    const d = new Date(now - 24 * 3600 * 1000);
    return toLocalInput(d);
  });
  const [to, setTo] = useState<string>(() => toLocalInput(new Date(now)));
  const [tab, setTab] = useState<Tab>(defaultTab);

  // mounted guard (CSR only)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const range: DateRange = useMemo(() => {
    const start = from ? Date.parse(from) : null;
    const end = to ? Date.parse(to) : null;
    return { start, end };
  }, [from, to]);

  const filtered = useMemo(() => {
    let list = filterByRange(items, range);
    if (tab !== "all") list = list.filter(a => a.severity === tab);
    return list.sort((a,b) => b.ts - a.ts);
  }, [items, range, tab]);

  const stats = useMemo(() => summarize(filtered), [filtered]);

  if (!mounted) return <div className="p-6 text-slate-400">Loading…</div>;

  const exportCSV = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alerts_${tab}_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quick = (hours: number) => {
    setFrom(toLocalInput(new Date(Date.now() - hours * 3600 * 1000)));
    setTo(toLocalInput(new Date()));
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <TabBtn active={tab === "all"} onClick={() => setTab("all")}>All</TabBtn>
        <TabBtn active={tab === "critical"} tone="critical" onClick={() => setTab("critical")}>
          Critical
        </TabBtn>
        <TabBtn active={tab === "warning"} tone="warning" onClick={() => setTab("warning")}>
          Warning
        </TabBtn>
        <div className="flex-1" />
        <button
          onClick={exportCSV}
          className="px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">From</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">To</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-end gap-2">
          <QuickBtn onClick={() => quick(24)}>Last 24h</QuickBtn>
          <QuickBtn onClick={() => quick(72)}>Last 72h</QuickBtn>
          <QuickBtn onClick={() => quick(24*7)}>Last 7d</QuickBtn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-3">
        <Stat title="Total" value={stats.total} />
        <Stat title="Critical" value={stats.bySeverity.critical} tone="critical" />
        <Stat title="Warning" value={stats.bySeverity.warning} tone="warning" />
        <Stat title="Unique locations" value={Object.keys(stats.byLocation).length} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <Th>Time</Th>
              <Th>Severity</Th>
              <Th>Metric</Th>
              <Th>Location</Th>
              <Th className="text-right">Value</Th>
              <Th>Message</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No alerts in this range.
                </td>
              </tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id} className="bg-slate-900/40 hover:bg-slate-900/60">
                  <Td>{new Date(a.ts).toLocaleString()}</Td>
                  <Td>
                    <Badge tone={a.severity}>{a.severity}</Badge>
                  </Td>
                  <Td><Badge tone="metric">{a.metric}</Badge></Td>
                  <Td className="whitespace-nowrap">{a.location}</Td>
                  <Td className="text-right">
                    {a.metric === "doorOpen" ? `${a.value}s` : a.metric === "humidity" ? `${a.value}%` : `${a.value}°C`}
                  </Td>
                  <Td className="max-w-[360px] truncate" title={a.message}>{a.message}</Td>
                  <Td className="text-right">
                    {a.acknowledged ? (
                      <span className="text-xs text-slate-500 italic">Ack</span>
                    ) : (
                      <button
                        onClick={() => acknowledge(a.id)}
                        className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700"
                      >
                        Acknowledge
                      </button>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => clearAcknowledged()}
          className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300"
        >
          Clear acknowledged
        </button>
      </div>
    </div>
  );
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "warning" | "critical" | "metric" }) {
  const palette = {
    warning: "bg-amber-500/15 text-amber-300 border-amber-600/40",
    critical: "bg-rose-500/15 text-rose-300 border-rose-600/40",
    metric: "bg-sky-500/10 text-sky-300 border-sky-600/40",
  }[tone];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${palette}`}>{children}</span>;
}

function Stat({ title, value, tone }: { title: string; value: number; tone?: "warning" | "critical" }) {
  const palette = tone === "critical"
    ? "bg-rose-500/10 text-rose-200"
    : tone === "warning"
    ? "bg-amber-500/10 text-amber-200"
    : "bg-slate-800 text-slate-200";
  return (
    <div className={`rounded-xl border border-slate-800 p-4 ${palette}`}>
      <div className="text-xs opacity-80">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function QuickBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700">
      {children}
  </button>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-medium text-left ${className}`}>{children}</th>;
}
function Td({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return <td className={`px-3 py-2 text-slate-200 ${className}`} title={title}>{children}</td>;
}
function TabBtn({ active, children, tone, onClick }:{ active:boolean; children:React.ReactNode; tone?:"critical"|"warning"; onClick:()=>void }) {
  const base = "px-3 py-1.5 rounded-lg border transition";
  const activeCls = tone==="critical"
    ? "bg-rose-500/20 border-rose-600/40 text-rose-100"
    : tone==="warning"
    ? "bg-amber-500/20 border-amber-600/40 text-amber-100"
    : "bg-slate-800 border-slate-700 text-slate-100";
  const idle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";
  return <button onClick={onClick} className={`${base} ${active ? activeCls : idle}`}>{children}</button>;
}
