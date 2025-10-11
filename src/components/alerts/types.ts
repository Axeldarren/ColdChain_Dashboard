export type Severity = "none" | "warning" | "critical";
export type Channel = "inapp" | "email" | "sms" | "webhook";

export interface MetricThreshold {
  enabled: boolean;
  warningMin?: number | null;
  warningMax?: number | null;
  criticalMin?: number | null;
  criticalMax?: number | null;
  warningDurationSec?: number | null;   // door only
  criticalDurationSec?: number | null;  // door only
  debounceSeconds: number;              // default 60 (temp), 120 (humidity), 5 (door)
  hysteresisPercent: number;            // default 5
}

export interface AlertSettings {
  defaults: {
    temperature: MetricThreshold;
    humidity: MetricThreshold;
    doorOpen: MetricThreshold;
  };
  channels: Channel[]; // at least one
  quietHours?: { start: string; end: string } | null;
}

export const DEFAULT_SETTINGS: AlertSettings = {
  defaults: {
    temperature: {
      enabled: true,
      warningMin: -20, warningMax: -15,
      criticalMin: -30, criticalMax: -10,
      debounceSeconds: 60,
      hysteresisPercent: 5,
    },
    humidity: {
      enabled: true,
      warningMin: 55, warningMax: 75,
      criticalMin: 45, criticalMax: 85,
      debounceSeconds: 120,
      hysteresisPercent: 5,
    },
    doorOpen: {
      enabled: true,
      warningDurationSec: 30,
      criticalDurationSec: 120,
      debounceSeconds: 5,
      hysteresisPercent: 0,
    },
  },
  channels: ["inapp"],
  quietHours: null,
};
