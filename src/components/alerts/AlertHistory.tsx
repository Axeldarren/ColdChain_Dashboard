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
  const { items, acknowledge } = useAlertFeed();
  const now = Date.now();
  const [from, setFrom] = useState<string>(() => toLocalInput(new Date(now - 24*3600*1000)));
  const [to, setTo] = useState<string>(() => toLocalInput(new Date(now)));
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [groupByDay, setGroupByDay] = useState(true);
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
      <div className="flex items-center gap-2 flex-wrap">
        <TabBtn active={tab==="all"} onClick={() => setTab("all")}>All</TabBtn>
        <TabBtn active={tab==="critical"} tone="critical" onClick={() => setTab("critical")}>Critical</TabBtn>
        <TabBtn active={tab==="warning"}  tone="warning"  onClick={() => setTab("warning")}>Warning</TabBtn>
        <div className="flex-1" />
        <label className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <input type="checkbox" checked={groupByDay} onChange={(e)=>setGroupByDay(e.target.checked)} 
            className="w-4 h-4 text-blue-600 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500" />
          Group by day
        </label>
        <button onClick={exportCSV} className="px-3 py-1.5 rounded-lg text-sm
             bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200
             border border-gray-300 dark:border-gray-600
             hover:bg-gray-300 dark:hover:bg-gray-600
             focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3 shadow-sm">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">From</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e)=>setFrom(e.target.value)}
            className="w-full rounded-lg px-3 py-2
                       bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                       border border-gray-300 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">To</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e)=>setTo(e.target.value)}
            className="w-full rounded-lg px-3 py-2
                       bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                       border border-gray-300 dark:border-gray-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
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
        <section key={day} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
          {groupByDay && (
            <div className="px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 font-medium">{day}</div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
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
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rows.length === 0 ? (
                  <tr><td colSpan={7} className="p-6 text-center text-gray-500 dark:text-gray-400">No alerts.</td></tr>
                ) : rows.map(a => {
                  const t = fmtTime(a.ts);
                  return (
                    <tr key={a.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <Td className="whitespace-nowrap">
                        <div className="font-mono text-[12px] text-gray-900 dark:text-gray-100" title={t.date}>{t.rel}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{new Date(a.ts).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</div>
                      </Td>
                      <Td><span className={cls("px-2 py-0.5 rounded-md text-xs border font-medium",
                        a.severity==="critical" ? "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600/40" : "bg-orange-100 dark:bg-amber-500/15 text-orange-700 dark:text-amber-300 border-orange-300 dark:border-amber-600/40"
                      )}>{a.severity}</span></Td>
                      <Td><span className="px-2 py-0.5 rounded-md text-xs border font-medium bg-blue-100 dark:bg-sky-500/10 text-blue-700 dark:text-sky-300 border-blue-300 dark:border-sky-600/40">{a.metric}</span></Td>
                      <Td className="truncate" title={a.location || "Unknown"}>{a.location || "Unknown"}</Td>
                      <Td className="text-right font-medium">{fmtValue(a.metric, a.value)}</Td>
                      <Td className="max-w-[460px] break-words" title={a.message || "—"}>{a.message || "—"}</Td>
                      <Td className="text-right">
                        {a.acknowledged ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">Ack</span>
                        ) : (
                          <button onClick={()=>acknowledge(a.id)} className="px-2 py-1 rounded-lg text-xs bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
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

function Stat({ title, value, tone }: { title: string; value: number; tone?: "warning" | "critical" }) {
  const palette = tone === "critical"
    ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30"
    : tone === "warning"
    ? "bg-orange-50 dark:bg-amber-500/10 text-orange-700 dark:text-amber-300 border-orange-200 dark:border-amber-500/30"
    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700";
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${palette}`}>
      <div className="text-xs opacity-80 font-medium">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function QuickBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-xs
                 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                 border border-gray-300 dark:border-gray-600
                 hover:bg-gray-300 dark:hover:bg-gray-600
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {children}
    </button>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-semibold text-left ${className}`}>{children}</th>;
}
function Td({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return <td className={`px-3 py-2 text-gray-700 dark:text-gray-200 ${className}`} title={title}>{children}</td>;
}
function TabBtn({ active, children, tone, onClick }:{ active:boolean; children:React.ReactNode; tone?:"critical"|"warning"; onClick:()=>void }) {
  const base = "px-3 py-1.5 rounded-lg border transition text-sm font-medium";
  const activeCls = tone==="critical"
    ? "bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-600/40 text-red-700 dark:text-red-200"
    : tone==="warning"
    ? "bg-orange-100 dark:bg-amber-500/20 border-orange-300 dark:border-amber-600/40 text-orange-700 dark:text-amber-200"
    : "bg-blue-100 dark:bg-gray-700 border-blue-300 dark:border-gray-600 text-blue-700 dark:text-gray-100";
  const idle = "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750";
  return <button onClick={onClick} className={`${base} ${active ? activeCls : idle}`}>{children}</button>;
}
