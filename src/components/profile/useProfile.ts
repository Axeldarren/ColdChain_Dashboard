"use client";

import { useEffect, useState } from "react";

export type Units = "celsius" | "fahrenheit";
export type Channel = "inapp" | "email" | "sms";

export type Profile = {
  name: string;
  company: string;
  role: string;
  email?: string;
  phone?: string;
  timezone?: string;            // e.g., "Asia/Jakarta"
  preferredUnits: Units;        // temp unit
  alertChannels: Channel[];     // default delivery prefs
  quietHours?: { start: string; end: string } | null;
  locationsOfInterest?: string[]; // e.g., ["Warehouse North", ...]
  avatarDataUrl?: string | null;  // base64 preview (client-only)
};

const KEY = "coldchain.profile.v1";

export const DEFAULT_PROFILE: Profile = {
  name: "User",
  company: "Company",
  role: "Operator",
  email: "",
  phone: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  preferredUnits: "celsius",
  alertChannels: ["inapp"],
  quietHours: null,
  locationsOfInterest: [],
  avatarDataUrl: null,
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    setProfile(raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE);
    setLoading(false);
  }, []);

  const save = (p: Profile) => {
    setProfile(p);
    localStorage.setItem(KEY, JSON.stringify(p));
  };

  const reset = () => save(DEFAULT_PROFILE);

  return { profile, save, reset, loading };
}
