export function fmtValue(metric: "temperature"|"humidity"|"doorOpen", v?: number) {
  if (v == null || Number.isNaN(v)) return "—";
  if (metric === "doorOpen") return `${Math.round(v)}s` ;
  if (metric === "humidity") return `${Math.round(v)}%` ;
  return `${Number(v).toFixed(1)}°C` ;
}

export function fmtTime(ts: number) {
  const d = new Date(ts);
  const date = d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const rel = timeAgo(ts);
  return { date, rel };
}

export function timeAgo(ts: number) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diff = Math.round((ts - Date.now()) / 1000);
  const abs = Math.abs(diff);
  // pick best unit
  const table: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"], [3600, "minute"], [86400, "hour"], [604800, "day"]
  ];
  for (let i = table.length - 1; i >= 0; i--) {
    const [sec, unit] = table[i];
    if (abs >= sec || i === 0) return rtf.format(Math.round(diff / sec), unit);
  }
  return "";
}

export const tone = {
  critical: "border-l-2 border-l-rose-500/70",
  warning:  "border-l-2 border-l-amber-500/70",
  metric:   "bg-sky-500/10 text-sky-300 border-sky-600/40",
};

export function cls(...xs: (string|false|undefined)[]) {
  return xs.filter(Boolean).join(" ");
}
