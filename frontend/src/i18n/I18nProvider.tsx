import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LOCALES, STRINGS, type LocaleCode } from "./locales";

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date | string, opts?: Intl.DateTimeFormatOptions) => string;
}

const STORAGE_KEY = "cpm.locale";

const I18nContext = createContext<I18nContextValue | null>(null);

const LOCALE_TO_INTL: Record<LocaleCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    return saved && LOCALES.some((l) => l.code === saved) ? saved : "en";
  });

  useEffect(() => {
    const meta = LOCALES.find((l) => l.code === locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta?.dir ?? "ltr";
  }, [locale]);

  const setLocale = useCallback((l: LocaleCode) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = useCallback(
    (key: string) => STRINGS[locale]?.[key] ?? STRINGS.en[key] ?? key,
    [locale]
  );

  const formatCurrency = useCallback(
    (amount: number, currency = "INR") =>
      new Intl.NumberFormat(LOCALE_TO_INTL[locale], {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount),
    [locale]
  );

  const formatDate = useCallback(
    (date: Date | string, opts?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(LOCALE_TO_INTL[locale], opts ?? { dateStyle: "medium" }).format(
        typeof date === "string" ? new Date(date) : date
      ),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, formatCurrency, formatDate }),
    [locale, setLocale, t, formatCurrency, formatDate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/** Access translation + formatting helpers. Safe outside a provider (falls back to English). */
export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  // Fallback so components don't crash if provider is missing
  return {
    locale: "en",
    setLocale: () => {},
    t: (key: string) => STRINGS.en[key] ?? key,
    formatCurrency: (a: number, c = "INR") =>
      new Intl.NumberFormat("en-IN", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(a),
    formatDate: (d: Date | string, o?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-IN", o ?? { dateStyle: "medium" }).format(
        typeof d === "string" ? new Date(d) : d
      ),
  };
};
