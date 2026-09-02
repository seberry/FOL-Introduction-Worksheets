import { describe, expect, it } from "vitest";
import { DEFAULT_PROGRESS, STORAGE_KEY, loadProgress, resetProgress, saveProgress } from "../domain/progress";

describe("local progress persistence", () => {
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
});
