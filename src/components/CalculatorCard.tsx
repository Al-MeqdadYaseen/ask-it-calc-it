import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { evaluate } from "mathjs";
import { CalculatorDefinition } from "@/types/calculator";
import { RotateCcw } from "lucide-react";

import { useLanguage } from "./LanguageProvider";
import { direction, formatValue } from "@/lib/locale";
import { Button } from "@/components/ui/button";

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  onReset: () => void;
}

const CalculatorCard = ({ calculator, onReset }: CalculatorCardProps) => {
  const { locale, t } = useLanguage();
  const contentLocale = calculator.locale ?? "en";
  const [values, setValues] = useState<Record<string, number | string>>({});

  useEffect(() => {
    const defaults: Record<string, number | string> = {};
    calculator.inputs.forEach((input) => {
      defaults[input.id] = input.default;
    });
    setValues(defaults);
  }, [calculator]);

  const outputs = useMemo(() => {
    return calculator.outputs.map((output) => {
      try {
        const scope: Record<string, number> = {};
        calculator.inputs.forEach((input) => {
          const val = values[input.id];
          scope[input.id] = typeof val === "number" ? val : parseFloat(String(val)) || 0;
        });
        const result = evaluate(output.formula, scope);
        return { ...output, value: typeof result === "number" ? result : Number(result) };
      } catch {
        return { ...output, value: NaN };
      }
    });
  }, [calculator, values]);

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div lang={contentLocale} dir={direction(contentLocale)} className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex gap-2 items-start justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-3xl">{calculator.emoji}</span>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">{calculator.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{calculator.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon"
            onClick={onReset}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={t.reset}
            aria-label={t.reset}
            lang={locale}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-4">
          {calculator.inputs.map((input) => (
            <div key={input.id}>
              <label htmlFor={`calc-${input.id}`} className="block text-sm font-medium text-muted-foreground mb-1.5">
                {input.label} {input.unit && <span className="text-muted-foreground/60">({input.unit})</span>}
              </label>
              {input.type === "select" && input.options ? (
                <select
                  id={`calc-${input.id}`}
                  value={String(values[input.id] ?? input.default)}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {input.options.map((opt) => (
                    <option key={opt} value={opt}>{input.optionLabels?.[opt] ?? opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={`calc-${input.id}`}
                  type="number"
                  dir="ltr"
                  value={values[input.id] ?? input.default}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: parseFloat(e.target.value) || 0 }))}
                  min={input.min}
                  max={input.max}
                  step={input.step ?? "any"}
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Outputs */}
        <div className="px-6 pb-6">
          <div className="rounded-xl gradient-warm p-[1px]">
            <div className="rounded-[11px] bg-card p-4 space-y-3">
              {outputs.map((output) => (
                <div key={output.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {output.label} {output.unit && <span className="text-muted-foreground/60">({output.unit})</span>}
                  </span>
                  <motion.span
                    key={output.value}
                    dir="auto"
                    className="font-display font-bold text-lg text-gradient-warm"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    {formatValue(output.value, locale, output.format)}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalculatorCard;
