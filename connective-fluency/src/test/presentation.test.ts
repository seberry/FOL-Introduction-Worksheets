import { describe, expect, it } from "vitest";
import { DEFAULT_PROGRESS, recordAnswer } from "../domain/progress";
import { compactTransitionDue, initialCoverageComplete, practicePresentation } from "../domain/presentation";
import { createItems } from "../domain/scheduler";

describe("guided practice presentation", () => {
  it("keeps every initial case expanded until coverage is complete", () => {
    let progress = structuredClone(DEFAULT_PROGRESS);
    expect(practicePresentation(progress, ["and"])).toBe("expanded");
    for (const item of createItems(["and"])) progress = recordAnswer(progress, item.key, true, 100, 1);
    expect(initialCoverageComplete(progress, "and")).toBe(true);
    expect(compactTransitionDue(progress, "and")).toBe(true);
  });

  it("uses compact presentation after the persisted transition", () => {
    const progress = { ...structuredClone(DEFAULT_PROGRESS), compactIntroduced: ["and" as const] };
    expect(practicePresentation(progress, ["and"])).toBe("compact");
    expect(compactTransitionDue(progress, "and")).toBe(false);
  });

  it("never changes Expanded mode and uses Compact immediately", () => {
    const expanded = { ...structuredClone(DEFAULT_PROGRESS), settings: { practicePresentation: "expanded" as const, autoAdvance: true } };
    const compact = { ...structuredClone(DEFAULT_PROGRESS), settings: { practicePresentation: "compact" as const, autoAdvance: true } };
    expect(practicePresentation(expanded, ["not"])).toBe("expanded");
    expect(practicePresentation(compact, ["not"])).toBe("compact");
  });

  it("uses compact practice for mixed retrieval in Guided mode", () => {
    expect(practicePresentation(structuredClone(DEFAULT_PROGRESS), ["not", "and"])).toBe("compact");
  });
});
