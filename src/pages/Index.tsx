import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CalculatorDefinition } from "@/types/calculator";
import { useLanguage } from "@/components/LanguageProvider";
import PromptInput from "@/components/PromptInput";
import ExampleChips from "@/components/ExampleChips";
import CalculatorCard from "@/components/CalculatorCard";

const Index = () => {
  const { locale, t } = useLanguage();
  const [calculator, setCalculator] = useState<CalculatorDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCalculator = async (prompt: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-calculator", {
        body: { prompt, locale },
      });

      if (error) {
        let code = "generation_failed";
        try { if (error.context instanceof Response) code = (await error.context.json()).code ?? code; } catch { /* Use safe fallback. */ }
        const key = code === "rate_limited" ? "rateLimited" : code === "credits_exhausted" ? "credits" : code === "invalid_request" ? "invalid" : code === "parse_failed" ? "parse" : "failed";
        toast.error(t[key]);
        return;
      }

      if (data?.error) {
        toast.error(t.failed);
        return;
      }

      if (data?.calculator) {
        setCalculator({ ...data.calculator, locale } as CalculatorDefinition);
      }
    } catch (e: unknown) {
      console.error(e);
      toast.error(t.failed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-20">
        <AnimatePresence mode="wait">
          {!calculator ? (
            <motion.div
              key="hero"
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Hero */}
              <div className="text-center space-y-4">
                <motion.div
                  className="text-5xl sm:text-6xl mb-2"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  🧮
                </motion.div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
                  {locale === "ar" ? <>{t.titleEnd} <span className="text-gradient-warm">{t.titleHighlight}</span></> : <>{t.titleStart} <span className="text-gradient-warm">{t.titleHighlight}</span> {t.titleEnd}</>}
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  {t.description}
                </p>
              </div>

              {/* Prompt */}
              <PromptInput onSubmit={generateCalculator} isLoading={isLoading} />

              {/* Examples */}
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">{t.examples}</p>
                <ExampleChips onSelect={generateCalculator} disabled={isLoading} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calculator"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Compact prompt bar at top */}
              <PromptInput onSubmit={(p) => { setCalculator(null); generateCalculator(p); }} isLoading={isLoading} />
              
              <CalculatorCard calculator={calculator} onReset={() => setCalculator(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
