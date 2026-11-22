import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { direction, initialLocale, rememberLocale, type Locale } from "@/lib/locale";
import { messages } from "@/lib/translations";

const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction(locale);
  }, [locale]);
  const setLocale = (next: Locale) => { rememberLocale(next); updateLocale(next); };
  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required");
  return { ...context, t: messages[context.locale] };
}