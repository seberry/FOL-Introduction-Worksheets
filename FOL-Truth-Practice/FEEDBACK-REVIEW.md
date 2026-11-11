# Proposed feedback for visual truth practice

**Status: approved by the repository owner on 2026-11-11, with compact atomic notation.**

Each case below is one gallery card. A false card is an incorrect selection; a true card is an accepted selection. The model column is for instructor review, not additional student feedback. The same patterns apply to later rounds. The displayed short response mentions only facts relevant to the sentence.

For compound sentences, a “More explanation” control would reveal the existing explainer’s recursive explanation. Its current output for each case appears below the corresponding table. No new expanded wording is proposed here. For a simple atomic sentence, the short response already gives the name and full extension; an expanded control is unnecessary.

A disjunction is true when at least one disjunct is true: for example, if Pa is true and Qb is false, Pa ∨ Qb is true.

## Pa

Pa says that the object named by a has property P.

### Initial sentence: Pa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1; Q: nothing | true | Correct! a names 1 and P applies to 1, so Pa is true. |
| 2 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1 and 3; Q: nothing | false | Not quite. a names 2 and P only applies to 1 and 3, so Pa is false. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1 and 2; Q: nothing | true | Correct! a names 2 and P applies to 1 and 2, so Pa is true. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 1; P: 2 and 3; Q: nothing | false | Not quite. a names 1 and P only applies to 2 and 3, so Pa is false. |
| 5 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1 and 3; Q: nothing | true | Correct! a names 3 and P applies to 1 and 3, so Pa is true. |
| 6 | Domain: 1, 2, and 3; a names 3; b names 1; P: nothing; Q: nothing | false | Not quite. a names 3 and P applies to nothing, so Pa is false. |

### Related variation: Qb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 1, 2, and 3 | true | Correct! b names 1 and Q applies to 1, 2, and 3, so Qb is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 3; P: nothing; Q: 2 | false | Not quite. b names 3 and Q only applies to 2, so Qb is false. |
| 3 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: 2 | true | Correct! b names 2 and Q applies to 2, so Qb is true. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: 2 and 3 | true | Correct! b names 2 and Q applies to 2 and 3, so Qb is true. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: 3 | false | Not quite. b names 2 and Q only applies to 3, so Qb is false. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 2 and 3 | false | Not quite. b names 1 and Q only applies to 2 and 3, so Qb is false. |

## Pa ∨ Qa

At least one of P and Q applies to the object named by a.

### Initial sentence: Pa ∨ Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1 and 3; Q: 1 | false | Not quite. Pa is false and Qa is false, so Pa ∨ Qa is false. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 2 | false | Not quite. Pa is false and Qa is false, so Pa ∨ Qa is false. |
| 3 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2; Q: 2 and 3 | true | Correct! Pa is false and Qa is true, so Pa ∨ Qa is true. |
| 4 | Domain: 1, 2, and 3; a names 3; b names 1; P: nothing; Q: nothing | false | Not quite. Pa is false and Qa is false, so Pa ∨ Qa is false. |
| 5 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1, 2, and 3; Q: 2 and 3 | true | Correct! Pa is true and Qa is true, so Pa ∨ Qa is true. |
| 6 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2 and 3; Q: 2 and 3 | true | Correct! Pa is true and Qa is true, so Pa ∨ Qa is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pa ∨ Qa) is false because both disjuncts are false.
  Pa is false because a denotes 2 and 2 is not in P.
  Qa is false because a denotes 2 and 2 is not in Q.
```

Card 2:

```text
(Pa ∨ Qa) is false because both disjuncts are false.
  Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 3:

```text
(Pa ∨ Qa) is true because its right disjunct is true.
  Pa is false because a denotes 3 and 3 is not in P.
  Qa is true because a denotes 3 and 3 is in Q.
```

Card 4:

```text
(Pa ∨ Qa) is false because both disjuncts are false.
  Pa is false because a denotes 3 and 3 is not in P.
  Qa is false because a denotes 3 and 3 is not in Q.
```

