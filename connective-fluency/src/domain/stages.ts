import type { ConnectiveId } from "./connectives";
import type { ProgressState } from "./progress";

export type StageKind = "recognition" | "connective" | "mixed" | "tables" | "alternate" | "review";

export interface StageDefinition {
  id: string;
  title: string;
  description: string;
  kind: StageKind;
  connectiveIds: ConnectiveId[];
  prerequisite?: string;
}

export const STAGES: StageDefinition[] = [
  {
    id: "symbols",
    title: "Symbols: AND and OR",
    description: "Match the first two symbols with their ordinary-language names.",
    kind: "recognition",
    connectiveIds: ["and", "or"],
  },
  {
    id: "not",
    title: "NOT",
    description: "Learn how NOT flips a truth value.",
    kind: "connective",
    connectiveIds: ["not"],
    prerequisite: "symbols",
  },
  {
    id: "and",
    title: "AND",
    description: "Practice all four AND cases.",
    kind: "connective",
    connectiveIds: ["and"],
    prerequisite: "not",
  },
  {
    id: "or",
    title: "OR",
    description: "Practice inclusive OR, including the both-true case.",
    kind: "connective",
    connectiveIds: ["or"],
    prerequisite: "and",
  },
  {
    id: "iff",
    title: "IFF",
    description: "Compare whether both sides have the same truth value.",
    kind: "connective",
    connectiveIds: ["iff"],
    prerequisite: "or",
  },
  {
    id: "conditional",
    title: "IF…THEN",
    description: "Focus on the conditional's one false case.",
    kind: "connective",
    connectiveIds: ["conditional"],
    prerequisite: "iff",
  },
  {
    id: "mixed",
    title: "Mixed practice",
    description: "Retrieve the truth functions without knowing which comes next.",
    kind: "mixed",
    connectiveIds: ["not", "and", "or", "iff", "conditional"],
    prerequisite: "conditional",
  },
  {
    id: "tables",
    title: "Build truth tables",
    description: "Reconstruct each characteristic table one output at a time.",
    kind: "tables",
    connectiveIds: ["and", "or", "iff", "conditional", "not"],
    prerequisite: "mixed",
  },
  {
    id: "alternate",
    title: "Alternate notation",
    description: "Connect familiar operations with symbols used in other books.",
    kind: "alternate",
    connectiveIds: ["not", "and", "or", "conditional", "iff"],
    prerequisite: "tables",
  },
  {
    id: "review",
    title: "Mixed review",
    description: "Keep every connective available with both notation systems.",
    kind: "review",
    connectiveIds: ["not", "and", "or", "iff", "conditional"],
    prerequisite: "alternate",
  },
];

export function stageUnlocked(stage: StageDefinition, progress: ProgressState, unlockAll = false): boolean {
  return unlockAll || !stage.prerequisite || progress.completedStages.includes(stage.prerequisite);
}
