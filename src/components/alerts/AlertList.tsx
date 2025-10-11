"use client";

import { useEffect, useState } from "react";
import { useAlertFeed, Severity } from "./useAlertFeed";
import { fmtTime, fmtValue, tone, cls } from "./ui";

function Pill({ children, kind }: { children: React.ReactNode; kind: "warning"|"critical"|"metric" }) {
  const map = {
    warning:  "bg-amber-500/15 text-amber-200 border border-amber-600/40",
    critical: "bg-rose-500/15 text-rose-200 border border-rose-600/40",
    metric:   "bg-sky-500/10 text-sky-300 border border-sky-600/40",
  } as const;
  return <span className={cls("inline-flex px-2 py-0.5 rounded-md text-[11px] leading-5", map[kind])}>{children}</span>;
}

export default function AlertList({ filter }: { filter?: Severity }) {
  const { items, acknowledge, clearAcknowledged, push } = useAlertFeed();
  const [mounted, setMounted] = useState(false);
  const [dense, setDense] = useState<"compact"|"comfortable">("compact");

  useEffect(() => {
    setMounted(true);
    (window as any).__pushAlert = push;
    return () => { delete (window as any).__pushAlert; };
  }, [push]);

  if (!mounted) return <div className="p-6 text-slate-400">Loading…</div>;

  const filtered = (items ?? [])
    .filter(a => (filter ? a.severity === filter : true))
    .sort((a,b) => b.ts - a.ts);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Density:</span>
        <button
          onClick={() => setDense("compact")}
          className={cls(
            "px-2 py-1 rounded-md text-xs border",
            dense==="compact" ? "bg-slate-800 border-slate-700" : "bg-slate-900 border-slate-800 hover:bg-slate-800"
          )}
        >
          Compact
        </button>
        <button
          onClick={() => setDense("comfortable")}
          className={cls(
            "px-2 py-1 rounded-md text-xs border",
            dense==="comfortable" ? "bg-slate-800 border-slate-700" : "bg-slate-900 border-slate-800 hover:bg-slate-800"
          )}
        >
          Comfortable
        </button>
        <div className="flex-1" />
        <button
          onClick={() => clearAcknowledged()}
          className="px-2.5 py-1.5 rounded-md text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800"
        >
          Clear acknowledged
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        filtered.map(a => {
          const t = fmtTime(a.ts);
          return (
            <article
              key={a.id}
              className={cls(
                "rounded-xl bg-slate-900/60 border border-slate-800 px-4",
                dense==="compact" ? "py-2" : "py-3",
                tone[a.severity]
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                <div className="flex items-center gap-2 min-w-[170px]">
                  <Pill kind={a.severity}>{a.severity}</Pill>
                  <Pill kind="metric">{a.metric}</Pill>
                </div>
                <div className="text-slate-300 flex-1 break-words">
                  <span className="font-medium">{a.location || "Unknown location"}</span>
                  <span className="mx-2 text-slate-600">•</span>
                  <span className="text-slate-200">{a.message || "—"}</span>
                </div>
                <div className="flex items-center gap-4 md:ml-auto">
                  <div className="text-right text-sm">
                    <div className="text-slate-200">{fmtValue(a.metric, a.value)}</div>
                    <time
                      title={t.date}
                      className="text-[11px] text-slate-400 leading-4"
                      dateTime={new Date(a.ts).toISOString()}
                    >
                      {t.rel}
                    </time>
                  </div>
                  {a.acknowledged ? (
                    <span className="text-xs text-slate-500 italic">Ack</span>
                  ) : (
                    <button
                      onClick={() => acknowledge(a.id)}
                      className="px-2.5 py-1.5 rounded-md text-xs bg-slate-800 border border-slate-700 hover:bg-slate-700"
                      aria-label="Acknowledge alert"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter?: Severity }) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-center">
      No {filter ? filter : ""} alerts to show.
    </div>
  );
}