Card 5:

```text
(Pa ∨ Qa) is true because both disjuncts are true.
  Pa is true because a denotes 3 and 3 is in P.
  Qa is true because a denotes 3 and 3 is in Q.
```

Card 6:

```text
(Pa ∨ Qa) is true because both disjuncts are true.
  Pa is true because a denotes 3 and 3 is in P.
  Qa is true because a denotes 3 and 3 is in Q.
```

</details>

### Related variation: Pb ∨ Qb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: 2 | true | Correct! Pb is false and Qb is true, so Pb ∨ Qb is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 2; P: 1; Q: nothing | false | Not quite. Pb is false and Qb is false, so Pb ∨ Qb is false. |
| 3 | Domain: 1, 2, and 3; a names 1; b names 2; P: 1; Q: 1 | false | Not quite. Pb is false and Qb is false, so Pb ∨ Qb is false. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: nothing | false | Not quite. Pb is false and Qb is false, so Pb ∨ Qb is false. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 2; P: 1, 2, and 3; Q: 1 and 2 | true | Correct! Pb is true and Qb is true, so Pb ∨ Qb is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 2; P: 2; Q: 2 and 3 | true | Correct! Pb is true and Qb is true, so Pb ∨ Qb is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pb ∨ Qb) is true because its right disjunct is true.
  Pb is false because b denotes 2 and 2 is not in P.
  Qb is true because b denotes 2 and 2 is in Q.
```

Card 2:

```text
(Pb ∨ Qb) is false because both disjuncts are false.
  Pb is false because b denotes 2 and 2 is not in P.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 3:

```text
(Pb ∨ Qb) is false because both disjuncts are false.
  Pb is false because b denotes 2 and 2 is not in P.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 4:

```text
(Pb ∨ Qb) is false because both disjuncts are false.
  Pb is false because b denotes 2 and 2 is not in P.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 5:

```text
(Pb ∨ Qb) is true because both disjuncts are true.
  Pb is true because b denotes 2 and 2 is in P.
  Qb is true because b denotes 2 and 2 is in Q.
```

Card 6:

```text
(Pb ∨ Qb) is true because both disjuncts are true.
  Pb is true because b denotes 2 and 2 is in P.
  Qb is true because b denotes 2 and 2 is in Q.
```

</details>

## Pa ∧ Qb

P applies to the object named by a, and Q applies to the object named by b.

### Initial sentence: Pa ∧ Qb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 3; b names 3; P: 3; Q: 3 | true | Correct! Pa is true and Qb is true, so Pa ∧ Qb is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 3; P: nothing; Q: nothing | false | Not quite. Pa is false and Qb is false, so Pa ∧ Qb is false. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 3; P: 1 and 3; Q: 1 and 2 | false | Not quite. Pa is false and Qb is false, so Pa ∧ Qb is false. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1; Q: 1 and 3 | true | Correct! Pa is true and Qb is true, so Pa ∧ Qb is true. |
| 5 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2; Q: 3 | false | Not quite. Pa is false and Qb is false, so Pa ∧ Qb is false. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 3; P: 1, 2, and 3; Q: 2 and 3 | true | Correct! Pa is true and Qb is true, so Pa ∧ Qb is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pa ∧ Qb) is true because both conjuncts are true.
  Pa is true because a denotes 3 and 3 is in P.
  Qb is true because b denotes 3 and 3 is in Q.
```

Card 2:

```text
(Pa ∧ Qb) is false because both conjuncts are false.
  Pa is false because a denotes 1 and 1 is not in P.
  Qb is false because b denotes 3 and 3 is not in Q.
```

Card 3:

```text
(Pa ∧ Qb) is false because both conjuncts are false.
  Pa is false because a denotes 2 and 2 is not in P.
  Qb is false because b denotes 3 and 3 is not in Q.
