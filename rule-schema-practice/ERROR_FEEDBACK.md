# Error-feedback reference

> **Status:** Approved and implemented in `app.js`.

## Feedback policy

Error feedback should direct the student back to the relevant schema without supplying the answer.

1. Identify an observable structural mismatch: wrong main connective, omitted cited line, altered cited sentence, incomplete conjunct, or the wrong half of a conditional.
2. Restate only as much of the rule as the student needs for another attempt.
3. Do not state the missing formula or name the correct choice.
4. Refer to the cited line numbers rather than “the available lines.” Other earlier proof lines may also be available.
5. Do not imply that `&I` requires two distinct sentences or lines. The same line may be cited twice; from `P`, one may infer `P & P` by `&I`.
6. Use the following student-facing glosses when helpful:
   - **Conjunct:** one of the complete sentences joined by the main `&`.
   - **Antecedent:** the complete front half of a conditional.
   - **Consequent:** the complete back half of a conditional.

## Level 1: Conjunction Introduction (`&I`)

General reminder for this level:

> `&I` lets us infer a conjunction (`&`) of the exact sentences on the cited line number(s).

### Problem 1

Proof: `P`, `Q`, therefore `[blank]` by `&I 1, 2`
Correct answer for instructor reference: `P & Q`

| Incorrect choice | Student feedback |
|---|---|
| `P → Q` | Careful: `&I` lets us infer a conjunction (`&`) of the sentences on the two cited lines. |
| `Q` | This omits the first cited line. `&I 1, 2` must use the complete sentence on each cited line. |
| `P` | This omits the second cited line. `&I 1, 2` must use the complete sentence on each cited line. |

### Problem 2

Proof: `~P`, `R`, therefore `[blank]` by `&I 1, 2`
Correct answer for instructor reference: `~P & R`

| Incorrect choice | Student feedback |
|---|---|
| `~(P & R)` | Careful: the main connective of a conclusion justified by `&I` must be `&`. |
| `P & R` | One conjunct does not exactly match the complete sentence on either cited line. `&I` copies the cited sentences without changing them. |
| `~P` | This omits the second cited line. `&I 1, 2` must use the complete sentence on each cited line. |

### Problem 3

Proof: `P → Q`, `~R`, therefore `[blank]` by `&I 1, 2`
Correct answer for instructor reference: `(P → Q) & ~R`

| Incorrect choice | Student feedback |
|---|---|
| `P → (Q & ~R)` | Careful: `&I` lets us infer a conjunction (`&`) of the sentences on the two cited lines. |
| `Q & ~R` | One conjunct is only part of the sentence on a cited line. Each conjunct must match a complete cited sentence. |
| `(P & Q) → ~R` | Careful: `&I` lets us infer a conjunction (`&`) of the sentences on the two cited lines. |

### Problem 4

Proof: `P & Q`, `R → S`, therefore `[blank]` by `&I 1, 2`
Correct answer for instructor reference: `(P & Q) & (R → S)`

| Incorrect choice | Student feedback |
|---|---|
| `Q & R` | Both conjuncts are only parts of the sentences on the cited lines. Each conjunct must match a complete cited sentence. |
| `P & (Q → R)` | The conjuncts do not exactly match the complete sentences on the cited lines. `&I` does not rearrange their contents. |
| `(P & Q) → (R → S)` | Careful: the main connective of a conclusion justified by `&I` must be `&`. |

### Problem 5: identify `𝔄`

Proof: `P → Q`, `R & S`, therefore `(P → Q) & (R & S)` by `&I 1, 2`
Correct answer for instructor reference: `P → Q`

| Incorrect choice | Student feedback |
|---|---|
| `P` | This is only part of a sentence on a cited line. A metavariable must match a complete sentence. |
| `Q` | This is only part of a sentence on a cited line. A metavariable must match a complete sentence. |
| `(P → Q) & (R & S)` | This is the whole conclusion, which has the form `𝔄 & 𝔅`. The question asks which complete part plays the role of `𝔄`. |

### Problem 6

Proof: `~(P → Q)`, `R & S`, therefore `[blank]` by `&I 1, 2`
Correct answer for instructor reference: `~(P → Q) & (R & S)`

| Incorrect choice | Student feedback |
|---|---|
| `~P → (Q & R)` | Careful: `&I` lets us infer a conjunction (`&`) of the sentences on the two cited lines. |
| `(P → Q) & (R → S)` | The conjuncts do not exactly match the complete sentences on the cited lines. `&I` copies cited sentences without changing them. |
| `~((P → Q) & R)` | Careful: the main connective of a conclusion justified by `&I` must be `&`. |

