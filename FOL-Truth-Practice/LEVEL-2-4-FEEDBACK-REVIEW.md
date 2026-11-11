# Levels 2–4: representative feedback for review

**Approved by the repository owner on 2026-11-11.**

## Pedagogical choices

- For a true existential, name one witness and say that it satisfies the matrix. For a false existential, say no object satisfies the matrix. The short feedback does not list every object; the optional full explanation can show more detail.
- For a false universal, name one counterexample and say it fails the matrix. For a true universal, say every object satisfies the matrix.
- For a truth-functional combination of quantified sentences, state the truth value of each part, then the truth value of the whole. Different existential conjuncts may have different witnesses.
- For candidate-object practice, accept every object that satisfies the matrix of a true outermost existential, and every object that fails the matrix of a false outermost universal. The short response states whether that chosen object works and the matrix’s truth value for it.
- “More explanation” can show the existing recursive explainer. Short feedback and candidate responses below illustrate the approved wording; the existing full explainer is also reviewed.

## Representative gallery selections

| Situation | Model | Sentence | Proposed response |
| --- | --- | --- | --- |
| Existential: a witness satisfies both properties | Domain: 1, 2, 3; P: 1, 2; Q: 2, 3; R: none | ∃x (Px ∧ Qx) | Correct! 2 is a witness: (Px ∧ Qx) is true when x is 2. So ∃x (Px ∧ Qx) is true. |
| Existential: different objects satisfy the two properties | Domain: 1, 2, 3; P: 1; Q: 2, 3; R: none | ∃x (Px ∧ Qx) | Not quite. No object makes (Px ∧ Qx) true. So ∃x (Px ∧ Qx) is false. |
| Existential: no object has either property | Domain: 1, 2, 3; P: none; Q: none; R: none | ∃x (Px ∨ Qx) | Not quite. No object makes (Px ∨ Qx) true. So ∃x (Px ∨ Qx) is false. |
| Existential: one object has P without Q | Domain: 1, 2, 3; P: 1, 2; Q: 2, 3; R: none | ∃x (Px ∧ ¬Qx) | Correct! 1 is a witness: (Px ∧ ¬Qx) is true when x is 1. So ∃x (Px ∧ ¬Qx) is true. |
| Three properties: no single object has all three | Domain: 1, 2, 3; P: 1, 2; Q: 2, 3; R: 1, 3 | ∃x (Px ∧ Qx ∧ Rx) | Not quite. No object makes ((Px ∧ Qx) ∧ Rx) true. So ∃x (Px ∧ Qx ∧ Rx) is false. |
| Universal: every object satisfies the matrix | Domain: 1, 2, 3; P: 1, 2; Q: 3; R: none | ∀x (Px ∨ Qx) | Correct! Every object makes (Px ∨ Qx) true. So ∀x (Px ∨ Qx) is true. |
| Universal: a counterexample fails the matrix | Domain: 1, 2, 3; P: 1, 2, 3; Q: 1, 3; R: none | ∀x (Px ∧ Qx) | Not quite. 2 is a counterexample: (Px ∧ Qx) is false when x is 2. So ∀x (Px ∧ Qx) is false. |
| Universal conditional: a false antecedent is harmless | Domain: 1, 2, 3; P: none; Q: none; R: none | ∀x (Px → (Qx ∧ Rx)) | Correct! Every object makes (Px → (Qx ∧ Rx)) true. So ∀x (Px → (Qx ∧ Rx)) is true. |
| Combination: separate witnesses can be different | Domain: 1, 2, 3; P: 1; Q: 2; R: none | (∃x Px) ∧ (∃x Qx) | Correct! ∃x Px is true and ∃x Qx is true. So (∃x Px) ∧ (∃x Qx) is true. |
| Combination: the first part is true and the second is false | Domain: 1, 2, 3; P: 1; Q: 2; R: none | (∃x Px) ∧ (∀x ¬Qx) | Not quite. ∃x Px is true and ∀x ¬Qx is false. So (∃x Px) ∧ (∀x ¬Qx) is false. |
| Conditional: a false antecedent makes it true | Domain: 1, 2, 3; P: 1; Q: none; R: none | (∀x Px) → (∃x Qx) | Correct! ∀x Px is false and ∃x Qx is false. So (∀x Px) → (∃x Qx) is true. |
| Conditional: true antecedent and false consequent | Domain: 1, 2, 3; P: 1, 2, 3; Q: none; R: none | (∀x Px) → (∃x Qx) | Not quite. ∀x Px is true and ∃x Qx is false. So (∀x Px) → (∃x Qx) is false. |