```

Card 4:

```text
(Pa ∧ Qb) is true because both conjuncts are true.
  Pa is true because a denotes 1 and 1 is in P.
  Qb is true because b denotes 1 and 1 is in Q.
```

Card 5:

```text
(Pa ∧ Qb) is false because both conjuncts are false.
  Pa is false because a denotes 3 and 3 is not in P.
  Qb is false because b denotes 1 and 1 is not in Q.
```

Card 6:

```text
(Pa ∧ Qb) is true because both conjuncts are true.
  Pa is true because a denotes 1 and 1 is in P.
  Qb is true because b denotes 3 and 3 is in Q.
```

</details>

### Related variation: Qa ∧ Pb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 3; b names 2; P: 1; Q: 1 | false | Not quite. Qa is false and Pb is false, so Qa ∧ Pb is false. |
| 2 | Domain: 1, 2, and 3; a names 2; b names 1; P: 2 and 3; Q: nothing | false | Not quite. Qa is false and Pb is false, so Qa ∧ Pb is false. |
| 3 | Domain: 1, 2, and 3; a names 3; b names 3; P: 1 and 3; Q: 2 and 3 | true | Correct! Qa is true and Pb is true, so Qa ∧ Pb is true. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1, 2, and 3; Q: 1 and 3 | true | Correct! Qa is true and Pb is true, so Qa ∧ Pb is true. |
| 5 | Domain: 1, 2, and 3; a names 2; b names 3; P: 1, 2, and 3; Q: 2 | true | Correct! Qa is true and Pb is true, so Qa ∧ Pb is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1, 2, and 3; Q: 2 and 3 | false | Not quite. Qa is false and Pb is true, so Qa ∧ Pb is false. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Qa ∧ Pb) is false because both conjuncts are false.
  Qa is false because a denotes 3 and 3 is not in Q.
  Pb is false because b denotes 2 and 2 is not in P.
```

Card 2:

```text
(Qa ∧ Pb) is false because both conjuncts are false.
  Qa is false because a denotes 2 and 2 is not in Q.
  Pb is false because b denotes 1 and 1 is not in P.
```

Card 3:

```text
(Qa ∧ Pb) is true because both conjuncts are true.
  Qa is true because a denotes 3 and 3 is in Q.
  Pb is true because b denotes 3 and 3 is in P.
```

Card 4:

```text
(Qa ∧ Pb) is true because both conjuncts are true.
  Qa is true because a denotes 1 and 1 is in Q.
  Pb is true because b denotes 1 and 1 is in P.
```

Card 5:

```text
(Qa ∧ Pb) is true because both conjuncts are true.
  Qa is true because a denotes 2 and 2 is in Q.
  Pb is true because b denotes 3 and 3 is in P.
```

Card 6:

```text
(Qa ∧ Pb) is false because its left conjunct is false.
  Qa is false because a denotes 1 and 1 is not in Q.
  Pb is true because b denotes 1 and 1 is in P.
```

</details>

## ¬Pa

P does not apply to the object named by a.

### Initial sentence: ¬Pa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 1; P: 3; Q: nothing | true | Correct! Pa is false, so ¬Pa is true. |
| 2 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1, 2, and 3; Q: nothing | false | Not quite. Pa is true, so ¬Pa is false. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 1; P: 3; Q: nothing | true | Correct! Pa is false, so ¬Pa is true. |
| 4 | Domain: 1, 2, and 3; a names 3; b names 1; P: nothing; Q: nothing | true | Correct! Pa is false, so ¬Pa is true. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1 and 3; Q: nothing | false | Not quite. Pa is true, so ¬Pa is false. |
| 6 | Domain: 1, 2, and 3; a names 3; b names 1; P: 3; Q: nothing | false | Not quite. Pa is true, so ¬Pa is false. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
¬Pa is true because Pa is false.
  Pa is false because a denotes 1 and 1 is not in P.
```

Card 2:

```text
¬Pa is false because Pa is true.
  Pa is true because a denotes 2 and 2 is in P.