### Clarification included in the `&I` introduction

> `&I` lets you infer a conjunction whose two conjuncts are exactly the sentences on the cited line number(s). The cited sentences need not be different, and the line numbers need not be different. For example, from `P` you may infer `P & P` by `&I 1, 1`.

## Level 2: Conjunction Elimination (`&E`)

General reminder for this level:

> `&E` lets us infer either whole conjunct of the conjunction on the cited line. A conjunct is one of the complete sentences joined by the main `&`.

### Problem 1

Proof: `P & Q`, therefore `[blank]` by `&E 1`
Correct answer for instructor reference: `P`

| Incorrect choice | Student feedback |
|---|---|
| `P → Q` | This does not exactly match either whole conjunct on the cited line. `&E` copies one conjunct without changing it. |
| `P & Q` | This repeats the whole conjunction. `&E` lets us infer one of the complete things joined by its main `&`. |
| `~Q` | This changes one of the conjuncts. `&E` copies a whole conjunct without changing it. |

### Problem 2

Proof: `P & Q`, therefore `[blank]` by `&E 1`
Correct answer for instructor reference: `Q`

| Incorrect choice | Student feedback |
|---|---|
| `P → Q` | This does not exactly match either whole conjunct on the cited line. `&E` copies one conjunct without changing it. |
| `P & Q` | This repeats the whole conjunction. `&E` lets us infer one of the complete things joined by its main `&`. |
| `~P` | This changes one of the conjuncts. `&E` copies a whole conjunct without changing it. |

### Problem 3

Proof: `~P & R`, therefore `[blank]` by `&E 1`
Correct answer for instructor reference: `~P`

| Incorrect choice | Student feedback |
|---|---|
| `P` | This does not exactly match a whole conjunct on the cited line. `&E` copies a conjunct without dropping anything from it. |
| `~R` | This changes one of the conjuncts. `&E` copies a whole conjunct without changing it. |
| `P & R` | This is a new conjunction rather than one whole conjunct from the cited line. |

### Problem 4

Proof: `(P → Q) & R`, therefore `[blank]` by `&E 1`
Correct answer for instructor reference: `P → Q`

| Incorrect choice | Student feedback |
|---|---|
| `Q` | This is only part of a conjunct. `&E` copies one whole conjunct—one complete thing joined by the main `&`. |
| `P` | This is only part of a conjunct. `&E` copies one whole conjunct—one complete thing joined by the main `&`. |
| `Q & R` | This builds a new conjunction from parts of the cited line. `&E` instead copies one whole conjunct. |

### Problem 5: identify `𝔄`

Proof: `(P & Q) & (R → S)`, therefore `P & Q` by `&E 1`
Correct answer for instructor reference: `P & Q`

| Incorrect choice | Student feedback |
|---|---|
| `P` | This is only part of a conjunct. Here `𝔄` must match one whole conjunct of the premise. |
| `Q` | This is only part of a conjunct. Here `𝔄` must match one whole conjunct of the premise. |
| `(P & Q) & (R → S)` | This is the whole premise, which has the form `𝔄 & 𝔅`. The question asks which complete part plays the role of `𝔄`. |

### Problem 6

Proof: `~(P → Q) & (R & S)`, therefore `[blank]` by `&E 1`
Correct answer for instructor reference: `R & S`

| Incorrect choice | Student feedback |
|---|---|
| `S` | This is only part of a conjunct. `&E` copies one whole conjunct—one complete thing joined by the main `&`. |
| `P → Q` | This does not exactly match a whole conjunct on the cited line. `&E` copies a conjunct without dropping anything from it. |
| `~R & S` | This does not exactly match either whole conjunct on the cited line. `&E` does not move material from one conjunct into another. |

## Level 3: Conditional Elimination (`→E`)

General reminder for this level:

> `→E` lets us infer the consequent (the complete back half) of a cited conditional when another cited line contains its antecedent (the complete front half).

### Problem 1

Proof: `P → Q`, `P`, therefore `[blank]` by `→E 1, 2`
Correct answer for instructor reference: `Q`

| Incorrect choice | Student feedback |
|---|---|
| `P` | This repeats the antecedent (front half). `→E` lets us infer the consequent (back half) of the cited conditional. |
| `P → Q` | This repeats the conditional. `→E` lets us infer its consequent when another cited line contains its antecedent. |
| `Q → P` | This reverses the conditional. `→E` lets us infer its consequent; it does not infer a reversed conditional. |

### Problem 2

