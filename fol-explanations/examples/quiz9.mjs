// Transcribed from Quiz_9_Monadic_FOL_Truth_A_C (3).pdf (three pages).
// This is sample data, not a parser for quiz PDFs.
export const versions = {
  A: { domain: [1, 2, 3], constants: { c: 2 }, predicates: { P: [1, 2], Q: [1, 3], R: [1] } },
  B: { domain: [1, 2, 3], constants: { c: 3 }, predicates: { P: [1, 2, 3], Q: [], R: [1, 2] } },
  C: { domain: [1, 2, 3], constants: { c: 1 }, predicates: { P: [2], Q: [3], R: [1, 2] } }
};

export const questions = [
  { number: 1, formula: '¬P(c) ∨ Q(c)', objectRequested: false },
  { number: 2, formula: '∃x (P(x) ∧ Q(x) ∧ R(x))', objectRequested: true },
  { number: 3, formula: '∃x (P(x) ∧ ¬Q(x))', objectRequested: true },
  { number: 4, formula: '∀x (P(x) → (Q(x) ∨ R(x)))', objectRequested: true },
  { number: 5, formula: '∀x (P(x) ∨ Q(x))', objectRequested: true },
  { number: 6, formula: '(∃x P(x)) ∧ (∃x Q(x))', objectRequested: false },
  { number: 7, formula: '(∀x P(x)) → (∃x Q(x))', objectRequested: false }
];

export const polyadicModel = {
  domain: [1, 2, 3], constants: { a: 1, b: 2 },
  predicates: { R: [[1, 1], [1, 2], [1, 3], [2, 2]], P: [1, 3] }
};
