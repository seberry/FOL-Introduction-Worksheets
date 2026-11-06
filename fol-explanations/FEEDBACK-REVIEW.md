# FOL explanation wording — approved reference

Status: the repository owner approved this full-explanation wording on 2026-11-06: "i dont think we need to work on it. just commit that". Full explanations, not hints. Future wording changes require review under AGENTS.md.

Source: the supplied three-page Quiz_9_Monadic_FOL_Truth_A_C (3).pdf. Versions A, B, and C each have seven questions. Models and formulas are transcribed in examples/quiz9.mjs.

Every question includes the response to the opposite (incorrect) truth-value answer. Questions 2–5 additionally include every in-domain object choice, including all distractors. An N/A entry is correct only when the true existential / false universal convention does not require an object. The candidate explanations check only the first quantifier and do not give a replacement object.

Logical values and candidate sets are checked against a separately written answer key in test/semantics.test.mjs. The module is standalone; existing worksheets and quizzes have not yet been connected to it.

For reuse, see INTEGRATION.md and README.md. If proposing future wording changes, review this file with commentary.mjs (wording) and core.mjs (semantics), then regenerate this reference.

Regenerate with: `node fol-explanations/examples/generate-review.mjs`.

## Quiz 9 — Version A

Model: `{"domain":[1,2,3],"constants":{"c":2},"predicates":{"P":[1,2],"Q":[1,3],"R":[1]}}`

| Question | Truth | Required object | Valid choices |
| --- | --- | --- | --- |
| 1 | False | not asked | — |
| 2 | True | witness | 1 |
| 3 | True | witness | 2 |
| 4 | False | counterexample | 2 |
| 5 | True | N/A | — |
| 6 | True | not asked | — |
| 7 | True | not asked | — |

### A1. ¬P(c) ∨ Q(c)

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
(¬P(c) ∨ Q(c)) is false because both disjuncts are false.
  ¬P(c) is false because P(c) is true.
    P(c) is true because c denotes 2 and 2 is in P.
  Q(c) is false because c denotes 2 and 2 is not in Q.
```

### A2. ∃x (P(x) ∧ Q(x) ∧ R(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∃x ((P(x) ∧ Q(x)) ∧ R(x)) is true because its body is true for x = 1.
  With x = 1:
    ((P(x) ∧ Q(x)) ∧ R(x)) is true because both conjuncts are true.
      (P(x) ∧ Q(x)) is true because both conjuncts are true.
        P(x) is true because x = 1 and 1 is in P.
        Q(x) is true because x = 1 and 1 is in Q.
      R(x) is true because x = 1 and 1 is in R.
```

N/A is incorrect: a witness is required for this true existential.

Object choice **1** — **valid witness**:

