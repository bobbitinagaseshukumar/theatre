import React, { useState } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnnouncementBarProps {
  messages?: string[];
}

const DEFAULT: string[] = [
  "🎬 Dolby Atmos now live on Screen 1 — book the premium experience",
  "🍿 Combo Fest: Flat 25% off on all food combos this weekend",
  "⭐ Become a Gold Member and skip the queue with priority booking",
];

/**
 * Top marquee announcement bar. Dismissible; auto-scrolls messages.
 */
const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ messages = DEFAULT }) => {
  const [open, setOpen] = useState(true);
  const [idx, setIdx] = useState(0);

  React.useEffect(() => {
    if (messages.length < 2) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % messages.length), 4000);
    return () => window.clearInterval(t);
  }, [messages.length]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-r from-black via-cpm-bg2 to-black"
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-6 py-2 text-xs">
            <Megaphone className="h-4 w-4 shrink-0 text-gold" />
            <div className="relative h-4 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 truncate font-medium tracking-cpm text-cpm-muted"
                >
                  {messages[idx]}
                </motion.p>
              </AnimatePresence>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Dismiss announcement"
              className="shrink-0 rounded p-1 text-cpm-muted transition-colors hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;
