# Error-feedback reference

This page collects the explanations shown after an incorrect answer in **Match the Pattern**.

## Shared fallback messages

Some early or routine exercises use a shared message instead of a different explanation for every distractor.

- Formula-completion fallback: “Compare the whole formulas in the proof with each line of the rule schema.”
- Metavariable-question fallback: “Look for the complete formula occupying that placeholder—not just a letter inside it.”

## Level 1: Conjunction Introduction (`&I`)

### Problem 1 — correct answer: `P & Q`

- If `P → Q`: “That makes a conditional. &I joins the two available formulas with &.”
- If `Q`: “That repeats line 2. &I should put both available formulas together.”
- If `P`: “That repeats line 1. &I should put both available formulas together.”

### Problem 2 — correct answer: `~P & R`

- If `~(P & R)`: “The negation belongs only to P on line 1. &I does not move it outside the new conjunction.”
- If `P & R`: “Line 1 is ~P, not P. Keep each complete formula unchanged when you join them.”
- If `~P`: “That uses only one premise. &I combines both formulas.”

### Problem 3 — correct answer: `(P → Q) & ~R`

- If `P → (Q & ~R)`: “That places only Q together with ~R. The whole formula P → Q is playing the role of 𝔄.”
- If `Q & ~R`: “Q is only part of line 1. &I uses the whole formula P → Q.”
- If `(P & Q) → ~R`: “&I puts an & between the two whole formulas; it does not rearrange their insides.”

### Problem 4 — correct answer: `(P & Q) & (R → S)`

- If `Q & R`: “That takes pieces from inside the premises. 𝔄 and 𝔅 stand for the two whole formulas.”
- If `P & (Q → R)`: “This changes both premises. &I preserves them and adds a new main &.”
- If `(P & Q) → (R → S)`: “The rule here is &I, so the new main connective must be &.”

### Problems 5–6

- Problem 5 uses the metavariable-question fallback.
- Problem 6 uses the formula-completion fallback.

## Level 2: Conjunction Elimination (`&E`)

### Problems 1–3

These introductory exercises use the formula-completion fallback.

### Problem 4 — correct answer: `P → Q`

- If `Q`: “Q is only a part of the first conjunct. &E takes out one of the two complete conjuncts.”
- If `P`: “P is buried inside the first conjunct. The whole first conjunct is P → Q.”
- If `Q & R`: “Those pieces are not the two conjuncts shown by the main &: they are (P → Q) and R.”

### Problem 5

This exercise uses the metavariable-question fallback.

### Problem 6 — correct answer: `R & S`

- If `S`: “S is only part of the second conjunct. The whole second conjunct is R & S.”
- If `P → Q`: “The first conjunct is ~(P → Q), including its negation. &E cannot drop the ~.”
- If `~R & S`: “&E copies a whole conjunct exactly; it does not move a negation into it.”

## Level 3: Conditional Elimination (`→E`)

### Problem 1

This introductory exercise uses the formula-completion fallback.

### Problem 2 — correct answer: `R`

- If `Q`: “The second premise matches the whole antecedent P & Q, so →E gives the consequent R.”
- If `P`: “P is only part of the antecedent. Once the whole antecedent is present, conclude R.”
- If `P & Q`: “That repeats the antecedent. →E takes you to the consequent R.”

### Problem 3 — correct answer: `Q & R`

- If `Q`: “𝔅 is the whole consequent Q & R. →E gives all of 𝔅, not just its first part.”
- If `R`: “𝔅 is the whole consequent Q & R. →E gives all of 𝔅, not just its second part.”
- If `P & Q`: “→E copies the consequent of line 1; it does not build a new conjunction.”

### Problem 4 — correct answer: `P → Q`

- If `Q`: “The antecedent 𝔄 is the entire formula P → Q, not merely its consequent Q.”
- If `R`: “R is part of 𝔅. The missing premise must match 𝔄, the whole left side of the conditional.”
- If `R & S`: “That is 𝔅. →E requires 𝔄 as the second premise in order to conclude 𝔅.”

### Problem 5

This exercise uses the metavariable-question fallback.

### Problem 6 — correct answer: `~P`

- If `P`: “The antecedent is ~P. P and ~P do not match.”
- If `Q`: “Q is only part of the consequent. The needed second premise is the antecedent ~P.”
- If `Q & R`: “That is the result 𝔅. To reach it by →E, the other premise must be 𝔄, which is ~P.”

## Level 4: Mixed Rule Practice

The mixed exercises explain the selected rule. Only explanations for an incorrect selection are shown.

- If `&I` is selected: “&I combines two formulas into a conjunction.”
- If `&E` is selected: “&E takes one whole conjunct from a conjunction.”
- If `→E` is selected: “→E uses a conditional and its antecedent to reach its consequent.”

Problems 1 and 4 have `&I` as the correct answer, Problems 2 and 5 have `&E`, and Problems 3 and 6 have `→E`.
