"use client";

import { useEffect, useState } from "react";
import { useAlertFeed } from "@/components/alerts/useAlertFeed";
import { cls } from "@/components/alerts/ui"; // if you don't have cls, replace with small util here

type Props = {
  open: boolean;
  onToggle: () => void;
};

const READ_KEY = "coldchain.notifications.lastSeenTs.v1";

export function getLastSeenTs() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(READ_KEY) || 0);
}
export function setLastSeenTs(ts: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(READ_KEY, String(ts));
}

export default function NotificationBell({ open, onToggle }: Props) {
  const { items } = useAlertFeed();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const lastSeen = getLastSeenTs();
    // “important” = warning or critical
    const count = (items || []).filter(a => a.ts > lastSeen && (a.severity === "critical" || a.severity === "warning")).length;
    setUnread(count);
  }, [items, open]);

  return (
    <button
      aria-label="Notifications"
      onClick={onToggle}
      className={cls(
        "relative rounded-full p-2 border transition",
        open
          ? "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600"
          : "bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
      )}
    >
      {/* simple bell svg */}
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-700 dark:text-slate-200">
        <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2m6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1z"/>
      </svg>
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] bg-rose-500 text-white flex items-center justify-center border border-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  );
}
