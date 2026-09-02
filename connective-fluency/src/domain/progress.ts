import type { ConnectiveId } from "./connectives";

export const STORAGE_KEY = "connective-fluency-progress-v1";

export interface SkillStats {
  attempts: number;
  correct: number;
  streak: number;
  mastery: number;
  averageLatencyMs: number;
  lastSeenAt: number;
  lastIncorrectAt?: number;
}

export interface RecentAnswer {
  key: string;
  correct: boolean;
  latencyMs: number;
  answeredAt: number;
}

export interface Settings {
  truthDisplay: "letters" | "words";
  autoAdvance: boolean;
}

export interface ProgressState {
  version: 1;
  skills: Record<string, SkillStats>;
  recentAnswers: RecentAnswer[];
  learnedConnectives: ConnectiveId[];
  completedStages: string[];
  alternateIntroduced: ConnectiveId[];
  settings: Settings;
}

export const DEFAULT_PROGRESS: ProgressState = {
  version: 1,
  skills: {},
  recentAnswers: [],
  learnedConnectives: [],
  completedStages: [],
  alternateIntroduced: [],
  settings: { truthDisplay: "letters", autoAdvance: true },
};

function validProgress(value: unknown): value is ProgressState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ProgressState>;
  return candidate.version === 1 && Boolean(candidate.skills) && Array.isArray(candidate.recentAnswers);
}

export function loadProgress(storage: Pick<Storage, "getItem"> = localStorage): ProgressState {
  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(DEFAULT_PROGRESS);
    const parsed: unknown = JSON.parse(stored);
    if (!validProgress(parsed)) return structuredClone(DEFAULT_PROGRESS);
    return {
      ...structuredClone(DEFAULT_PROGRESS),
      ...parsed,
      settings: { ...DEFAULT_PROGRESS.settings, ...parsed.settings },
    };
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

export function saveProgress(progress: ProgressState, storage: Pick<Storage, "setItem"> = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(storage: Pick<Storage, "removeItem"> = localStorage): ProgressState {
  storage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_PROGRESS);
}

export function updateSkill(
  previous: SkillStats | undefined,
  correct: boolean,
  latencyMs: number,
  now = Date.now(),
): SkillStats {
  const current = previous ?? {
    attempts: 0,
    correct: 0,
    streak: 0,
    mastery: 0,
    averageLatencyMs: 0,
    lastSeenAt: 0,
  };
  const attempts = current.attempts + 1;
  const averageLatencyMs = Math.round(
    (current.averageLatencyMs * current.attempts + latencyMs) / attempts,
  );
  const speedAdjustment = correct && latencyMs < 7000 ? 0.03 : correct && latencyMs > 12000 ? -0.03 : 0;
  const masteryDelta = correct ? 0.16 + Math.min(current.streak, 3) * 0.025 + speedAdjustment : -0.28;
  return {
    attempts,
    correct: current.correct + (correct ? 1 : 0),
    streak: correct ? current.streak + 1 : 0,
    mastery: Math.max(0, Math.min(1, current.mastery + masteryDelta)),
    averageLatencyMs,
    lastSeenAt: now,
    ...(correct ? { lastIncorrectAt: current.lastIncorrectAt } : { lastIncorrectAt: now }),
  };
}

export function recordAnswer(
  progress: ProgressState,
  key: string,
  correct: boolean,
  latencyMs: number,
  now = Date.now(),
): ProgressState {
  return {
    ...progress,
    skills: { ...progress.skills, [key]: updateSkill(progress.skills[key], correct, latencyMs, now) },
    recentAnswers: [
      { key, correct, latencyMs, answeredAt: now },
      ...progress.recentAnswers,
    ].slice(0, 80),
  };
}

export type MasteryLabel = "Not started" | "Needs practice" | "Learning" | "Comfortable";

export function masteryLabel(stats: SkillStats | undefined): MasteryLabel {
  if (!stats?.attempts) return "Not started";
  if (stats.mastery < 0.3 || stats.streak === 0) return "Needs practice";
  if (stats.mastery < 0.72 || stats.attempts < 3) return "Learning";
  return "Comfortable";
}

export function groupMastery(progress: ProgressState, prefix: string): MasteryLabel {
  const entries = Object.entries(progress.skills).filter(([key]) => key.startsWith(prefix));
  if (!entries.length) return "Not started";
  const scores = entries.map(([, stats]) => stats.mastery);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const minimum = Math.min(...scores);
  if (minimum < 0.2) return "Needs practice";
  if (average < 0.68 || entries.some(([, stats]) => stats.attempts < 2)) return "Learning";
  return "Comfortable";
}