```

Card 3:

```text
¬Pa is true because Pa is false.
  Pa is false because a denotes 2 and 2 is not in P.
```

Card 4:

```text
¬Pa is true because Pa is false.
  Pa is false because a denotes 3 and 3 is not in P.
```

Card 5:

```text
¬Pa is false because Pa is true.
  Pa is true because a denotes 1 and 1 is in P.
```

Card 6:

```text
¬Pa is false because Pa is true.
  Pa is true because a denotes 3 and 3 is in P.
```

</details>

### Related variation: ¬Qb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 3; P: nothing; Q: 1 and 3 | false | Not quite. Qb is true, so ¬Qb is false. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 1 and 2 | false | Not quite. Qb is true, so ¬Qb is false. |
| 3 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 1, 2, and 3 | false | Not quite. Qb is true, so ¬Qb is false. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: nothing | true | Correct! Qb is false, so ¬Qb is true. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 2; P: nothing; Q: 3 | true | Correct! Qb is false, so ¬Qb is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 3 | true | Correct! Qb is false, so ¬Qb is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
¬Qb is false because Qb is true.
  Qb is true because b denotes 3 and 3 is in Q.
```

Card 2:

```text
¬Qb is false because Qb is true.
  Qb is true because b denotes 1 and 1 is in Q.
```

Card 3:

```text
¬Qb is false because Qb is true.
  Qb is true because b denotes 1 and 1 is in Q.
```

Card 4:

```text
¬Qb is true because Qb is false.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 5:

```text
¬Qb is true because Qb is false.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 6:

```text
¬Qb is true because Qb is false.
  Qb is false because b denotes 1 and 1 is not in Q.
```

</details>

## ¬Pa ∧ Qa

P does not apply to a, and Q does apply to a.

### Initial sentence: ¬Pa ∧ Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1, 2, and 3; Q: 2 | false | Not quite. ¬Pa is false and Qa is true, so ¬Pa ∧ Qa is false. |
| 2 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1, 2, and 3; Q: 1 and 2 | false | Not quite. ¬Pa is false and Qa is false, so ¬Pa ∧ Qa is false. |
| 3 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1; Q: 1 and 3 | true | Correct! ¬Pa is true and Qa is true, so ¬Pa ∧ Qa is true. |
| 4 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1; Q: 2 | true | Correct! ¬Pa is true and Qa is true, so ¬Pa ∧ Qa is true. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 1 and 2 | true | Correct! ¬Pa is true and Qa is true, so ¬Pa ∧ Qa is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 2; Q: 3 | false | Not quite. ¬Pa is true and Qa is false, so ¬Pa ∧ Qa is false. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(¬Pa ∧ Qa) is false because its left conjunct is false.
  ¬Pa is false because Pa is true.
    Pa is true because a denotes 2 and 2 is in P.
  Qa is true because a denotes 2 and 2 is in Q.
```

Card 2:

```text
(¬Pa ∧ Qa) is false because both conjuncts are false.
  ¬Pa is false because Pa is true.
    Pa is true because a denotes 3 and 3 is in P.
  Qa is false because a denotes 3 and 3 is not in Q.
```

Card 3:

```text
(¬Pa ∧ Qa) is true because both conjuncts are true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 3 and 3 is not in P.
  Qa is true because a denotes 3 and 3 is in Q.
```

Card 4:

```text
(¬Pa ∧ Qa) is true because both conjuncts are true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 2 and 2 is not in P.
  Qa is true because a denotes 2 and 2 is in Q.
```

Card 5:

```text
(¬Pa ∧ Qa) is true because both conjuncts are true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 1 and 1 is not in P.
  Qa is true because a denotes 1 and 1 is in Q.
```

Card 6:

```text
(¬Pa ∧ Qa) is false because its right conjunct is false.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

</details>

