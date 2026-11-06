# Reusable FOL quiz explanations

A dependency-free JavaScript module for truth in small finite classical FOL models,
with recursive explanations and checks of proposed witnesses or counterexamples.
Runs in Node or a browser module. Copy this directory into another project;
the runtime needs only `index.mjs`, `core.mjs`, and `commentary.mjs`.

**The repository owner approved the current full-explanation wording on
2026-11-06**, saying, "i dont think we need to work on it. just commit that".
[FEEDBACK-REVIEW.md](FEEDBACK-REVIEW.md) contains the generated reference: all 21
questions from the supplied Quiz 9 PDF, every in-domain object choice for
questions 2–5, and additional nested/polyadic examples. This is a standalone module;
the existing worksheets and quiz have not yet been connected to it. Future wording
changes require review under AGENTS.md; keep the reference and implemented wording
synchronized. See [INTEGRATION.md](INTEGRATION.md) for the handoff to another project.

## Use

```js
import { explainTruth, explainCandidate } from './fol-explanations/index.mjs';

const model = {
  domain: [1, 2, 3],
  constants: { c: 2 },
  predicates: { P: [1, 2], Q: [1, 3], R: [1] }
};

const truth = explainTruth('∀x (P(x) → (Q(x) ∨ R(x)))', model, {
  claimedTruth: true // optional: add a response to the student's truth-value answer
});
console.log(truth.value);            // false
console.log(truth.requiredEvidence); // 'counterexample'
console.log(truth.text);             // full recursive explanation

const candidate = explainCandidate('∃x (P(x) ∧ ¬Q(x))', model, 1);
console.log(candidate.valid);        // false
console.log(candidate.text);         // why Q(x) is true, so ¬Q(x) is false at x = 1
```

In a browser use `<script type="module">` with the same imports, served over HTTP.
Output is plain text; insert it with `textContent`, or supply your own renderer
for the returned evidence tree. Domain-object strings are data, not HTML.

## Quiz conventions

- Only a **true outermost existential** requires a witness; only a **false
  outermost universal** requires a counterexample. `requiredEvidence` is `null`
  otherwise. The calling quiz still decides whether that question asks for an
  object at all. The module does not assign points or infer grading policy.
- An object's candidacy is tested by removing **just the first quantifier**.
  For `∃x ∀y R(x,y)`, choosing 2 sets x to 2 and checks `∀y R(x,y)`.
  For `∀x ∃y R(x,y)`, choosing 2 checks whether `∃y R(x,y)` is **false** at x = 2.
  A pair of consecutive existential quantifiers still asks for one outer object.
- A conjunction of existentials has no single outer witness request. Its
  conjuncts can be true for different objects. Negated quantified formulas also
  have no outer witness/counterexample request under this convention.
- `explainCandidate` can inspect an object even for a false existential or true
  universal: every in-domain candidate will fail, and `required` will be false.
  It throws for a formula without an outermost quantifier.
- Candidate values are actual domain objects. Numeric `2` and string `"2"` are
  different. The caller must interpret text inputs and N/A; this module does not
  guess whether a student intended an object, a constant, or N/A.
- Out-of-domain candidates return `valid: false`, `inDomain: false`, and
  `bodyTrace: null`. They are not evaluated as if they belonged to the model.

## How the reasoning works

1. Parse a formula into a syntax tree and validate its terms and interpretations.
2. For an atom, resolve its terms and check extension membership. For identity,
   compare the denotations. For a connective, apply its truth condition to its
   children. For a quantifier, evaluate its body once per domain object, with
   that variable's assignment replaced and other assignments preserved.
3. Record the result, assignment, resolved terms, and children at every node.
   Truth and candidate validity come from this evidence, independently of prose.
4. Render the evidence with deterministic wording. There is no LLM call.

`core.mjs` contains steps 1–3; `commentary.mjs` contains step 4 and is the main
place to workshop pedagogy. The starting pattern is the recursive evaluator in
`FOL-Truth-Review-1/index.html`, with validation, explicit term types, identity,
biconditionals, reusable exports, and a separate prose renderer added here.

The machine-readable evidence tree always contains **all** quantified instances
and Boolean children. The default prose explains both Boolean children, but
shows only one sufficient instance for a true existential or false universal.
For a false existential or true universal, it explains every object.
Use `{ exhaustive: true }` to print all quantified instances too.
Rejected-candidate feedback renders just the body for the chosen object; it does
not print an alternative witness or counterexample to the outer formula.

