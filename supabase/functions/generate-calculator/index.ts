import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a calculator generator. Given a natural language description, produce a JSON object representing an interactive calculator.

The JSON must follow this exact schema:
{
  "title": "Calculator Name",
  "description": "Brief description",
  "emoji": "relevant emoji",
  "inputs": [
    {
      "id": "unique_id",
      "label": "Input Label",
      "type": "number" | "select",
      "default": number or string,
      "unit": "optional unit string",
      "options": ["only for select type"],
      "min": optional number,
      "max": optional number,
      "step": optional number
    }
  ],
  "outputs": [
    {
      "id": "unique_id",
      "label": "Output Label",
      "formula": "math expression using input ids as variables, e.g. price * quantity * (1 + tax_rate / 100)",
      "unit": "optional unit string",
      "format": "number" | "currency" | "percent"
    }
  ]
}

Rules:
- Use simple math expressions with +, -, *, /, parentheses, and basic functions (sqrt, pow, abs, round, ceil, floor, min, max, log, exp, pi)
- Input ids must be valid JS identifiers (snake_case)
- For select inputs, map option values to numbers in the formula using ternary-like logic or just use the numeric value
- Always provide sensible defaults
- Keep it practical and useful
- Return ONLY the JSON, no markdown, no code blocks, no explanation`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt.trim().slice(0, 500) },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Failed to generate calculator" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "No response from AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Try to parse the JSON from the response
    let calculator;
    try {
      // Remove markdown code blocks if present
      const cleaned = content.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
      calculator = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse calculator. Please try rephrasing." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ calculator }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-calculator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