### Related variation: Pa ∧ ¬Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2 and 3; Q: nothing | true | Correct! Pa is true and ¬Qa is true, so Pa ∧ ¬Qa is true. |
| 2 | Domain: 1, 2, and 3; a names 2; b names 1; P: 2; Q: 1 and 3 | true | Correct! Pa is true and ¬Qa is true, so Pa ∧ ¬Qa is true. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1 and 3; Q: 1 and 2 | false | Not quite. Pa is false and ¬Qa is false, so Pa ∧ ¬Qa is false. |
| 4 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1; Q: 1 and 3 | false | Not quite. Pa is false and ¬Qa is false, so Pa ∧ ¬Qa is false. |
| 5 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2 and 3; Q: 2 and 3 | false | Not quite. Pa is true and ¬Qa is false, so Pa ∧ ¬Qa is false. |
| 6 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1, 2, and 3; Q: nothing | true | Correct! Pa is true and ¬Qa is true, so Pa ∧ ¬Qa is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pa ∧ ¬Qa) is true because both conjuncts are true.
  Pa is true because a denotes 3 and 3 is in P.
  ¬Qa is true because Qa is false.
    Qa is false because a denotes 3 and 3 is not in Q.
```

Card 2:

```text
(Pa ∧ ¬Qa) is true because both conjuncts are true.
  Pa is true because a denotes 2 and 2 is in P.
  ¬Qa is true because Qa is false.
    Qa is false because a denotes 2 and 2 is not in Q.
```

Card 3:

```text
(Pa ∧ ¬Qa) is false because both conjuncts are false.
  Pa is false because a denotes 2 and 2 is not in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 2 and 2 is in Q.
```

Card 4:

```text
(Pa ∧ ¬Qa) is false because both conjuncts are false.
  Pa is false because a denotes 3 and 3 is not in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 3 and 3 is in Q.
```

Card 5:

```text
(Pa ∧ ¬Qa) is false because its right conjunct is false.
  Pa is true because a denotes 3 and 3 is in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 3 and 3 is in Q.
```

Card 6:

```text
(Pa ∧ ¬Qa) is true because both conjuncts are true.
  Pa is true because a denotes 2 and 2 is in P.
  ¬Qa is true because Qa is false.
    Qa is false because a denotes 2 and 2 is not in Q.
```

</details>

## ¬Pa ∨ Qa

Either P does not apply to a, or Q applies to a, or both.

### Initial sentence: ¬Pa ∨ Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 1; P: 3; Q: 2 and 3 | true | Correct! ¬Pa is true and Qa is false, so ¬Pa ∨ Qa is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: 2 | true | Correct! ¬Pa is true and Qa is false, so ¬Pa ∨ Qa is true. |
| 3 | Domain: 1, 2, and 3; a names 3; b names 1; P: 1 and 3; Q: 2 | false | Not quite. ¬Pa is false and Qa is false, so ¬Pa ∨ Qa is false. |
| 4 | Domain: 1, 2, and 3; a names 2; b names 1; P: 2; Q: 1 | false | Not quite. ¬Pa is false and Qa is false, so ¬Pa ∨ Qa is false. |
| 5 | Domain: 1, 2, and 3; a names 3; b names 1; P: 3; Q: 1 | false | Not quite. ¬Pa is false and Qa is false, so ¬Pa ∨ Qa is false. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 3; Q: 2 | true | Correct! ¬Pa is true and Qa is false, so ¬Pa ∨ Qa is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(¬Pa ∨ Qa) is true because its left disjunct is true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 2:

```text
(¬Pa ∨ Qa) is true because its left disjunct is true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 3:

```text
(¬Pa ∨ Qa) is false because both disjuncts are false.
  ¬Pa is false because Pa is true.
    Pa is true because a denotes 3 and 3 is in P.
  Qa is false because a denotes 3 and 3 is not in Q.
```

Card 4:

```text
(¬Pa ∨ Qa) is false because both disjuncts are false.
  ¬Pa is false because Pa is true.
    Pa is true because a denotes 2 and 2 is in P.
  Qa is false because a denotes 2 and 2 is not in Q.
```

Card 5:

