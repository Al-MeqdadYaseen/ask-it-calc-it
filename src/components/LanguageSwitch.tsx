import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage();
  return <div className="relative z-20 flex justify-end max-w-4xl mx-auto px-4 pt-4">
    <div role="group" aria-label={t.language} dir="ltr" className="flex gap-1 rounded-lg border border-border bg-card p-1">
      <Button size="sm" variant={locale === "en" ? "secondary" : "ghost"} lang="en" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>English</Button>
      <Button size="sm" variant={locale === "ar" ? "secondary" : "ghost"} lang="ar" dir="rtl" aria-pressed={locale === "ar"} onClick={() => setLocale("ar")}>العربية</Button>
    </div>
  </div>;
}