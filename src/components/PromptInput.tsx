import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
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
            placeholder="Describe any calculator you can imagine..."
            className="flex-1 bg-transparent px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none font-sans text-base"
            disabled={isLoading}
            maxLength={500}
          />
          <motion.button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="gradient-warm rounded-xl px-5 py-3 font-display font-semibold text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? "Generating..." : "Generate"}
          </motion.button>
        </div>
      </motion.div>
    </form>
  );
};

export default PromptInput;
