import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  Lock,
  Bell,
  CreditCard,
  MonitorSmartphone,
  Globe,
  Palette,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { RootState } from "../redux/store";
import { Button, Input, Badge } from "../components/ui";
import { cn } from "../lib/cn";

type SectionKey =
  | "personal"
  | "security"
  | "privacy"
  | "notifications"
  | "payments"
  | "devices"
  | "region"
  | "theme"
  | "data";

const NAV: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "personal", label: "Personal Info", icon: <User className="h-4 w-4" /> },
  { key: "security", label: "Security", icon: <ShieldCheck className="h-4 w-4" /> },
  { key: "privacy", label: "Privacy", icon: <Lock className="h-4 w-4" /> },
  { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  { key: "payments", label: "Payment Methods", icon: <CreditCard className="h-4 w-4" /> },
  { key: "devices", label: "Devices", icon: <MonitorSmartphone className="h-4 w-4" /> },
  { key: "region", label: "Language & Region", icon: <Globe className="h-4 w-4" /> },
  { key: "theme", label: "Theme & Accessibility", icon: <Palette className="h-4 w-4" /> },
  { key: "data", label: "Data & Account", icon: <Download className="h-4 w-4" /> },
];

const Toggle: React.FC<{ label: string; desc?: string; defaultOn?: boolean }> = ({
  label,
  desc,
  defaultOn = false,
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {desc && <p className="text-xs text-cpm-muted">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          on ? "border-gold bg-gold/80" : "border-cpm-border bg-white/5"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
            on ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
};

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="cpm-glass p-6">
    <h2 className="mb-5 font-heading text-lg font-bold text-white">{title}</h2>
    {children}
  </motion.div>
);

const AccountSettings: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const [section, setSection] = useState<SectionKey>("personal");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const target = 78;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setScore(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto max-w-[1450px] px-4 py-10 sm:px-6 lg:px-10">
      {/* Profile header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 rounded-cpm border border-gold/25 bg-gradient-to-br from-cpm-surface via-cpm-bg2 to-black p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-premium font-heading text-3xl font-extrabold text-black shadow-goldGlow">
            {user?.name?.charAt(0).toUpperCase() ?? "G"}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-white">{user?.name ?? "Guest"}</h1>
            <p className="text-sm text-cpm-muted">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="gold">Gold Member</Badge>
              <Badge tone="success" dot>Verified</Badge>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[180px]">
          <div className="mb-1 flex justify-between text-xs text-cpm-muted">
            <span>Profile completion</span>
            <span className="text-gold">{score}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-premium"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar nav */}
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Settings sections">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setSection(n.key)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-cpm border px-4 py-3 text-sm font-semibold transition-colors",
                section === n.key
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-cpm-border bg-white/5 text-cpm-muted hover:text-white"
              )}
            >
              {n.icon}
              <span className="whitespace-nowrap">{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-6">
          {/* AI assistant tip */}
          <div className="relative overflow-hidden rounded-cpm p-[1.5px]">
            <motion.div
              aria-hidden
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-gold via-gold-premium to-gold"
            />
            <div className="relative flex items-center gap-3 rounded-[15px] bg-cpm-surface/95 p-4 backdrop-blur">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold animate-cpmGlow">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm text-white">
                <span className="font-bold text-gold">AI Tip:</span> Enable 2FA and verify your phone to raise your
                security score to 100.
              </p>
            </div>
          </div>

          {section === "personal" && (
            <Panel title="Personal Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First Name" defaultValue={user?.name?.split(" ")[0] ?? ""} />
                <Input label="Last Name" defaultValue={user?.name?.split(" ")[1] ?? ""} />
                <Input label="Display Name" defaultValue={user?.name ?? ""} />
                <Input label="Date of Birth" type="date" />
                <Input label="Occupation (optional)" placeholder="e.g. Designer" />
                <Input label="Phone" defaultValue={user?.phone ?? ""} />
              </div>
              <div className="mt-5 flex gap-3">
                <Button>Save Changes</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </Panel>
          )}

          {section === "security" && (
            <Panel title="Account Security">
              <div className="mb-5 flex items-center justify-between rounded-xl border border-cpm-border bg-white/5 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Security Score</p>
                  <p className="text-xs text-cpm-muted">Improve by enabling 2FA & verifying phone</p>
                </div>
                <span className="font-number text-3xl font-extrabold text-gold">{score}</span>
              </div>
              <Toggle label="Two-Factor Authentication (2FA)" desc="Extra layer of login protection" />
              <Toggle label="Biometric Login" desc="Fingerprint / Face ID on supported devices" defaultOn />
              <Toggle label="Login Alerts" desc="Notify me of new device sign-ins" defaultOn />
              <div className="mt-5 flex flex-wrap gap-3">
                <Button variant="secondary">Change Password</Button>
                <Button variant="ghost">View Login History</Button>
                <Button variant="danger">Logout All Devices</Button>
              </div>
            </Panel>
          )}

          {section === "privacy" && (
            <Panel title="Privacy Settings">
              <Toggle label="Public Profile Visibility" defaultOn />
              <Toggle label="Show Booking Activity" />
              <Toggle label="Personalized Recommendations" desc="Use my history to suggest movies" defaultOn />
              <Toggle label="Location Access" desc="For nearby theatre suggestions" defaultOn />
              <Toggle label="Marketing Consent" desc="Receive promotional campaigns" />
              <Toggle label="Analytics Consent" desc="Help improve the app anonymously" defaultOn />
              <div className="mt-5 flex gap-3">
                <Button>Save Preferences</Button>
                <Button variant="ghost">Reset Defaults</Button>
              </div>
            </Panel>
          )}

          {section === "notifications" && (
            <Panel title="Notification Preferences">
              {["Booking Updates", "Movie Releases", "Offers", "Membership", "Reward Points", "Refund Status", "System Alerts"].map(
                (c, i) => (
                  <Toggle key={c} label={c} defaultOn={i < 4} />
                )
              )}
              <p className="mt-4 text-xs text-cpm-muted">Channels: Push · Email · SMS · WhatsApp · In-App</p>
            </Panel>
          )}

          {section === "payments" && (
            <Panel title="Saved Payment Methods">
              <div className="space-y-3">
                {[
                  { label: "Visa •••• 4242", tag: "Default" },
                  { label: "Mastercard •••• 8931", tag: "" },
                  { label: "UPI · name@okaxis", tag: "" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between rounded-xl border border-cpm-border bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gold" />
                      <span className="text-sm font-semibold text-white">{m.label}</span>
                      {m.tag && <Badge tone="gold">{m.tag}</Badge>}
                    </div>
                    <button className="text-xs text-cpm-muted hover:text-error">Remove</button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-cpm-muted">Cards are tokenized and masked — full numbers are never stored.</p>
              <Button className="mt-5" variant="secondary">Add Payment Method</Button>
            </Panel>
          )}

          {section === "devices" && (
            <Panel title="Connected Devices">
              <div className="space-y-3">
                {[
                  { name: "Windows · Chrome", loc: "Guntur, IN", active: "Active now", trusted: true },
                  { name: "iPhone 15 · Safari", loc: "Hyderabad, IN", active: "2 days ago", trusted: true },
                  { name: "Android · App", loc: "Chennai, IN", active: "1 week ago", trusted: false },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between rounded-xl border border-cpm-border bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{d.name}</p>
                      <p className="text-xs text-cpm-muted">{d.loc} · {d.active}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {d.trusted && <Badge tone="success" dot>Trusted</Badge>}
                      <button className="text-xs text-cpm-muted hover:text-error">Logout</button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-5" variant="danger">Logout All Devices</Button>
            </Panel>
          )}

          {section === "region" && (
            <Panel title="Language & Region">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Language" defaultValue="English" />
                <Input label="Currency" defaultValue="INR (₹)" />
                <Input label="Time Zone" defaultValue="IST (GMT+5:30)" />
                <Input label="Preferred City" defaultValue="Guntur" />
                <Input label="Subtitle Language" defaultValue="English" />
                <Input label="Audio Language" defaultValue="English" />
              </div>
              <Button className="mt-5">Apply Changes</Button>
            </Panel>
          )}

          {section === "theme" && (
            <Panel title="Theme & Accessibility">
              <Toggle label="Dark Theme" desc="Premium cinema dark mode" defaultOn />
              <Toggle label="High Contrast Mode" />
              <Toggle label="Reduced Motion" desc="Minimize animations" />
              <Toggle label="Large Text" />
              <Toggle label="Keyboard Navigation Hints" defaultOn />
            </Panel>
          )}

          {section === "data" && (
            <div className="space-y-6">
              <Panel title="Download My Data">
                <p className="mb-4 text-sm text-cpm-muted">
                  Export your profile, bookings, invoices, rewards and reviews.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>PDF</Button>
                  <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>JSON</Button>
                  <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>CSV</Button>
                </div>
              </Panel>
              <Panel title="Delete Account">
                <div className="rounded-xl border border-error/30 bg-error/5 p-4">
                  <p className="text-sm text-cpm-muted">
                    Deleting your account is permanent after a 30-day cooling period. You can also temporarily deactivate
                    instead.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="ghost">Deactivate Temporarily</Button>
                    <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>Delete Account</Button>
                  </div>
                </div>
              </Panel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