## Model and formula input

Domains are nonempty arrays of unique finite numbers or strings. Different
constants may denote the same object. Unary extensions can be `[1, 2]` or
`[[1], [2]]`; polyadic extensions use tuples, e.g. `R: [[1, 2], [2, 2]]`.
Empty extensions are `[]`. Missing predicates or constants are errors, rather
than implicitly false interpretations. Arity must be consistent, including uses
of predicates with empty extensions. Values outside the domain are rejected.

Supported strings include:

```text
¬P(c) ∨ Q(c)
∃x (P(x) ∧ Q(x) ∧ R(x))
∀x (P(x) → (Q(x) ∨ R(x)))
(∃x P(x)) ∧ (∃x Q(x))
∃x ∀y R(x,y)
∀x (R(x,x) ↔ x = a)
exists x (Px & ~Qx)
```

- Connectives: `¬ ~ !`, `∧ &`, `∨ |`, `→ ->`, `↔ <->`; identity `=`,
  nonidentity `≠ !=`; quantifiers `∀ forall`, `∃ exists`.
- Precedence from strongest to weakest: unary negation/quantification,
  conjunction, disjunction, conditional, biconditional. Conditionals associate
  right; repeated biconditionals require parentheses.
- A quantifier binds the next unary formula. Write `∀x (P(x) → Q(x))`
  when its scope includes the conditional. `∀x P(x) → Q(x)` leaves the final x free.
- Predicate symbols are a single uppercase letter, optionally followed by
  digits/underscores. Parenthesized term identifiers start lowercase and may
  contain lowercase letters, digits, and underscores. Compact `Rxy` uses
  single-letter terms; use `R(x,y)` for clearer input.
- Bound identifiers are variables. Free identifiers `u` through `z`, optionally
  followed by digits/underscores, are also variables; other identifiers are
  constants. Supply `options.assignment` for free variables. No term is a literal
  domain object in the formula: the number 2 is supplied as an assignment or
  constant interpretation, not by writing `P(2)`.
- For other naming conventions use an explicit AST with `variable(name)` and
  `constant(name)` terms. These types also distinguish a constant named x from
  a variable named x. The parser's conventions do not constrain explicit ASTs.
- No function symbols, empty domains, infinite models, or PDF/OCR ingestion.
  Input must already be a formula and a model. Full evidence trees grow with
  domain size and quantifier nesting; this prototype is intended for small quizzes.

## API

| Function | Result |
| --- | --- |
| `parseFormula(text)` | Syntax tree |
| `formatFormula(ast)` | Fully grouped binary formulas in normalized notation |
| `evaluate(textOrAst, model, assignment = {})` | `{ formula, assignment, value, resolvedTerms, children }` evidence tree; quantified children also have `object` |
| `requiredEvidence(trace)` | `'witness'`, `'counterexample'`, or `null` |
| `checkCandidate(textOrAst, model, object, assignment = {})` | `{ kind, candidate, inDomain, valid, required, trace, bodyTrace }` |
| `renderExplanation(trace, options = {})` | Plain text |
| `explainTruth(textOrAst, model, options = {})` | `{ value, requiredEvidence, trace, text }` |
| `explainCandidate(textOrAst, model, object, options = {})` | Candidate-check fields plus `text` |

Example explicit syntax tree:

```js
import { variable, constant, evaluate } from './fol-explanations/index.mjs';

evaluate({
  type: 'exists', variable: 'person', body: {
    type: 'atomic', relation: 'R', args: [variable('person'), constant('a')]
  }
}, {
  domain: [1, 2], constants: { a: 1 }, predicates: { R: [[2, 1]] }
});
```

Other node types: `not` with `body`; `and`, `or`, `implies`, `iff` with
`left` and `right` formulas; `identity` with `left` and `right` terms;
`forall` with `variable` and `body`. Input models and assignments are not mutated.

## Check and regenerate

From the repository root:

```text
node --test fol-explanations/test/semantics.test.mjs
node fol-explanations/examples/generate-review.mjs
```

Tests cover the independently written PDF answer key and candidate sets, every
classical Boolean truth-table case, every existing monadic problem-bank checker
across all 512 three-predicate interpretations on a three-object domain (and all
three constant denotations), nested quantifiers, variable shadowing, identity,
tuple ordering, malformed inputs, and explanation coverage.
