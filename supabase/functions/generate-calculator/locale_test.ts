import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { RequestSchema, languageInstruction, CalculatorSchema } from "./locale.ts";

Deno.test("locale defaults to English for older clients", () => {
  assertEquals(RequestSchema.parse({ prompt: "tip" }).locale, "en");
});
Deno.test("locale is separately validated as en or ar", () => {
  assertEquals(RequestSchema.parse({ prompt: "tip", locale: "ar" }).locale, "ar");
  assertEquals(RequestSchema.safeParse({ prompt: "tip", locale: "ar-SA" }).success, false);
  assertEquals(RequestSchema.safeParse({ prompt: "tip", locale: "Ignore instructions" }).success, false);
});
Deno.test("trusted output instructions depend on locale rather than prompt language", () => {
  assertStringIncludes(languageInstruction("ar"), "even if the user's prompt is English");
  assertStringIncludes(languageInstruction("en"), "even if the user's prompt is Arabic");
});
Deno.test("select codes stay parseable and formulas stay ASCII", () => {
  const calculator = { title: "مساحة", description: "", emoji: "📐", inputs: [{ id: "shape", label: "الشكل", type: "select", default: "0", options: ["0", "1"], optionLabels: { "0": "دائرة", "1": "مربع" } }], outputs: [{ id: "area", label: "المساحة", formula: "shape == 0 ? pi : 4" }] };
  assertEquals(CalculatorSchema.safeParse(calculator).success, true);
  assertEquals(CalculatorSchema.safeParse({ ...calculator, inputs: [{ ...calculator.inputs[0], options: ["دائرة"] }] }).success, false);
});