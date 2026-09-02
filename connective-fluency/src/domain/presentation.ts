import type { ConnectiveId } from "./connectives";
import type { ProgressState } from "./progress";
import { createItems } from "./scheduler";

export type PracticePresentation = "expanded" | "compact";

export function initialCoverageComplete(progress: ProgressState, connectiveId: ConnectiveId): boolean {
  return createItems([connectiveId]).every((item) => progress.skills[item.key]?.attempts);
}

export function practicePresentation(progress: ProgressState, connectiveIds: ConnectiveId[]): PracticePresentation {
  const preference = progress.settings.practicePresentation;
  if (preference === "expanded") return "expanded";
  if (preference === "compact" || connectiveIds.length !== 1) return "compact";
  return progress.compactIntroduced.includes(connectiveIds[0]) ? "compact" : "expanded";
}

export function compactTransitionDue(progress: ProgressState, connectiveId: ConnectiveId): boolean {
  return progress.settings.practicePresentation === "guided"
    && !progress.compactIntroduced.includes(connectiveId)
    && initialCoverageComplete(progress, connectiveId);
}
