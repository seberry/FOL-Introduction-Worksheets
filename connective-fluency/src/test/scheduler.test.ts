import { describe, expect, it } from "vitest";
import { DEFAULT_PROGRESS, recordAnswer } from "../domain/progress";
import { createItems, missedItemHasPriority, schedulingWeight } from "../domain/scheduler";

describe("adaptive scheduling", () => {
  it("raises priority after a miss", () => {
    const item = createItems(["and"])[1];
    const missed = recordAnswer(structuredClone(DEFAULT_PROGRESS), item.key, false, 2500, 10_000);
    expect(missedItemHasPriority(item, missed, 11_000)).toBe(true);
  });

  it("gives weak and slow skills more weight than fluent skills", () => {
    const weak = { attempts: 4, correct: 2, streak: 0, mastery: 0.2, averageLatencyMs: 12_000, lastSeenAt: 10_000, lastIncorrectAt: 10_000 };
    const fluent = { attempts: 8, correct: 8, streak: 8, mastery: 0.95, averageLatencyMs: 1800, lastSeenAt: 10_000 };
    expect(schedulingWeight(weak, 11_000)).toBeGreaterThan(schedulingWeight(fluent, 11_000));
  });
});
