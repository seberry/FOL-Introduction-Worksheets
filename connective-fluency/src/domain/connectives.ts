export type TruthValue = boolean;
export type ConnectiveId = "not" | "and" | "or" | "iff" | "conditional";

export interface Connective {
  id: ConnectiveId;
  primarySymbol: string;
  alternateSymbols: string[];
  shortName: string;
  technicalName: string;
  rule: string;
  expandedRule?: string;
  arity: 1 | 2;
  spokenName: string;
  evaluate: (a: TruthValue, b?: TruthValue) => TruthValue;
}

export const CONNECTIVES: Record<ConnectiveId, Connective> = {
  not: {
    id: "not",
    primarySymbol: "¬",
    alternateSymbols: ["~"],
    shortName: "NOT",
    technicalName: "negation",
    rule: "NOT flips the truth value.",
    arity: 1,
    spokenName: "not",
    evaluate: (a) => !a,
  },
  and: {
    id: "and",
    primarySymbol: "∧",
    alternateSymbols: ["&"],
    shortName: "AND",
    technicalName: "conjunction",
    rule: "AND is true only when both sides are true.",
    arity: 2,
    spokenName: "and",
    evaluate: (a, b) => a && Boolean(b),
  },
  or: {
    id: "or",
    primarySymbol: "∨",
    alternateSymbols: ["v"],
    shortName: "OR",
    technicalName: "disjunction",
    rule: "OR is true when at least one side is true.",
    expandedRule: "In logic, OR means A or B or both.",
    arity: 2,
    spokenName: "or",
    evaluate: (a, b) => a || Boolean(b),
  },
  iff: {
    id: "iff",
    primarySymbol: "↔",
    alternateSymbols: ["≡"],
    shortName: "IFF",
    technicalName: "biconditional",
    rule: "IFF is true when both sides have the same truth value.",
    expandedRule: "It is true when both are true or both are false.",
    arity: 2,
    spokenName: "if and only if",
    evaluate: (a, b) => a === b,
  },
  conditional: {
    id: "conditional",
    primarySymbol: "→",
    alternateSymbols: ["⊃"],
    shortName: "IF…THEN",
    technicalName: "conditional",
    rule: "IF…THEN is false only when the first part is true and the second part is false.",
    expandedRule: "The first part is the antecedent; the second part is the consequent.",
    arity: 2,
    spokenName: "if then",
    evaluate: (a, b) => !a || Boolean(b),
  },
};

export const CONNECTIVE_ORDER: ConnectiveId[] = ["not", "and", "or", "iff", "conditional"];

export const SYMBOL_RECOGNITION_ORDER: ConnectiveId[] = ["and", "or", "not", "iff", "conditional"];

export function truthLabel(value: TruthValue, words = false): string {
  return words ? (value ? "TRUE" : "FALSE") : value ? "T" : "F";
}

export function caseCode(a: TruthValue, b?: TruthValue): string {
  return `${a ? "T" : "F"}${b === undefined ? "" : b ? "T" : "F"}`;
}

export function evaluationKey(id: ConnectiveId, a: TruthValue, b?: TruthValue): string {
  return `eval:${id}:${caseCode(a, b)}`;
}

export function recognitionKey(id: ConnectiveId, direction: "symbol-name" | "name-symbol"): string {
  return `recognition:${direction}:${id}`;
}

export function parseEvaluationKey(key: string): { connectiveId: ConnectiveId; a: boolean; b?: boolean } | null {
  const match = /^eval:(not|and|or|iff|conditional):([TF])([TF])?$/.exec(key);
  if (!match) return null;
  return {
    connectiveId: match[1] as ConnectiveId,
    a: match[2] === "T",
    ...(match[3] ? { b: match[3] === "T" } : {}),
  };
}

export function getCases(connective: Connective): Array<{ a: boolean; b?: boolean }> {
  if (connective.arity === 1) return [{ a: true }, { a: false }];
  return [
    { a: true, b: true },
    { a: true, b: false },
    { a: false, b: true },
    { a: false, b: false },
  ];
}

export function formatExpression(
  connective: Connective,
  a: boolean,
  b: boolean | undefined,
  symbol: string,
  words = false,
): string {
  const left = truthLabel(a, words);
  return connective.arity === 1 ? `${symbol}${left}` : `${left} ${symbol} ${truthLabel(Boolean(b), words)}`;
}

export function spokenExpression(connective: Connective, a: boolean, b?: boolean): string {
  const left = a ? "true" : "false";
  return connective.arity === 1
    ? `${connective.spokenName} ${left}`
    : `${left} ${connective.spokenName} ${b ? "true" : "false"}`;
}

export const SYMBOL_TO_CONNECTIVE = Object.values(CONNECTIVES).reduce<Record<string, ConnectiveId>>(
  (map, connective) => {
    map[connective.primarySymbol] = connective.id;
    connective.alternateSymbols.forEach((symbol) => {
      map[symbol] = connective.id;
    });
    return map;
  },
  {},
);
