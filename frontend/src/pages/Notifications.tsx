import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  CreditCard,
  Popcorn,
  Crown,
  ShieldAlert,
  Sparkles,
  Bell,
  Check,
  Trash2,
} from "lucide-react";
import { Badge } from "../components/ui";
import { cn } from "../lib/cn";

type Category = "booking" | "payment" | "food" | "membership" | "security" | "offer";
type Priority = "critical" | "high" | "normal" | "low";

interface Notif {
  id: string;
  category: Category;
  title: string;
  body: string;
  time: string;
  priority: Priority;
  read: boolean;
}

const CAT_ICON: Record<Category, React.ReactNode> = {
  booking: <Ticket className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  food: <Popcorn className="h-4 w-4" />,
  membership: <Crown className="h-4 w-4" />,
  security: <ShieldAlert className="h-4 w-4" />,
  offer: <Sparkles className="h-4 w-4" />,
};

const PRIORITY_TONE: Record<Priority, "error" | "warning" | "gold" | "neutral"> = {
  critical: "error",
  high: "warning",
  normal: "gold",
  low: "neutral",
};

const SEED: Notif[] = [
  { id: "n1", category: "booking", title: "Show starts in 2 hours", body: "Aether: Rising Stars · Screen 1 · Seats C5, C6.", time: "10m ago", priority: "high", read: false },
  { id: "n2", category: "payment", title: "Payment successful", body: "₹620 paid for booking #bk-7849c. Invoice ready.", time: "1h ago", priority: "normal", read: false },
  { id: "n3", category: "food", title: "Your order is ready", body: "Truffle Popcorn ready for pickup at counter 3.", time: "1h ago", priority: "normal", read: false },
  { id: "n4", category: "security", title: "New device sign-in", body: "Chrome on Windows · Guntur, IN. Was this you?", time: "3h ago", priority: "critical", read: false },
  { id: "n5", category: "membership", title: "120 reward points added", body: "Points credited for your recent booking.", time: "Yesterday", priority: "low", read: true },
  { id: "n6", category: "offer", title: "Weekend action offer", body: "20% off this weekend with code ACTION20.", time: "Yesterday", priority: "normal", read: true },
  { id: "n7", category: "membership", title: "Reward points expiring", body: "120 points expire in 7 days. Redeem now.", time: "2 days ago", priority: "high", read: true },
];

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Bookings" },
  { key: "payment", label: "Payments" },
  { key: "offer", label: "Offers" },
  { key: "security", label: "Security" },
];

const Notifications: React.FC = () => {
  const [items, setItems] = useState<Notif[]>(SEED);
  const [filter, setFilter] = useState("all");

  const unread = items.filter((n) => !n.read).length;
  const critical = items.filter((n) => n.priority === "critical").length;

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.category === filter);
  }, [items, filter]);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearRead = () => setItems((prev) => prev.filter((n) => !n.read));
  const dismiss = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));
  const toggleRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header + summary */}
      <div className="mb-8">
        <h1 className="flex items-center gap-3 font-heading text-4xl font-extrabold tracking-tight">
          <Bell className="h-8 w-8 text-gold" />
          Notifications
        </h1>
        <p className="mt-1 text-sm text-cpm-muted">
          {unread} unread · {critical} critical alert{critical === 1 ? "" : "s"}
        </p>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Unread", value: unread, tone: "gold" as const },
          { label: "Critical", value: critical, tone: "error" as const },
          { label: "Total", value: items.length, tone: "neutral" as const },
        ].map((s) => (
          <div key={s.label} className="cpm-glass flex items-center justify-between p-4">
            <div>
              <p className="text-[11px] uppercase tracking-cpm text-cpm-muted">{s.label}</p>
              <p className="font-number text-2xl font-extrabold text-white">{s.value}</p>
            </div>
            <Badge tone={s.tone}>{s.label}</Badge>
          </div>
        ))}
      </div>

      {/* Filters + actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold tracking-cpm transition-colors",
                filter === f.key
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-cpm-border bg-white/5 text-cpm-muted hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg border border-cpm-border px-3 py-1.5 text-xs font-semibold text-cpm-muted hover:text-white"
          >
            <Check className="h-3.5 w-3.5" /> Mark all read
          </button>
          <button
            onClick={clearRead}
            className="flex items-center gap-1.5 rounded-lg border border-cpm-border px-3 py-1.5 text-xs font-semibold text-cpm-muted hover:text-error"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear read
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={cn(
                "flex items-start gap-4 rounded-cpm border p-4 transition-colors",
                n.read ? "border-cpm-border bg-white/5" : "border-gold/30 bg-gold/5"
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
                {CAT_ICON[n.category]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />}
                  <Badge tone={PRIORITY_TONE[n.priority]} className="ml-auto capitalize">
                    {n.priority}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-cpm-muted">{n.body}</p>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-cpm-muted">
                  <span>{n.time}</span>
                  <button onClick={() => toggleRead(n.id)} className="hover:text-gold">
                    {n.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button onClick={() => dismiss(n.id)} className="hover:text-error">
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="mb-3 h-10 w-10 text-cpm-muted/40" />
            <p className="text-sm text-cpm-muted">You're all caught up.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
