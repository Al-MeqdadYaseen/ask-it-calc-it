import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { evaluate } from "mathjs";
import { CalculatorDefinition } from "@/types/calculator";
import { RotateCcw } from "lucide-react";

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  onReset: () => void;
}

const CalculatorCard = ({ calculator, onReset }: CalculatorCardProps) => {
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

  const formatValue = (value: number, format?: string) => {
    if (isNaN(value)) return "—";
    switch (format) {
      case "currency":
        return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "percent":
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{calculator.emoji}</span>
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">{calculator.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{calculator.description}</p>
            </div>
          </div>
          <motion.button
            onClick={onReset}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            whileHover={{ rotate: -90 }}
            whileTap={{ scale: 0.9 }}
            title="New calculator"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-4">
          {calculator.inputs.map((input) => (
            <div key={input.id}>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                {input.label} {input.unit && <span className="text-muted-foreground/60">({input.unit})</span>}
              </label>
              {input.type === "select" && input.options ? (
                <select
                  value={String(values[input.id] ?? input.default)}
                  onChange={(e) => setValues((v) => ({ ...v, [input.id]: e.target.value }))}
                  className="w-full rounded-xl bg-secondary border border-border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {input.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
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
                <div key={output.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {output.label} {output.unit && <span className="text-muted-foreground/60">({output.unit})</span>}
                  </span>
                  <motion.span
                    key={output.value}
                    className="font-display font-bold text-lg text-gradient-warm"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    {formatValue(output.value, output.format)}
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