## Representative object choices

| Model | Sentence | Choice | Valid? | Proposed response |
| --- | --- | --- | --- |
| Domain: 1, 2, 3; P: 1; Q: 2; R: none | ∃x (Px ∨ Qx) | 1 | yes | Correct! 1 is a witness: (Px ∨ Qx) is true when x is 1. |
| Domain: 1, 2, 3; P: 1; Q: 2; R: none | ∃x (Px ∨ Qx) | 2 | yes | Correct! 2 is a witness: (Px ∨ Qx) is true when x is 2. |
| Domain: 1, 2, 3; P: 1; Q: 2; R: none | ∃x (Px ∨ Qx) | 3 | no | Not quite. 3 is not a witness: (Px ∨ Qx) is false when x is 3. |
| Domain: 1, 2, 3; P: 1, 2, 3; Q: 1, 3; R: none | ∀x Qx | 1 | no | Not quite. 1 is not a counterexample: Qx is true when x is 1. |
| Domain: 1, 2, 3; P: 1, 2, 3; Q: 1, 3; R: none | ∀x Qx | 2 | yes | Correct! 2 is a counterexample: Qx is false when x is 2. |
| Domain: 1, 2, 3; P: 1, 2, 3; Q: 1, 3; R: none | ∀x Qx | 3 | no | Not quite. 3 is not a counterexample: Qx is true when x is 3. |

## Example of expanded explanation

For the second row above (∃x (Px ∧ Qx), with P only on 1 and Q on 2 and 3), the existing explainer produces:

```text
∃x (Px ∧ Qx) is false because its body is false for every object in the domain.
  With x = 1:
    (Px ∧ Qx) is false because its right conjunct is false.
      Px is true because x = 1 and 1 is in P.
      Qx is false because x = 1 and 1 is not in Q.
  With x = 2:
    (Px ∧ Qx) is false because its left conjunct is false.
      Px is false because x = 2 and 2 is not in P.
      Qx is true because x = 2 and 2 is in Q.
  With x = 3:
    (Px ∧ Qx) is false because its left conjunct is false.
      Px is false because x = 3 and 3 is not in P.
      Qx is true because x = 3 and 3 is in Q.
```

## Lesson scope

- Level 2: ∃x (Px ∧ Qx); variation ∃x (Qx ∧ Rx).
- Level 2: ∃x (Px ∨ Qx); variation ∃x (Qx ∨ Rx).
- Level 2: ∃x (Px ∧ ¬Qx); variation ∃x (Qx ∧ ¬Px).
- Level 2: ∃x (Px ∧ Qx ∧ Rx); variation ∃x (Px ∧ Qx ∧ ¬Rx).
- Level 3: ∀x Px; variation ∀x Qx.
- Level 3: ∀x (Px ∧ Qx); variation ∀x (Qx ∧ Rx).
- Level 3: ∀x (Px ∨ Qx); variation ∀x (Qx ∨ Rx).
- Level 3: ∀x (Px ↔ Qx); variation ∀x (Qx ↔ Rx).
- Level 3: ∀x (Px → (Qx ∧ Rx)); variation ∀x (Qx → (Px ∧ Rx)).
- Level 4: (∃x Px) ∧ (∃x Qx); variation (∃x Qx) ∧ (∃x Rx).
- Level 4: (∃x Px) ∧ (∀x ¬Qx); variation (∃x Qx) ∧ (∀x ¬Px).
- Level 4: (∀x Px) → (∃x Qx); variation (∀x Qx) → (∃x Px).

The already implemented ∃x Px lesson precedes the new Level 2 lessons. Automated checks cover gallery sizes and truth counts, truth conditions, witness and counterexample validity, empty extensions, and conditional edge cases. Additional UI and generation checks will accompany implementation as needed.