```text
1 is a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 1.
((P(x) ∧ Q(x)) ∧ R(x)) is true because both conjuncts are true.
  (P(x) ∧ Q(x)) is true because both conjuncts are true.
    P(x) is true because x = 1 and 1 is in P.
    Q(x) is true because x = 1 and 1 is in Q.
  R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **invalid witness**:

```text
2 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 2.
((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
  (P(x) ∧ Q(x)) is false because its right conjunct is false.
    P(x) is true because x = 2 and 2 is in P.
    Q(x) is false because x = 2 and 2 is not in Q.
  R(x) is false because x = 2 and 2 is not in R.
```

Object choice **3** — **invalid witness**:

```text
3 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 3.
((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
  (P(x) ∧ Q(x)) is false because its left conjunct is false.
    P(x) is false because x = 3 and 3 is not in P.
    Q(x) is true because x = 3 and 3 is in Q.
  R(x) is false because x = 3 and 3 is not in R.
```

### A3. ∃x (P(x) ∧ ¬Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∃x (P(x) ∧ ¬Q(x)) is true because its body is true for x = 2.
  With x = 2:
    (P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
      P(x) is true because x = 2 and 2 is in P.
      ¬Q(x) is true because Q(x) is false.
        Q(x) is false because x = 2 and 2 is not in Q.
```

N/A is incorrect: a witness is required for this true existential.

Object choice **1** — **invalid witness**:

```text
1 is not a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 1.
(P(x) ∧ ¬Q(x)) is false because its right conjunct is false.
  P(x) is true because x = 1 and 1 is in P.
  ¬Q(x) is false because Q(x) is true.
    Q(x) is true because x = 1 and 1 is in Q.
```

Object choice **2** — **valid witness**:

```text
2 is a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 2.
(P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
  P(x) is true because x = 2 and 2 is in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **invalid witness**:

```text
3 is not a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 3.
(P(x) ∧ ¬Q(x)) is false because both conjuncts are false.
  P(x) is false because x = 3 and 3 is not in P.
  ¬Q(x) is false because Q(x) is true.
    Q(x) is true because x = 3 and 3 is in Q.
```

### A4. ∀x (P(x) → (Q(x) ∨ R(x)))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
∀x (P(x) → (Q(x) ∨ R(x))) is false because its body is false for x = 2.
  With x = 2:
    (P(x) → (Q(x) ∨ R(x))) is false because its antecedent is true and its consequent is false.
      P(x) is true because x = 2 and 2 is in P.
      (Q(x) ∨ R(x)) is false because both disjuncts are false.
        Q(x) is false because x = 2 and 2 is not in Q.
        R(x) is false because x = 2 and 2 is not in R.
```

N/A is incorrect: a counterexample is required for this false universal.

Object choice **1** — **invalid counterexample**:

```text
1 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 1.
(P(x) → (Q(x) ∨ R(x))) is true because its consequent is true.
  P(x) is true because x = 1 and 1 is in P.
  (Q(x) ∨ R(x)) is true because both disjuncts are true.
    Q(x) is true because x = 1 and 1 is in Q.
    R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **valid counterexample**:

```text
2 is a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 2.
(P(x) → (Q(x) ∨ R(x))) is false because its antecedent is true and its consequent is false.
  P(x) is true because x = 2 and 2 is in P.
  (Q(x) ∨ R(x)) is false because both disjuncts are false.
    Q(x) is false because x = 2 and 2 is not in Q.
    R(x) is false because x = 2 and 2 is not in R.
```

Object choice **3** — **invalid counterexample**:

```text
3 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 3.
(P(x) → (Q(x) ∨ R(x))) is true because its antecedent is false.
  P(x) is false because x = 3 and 3 is not in P.
  (Q(x) ∨ R(x)) is true because its left disjunct is true.
    Q(x) is true because x = 3 and 3 is in Q.
    R(x) is false because x = 3 and 3 is not in R.
```

### A5. ∀x (P(x) ∨ Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∀x (P(x) ∨ Q(x)) is true because its body is true for every object in the domain.
  With x = 1:
    (P(x) ∨ Q(x)) is true because both disjuncts are true.
      P(x) is true because x = 1 and 1 is in P.
      Q(x) is true because x = 1 and 1 is in Q.
  With x = 2:
    (P(x) ∨ Q(x)) is true because its left disjunct is true.
      P(x) is true because x = 2 and 2 is in P.
      Q(x) is false because x = 2 and 2 is not in Q.
  With x = 3:
    (P(x) ∨ Q(x)) is true because its right disjunct is true.
      P(x) is false because x = 3 and 3 is not in P.
      Q(x) is true because x = 3 and 3 is in Q.
```

N/A is correct: this question does not require an object for the actual truth value.

Object choice **1** — **invalid counterexample**:

```text
1 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 1.
(P(x) ∨ Q(x)) is true because both disjuncts are true.
  P(x) is true because x = 1 and 1 is in P.
  Q(x) is true because x = 1 and 1 is in Q.
```

Object choice **2** — **invalid counterexample**:

```text
2 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 2.
(P(x) ∨ Q(x)) is true because its left disjunct is true.
  P(x) is true because x = 2 and 2 is in P.
  Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **invalid counterexample**:

```text
3 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 3.
(P(x) ∨ Q(x)) is true because its right disjunct is true.
  P(x) is false because x = 3 and 3 is not in P.
  Q(x) is true because x = 3 and 3 is in Q.
```

### A6. (∃x P(x)) ∧ (∃x Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
(∃x P(x) ∧ ∃x Q(x)) is true because both conjuncts are true.
  ∃x P(x) is true because its body is true for x = 1.
    With x = 1:
      P(x) is true because x = 1 and 1 is in P.
  ∃x Q(x) is true because its body is true for x = 1.
    With x = 1:
      Q(x) is true because x = 1 and 1 is in Q.
```

### A7. (∀x P(x)) → (∃x Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
(∀x P(x) → ∃x Q(x)) is true because its antecedent is false.
  ∀x P(x) is false because its body is false for x = 3.
    With x = 3:
      P(x) is false because x = 3 and 3 is not in P.
  ∃x Q(x) is true because its body is true for x = 1.
    With x = 1:
      Q(x) is true because x = 1 and 1 is in Q.
```

## Quiz 9 — Version B

Model: `{"domain":[1,2,3],"constants":{"c":3},"predicates":{"P":[1,2,3],"Q":[],"R":[1,2]}}`

| Question | Truth | Required object | Valid choices |
| --- | --- | --- | --- |
| 1 | False | not asked | — |
| 2 | False | N/A | — |
| 3 | True | witness | 1, 2, 3 |
| 4 | False | counterexample | 3 |
| 5 | True | N/A | — |
| 6 | False | not asked | — |
| 7 | False | not asked | — |

### B1. ¬P(c) ∨ Q(c)

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
(¬P(c) ∨ Q(c)) is false because both disjuncts are false.
  ¬P(c) is false because P(c) is true.
    P(c) is true because c denotes 3 and 3 is in P.
  Q(c) is false because c denotes 3 and 3 is not in Q.
```

### B2. ∃x (P(x) ∧ Q(x) ∧ R(x))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
∃x ((P(x) ∧ Q(x)) ∧ R(x)) is false because its body is false for every object in the domain.
  With x = 1:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
      (P(x) ∧ Q(x)) is false because its right conjunct is false.
        P(x) is true because x = 1 and 1 is in P.
        Q(x) is false because x = 1 and 1 is not in Q.
      R(x) is true because x = 1 and 1 is in R.
  With x = 2:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
      (P(x) ∧ Q(x)) is false because its right conjunct is false.
        P(x) is true because x = 2 and 2 is in P.
        Q(x) is false because x = 2 and 2 is not in Q.
      R(x) is true because x = 2 and 2 is in R.
  With x = 3:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
      (P(x) ∧ Q(x)) is false because its right conjunct is false.
        P(x) is true because x = 3 and 3 is in P.
        Q(x) is false because x = 3 and 3 is not in Q.
      R(x) is false because x = 3 and 3 is not in R.
```

N/A is correct: this question does not require an object for the actual truth value.

Object choice **1** — **invalid witness**:

```text
1 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 1.
((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
  (P(x) ∧ Q(x)) is false because its right conjunct is false.
    P(x) is true because x = 1 and 1 is in P.
    Q(x) is false because x = 1 and 1 is not in Q.
  R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **invalid witness**:

```text
2 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 2.
((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
  (P(x) ∧ Q(x)) is false because its right conjunct is false.
    P(x) is true because x = 2 and 2 is in P.
    Q(x) is false because x = 2 and 2 is not in Q.
  R(x) is true because x = 2 and 2 is in R.
```

Object choice **3** — **invalid witness**:

```text
3 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 3.
((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
  (P(x) ∧ Q(x)) is false because its right conjunct is false.
    P(x) is true because x = 3 and 3 is in P.
    Q(x) is false because x = 3 and 3 is not in Q.
  R(x) is false because x = 3 and 3 is not in R.
```

### B3. ∃x (P(x) ∧ ¬Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∃x (P(x) ∧ ¬Q(x)) is true because its body is true for x = 1.
  With x = 1:
    (P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
      P(x) is true because x = 1 and 1 is in P.
      ¬Q(x) is true because Q(x) is false.
        Q(x) is false because x = 1 and 1 is not in Q.
```

N/A is incorrect: a witness is required for this true existential.

Object choice **1** — **valid witness**:

```text
1 is a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 1.
(P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
  P(x) is true because x = 1 and 1 is in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 1 and 1 is not in Q.
```

Object choice **2** — **valid witness**:

```text
2 is a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 2.
(P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
  P(x) is true because x = 2 and 2 is in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **valid witness**:

```text
3 is a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 3.
(P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
  P(x) is true because x = 3 and 3 is in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 3 and 3 is not in Q.
```

### B4. ∀x (P(x) → (Q(x) ∨ R(x)))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
∀x (P(x) → (Q(x) ∨ R(x))) is false because its body is false for x = 3.
  With x = 3:
    (P(x) → (Q(x) ∨ R(x))) is false because its antecedent is true and its consequent is false.
      P(x) is true because x = 3 and 3 is in P.
      (Q(x) ∨ R(x)) is false because both disjuncts are false.
        Q(x) is false because x = 3 and 3 is not in Q.
        R(x) is false because x = 3 and 3 is not in R.
```

N/A is incorrect: a counterexample is required for this false universal.

Object choice **1** — **invalid counterexample**:

```text
1 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 1.
(P(x) → (Q(x) ∨ R(x))) is true because its consequent is true.
  P(x) is true because x = 1 and 1 is in P.
  (Q(x) ∨ R(x)) is true because its right disjunct is true.
    Q(x) is false because x = 1 and 1 is not in Q.
    R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **invalid counterexample**:

```text
2 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 2.
(P(x) → (Q(x) ∨ R(x))) is true because its consequent is true.
  P(x) is true because x = 2 and 2 is in P.
  (Q(x) ∨ R(x)) is true because its right disjunct is true.
    Q(x) is false because x = 2 and 2 is not in Q.
    R(x) is true because x = 2 and 2 is in R.
```

Object choice **3** — **valid counterexample**:

```text
3 is a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 3.
(P(x) → (Q(x) ∨ R(x))) is false because its antecedent is true and its consequent is false.
  P(x) is true because x = 3 and 3 is in P.
  (Q(x) ∨ R(x)) is false because both disjuncts are false.
    Q(x) is false because x = 3 and 3 is not in Q.
    R(x) is false because x = 3 and 3 is not in R.
```

### B5. ∀x (P(x) ∨ Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∀x (P(x) ∨ Q(x)) is true because its body is true for every object in the domain.
  With x = 1:
    (P(x) ∨ Q(x)) is true because its left disjunct is true.
      P(x) is true because x = 1 and 1 is in P.
      Q(x) is false because x = 1 and 1 is not in Q.
  With x = 2:
    (P(x) ∨ Q(x)) is true because its left disjunct is true.
      P(x) is true because x = 2 and 2 is in P.
      Q(x) is false because x = 2 and 2 is not in Q.
  With x = 3:
    (P(x) ∨ Q(x)) is true because its left disjunct is true.
      P(x) is true because x = 3 and 3 is in P.
      Q(x) is false because x = 3 and 3 is not in Q.
```

N/A is correct: this question does not require an object for the actual truth value.

Object choice **1** — **invalid counterexample**:

```text
1 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 1.
(P(x) ∨ Q(x)) is true because its left disjunct is true.
  P(x) is true because x = 1 and 1 is in P.
  Q(x) is false because x = 1 and 1 is not in Q.
```

Object choice **2** — **invalid counterexample**:

```text
2 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 2.
(P(x) ∨ Q(x)) is true because its left disjunct is true.
  P(x) is true because x = 2 and 2 is in P.
  Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **invalid counterexample**:

```text
3 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 3.
(P(x) ∨ Q(x)) is true because its left disjunct is true.
  P(x) is true because x = 3 and 3 is in P.
  Q(x) is false because x = 3 and 3 is not in Q.
```

### B6. (∃x P(x)) ∧ (∃x Q(x))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
(∃x P(x) ∧ ∃x Q(x)) is false because its right conjunct is false.
  ∃x P(x) is true because its body is true for x = 1.
    With x = 1:
      P(x) is true because x = 1 and 1 is in P.
  ∃x Q(x) is false because its body is false for every object in the domain.
    With x = 1:
      Q(x) is false because x = 1 and 1 is not in Q.
    With x = 2:
      Q(x) is false because x = 2 and 2 is not in Q.
    With x = 3:
      Q(x) is false because x = 3 and 3 is not in Q.
```

### B7. (∀x P(x)) → (∃x Q(x))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
(∀x P(x) → ∃x Q(x)) is false because its antecedent is true and its consequent is false.
  ∀x P(x) is true because its body is true for every object in the domain.
    With x = 1:
      P(x) is true because x = 1 and 1 is in P.
    With x = 2:
      P(x) is true because x = 2 and 2 is in P.
    With x = 3:
      P(x) is true because x = 3 and 3 is in P.
  ∃x Q(x) is false because its body is false for every object in the domain.
    With x = 1:
      Q(x) is false because x = 1 and 1 is not in Q.
    With x = 2:
      Q(x) is false because x = 2 and 2 is not in Q.
    With x = 3:
      Q(x) is false because x = 3 and 3 is not in Q.
```

## Quiz 9 — Version C

Model: `{"domain":[1,2,3],"constants":{"c":1},"predicates":{"P":[2],"Q":[3],"R":[1,2]}}`

| Question | Truth | Required object | Valid choices |
| --- | --- | --- | --- |
| 1 | True | not asked | — |
| 2 | False | N/A | — |
| 3 | True | witness | 2 |
| 4 | True | N/A | — |
| 5 | False | counterexample | 1 |
| 6 | True | not asked | — |
| 7 | True | not asked | — |

### C1. ¬P(c) ∨ Q(c)

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
(¬P(c) ∨ Q(c)) is true because its left disjunct is true.
  ¬P(c) is true because P(c) is false.
    P(c) is false because c denotes 1 and 1 is not in P.
  Q(c) is false because c denotes 1 and 1 is not in Q.
```

### C2. ∃x (P(x) ∧ Q(x) ∧ R(x))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
∃x ((P(x) ∧ Q(x)) ∧ R(x)) is false because its body is false for every object in the domain.
  With x = 1:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
      (P(x) ∧ Q(x)) is false because both conjuncts are false.
        P(x) is false because x = 1 and 1 is not in P.
        Q(x) is false because x = 1 and 1 is not in Q.
      R(x) is true because x = 1 and 1 is in R.
  With x = 2:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
      (P(x) ∧ Q(x)) is false because its right conjunct is false.
        P(x) is true because x = 2 and 2 is in P.
        Q(x) is false because x = 2 and 2 is not in Q.
      R(x) is true because x = 2 and 2 is in R.
  With x = 3:
    ((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
      (P(x) ∧ Q(x)) is false because its left conjunct is false.
        P(x) is false because x = 3 and 3 is not in P.
        Q(x) is true because x = 3 and 3 is in Q.
      R(x) is false because x = 3 and 3 is not in R.
```

N/A is correct: this question does not require an object for the actual truth value.

Object choice **1** — **invalid witness**:

```text
1 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 1.
((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
  (P(x) ∧ Q(x)) is false because both conjuncts are false.
    P(x) is false because x = 1 and 1 is not in P.
    Q(x) is false because x = 1 and 1 is not in Q.
  R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **invalid witness**:

```text
2 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 2.
((P(x) ∧ Q(x)) ∧ R(x)) is false because its left conjunct is false.
  (P(x) ∧ Q(x)) is false because its right conjunct is false.
    P(x) is true because x = 2 and 2 is in P.
    Q(x) is false because x = 2 and 2 is not in Q.
  R(x) is true because x = 2 and 2 is in R.
```

Object choice **3** — **invalid witness**:

```text
3 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)).
Removing just the first quantifier, the body ((P(x) ∧ Q(x)) ∧ R(x)) must be true when x = 3.
((P(x) ∧ Q(x)) ∧ R(x)) is false because both conjuncts are false.
  (P(x) ∧ Q(x)) is false because its left conjunct is false.
    P(x) is false because x = 3 and 3 is not in P.
    Q(x) is true because x = 3 and 3 is in Q.
  R(x) is false because x = 3 and 3 is not in R.
```

### C3. ∃x (P(x) ∧ ¬Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∃x (P(x) ∧ ¬Q(x)) is true because its body is true for x = 2.
  With x = 2:
    (P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
      P(x) is true because x = 2 and 2 is in P.
      ¬Q(x) is true because Q(x) is false.
        Q(x) is false because x = 2 and 2 is not in Q.
```

N/A is incorrect: a witness is required for this true existential.

Object choice **1** — **invalid witness**:

```text
1 is not a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 1.
(P(x) ∧ ¬Q(x)) is false because its left conjunct is false.
  P(x) is false because x = 1 and 1 is not in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 1 and 1 is not in Q.
```

Object choice **2** — **valid witness**:

```text
2 is a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 2.
(P(x) ∧ ¬Q(x)) is true because both conjuncts are true.
  P(x) is true because x = 2 and 2 is in P.
  ¬Q(x) is true because Q(x) is false.
    Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **invalid witness**:

```text
3 is not a witness for ∃x (P(x) ∧ ¬Q(x)).
Removing just the first quantifier, the body (P(x) ∧ ¬Q(x)) must be true when x = 3.
(P(x) ∧ ¬Q(x)) is false because both conjuncts are false.
  P(x) is false because x = 3 and 3 is not in P.
  ¬Q(x) is false because Q(x) is true.
    Q(x) is true because x = 3 and 3 is in Q.
```

### C4. ∀x (P(x) → (Q(x) ∨ R(x)))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
∀x (P(x) → (Q(x) ∨ R(x))) is true because its body is true for every object in the domain.
  With x = 1:
    (P(x) → (Q(x) ∨ R(x))) is true because its antecedent is false.
      P(x) is false because x = 1 and 1 is not in P.
      (Q(x) ∨ R(x)) is true because its right disjunct is true.
        Q(x) is false because x = 1 and 1 is not in Q.
        R(x) is true because x = 1 and 1 is in R.
  With x = 2:
    (P(x) → (Q(x) ∨ R(x))) is true because its consequent is true.
      P(x) is true because x = 2 and 2 is in P.
      (Q(x) ∨ R(x)) is true because its right disjunct is true.
        Q(x) is false because x = 2 and 2 is not in Q.
        R(x) is true because x = 2 and 2 is in R.
  With x = 3:
    (P(x) → (Q(x) ∨ R(x))) is true because its antecedent is false.
      P(x) is false because x = 3 and 3 is not in P.
      (Q(x) ∨ R(x)) is true because its left disjunct is true.
        Q(x) is true because x = 3 and 3 is in Q.
        R(x) is false because x = 3 and 3 is not in R.
```

N/A is correct: this question does not require an object for the actual truth value.

Object choice **1** — **invalid counterexample**:

```text
1 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 1.
(P(x) → (Q(x) ∨ R(x))) is true because its antecedent is false.
  P(x) is false because x = 1 and 1 is not in P.
  (Q(x) ∨ R(x)) is true because its right disjunct is true.
    Q(x) is false because x = 1 and 1 is not in Q.
    R(x) is true because x = 1 and 1 is in R.
```

Object choice **2** — **invalid counterexample**:

```text
2 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 2.
(P(x) → (Q(x) ∨ R(x))) is true because its consequent is true.
  P(x) is true because x = 2 and 2 is in P.
  (Q(x) ∨ R(x)) is true because its right disjunct is true.
    Q(x) is false because x = 2 and 2 is not in Q.
    R(x) is true because x = 2 and 2 is in R.
```

Object choice **3** — **invalid counterexample**:

```text
3 is not a counterexample for ∀x (P(x) → (Q(x) ∨ R(x))).
Removing just the first quantifier, the body (P(x) → (Q(x) ∨ R(x))) must be false when x = 3.
(P(x) → (Q(x) ∨ R(x))) is true because its antecedent is false.
  P(x) is false because x = 3 and 3 is not in P.
  (Q(x) ∨ R(x)) is true because its left disjunct is true.
    Q(x) is true because x = 3 and 3 is in Q.
    R(x) is false because x = 3 and 3 is not in R.
```

### C5. ∀x (P(x) ∨ Q(x))

Incorrect truth-value response: **True**. Proposed explanation:

```text
You answered true, but the sentence is false in this model.
∀x (P(x) ∨ Q(x)) is false because its body is false for x = 1.
  With x = 1:
    (P(x) ∨ Q(x)) is false because both disjuncts are false.
      P(x) is false because x = 1 and 1 is not in P.
      Q(x) is false because x = 1 and 1 is not in Q.
```

N/A is incorrect: a counterexample is required for this false universal.

Object choice **1** — **valid counterexample**:

```text
1 is a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 1.
(P(x) ∨ Q(x)) is false because both disjuncts are false.
  P(x) is false because x = 1 and 1 is not in P.
  Q(x) is false because x = 1 and 1 is not in Q.
```

Object choice **2** — **invalid counterexample**:

```text
2 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 2.
(P(x) ∨ Q(x)) is true because its left disjunct is true.
  P(x) is true because x = 2 and 2 is in P.
  Q(x) is false because x = 2 and 2 is not in Q.
```

Object choice **3** — **invalid counterexample**:

```text
3 is not a counterexample for ∀x (P(x) ∨ Q(x)).
Removing just the first quantifier, the body (P(x) ∨ Q(x)) must be false when x = 3.
(P(x) ∨ Q(x)) is true because its right disjunct is true.
  P(x) is false because x = 3 and 3 is not in P.
  Q(x) is true because x = 3 and 3 is in Q.
```

### C6. (∃x P(x)) ∧ (∃x Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
(∃x P(x) ∧ ∃x Q(x)) is true because both conjuncts are true.
  ∃x P(x) is true because its body is true for x = 2.
    With x = 2:
      P(x) is true because x = 2 and 2 is in P.
  ∃x Q(x) is true because its body is true for x = 3.
    With x = 3:
      Q(x) is true because x = 3 and 3 is in Q.
```

### C7. (∀x P(x)) → (∃x Q(x))

Incorrect truth-value response: **False**. Proposed explanation:

```text
You answered false, but the sentence is true in this model.
(∀x P(x) → ∃x Q(x)) is true because its antecedent is false.
  ∀x P(x) is false because its body is false for x = 1.
    With x = 1:
      P(x) is false because x = 1 and 1 is not in P.
  ∃x Q(x) is true because its body is true for x = 3.
    With x = 3:
      Q(x) is true because x = 3 and 3 is in Q.
```

## Additional polyadic and nested-quantifier cases

Model: `{"domain":[1,2,3],"constants":{"a":1,"b":2},"predicates":{"R":[[1,1],[1,2],[1,3],[2,2]],"P":[1,3]}}`

### ∃x ∀y R(x,y)

Truth explanation:

```text
∃x ∀y R(x,y) is true because its body is true for x = 1.
  With x = 1:
    ∀y R(x,y) is true because its body is true for every object in the domain.
      With y = 1:
        R(x,y) is true because x = 1, y = 1 and ⟨1, 1⟩ is in R.
      With y = 2:
        R(x,y) is true because x = 1, y = 2 and ⟨1, 2⟩ is in R.
      With y = 3:
        R(x,y) is true because x = 1, y = 3 and ⟨1, 3⟩ is in R.
```

Checking the proposed object **2** for just the first quantifier:

```text
2 is not a witness for ∃x ∀y R(x,y).
Removing just the first quantifier, the body ∀y R(x,y) must be true when x = 2.
∀y R(x,y) is false because its body is false for y = 1.
  With y = 1:
    R(x,y) is false because x = 2, y = 1 and ⟨2, 1⟩ is not in R.
```

### ∀x ∃y R(x,y)

Truth explanation:

```text
∀x ∃y R(x,y) is false because its body is false for x = 3.
  With x = 3:
    ∃y R(x,y) is false because its body is false for every object in the domain.
      With y = 1:
        R(x,y) is false because x = 3, y = 1 and ⟨3, 1⟩ is not in R.
      With y = 2:
        R(x,y) is false because x = 3, y = 2 and ⟨3, 2⟩ is not in R.
      With y = 3:
        R(x,y) is false because x = 3, y = 3 and ⟨3, 3⟩ is not in R.
```

Checking the proposed object **3** for just the first quantifier:

```text
3 is a counterexample for ∀x ∃y R(x,y).
Removing just the first quantifier, the body ∃y R(x,y) must be false when x = 3.
∃y R(x,y) is false because its body is false for every object in the domain.
  With y = 1:
    R(x,y) is false because x = 3, y = 1 and ⟨3, 1⟩ is not in R.
  With y = 2:
    R(x,y) is false because x = 3, y = 2 and ⟨3, 2⟩ is not in R.
  With y = 3:
    R(x,y) is false because x = 3, y = 3 and ⟨3, 3⟩ is not in R.
```

### ∃x ∃y R(x,y)

Truth explanation:

```text
∃x ∃y R(x,y) is true because its body is true for x = 1.
  With x = 1:
    ∃y R(x,y) is true because its body is true for y = 1.
      With y = 1:
        R(x,y) is true because x = 1, y = 1 and ⟨1, 1⟩ is in R.
```

Checking the proposed object **2** for just the first quantifier:

```text
2 is a witness for ∃x ∃y R(x,y).
Removing just the first quantifier, the body ∃y R(x,y) must be true when x = 2.
∃y R(x,y) is true because its body is true for y = 2.
  With y = 2:
    R(x,y) is true because x = 2, y = 2 and ⟨2, 2⟩ is in R.
```

### ∀x R(x,x)

Truth explanation:

```text
∀x R(x,x) is false because its body is false for x = 3.
  With x = 3:
    R(x,x) is false because x = 3 and ⟨3, 3⟩ is not in R.
```

Checking the proposed object **3** for just the first quantifier:

```text
3 is a counterexample for ∀x R(x,x).
Removing just the first quantifier, the body R(x,x) must be false when x = 3.
R(x,x) is false because x = 3 and ⟨3, 3⟩ is not in R.
```

### ∃x (R(a,x) ∧ x ≠ a)

Truth explanation:

```text
∃x (R(a,x) ∧ ¬(x = a)) is true because its body is true for x = 2.
  With x = 2:
    (R(a,x) ∧ ¬(x = a)) is true because both conjuncts are true.
      R(a,x) is true because a denotes 1, x = 2 and ⟨1, 2⟩ is in R.
      ¬(x = a) is true because x = a is false.
        x = a is false because x = 2, a denotes 1, and these are different objects.
```

Checking the proposed object **1** for just the first quantifier:

```text
1 is not a witness for ∃x (R(a,x) ∧ ¬(x = a)).
Removing just the first quantifier, the body (R(a,x) ∧ ¬(x = a)) must be true when x = 1.
(R(a,x) ∧ ¬(x = a)) is false because its right conjunct is false.
  R(a,x) is true because a denotes 1, x = 1 and ⟨1, 1⟩ is in R.
  ¬(x = a) is false because x = a is true.
    x = a is true because x = 1, a denotes 1, and these are the same object.
```

## Out-of-domain response

```text
4 is not a witness for ∃x ((P(x) ∧ Q(x)) ∧ R(x)) because it is not an object in the domain.
```
