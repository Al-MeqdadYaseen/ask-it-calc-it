import { motion } from "framer-motion";
import { EXAMPLE_PROMPTS } from "@/types/calculator";

interface ExampleChipsProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

const ExampleChips = ({ onSelect, disabled }: ExampleChipsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
      {EXAMPLE_PROMPTS.map((example, i) => (
        <motion.button
          key={example.label}
          onClick={() => !disabled && onSelect(example.prompt)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border hover:border-primary/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>{example.emoji}</span>
          <span>{example.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ExampleChips;