```text
(¬Pa ∨ Qa) is false because both disjuncts are false.
  ¬Pa is false because Pa is true.
    Pa is true because a denotes 3 and 3 is in P.
  Qa is false because a denotes 3 and 3 is not in Q.
```

Card 6:

```text
(¬Pa ∨ Qa) is true because its left disjunct is true.
  ¬Pa is true because Pa is false.
    Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

</details>

### Related variation: Pa ∨ ¬Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 3; b names 1; P: 2; Q: 3 | false | Not quite. Pa is false and ¬Qa is false, so Pa ∨ ¬Qa is false. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1 and 3; Q: 1 and 2 | true | Correct! Pa is true and ¬Qa is false, so Pa ∨ ¬Qa is true. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 1; P: 3; Q: 2 | false | Not quite. Pa is false and ¬Qa is false, so Pa ∨ ¬Qa is false. |
| 4 | Domain: 1, 2, and 3; a names 3; b names 1; P: nothing; Q: 1 and 3 | false | Not quite. Pa is false and ¬Qa is false, so Pa ∨ ¬Qa is false. |
| 5 | Domain: 1, 2, and 3; a names 2; b names 1; P: 2 and 3; Q: 1 and 2 | true | Correct! Pa is true and ¬Qa is false, so Pa ∨ ¬Qa is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1; Q: 2 and 3 | true | Correct! Pa is true and ¬Qa is true, so Pa ∨ ¬Qa is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pa ∨ ¬Qa) is false because both disjuncts are false.
  Pa is false because a denotes 3 and 3 is not in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 3 and 3 is in Q.
```

Card 2:

```text
(Pa ∨ ¬Qa) is true because its left disjunct is true.
  Pa is true because a denotes 1 and 1 is in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 1 and 1 is in Q.
```

Card 3:

```text
(Pa ∨ ¬Qa) is false because both disjuncts are false.
  Pa is false because a denotes 2 and 2 is not in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 2 and 2 is in Q.
```

Card 4:

```text
(Pa ∨ ¬Qa) is false because both disjuncts are false.
  Pa is false because a denotes 3 and 3 is not in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 3 and 3 is in Q.
```

Card 5:

```text
(Pa ∨ ¬Qa) is true because its left disjunct is true.
  Pa is true because a denotes 2 and 2 is in P.
  ¬Qa is false because Qa is true.
    Qa is true because a denotes 2 and 2 is in Q.
```

Card 6:

```text
(Pa ∨ ¬Qa) is true because both disjuncts are true.
  Pa is true because a denotes 1 and 1 is in P.
  ¬Qa is true because Qa is false.
    Qa is false because a denotes 1 and 1 is not in Q.
```

</details>

## Pa → Qa

If P applies to a, then Q applies to a. The conditional is false only when P applies to a and Q does not.

### Initial sentence: Pa → Qa

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 1; P: 2; Q: nothing | true | Correct! Pa is false and Qa is false, so Pa → Qa is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: nothing | true | Correct! Pa is false and Qa is false, so Pa → Qa is true. |
| 3 | Domain: 1, 2, and 3; a names 2; b names 1; P: 1, 2, and 3; Q: 3 | false | Not quite. Pa is true and Qa is false, so Pa → Qa is false. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1 and 2; Q: 2 | false | Not quite. Pa is true and Qa is false, so Pa → Qa is false. |
| 5 | Domain: 1, 2, and 3; a names 2; b names 1; P: 3; Q: 2 and 3 | true | Correct! Pa is false and Qa is true, so Pa → Qa is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1; Q: 2 and 3 | false | Not quite. Pa is true and Qa is false, so Pa → Qa is false. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pa → Qa) is true because its antecedent is false.
  Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 2:

```text
(Pa → Qa) is true because its antecedent is false.
  Pa is false because a denotes 1 and 1 is not in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 3:

```text
(Pa → Qa) is false because its antecedent is true and its consequent is false.
  Pa is true because a denotes 2 and 2 is in P.
  Qa is false because a denotes 2 and 2 is not in Q.
