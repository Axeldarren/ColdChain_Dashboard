"use client";

import { useRef, useState } from "react";
import { useProfile, DEFAULT_PROFILE, Profile } from "@/components/profile/useProfile";

export default function ProfilePage() {
  const { profile, save, reset, loading } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (loading) return <div className="p-6 text-slate-500">Loading profile…</div>;

  const onPick = () => fileRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await fToDataUrl(f);
    setForm({ ...form, avatarDataUrl: dataUrl });
  };

  const update = (k: keyof Profile, v: any) => setForm({ ...form, [k]: v });

  const toggleChannel = (c: Profile["alertChannels"][number]) => {
    const has = form.alertChannels.includes(c);
    update("alertChannels", has ? form.alertChannels.filter(x => x !== c) : [...form.alertChannels, c]);
  };

  const onSave = () => {
    // simple required fields
    if (!form.name.trim() || !form.company.trim() || !form.role.trim()) {
      alert("Name, Company, and Role are required.");
      return;
    }
    save(form);
    alert("Profile saved.");
  };

  const onReset = () => {
    if (confirm("Reset profile to defaults?")) {
      setForm(DEFAULT_PROFILE);
      reset();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Avatar */}
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 rounded-full bg-slate-100 overflow-hidden ring-1 ring-slate-200">
              {form.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-slate-400">No Avatar</div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            <button onClick={onPick} className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-sm">
              Upload photo
            </button>
            {form.avatarDataUrl && (
              <button onClick={() => update("avatarDataUrl", null)} className="text-xs text-slate-500 hover:text-slate-700">
                Remove photo
              </button>
            )}
          </div>
        </section>

        {/* Right: Details */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={form.name} onChange={v => update("name", v)} required />
            <Field label="Company" value={form.company} onChange={v => update("company", v)} required />
            <Field label="Role" value={form.role} onChange={v => update("role", v)} required />
            <Field label="Email" value={form.email ?? ""} onChange={v => update("email", v)} type="email" />
            <Field label="Phone" value={form.phone ?? ""} onChange={v => update("phone", v)} />
            <Field label="Timezone" value={form.timezone ?? ""} onChange={v => update("timezone", v)} />
            <div>
              <Label>Preferred Temperature Unit</Label>
              <div className="mt-2 flex items-center gap-3">
                <Chip active={form.preferredUnits === "celsius"} onClick={() => update("preferredUnits", "celsius")}>Celsius (°C)</Chip>
                <Chip active={form.preferredUnits === "fahrenheit"} onClick={() => update("preferredUnits", "fahrenheit")}>Fahrenheit (°F)</Chip>
              </div>
            </div>
            <div>
              <Label>Default Alert Channels</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                <Chip active={form.alertChannels.includes("inapp")} onClick={() => toggleChannel("inapp")}>In-app</Chip>
                <Chip active={form.alertChannels.includes("email")} onClick={() => toggleChannel("email")}>Email</Chip>
                <Chip active={form.alertChannels.includes("sms")} onClick={() => toggleChannel("sms")}>SMS</Chip>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Quiet Hours (optional)</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={form.quietHours?.start ?? ""}
                  onChange={(e) => update("quietHours", { start: e.target.value, end: form.quietHours?.end ?? "" })}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="22:00"
                />
                <input
                  type="time"
                  value={form.quietHours?.end ?? ""}
                  onChange={(e) => update("quietHours", { start: form.quietHours?.start ?? "", end: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="06:00"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Suppress non in-app notifications during these hours.</p>
            </div>
            <div className="sm:col-span-2">
              <Label>Locations of Interest</Label>
              <input
                type="text"
                placeholder="Comma-separated (e.g., Warehouse North, Storage Area)"
                value={(form.locationsOfInterest ?? []).join(", ")}
                onChange={(e) =>
                  update(
                    "locationsOfInterest",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean)
                  )
                }
                className="mt-2 w-full rounded-lg px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onReset} className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-sm">
              Reset
            </button>
            <button onClick={onSave} className="px-4 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 text-sm">
              Save changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
        placeholder={label}
      />
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm text-slate-600">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm border ${active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}` }
    >
      {children}
    </button>
  );
}

function fToDataUrl(file: File) {
  return new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
