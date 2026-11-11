# Feedback reference: relations in a model

The owner approved the pedagogical approach and examples in [the polyadic plan](../FOL-Truth-Practice/POLYADIC-GAME-PLAN.md). The first playable chunk uses its ordered-pair feedback pattern for the fixed sentence and variations, including reverse order and self-relations:

- Rab, a = 1, b = 2, ⟨1, 2⟩ in R: **Correct!** a names 1 and b names 2. ⟨1, 2⟩ is in R, so Rab is true.
- Rab, a = 1, b = 2, only ⟨2, 1⟩ in R: **Not quite.** a names 1 and b names 2. ⟨1, 2⟩ is not in R, so Rab is false.
- Rba, a = 1, b = 2, only ⟨1, 2⟩ in R: **Not quite.** b names 2 and a names 1. ⟨2, 1⟩ is not in R, so Rba is false.
- Raa, a = 1, no loop at 1: **Not quite.** a names 1. ⟨1, 1⟩ is not in R, so Raa is false.
- Rab, a = b = 1, with ⟨1, 1⟩ in R: **Correct!** a names 1 and b names 1. ⟨1, 1⟩ is in R, so Rab is true.

The expandable explanation is the already reviewed `fol-explanations` rendering. Truth and feedback derive from the same evidence tree; tests check all two-object relations and both name choices.

## Connectives: reused feedback patterns

These responses use the same instructor-approved short feedback patterns from [the monadic game](../FOL-Truth-Practice/FEEDBACK-REVIEW.md), with binary atoms rendered in compact notation. “More explanation” uses the existing explainer. For a = 1 and b = 2:

- If R contains ⟨1, 2⟩ but not ⟨2, 1⟩: **Not quite.** Rab is true and Rba is false, so Rab ∧ Rba is false.
- In the same model: **Correct!** Rab is true and Rba is false, so Rab ∨ Rba is true.
- In the same model: **Not quite.** Rab is true and Rba is false, so Rab → Rba is false.
- If neither pair is in R: **Correct!** Rab is false and Rba is false, so Rab → Rba is true.
- If ⟨1, 2⟩ is in R: **Not quite.** Rab is true, so ¬Rab is false.
- If a and b name the same object, Rab and Rba are the same statement about that object's loop; the evaluator does not assume the names differ.

## Existentials and witnesses

The proposed existential teaching text and the witness/false-existential examples in the approved [polyadic plan](../FOL-Truth-Practice/POLYADIC-GAME-PLAN.md) use the same short witness and candidate patterns approved for [the monadic game](../FOL-Truth-Practice/LEVEL-2-4-FEEDBACK-REVIEW.md). Ordered pairs are rendered using compact relational notation.

For the model with domain 1, 2; a = 1; R = {⟨1, 2⟩}:

- ∃x Rax, a true model: **Correct!** 2 is a witness: Rax is true when x is 2. So ∃x Rax is true.
- ∃x Rxa, a false model: **Not quite.** No object makes Rxa true. So ∃x Rxa is false.
- Choosing 2 for ∃x Rax: **Correct!** 2 is a witness: Rax is true when x is 2.
- Choosing 1 for ∃x Rax: **Not quite.** 1 is not a witness: Rax is false when x is 1.

For ∃x Rxx, a loop is sufficient. The variation ∃y Ryy uses y in its candidate feedback. When a true existential has multiple witnesses, every valid object is accepted.

## Universal sentences and counterexamples

The game uses the universal and candidate patterns approved in [the monadic feedback reference](../FOL-Truth-Practice/LEVEL-2-4-FEEDBACK-REVIEW.md), applied to the relational examples in the approved polyadic plan. For domain 1, 2; a = 1; R = {⟨1, 1⟩}:

- **Not quite.** 2 is a counterexample: Rax is false when x is 2. So ∀x Rax is false.
- Choosing 2: **Correct!** 2 is a counterexample: Rax is false when x is 2.
- Choosing 1: **Not quite.** 1 is not a counterexample: Rax is true when x is 1.

For ∀x Rax, a itself is among the objects checked. For ∀x (Rax → Rxa), an object with a false antecedent does not falsify the conditional. Every object that falsifies the matrix is accepted as a counterexample.

## Nested quantifiers: outer choices

The approved [polyadic plan](../FOL-Truth-Practice/POLYADIC-GAME-PLAN.md) introduces all four quantifier orders and distinguishes outer choices from inner ones. The game uses the reviewed quantified-sentence feedback pattern with the whole remaining formula as the condition.

For domain 1, 2 and R = {⟨1, 1⟩, ⟨1, 2⟩}:

- ∃x ∀y Rxy: **Correct!** 1 is a witness: ∀y Rxy is true when x is 1. So ∃x ∀y Rxy is true.
- Choosing 1 as the outer witness: **Correct!** 1 is a witness: ∀y Rxy is true when x is 1.
- ∀x ∃y Rxy: **Not quite.** 2 is a counterexample: ∃y Rxy is false when x is 2. So ∀x ∃y Rxy is false.
- Choosing 2 as the outer counterexample: **Correct!** 2 is a counterexample: ∃y Rxy is false when x is 2.

The candidate checker removes only the first quantifier, so an outer choice must make the entire remaining condition true for an existential or false for a universal. The game does not ask students to choose an inner object in these activities.

### Nested conditions with conjunction

The richer Level 5 cases use the existing approved quantified feedback pattern. For domain 1, 2; a = 1; R = {⟨1, 2⟩, ⟨2, 1⟩}:

- **Correct!** 1 is a witness: ∃y (Rxy ∧ Rya) is true when x is 1. So ∃x ∃y (Rxy ∧ Rya) is true.
- **Not quite.** No object makes ∃y (Rxy ∧ Ryy) true. So ∃x ∃y (Rxy ∧ Ryy) is false.

The same choice of y must satisfy both conjuncts. Candidate checks remove only the outer quantifier, so an x is accepted when the full existential condition that remains is true.

### Level 7: explaining a false ∃∀ sentence

At the owner's request, the short response for a false ∃x ∀y Rxy includes an additional plain-English sentence:

> Not quite. No object makes ∀y Rxy true. No object in the domain bears R to everything. So ∃x ∀y Rxy is false.

The reverse-relation variation uses the existing quantified feedback pattern, since “bears R to everything” would not describe that variation correctly.
