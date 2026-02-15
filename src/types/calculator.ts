export interface CalculatorInput {
  id: string;
  label: string;
  type: "number" | "select";
  default: number | string;
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface CalculatorOutput {
  id: string;
  label: string;
  formula: string;
  unit?: string;
  format?: "number" | "currency" | "percent";
}

export interface CalculatorDefinition {
  title: string;
  description: string;
  emoji: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export const EXAMPLE_PROMPTS = [
  { emoji: "💰", label: "Tip Calculator", prompt: "A restaurant tip calculator with bill amount, tip percentage, and number of people splitting" },
  { emoji: "🏠", label: "Mortgage", prompt: "A monthly mortgage payment calculator with home price, down payment, interest rate, and loan term" },
  { emoji: "🏋️", label: "BMI Calculator", prompt: "A BMI calculator with height in feet/inches and weight in pounds" },
  { emoji: "📐", label: "Area Calculator", prompt: "A calculator for the area of different shapes: circle, rectangle, and triangle" },
  { emoji: "💼", label: "Freelance Rate", prompt: "A freelance hourly rate calculator based on desired annual salary, work hours per week, vacation weeks, and expenses" },
  { emoji: "⛽", label: "Road Trip Cost", prompt: "A road trip fuel cost calculator with distance, fuel efficiency in MPG, and gas price per gallon" },
];