```

Card 4:

```text
(Pa → Qa) is false because its antecedent is true and its consequent is false.
  Pa is true because a denotes 1 and 1 is in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

Card 5:

```text
(Pa → Qa) is true because its antecedent is false.
  Pa is false because a denotes 2 and 2 is not in P.
  Qa is true because a denotes 2 and 2 is in Q.
```

Card 6:

```text
(Pa → Qa) is false because its antecedent is true and its consequent is false.
  Pa is true because a denotes 1 and 1 is in P.
  Qa is false because a denotes 1 and 1 is not in Q.
```

</details>

### Related variation: Pb → Qb

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, and 3; a names 1; b names 3; P: 2; Q: 1 and 2 | true | Correct! Pb is false and Qb is false, so Pb → Qb is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 2; P: 2; Q: 1 and 3 | false | Not quite. Pb is true and Qb is false, so Pb → Qb is false. |
| 3 | Domain: 1, 2, and 3; a names 1; b names 3; P: nothing; Q: 2 | true | Correct! Pb is false and Qb is false, so Pb → Qb is true. |
| 4 | Domain: 1, 2, and 3; a names 1; b names 2; P: 2; Q: 1 | false | Not quite. Pb is true and Qb is false, so Pb → Qb is false. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1, 2, and 3; Q: 3 | false | Not quite. Pb is true and Qb is false, so Pb → Qb is false. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: nothing | true | Correct! Pb is false and Qb is false, so Pb → Qb is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
(Pb → Qb) is true because its antecedent is false.
  Pb is false because b denotes 3 and 3 is not in P.
  Qb is false because b denotes 3 and 3 is not in Q.
```

Card 2:

```text
(Pb → Qb) is false because its antecedent is true and its consequent is false.
  Pb is true because b denotes 2 and 2 is in P.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 3:

```text
(Pb → Qb) is true because its antecedent is false.
  Pb is false because b denotes 3 and 3 is not in P.
  Qb is false because b denotes 3 and 3 is not in Q.
```

Card 4:

```text
(Pb → Qb) is false because its antecedent is true and its consequent is false.
  Pb is true because b denotes 2 and 2 is in P.
  Qb is false because b denotes 2 and 2 is not in Q.
```

Card 5:

```text
(Pb → Qb) is false because its antecedent is true and its consequent is false.
  Pb is true because b denotes 1 and 1 is in P.
  Qb is false because b denotes 1 and 1 is not in Q.
```

Card 6:

```text
(Pb → Qb) is true because its antecedent is false.
  Pb is false because b denotes 1 and 1 is not in P.
  Qb is false because b denotes 1 and 1 is not in Q.
```

</details>

## ∃x Px

At least one object has property P.

### Initial sentence: ∃x Px

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1, 2, 3, and 4; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. P applies to nothing, so ∃x Px is false. |
| 2 | Domain: 1; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. P applies to nothing, so ∃x Px is false. |
| 3 | Domain: 1 and 2; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. P applies to nothing, so ∃x Px is false. |
| 4 | Domain: 1; a names 1; b names 1; P: 1; Q: nothing | true | Correct! 1 is a witness because P applies to 1, so ∃x Px is true. |
| 5 | Domain: 1, 2, and 3; a names 1; b names 1; P: 2 and 3; Q: nothing | true | Correct! 2 is a witness because P applies to 2, so ∃x Px is true. |
| 6 | Domain: 1, 2, and 3; a names 1; b names 1; P: 1 and 3; Q: nothing | true | Correct! 1 is a witness because P applies to 1, so ∃x Px is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
∃x Px is false because its body is false for every object in the domain.
  With x = 1:
    Px is false because x = 1 and 1 is not in P.
  With x = 2:
    Px is false because x = 2 and 2 is not in P.
  With x = 3:
    Px is false because x = 3 and 3 is not in P.
  With x = 4:
    Px is false because x = 4 and 4 is not in P.
