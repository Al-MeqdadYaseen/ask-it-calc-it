import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { detectLocale, direction, formatValue, initialLocale, LANGUAGE_KEY, rememberLocale } from "./locale";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguageSwitch from "@/components/LanguageSwitch";
import CalculatorCard from "@/components/CalculatorCard";

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
describe("locale detection", () => {
  it("chooses first supported browser preference including regional tags", () => {
    expect(detectLocale(["fr-FR", "ar-SA", "en-GB"])).toBe("ar");
    expect(detectLocale(["en-GB", "ar-SA"])).toBe("en");
    expect(detectLocale(["AR-eg"])).toBe("ar");
  });
  it("falls back to English for unsupported or empty preferences", () => {
    expect(detectLocale(["fr", "de"])).toBe("en");
    expect(detectLocale([])).toBe("en");
  });
  it("honors only a valid stored override", () => {
    expect(detectLocale(["ar-SA"], "en")).toBe("en");
    expect(detectLocale(["en-GB"], "ar")).toBe("ar");
    expect(detectLocale(["ar-SA"], "fr")).toBe("ar");
    rememberLocale("ar");
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("ar");
    expect(initialLocale()).toBe("ar");
  });
  it("still detects and switches when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(navigator, "languages", "get").mockReturnValue(["ar-SA"]);
    expect(initialLocale()).toBe("ar");
    expect(() => rememberLocale("en")).not.toThrow();
  });
  it("sets Arabic RTL and English LTR on the document and persists explicit switching", () => {
    localStorage.setItem(LANGUAGE_KEY, "en");
    render(<LanguageProvider><LanguageSwitch /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(direction("en")).toBe("ltr");
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("ar");
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(document.documentElement.dir).toBe("ltr");
  });
  it("preserves edited values and generated language when switching", () => {
    localStorage.setItem(LANGUAGE_KEY, "en");
    const calculator = { locale: "en" as const, title: "Tip", description: "", emoji: "💰", inputs: [{ id: "bill", label: "Bill", type: "number" as const, default: 100 }], outputs: [{ id: "tip", label: "Tip", formula: "bill * 0.2" }] };
    const reset = vi.fn();
    render(<LanguageProvider><LanguageSwitch /><CalculatorCard calculator={calculator} onReset={reset} /></LanguageProvider>);
    fireEvent.change(screen.getByLabelText("Bill"), { target: { value: "250" } });
    fireEvent.click(screen.getByRole("button", { name: "العربية" }));
    expect(screen.getByLabelText("Bill")).toHaveValue(250);
    expect(screen.getByLabelText("Bill").closest("[lang]")?.getAttribute("lang")).toBe("en");
    expect(reset).not.toHaveBeenCalled();
  });
  it("formats numbers by locale without converting dollars or percentage points", () => {
    expect(formatValue(1234.5, "en")).toBe("1,234.5");
    expect(formatValue(1234.5, "ar")).toBe(new Intl.NumberFormat("ar", { maximumFractionDigits: 2 }).format(1234.5));
    expect(formatValue(20, "en", "percent")).toBe("20.0%");
    expect(formatValue(20, "ar", "percent")).toBe(new Intl.NumberFormat("ar", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(0.2));
    expect(formatValue(25, "ar", "currency")).toBe(`$${new Intl.NumberFormat("ar", { minimumFractionDigits: 2 }).format(25)}`);
  });
});