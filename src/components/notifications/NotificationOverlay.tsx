"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAlertFeed, AlertItem } from "@/components/alerts/useAlertFeed";
import { fmtTime, fmtValue, cls } from "@/components/alerts/ui";
import { setLastSeenTs } from "./NotificationBell";

type Props = { open: boolean; onClose: () => void };

export default function NotificationOverlay({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { items, acknowledge } = useAlertFeed();

  // close on click outside
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  // mark as “seen” when opened
  useEffect(() => {
    if (open) setLastSeenTs(Date.now());
  }, [open]);

  const list = useMemo(() => {
    // Important: show critical first, then warnings, newest first
    const sorted = (items ?? []).filter(a => a.severity === "critical" || a.severity === "warning")
      .sort((a, b) => {
        if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
        return b.ts - a.ts;
      });
    return sorted.slice(0, 50); // cap for overlay
  }, [items]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* dim the background a bit (click-through disabled, we handle outside click above) */}
      <div className="absolute inset-0 bg-black/0" />
      <div
        ref={ref}
        className="pointer-events-auto absolute right-4 top-16 w-[380px] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        role="dialog" aria-label="Notifications"
      >
        <Header onClose={onClose} count={list.length} />
        <div className="divide-y divide-slate-100 max-h-[60vh] overflow-auto">
          {list.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No important notifications.</div>
          ) : (
            list.map(item => <Row key={item.id} item={item} onAck={() => acknowledge(item.id)} />)
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

function Header({ onClose, count }: { onClose: () => void; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/80 backdrop-blur">
      <div className="text-sm font-medium text-slate-800">Notifications</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">{count} items</span>
        <button onClick={onClose} className="rounded-md px-2 py-1 text-xs border border-slate-300 hover:bg-slate-100">
          Close
        </button>
      </div>
    </div>
  );
}

function Row({ item, onAck }: { item: AlertItem; onAck: () => void }) {
  const t = fmtTime(item.ts);
  const color =
    item.severity === "critical"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <div className="p-3 flex gap-3 items-start">
      {/* severity dot */}
      <span className={cls("mt-1 h-2.5 w-2.5 rounded-full", item.severity === "critical" ? "bg-rose-500" : "bg-amber-500")} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cls("px-1.5 py-0.5 rounded border text-[11px] font-medium", color)}>
            {item.severity.toUpperCase()}
          </span>
          <span className="px-1.5 py-0.5 rounded border text-[11px] font-medium bg-sky-50 text-sky-800 border-sky-200">
            {item.metric}
          </span>
          <span className="text-xs text-slate-500" title={t.date}>{t.rel}</span>
        </div>
        <div className="text-sm text-slate-800 mt-1 break-words">
          <span className="font-medium">{item.location}</span>
          <span className="text-slate-400 mx-1">•</span>
          <span>{item.message}</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Value: <span className="text-slate-700">{fmtValue(item.metric, item.value)}</span>
        </div>
      </div>
      {item.acknowledged ? (
        <span className="text-[11px] text-slate-400 italic">Ack</span>
      ) : (
        <button
          onClick={onAck}
          className="self-center rounded-md px-2 py-1 text-xs border border-slate-300 hover:bg-slate-100"
        >
          Acknowledge
        </button>
      )}
    </div>
  );
}

function Footer() {
  return (
    <div className="px-4 py-2 border-t border-slate-200 bg-white flex items-center justify-between">
      <a href="/alert_level" className="text-xs text-slate-600 hover:text-slate-900 underline">
        View all alerts
      </a>
      <button
        onClick={() => setLastSeenTs(Date.now())}
        className="text-xs text-slate-600 hover:text-slate-900"
      >
        Mark all as read
      </button>
    </div>
  );
}
