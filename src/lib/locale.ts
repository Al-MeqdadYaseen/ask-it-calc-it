export type Locale = "en" | "ar";
export const LANGUAGE_KEY = "calc-creator-language";
export const direction = (locale: Locale) => locale === "ar" ? "rtl" : "ltr";
export function detectLocale(preferences: readonly string[], stored?: string | null): Locale {
  if (stored === "en" || stored === "ar") return stored;
  for (const tag of preferences) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "en" || base === "ar") return base;
  }
  return "en";
}
export function initialLocale(): Locale {
  let stored: string | null = null;
  try { stored = window.localStorage.getItem(LANGUAGE_KEY); } catch { /* Storage may be blocked. */ }
  return detectLocale(navigator.languages?.length ? navigator.languages : [navigator.language], stored);
}
export function rememberLocale(locale: Locale) {
  try { window.localStorage.setItem(LANGUAGE_KEY, locale); } catch { /* In-memory switching still works. */ }
}
export function formatValue(value: number, locale: Locale, format?: string) {
  if (Number.isNaN(value)) return "—";
  if (format === "currency") {
    // Currency outputs historically mean dollars; UI locale must not change the currency.
    return `$${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
  }
  if (format === "percent") {
    // Formulas already return percentage points, not a fraction.
    return new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100);
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}