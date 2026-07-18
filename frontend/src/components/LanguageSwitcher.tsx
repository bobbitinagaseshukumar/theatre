import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { LOCALES } from "../i18n/locales";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Compact language switcher — persists selection and updates the document lang.
 */
const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 transition-colors hover:border-accent hover:text-accent"
      >
        <Globe className="h-5 w-5" />
        <span className="hidden text-xs font-semibold sm:inline">{active.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass-panel absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]/95 py-1.5 shadow-glass"
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                  l.code === locale ? "text-accent" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  {l.label}
                </span>
                {l.code === locale && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