```

Card 2:

```text
∃x Px is false because its body is false for every object in the domain.
  With x = 1:
    Px is false because x = 1 and 1 is not in P.
```

Card 3:

```text
∃x Px is false because its body is false for every object in the domain.
  With x = 1:
    Px is false because x = 1 and 1 is not in P.
  With x = 2:
    Px is false because x = 2 and 2 is not in P.
```

Card 4:

```text
∃x Px is true because its body is true for x = 1.
  With x = 1:
    Px is true because x = 1 and 1 is in P.
```

Card 5:

```text
∃x Px is true because its body is true for x = 2.
  With x = 2:
    Px is true because x = 2 and 2 is in P.
```

Card 6:

```text
∃x Px is true because its body is true for x = 1.
  With x = 1:
    Px is true because x = 1 and 1 is in P.
```

</details>

### Related variation: ∃x Qx

| Card | Model | Truth | Proposed short response |
| --- | --- | --- | --- |
| 1 | Domain: 1 and 2; a names 1; b names 1; P: nothing; Q: 1 and 2 | true | Correct! 1 is a witness because Q applies to 1, so ∃x Qx is true. |
| 2 | Domain: 1, 2, and 3; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. Q applies to nothing, so ∃x Qx is false. |
| 3 | Domain: 1, 2, 3, and 4; a names 1; b names 1; P: nothing; Q: 2 and 4 | true | Correct! 2 is a witness because Q applies to 2, so ∃x Qx is true. |
| 4 | Domain: 1, 2, 3, and 4; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. Q applies to nothing, so ∃x Qx is false. |
| 5 | Domain: 1; a names 1; b names 1; P: nothing; Q: nothing | false | Not quite. Q applies to nothing, so ∃x Qx is false. |
| 6 | Domain: 1, 2, 3, and 4; a names 1; b names 1; P: nothing; Q: 1 and 2 | true | Correct! 1 is a witness because Q applies to 1, so ∃x Qx is true. |

<details>
<summary>Existing full explanations for these six cards</summary>

Card 1:

```text
∃x Qx is true because its body is true for x = 1.
  With x = 1:
    Qx is true because x = 1 and 1 is in Q.
```

Card 2:

```text
∃x Qx is false because its body is false for every object in the domain.
  With x = 1:
    Qx is false because x = 1 and 1 is not in Q.
  With x = 2:
    Qx is false because x = 2 and 2 is not in Q.
  With x = 3:
    Qx is false because x = 3 and 3 is not in Q.
```

Card 3:

```text
∃x Qx is true because its body is true for x = 2.
  With x = 2:
    Qx is true because x = 2 and 2 is in Q.
```

Card 4:

```text
∃x Qx is false because its body is false for every object in the domain.
  With x = 1:
    Qx is false because x = 1 and 1 is not in Q.
  With x = 2:
    Qx is false because x = 2 and 2 is not in Q.
  With x = 3:
    Qx is false because x = 3 and 3 is not in Q.
  With x = 4:
    Qx is false because x = 4 and 4 is not in Q.
```

Card 5:

```text
∃x Qx is false because its body is false for every object in the domain.
  With x = 1:
    Qx is false because x = 1 and 1 is not in Q.
```

Card 6:

```text
∃x Qx is true because its body is true for x = 1.
  With x = 1:
    Qx is true because x = 1 and 1 is in Q.
```

</details>

## Witness activity: ∃x Px

Model: Domain: 1, 2, and 3; a names 1; b names 2; P: 1 and 3; Q: nothing.

| Clicked object | Valid? | Proposed response |
| --- | --- | --- |
| 1 | Yes | Correct! P applies to 1, so 1 is a witness. |
| 2 | No | Not quite. P does not apply to 2, so 2 is not a witness. |
| 3 | Yes | Correct! P applies to 3, so 3 is a witness. |

For any true existential gallery model, the same pattern accepts each object in P and rejects each object outside P. If P is empty, ∃x Px is false and there is no witness.
