import { describe, expect, it } from "vitest";
import { CONNECTIVES, SYMBOL_TO_CONNECTIVE } from "../domain/connectives";

describe("characteristic truth functions", () => {
  it("evaluates NOT", () => {
    expect(CONNECTIVES.not.evaluate(true)).toBe(false);
    expect(CONNECTIVES.not.evaluate(false)).toBe(true);
  });

  it("evaluates AND", () => {
    expect([true, true, false, false].map((a, index) => CONNECTIVES.and.evaluate(a, [true, false, true, false][index]))).toEqual([true, false, false, false]);
  });

  it("evaluates inclusive OR", () => {
    expect(CONNECTIVES.or.evaluate(true, true)).toBe(true);
    expect(CONNECTIVES.or.evaluate(false, false)).toBe(false);
  });

  it("evaluates IFF", () => {
    expect(CONNECTIVES.iff.evaluate(true, false)).toBe(false);
    expect(CONNECTIVES.iff.evaluate(false, false)).toBe(true);
  });

  it("evaluates the conditional's crucial cases", () => {
    expect(CONNECTIVES.conditional.evaluate(true, false)).toBe(false);
    expect(CONNECTIVES.conditional.evaluate(false, true)).toBe(true);
  });

  it("maps every alternate symbol to the same operation", () => {
    Object.values(CONNECTIVES).forEach((connective) => {
      connective.alternateSymbols.forEach((symbol) => {
        expect(SYMBOL_TO_CONNECTIVE[symbol]).toBe(connective.id);
        expect(CONNECTIVES[SYMBOL_TO_CONNECTIVE[symbol]].evaluate(true, false)).toBe(connective.evaluate(true, false));
      });
    });
  });
});
