import { z } from "npm:zod@3.25.76";

export const RequestSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  locale: z.enum(["en", "ar"]).default("en"),
});
export const languageInstruction = (locale: "en" | "ar") => locale === "ar"
  ? "Output language: Arabic. Write every title, description, input/output label, option label and textual unit in natural Arabic, even if the user's prompt is English."
  : "Output language: English. Write every title, description, input/output label, option label and textual unit in English, even if the user's prompt is Arabic.";

const id = z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
const InputSchema = z.object({
  id, label: z.string(), type: z.enum(["number", "select"]), default: z.union([z.number(), z.string()]),
  unit: z.string().optional(), options: z.array(z.string()).optional(), optionLabels: z.record(z.string()).optional(),
  min: z.number().optional(), max: z.number().optional(), step: z.number().optional(),
}).superRefine((input, ctx) => {
  if (input.type === "select" && (!input.options?.length || input.options.some(v => !v.trim() || !Number.isFinite(Number(v))) || !input.options.includes(String(input.default)))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Select values must be numeric strings with a matching default" });
  }
});
export const CalculatorSchema = z.object({
  title: z.string(), description: z.string(), emoji: z.string(),
  inputs: z.array(InputSchema).min(1),
  outputs: z.array(z.object({ id, label: z.string(), formula: z.string().min(1).regex(/^[\x20-\x7E]+$/), unit: z.string().optional(), format: z.enum(["number", "currency", "percent"]).optional() })).min(1),
});