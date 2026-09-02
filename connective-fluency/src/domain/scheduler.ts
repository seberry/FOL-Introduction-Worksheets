import {
  CONNECTIVES,
  evaluationKey,
  getCases,
  type ConnectiveId,
} from "./connectives";
import type { ProgressState, SkillStats } from "./progress";

export interface PracticeItem {
  key: string;
  connectiveId: ConnectiveId;
  a: boolean;
  b?: boolean;
}

export function createItems(connectiveIds: ConnectiveId[]): PracticeItem[] {
  return connectiveIds.flatMap((connectiveId) =>
    getCases(CONNECTIVES[connectiveId]).map(({ a, b }) => ({
      key: evaluationKey(connectiveId, a, b),
      connectiveId,
      a,
      ...(b === undefined ? {} : { b }),
    })),
  );
}

export function schedulingWeight(stats: SkillStats | undefined, now = Date.now()): number {
  if (!stats) return 12;
  const lowMastery = (1 - stats.mastery) * 7;
  const recentMiss = stats.lastIncorrectAt && now - stats.lastIncorrectAt < 10 * 60_000 ? 6 : 0;
  const slowRecall = stats.averageLatencyMs > 9000 ? Math.min(2.5, stats.averageLatencyMs / 8000) : 0;
  const spacing = Math.min(3, Math.max(0, now - stats.lastSeenAt) / 86_400_000);
  return Math.max(0.6, 1 + lowMastery + recentMiss + slowRecall + spacing);
}

export function choosePracticeItem(
  items: PracticeItem[],
  progress: ProgressState,
  recentKeys: string[] = [],
  random = Math.random,
  now = Date.now(),
): PracticeItem {
  if (!items.length) throw new Error("Cannot schedule from an empty item list.");

  const unseen = items.filter((item) => !progress.skills[item.key]);
  if (unseen.length) {
    const unseenEligible = unseen.filter((item) => !recentKeys.slice(-2).includes(item.key));
    return (unseenEligible.length ? unseenEligible : unseen)[0];
  }

  const eligible = items.filter((item) => !recentKeys.slice(-2).includes(item.key));
  const notImmediateRepeat = items.filter((item) => !recentKeys.slice(-1).includes(item.key));
  const pool = eligible.length ? eligible : notImmediateRepeat.length ? notImmediateRepeat : items;
  const weighted = pool.map((item) => ({ item, weight: schedulingWeight(progress.skills[item.key], now) }));
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = random() * total;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

export function isConnectiveLearned(progress: ProgressState, id: ConnectiveId): boolean {
  const stats = createItems([id]).map((item) => progress.skills[item.key]);
  return stats.every((skill) => skill && skill.attempts >= 2 && skill.mastery >= 0.5);
}

export function missedItemHasPriority(
  item: PracticeItem,
  progress: ProgressState,
  now = Date.now(),
): boolean {
  const missed = progress.skills[item.key];
  if (!missed) return false;
  const baseline = { ...missed, lastIncorrectAt: undefined, mastery: Math.min(1, missed.mastery + 0.28) };
  return schedulingWeight(missed, now) > schedulingWeight(baseline, now);
}
