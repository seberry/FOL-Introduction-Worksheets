import type { ConnectiveId } from "./connectives";
import type { ProgressState } from "./progress";

export type StageKind = "recognition" | "connective" | "mixed" | "tables" | "alternate" | "review";

export interface StageDefinition {
  id: string;
  title: string;
  description: string;
  hint?: string;
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
    description: "Practice NOT.",
    hint: "NOT flips the truth value.",
    kind: "connective",
    connectiveIds: ["not"],
    prerequisite: "symbols",
  },
  {
    id: "and",
    title: "AND",
    description: "Practice AND.",
    hint: "AND is true only when both sides are true.",
    kind: "connective",
    connectiveIds: ["and"],
    prerequisite: "not",
  },
  {
    id: "or",
    title: "OR",
    description: "Practice OR.",
    hint: "This class uses inclusive OR: it is false only when both sides are false.",
    kind: "connective",
    connectiveIds: ["or"],
    prerequisite: "and",
  },
  {
    id: "iff",
    title: "IFF",
    description: "Practice IFF.",
    hint: "Look for matching truth values.",
    kind: "connective",
    connectiveIds: ["iff"],
    prerequisite: "or",
  },
  {
    id: "conditional",
    title: "IF…THEN",
    description: "Practice the material conditional.",
    hint: "There is only one false case.",
    kind: "connective",
    connectiveIds: ["conditional"],
    prerequisite: "iff",
  },
  {
    id: "mixed",
    title: "Mixed practice",
    description: "Practice all five connectives at once.",
    kind: "mixed",
    connectiveIds: ["not", "and", "or", "iff", "conditional"],
    prerequisite: "conditional",
  },
  {
    id: "tables",
    title: "Complete truth tables",
    description: "Fill in characteristic truth tables one row at a time.",
    kind: "tables",
    connectiveIds: ["and", "or", "iff", "conditional", "not"],
    prerequisite: "mixed",
  },
  {
    id: "alternate",
    title: "Alternate notation",
    description: "Learn the alternate symbols used in other logic books.",
    kind: "alternate",
    connectiveIds: ["not", "and", "or", "conditional", "iff"],
    prerequisite: "tables",
  },
  {
    id: "review",
    title: "Final review",
    description: "Practice every connective with primary and alternate notation.",
    kind: "review",
    connectiveIds: ["not", "and", "or", "iff", "conditional"],
    prerequisite: "alternate",
  },
];

export function stageUnlocked(stage: StageDefinition, progress: ProgressState, unlockAll = false): boolean {
  return unlockAll || !stage.prerequisite || progress.completedStages.includes(stage.prerequisite);
}
