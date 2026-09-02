import { describe, expect, it } from "vitest";
import { DEFAULT_PROGRESS, STORAGE_KEY, loadProgress, resetProgress, saveProgress } from "../domain/progress";

describe("local progress persistence", () => {
  it("uses word notation for fresh progress", () => {
    expect(loadProgress().settings.truthDisplay).toBe("words");
  });

  it("survives a reload from localStorage", () => {
    const progress = { ...structuredClone(DEFAULT_PROGRESS), completedStages: ["symbols"] };
    saveProgress(progress);
    expect(loadProgress().completedStages).toEqual(["symbols"]);
  });

  it("reset removes stored progress", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_PROGRESS, completedStages: ["symbols"] }));
    const result = resetProgress();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(result).toEqual(DEFAULT_PROGRESS);
  });

  it("migrates legacy settings without losing mastery or recent answers", () => {
    const legacy = {
      ...structuredClone(DEFAULT_PROGRESS),
      settings: { autoAdvance: false },
      skills: { "eval:not:T": { attempts: 3, correct: 3, streak: 3, mastery: 0.6, averageLatencyMs: 100, lastSeenAt: 1 } },
      recentAnswers: [{ key: "eval:not:T", correct: true, latencyMs: 100, answeredAt: 1 }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
    const migrated = loadProgress();
    expect(migrated.settings).toEqual({ truthDisplay: "words", autoAdvance: false });
    expect(migrated.skills).toEqual(legacy.skills);
    expect(migrated.recentAnswers).toEqual(legacy.recentAnswers);
  });

  it("keeps an explicit T/F preference across reloads", () => {
    saveProgress({ ...structuredClone(DEFAULT_PROGRESS), settings: { truthDisplay: "letters", autoAdvance: true } });
    expect(loadProgress().settings.truthDisplay).toBe("letters");
  });
});