Proof: `(P & Q) → R`, `P & Q`, therefore `[blank]` by `→E 1, 2`
Correct answer for instructor reference: `R`

| Incorrect choice | Student feedback |
|---|---|
| `Q` | This is only part of the antecedent. `→E` lets us infer the complete consequent (back half) of the cited conditional. |
| `P` | This is only part of the antecedent. `→E` lets us infer the complete consequent (back half) of the cited conditional. |
| `P & Q` | This repeats the antecedent. `→E` lets us infer the consequent of the cited conditional. |

### Problem 3

Proof: `P → (Q & R)`, `P`, therefore `[blank]` by `→E 1, 2`
Correct answer for instructor reference: `Q & R`

| Incorrect choice | Student feedback |
|---|---|
| `Q` | This is only part of the consequent. `→E` lets us infer the complete consequent (the whole back half) of the cited conditional. |
| `R` | This is only part of the consequent. `→E` lets us infer the complete consequent (the whole back half) of the cited conditional. |
| `P & Q` | This constructs a new sentence from parts of the cited lines. `→E` instead lets us infer the complete consequent of the cited conditional. |

### Problem 4

Proof: `(P → Q) → (R & S)`, `[blank]`, therefore `R & S` by `→E 1, 2`
Correct answer for instructor reference: `P → Q`

| Incorrect choice | Student feedback |
|---|---|
| `Q` | This is only part of the antecedent. To apply `→E`, the other cited line must contain the complete antecedent (front half) of the conditional. |
| `R` | This comes from the consequent. To apply `→E`, the other cited line must contain the complete antecedent (front half). |
| `R & S` | This is the consequent. To apply `→E`, the other cited line must contain the antecedent of the conditional. |

### Problem 5: identify `𝔅`

Proof: `(P & Q) → (R → S)`, `P & Q`, therefore `R → S` by `→E 1, 2`
Correct answer for instructor reference: `R → S`

| Incorrect choice | Student feedback |
|---|---|
| `R` | This is only part of the consequent. `𝔅` must match the complete consequent (the whole back half). |
| `S` | This is only part of the consequent. `𝔅` must match the complete consequent (the whole back half). |
| `P & Q` | This is the antecedent, so it plays the role of `𝔄`, not `𝔅`. Look for the complete consequent. |

### Problem 6

Proof: `~P → (Q & R)`, `[blank]`, therefore `Q & R` by `→E 1, 2`
Correct answer for instructor reference: `~P`

| Incorrect choice | Student feedback |
|---|---|
| `P` | This does not exactly match the antecedent. The other cited line must contain the complete antecedent without changing it. |
| `Q` | This is only part of the consequent. The missing cited line must instead match the complete antecedent. |
| `Q & R` | This is the consequent. To apply `→E`, the other cited line must contain the antecedent of the conditional. |

## Level 4: Mixed Rule Practice

These hints describe the selected rule and ask the student to compare its shape with the proof. They do not name the correct rule.

### Problems 1 and 4 — correct rule for instructor reference: `&I`

| Incorrect choice | Student feedback |
|---|---|
| `&E` | `&E` starts with a cited conjunction and copies one whole conjunct from it. Does the displayed proof have that shape? |
| `→E` | `→E` requires a cited conditional and another cited line containing its complete antecedent. Does the displayed proof have that shape? |

### Problems 2 and 5 — correct rule for instructor reference: `&E`

| Incorrect choice | Student feedback |
|---|---|
| `&I` | `&I` forms a conjunction from the exact sentences on its cited line number(s). Does the displayed proof have that shape? |
| `→E` | `→E` requires a cited conditional and another cited line containing its complete antecedent. Does the displayed proof have that shape? |

### Problems 3 and 6 — correct rule for instructor reference: `→E`

| Incorrect choice | Student feedback |
|---|---|
| `&I` | `&I` forms a conjunction from the exact sentences on its cited line number(s). Does the displayed proof have that shape? |
| `&E` | `&E` starts with a cited conjunction and copies one whole conjunct from it. Does the displayed proof have that shape? |

## Repository instruction

> Treat incorrect-answer feedback in educational games as high-risk instructional content. Before implementing or committing new or revised feedback, create or update an instructor-readable feedback reference that shows each problem, distractor, and proposed response. Ask the repository owner to review and approve that wording. Do not describe the feedback as final until approval. Check each explanation against the exact formal rule, including limiting or degenerate cases such as citing the same line twice for `&I`, and avoid claims stronger than the rule itself. Prefer hints that direct the student back to the schema without supplying the correct answer.
