"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAlertFeed,
  DateRange,
  filterByRange,
  summarize,
  toCSV,
} from "./useAlertFeed";
import { fmtTime, fmtValue, cls } from "./ui";

type Tab = "all" | "critical" | "warning";

export default function AlertHistory({ defaultTab = "all" as Tab }) {
  const { items, acknowledge, clearAcknowledged } = useAlertFeed();
  const now = Date.now();
  const [from, setFrom] = useState<string>(() => toLocalInput(new Date(now - 24*3600*1000)));
  const [to, setTo] = useState<string>(() => toLocalInput(new Date(now)));
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [groupByDay, setGroupByDay] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Do not early-return before hooks below; preserve hook order across renders

  const range: DateRange = useMemo(() => {
    const start = from ? Date.parse(from) : null;
    const end = to ? Date.parse(to) : null;
    return { start, end };
  }, [from, to]);

  const base = useMemo(() => {
    let list = filterByRange(items, range);
    if (tab !== "all") list = list.filter(a => a.severity === tab);
    return list.sort((a,b) => b.ts - a.ts);
  }, [items, range, tab]);

  const stats = useMemo(() => summarize(base), [base]);

  const sections = useMemo(() => {
    if (!groupByDay) return { All: base };
    const out: Record<string, typeof base> = {};
    for (const a of base) {
      const d = new Date(a.ts);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` ;
      (out[key] ??= []).push(a);
    }
    return out;
  }, [base, groupByDay]);

  const exportCSV = () => {
    const blob = new Blob([toCSV(base)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alerts_${tab}_${new Date().toISOString().slice(0,19)}.csv` ;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quick = (hours: number) => {
    setFrom(toLocalInput(new Date(Date.now() - hours * 3600 * 1000)));
    setTo(toLocalInput(new Date()));
  };

  return (
    <div className="space-y-4">
      {/* Tabs & actions */}
      <div className="flex items-center gap-2">
        <TabBtn active={tab==="all"} onClick={() => setTab("all")}>All</TabBtn>
        <TabBtn active={tab==="critical"} tone="critical" onClick={() => setTab("critical")}>Critical</TabBtn>
        <TabBtn active={tab==="warning"}  tone="warning"  onClick={() => setTab("warning")}>Warning</TabBtn>
        <div className="flex-1" />
        <label className="text-xs text-slate-300 flex items-center gap-2">
          <input type="checkbox" checked={groupByDay} onChange={(e)=>setGroupByDay(e.target.checked)} />
          Group by day
        </label>
        <button onClick={exportCSV} className="px-3 py-1.5 rounded-lg text-sm
             bg-slate-800 text-slate-100
             border border-slate-700
             hover:bg-slate-700
             focus:outline-none focus:ring-2 focus:ring-slate-500/60">
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
            onChange={(e)=>setFrom(e.target.value)}
            className="w-full rounded-lg px-3 py-2
                       bg-slate-900/90 text-slate-100 placeholder:text-slate-400
                       border border-slate-700
                       focus:outline-none focus:ring-2 focus:ring-slate-500/60 focus:border-slate-500
                       disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">To</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e)=>setTo(e.target.value)}
            className="w-full rounded-lg px-3 py-2
                       bg-slate-900/90 text-slate-100 placeholder:text-slate-400
                       border border-slate-700
                       focus:outline-none focus:ring-2 focus:ring-slate-500/60 focus:border-slate-500
                       disabled:opacity-60"
          />
        </div>
        <div className="flex items-end gap-2">
          <QuickBtn onClick={()=>quick(24)}>Last 24h</QuickBtn>
          <QuickBtn onClick={()=>quick(72)}>Last 72h</QuickBtn>
          <QuickBtn onClick={()=>quick(24*7)}>Last 7d</QuickBtn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-3">
        <Stat title="Total" value={stats.total} />
        <Stat title="Critical" value={stats.bySeverity.critical} tone="critical" />
        <Stat title="Warning" value={stats.bySeverity.warning} tone="warning" />
        <Stat title="Unique locations" value={Object.keys(stats.byLocation).length} />
      </div>

      {/* Sections */}
      {Object.entries(sections).map(([day, rows]) => (
        <section key={day} className="rounded-xl border border-slate-800 overflow-hidden">
          {groupByDay && (
            <div className="px-3 py-2 text-xs bg-slate-900/80 text-slate-300 border-b border-slate-800">{day}</div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/70 text-slate-300">
                <tr>
                  <Th className="w-[165px]">Time</Th>
                  <Th className="w-[100px]">Severity</Th>
                  <Th className="w-[110px]">Metric</Th>
                  <Th className="w-[220px]">Location</Th>
                  <Th className="w-[90px] text-right">Value</Th>
                  <Th>Message</Th>
                  <Th className="w-[120px] text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.length === 0 ? (
                  <tr><td colSpan={7} className="p-6 text-center text-slate-400">No alerts.</td></tr>
                ) : rows.map(a => {
                  const t = fmtTime(a.ts);
                  return (
                    <tr key={a.id} className="bg-slate-900/40 hover:bg-slate-900/60">
                      <Td className="whitespace-nowrap">
                        <div className="font-mono text-[12px] text-slate-200" title={t.date}>{t.rel}</div>
                        <div className="text-[11px] text-slate-500">{new Date(a.ts).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</div>
                      </Td>
                      <Td><span className={cls("px-2 py-0.5 rounded-md text-xs border",
                        a.severity==="critical" ? "bg-rose-500/15 text-rose-200 border-rose-600/40" : "bg-amber-500/15 text-amber-200 border-amber-600/40"
                      )}>{a.severity}</span></Td>
                      <Td><span className="px-2 py-0.5 rounded-md text-xs border bg-sky-500/10 text-sky-300 border-sky-600/40">{a.metric}</span></Td>
                      <Td className="truncate" title={a.location || "Unknown"}>{a.location || "Unknown"}</Td>
                      <Td className="text-right">{fmtValue(a.metric, a.value)}</Td>
                      <Td className="max-w-[460px] break-words" title={a.message || "—"}>{a.message || "—"}</Td>
                      <Td className="text-right">
                        {a.acknowledged ? (
                          <span className="text-xs text-slate-500 italic">Ack</span>
                        ) : (
                          <button onClick={()=>acknowledge(a.id)} className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">
                            Acknowledge
                          </button>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
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
    <button
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-xs
                 bg-slate-800 text-slate-100
                 border border-slate-700
                 hover:bg-slate-700
                 focus:outline-none focus:ring-2 focus:ring-slate-500/60"
    >
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
