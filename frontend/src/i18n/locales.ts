/**
 * Cinema Pro Max — lightweight i18n dictionaries.
 * Add new locales here; keys fall back to English, then to the key itself.
 */
export type LocaleCode = "en" | "hi" | "te" | "ta";

export interface LocaleMeta {
  code: LocaleCode;
  label: string;
  flag: string;
  currency: string;
  dir: "ltr" | "rtl";
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", flag: "🇬🇧", currency: "INR", dir: "ltr" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", currency: "INR", dir: "ltr" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", currency: "INR", dir: "ltr" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳", currency: "INR", dir: "ltr" },
];

type Dict = Record<string, string>;

export const STRINGS: Record<LocaleCode, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.movies": "Movies",
    "nav.theatres": "Theatres",
    "nav.offers": "Offers",
    "nav.food": "Food",
    "nav.contact": "Contact",
    "nav.signIn": "Sign In",
    "common.bookNow": "Book Now",
    "common.watchTrailer": "Watch Trailer",
    "common.loading": "Loading",
  },
  hi: {
    "nav.home": "होम",
    "nav.movies": "फ़िल्में",
    "nav.theatres": "थिएटर",
    "nav.offers": "ऑफर",
    "nav.food": "खाना",
    "nav.contact": "संपर्क",
    "nav.signIn": "साइन इन",
    "common.bookNow": "बुक करें",
    "common.watchTrailer": "ट्रेलर देखें",
    "common.loading": "लोड हो रहा है",
  },
  te: {
    "nav.home": "హోమ్",
    "nav.movies": "సినిమాలు",
    "nav.theatres": "థియేటర్లు",
    "nav.offers": "ఆఫర్లు",
    "nav.food": "ఆహారం",
    "nav.contact": "సంప్రదించండి",
    "nav.signIn": "సైన్ ఇన్",
    "common.bookNow": "బుక్ చేయండి",
    "common.watchTrailer": "ట్రైలర్ చూడండి",
    "common.loading": "లోడ్ అవుతోంది",
  },
  ta: {
    "nav.home": "முகப்பு",
    "nav.movies": "திரைப்படங்கள்",
    "nav.theatres": "திரையரங்குகள்",
    "nav.offers": "சலுகைகள்",
    "nav.food": "உணவு",
    "nav.contact": "தொடர்பு",
    "nav.signIn": "உள்நுழை",
    "common.bookNow": "இப்போது பதிவு செய்",
    "common.watchTrailer": "டிரெய்லரைப் பார்",
    "common.loading": "ஏற்றுகிறது",
  },
};
