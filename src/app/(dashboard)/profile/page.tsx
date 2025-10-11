"use client";

import { useRef, useState } from "react";
import { useProfile, DEFAULT_PROFILE, Profile } from "@/components/profile/useProfile";

export default function ProfilePage() {
  const { profile, save, reset, loading } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (loading) return <div className="p-6 text-slate-500 dark:text-slate-400">Loading profile…</div>;

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const toggleChannel = (c: Profile["alertChannels"][number]) => {
    setForm((s) => {
      const has = s.alertChannels.includes(c);
      return { ...s, alertChannels: has ? s.alertChannels.filter((x) => x !== c) : [...s.alertChannels, c] };
    });
  };

  const onPick = () => fileRef.current?.click();
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => update("avatarDataUrl", String(r.result));
    r.readAsDataURL(f);
  };

  const onSave = () => {
    if (!form.name.trim() || !form.company.trim() || !form.role.trim()) {
      alert("Name, Company, and Role are required.");
      return;
    }
    save(form);
    alert("Profile saved");
  };

  const onReset = () => {
    if (confirm("Reset profile to defaults?")) {
      reset();
      setForm(DEFAULT_PROFILE);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Profile</h1>

      {/* Unified Card */}
      <div className="rounded-2xl border bg-white shadow-sm
                      border-slate-200 dark:border-slate-700
                      dark:bg-slate-900">
        {/* Header strip */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Account</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Manage identity, contact, and alert preferences.</div>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" onClick={onReset}>Reset</Button>
            <Button onClick={onSave}>Save changes</Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="grid lg:grid-cols-[260px,1fr] gap-6">
            {/* Avatar column */}
            <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                  aria-label="Change profile picture"
                  className="h-28 w-28 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700
                 bg-slate-100 dark:bg-slate-800 grid place-items-center
                 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
               >
                  {form.avatarDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">No Avatar</span>
                  )}
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFile}
                />

                {form.avatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => update("avatarDataUrl", null)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Remove photo
                  </button>
                )}
                
              </div>
            </section>

            {/* Identity + settings */}
            <section className="space-y-6">
              {/* Identity */}
              <CardSection title="Identity">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name" required value={form.name} onChange={(v) => update("name", v)} />
                  <Field label="Company" required value={form.company} onChange={(v) => update("company", v)} />
                  <Field label="Role" required value={form.role} onChange={(v) => update("role", v)} />
                  <Field label="Email" type="email" value={form.email ?? ""} onChange={(v) => update("email", v)} />
                  <Field label="Phone" value={form.phone ?? ""} onChange={(v) => update("phone", v)} />
                  <Field label="Timezone" value={form.timezone ?? ""} onChange={(v) => update("timezone", v)} />
                </div>
              </CardSection>

              {/* Preferences */}
              <CardSection title="Preferences">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Preferred Temperature Unit</Label>
                    <div className="mt-2 inline-flex rounded-xl border
                                    border-slate-300 dark:border-slate-600 overflow-hidden">
                      <Seg
                        active={form.preferredUnits === "celsius"}
                        onClick={() => update("preferredUnits", "celsius")}
                      >
                        Celsius (°C)
                      </Seg>
                      <Seg
                        active={form.preferredUnits === "fahrenheit"}
                        onClick={() => update("preferredUnits", "fahrenheit")}
                      >
                        Fahrenheit (°F)
                      </Seg>
                    </div>
                  </div>
                  <div>
                    <Label>Default Alert Channels</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Tag active={form.alertChannels.includes("inapp")} onClick={() => toggleChannel("inapp")}>In-app</Tag>
                      <Tag active={form.alertChannels.includes("email")} onClick={() => toggleChannel("email")}>Email</Tag>
                      <Tag active={form.alertChannels.includes("sms")} onClick={() => toggleChannel("sms")}>SMS</Tag>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Quiet Hours (optional)</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        value={form.quietHours?.start ?? ""}
                        onChange={(e) => update("quietHours", { start: e.target.value, end: form.quietHours?.end ?? "" })}
                      />
                      <Input
                        type="time"
                        value={form.quietHours?.end ?? ""}
                        onChange={(e) => update("quietHours", { start: form.quietHours?.start ?? "", end: e.target.value })}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Suppress non in-app notifications during these hours.
                    </p>
                  </div>
                  <div>
                    <Label>Locations of Interest</Label>
                    <Input
                      placeholder="Comma-separated (e.g., Warehouse North, Storage Area)"
                      value={(form.locationsOfInterest ?? []).join(", ")}
                      onChange={(e) =>
                        update(
                          "locationsOfInterest",
                          e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                </div>
              </CardSection>
            </section>
          </div>
        </div>

        {/* Sticky footer actions for small screens */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex md:hidden justify-end gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-b-2xl">
          <Button variant="ghost" onClick={onReset}>Reset</Button>
          <Button onClick={onSave}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable UI bits (theme-aware) ---------- */

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="mb-3">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, required, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange((e.target as HTMLInputElement).value)} placeholder={label} />
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm text-slate-600 dark:text-slate-300">
      {children} {required && <span className="text-rose-600 dark:text-rose-400">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`mt-2 w-full rounded-lg px-3 py-2
                  bg-white dark:bg-slate-900
                  text-slate-900 dark:text-slate-100
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                  border border-slate-300 dark:border-slate-600
                  focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
                  ${className}`}
    />
  );
}

function Button({
  children, onClick, variant = "solid", size = "md",
}: { children: React.ReactNode; onClick?: () => void; variant?: "solid" | "ghost"; size?: "sm" | "md" }) {
  const base = "rounded-lg font-medium transition";
  const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  const solid =
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white";
  const ghost =
    "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 " +
    "dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800/60";
  return (
    <button onClick={onClick} className={`${base} ${pad} ${variant === "solid" ? solid : ghost}`}>
      {children}
    </button>
  );
}

function Seg({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm
        ${active
          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
          : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}
      `}
    >
      {children}
    </button>
  );
}

function Tag({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border
        ${active
          ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800"}
      `}
    >
      {children}
    </button>
  );
}
