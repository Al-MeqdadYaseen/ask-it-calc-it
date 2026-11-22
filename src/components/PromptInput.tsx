import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

import { useLanguage } from "./LanguageProvider";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <motion.div
        className="relative rounded-2xl bg-card border border-border p-1.5 glow-primary"
        whileFocus={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.promptLabel}
            dir="auto"
            className="min-w-0 w-full flex-1 bg-transparent px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none font-sans text-base"
            disabled={isLoading}
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="gradient-warm rounded-xl px-3 sm:px-5 py-3 h-auto shrink-0 font-display font-semibold text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span role={isLoading ? "status" : undefined}>{isLoading ? t.generating : t.generate}</span>
          </Button>
        </div>
      </motion.div>
    </form>
  );
};

export default PromptInput;
