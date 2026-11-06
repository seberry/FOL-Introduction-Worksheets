# Handoff: FOL explanations for a quiz/grading project

## Source and approval

Repository: `https://github.com/seberry/FOL-Introduction-Worksheets`.
Local checkout: `C:\Users\seber\FOL-Introduction-Worksheets`.
Module directory: `fol-explanations/`.

The repository owner approved the existing wording on **2026-11-06**, asking to
commit it and prepare this handoff. The approved examples are in
[FEEDBACK-REVIEW.md](FEEDBACK-REVIEW.md); [README.md](README.md) documents the API,
notation, and semantics. No student-facing integration has been made in this
source repository. This handoff describes the reusable module, not a completed
integration into the destination quiz repository.

## What to carry over

Runtime files, kept together:

```text
fol-explanations/index.mjs        public exports
fol-explanations/core.mjs         parser, validation, recursive evaluation, candidate checks
fol-explanations/commentary.mjs   approved deterministic explanation wording
```

There are no third-party runtime packages, network calls, or LLM calls. JavaScript
ES modules work in Node and browser module scripts. Copy README.md,
FEEDBACK-REVIEW.md, INTEGRATION.md, and examples/ as well to preserve the conventions,
reference, and regeneration script. Record the source commit in the destination
repository when vendoring the files.

The source tests are in `test/semantics.test.mjs`. One parity test imports
`Quiz-Monadic-Truth/fol_problem_bank.js` from the source repository, so copying the
module directory alone does not make that legacy-bank comparison portable. Run
the complete suite in the source checkout; adapt that test or carry its fixture
if you also want to run the source suite in the destination repository.

## Minimal use

```js
import { explainTruth, explainCandidate } from './fol-explanations/index.mjs';

const model = {
  domain: [1, 2, 3],
  constants: { c: 2 },
  predicates: { P: [1, 2], Q: [1, 3], R: [1] }
};

// A wrong truth-value answer: explain the actual value and its reasons.
const truth = explainTruth('∀x (P(x) → (Q(x) ∨ R(x)))', model, {
  claimedTruth: true
});
// truth.value === false
// truth.requiredEvidence === 'counterexample'
// truth.text contains the full explanation using x = 2.

// A wrong witness: explain the body for this particular submitted object.
const candidate = explainCandidate('∃x (P(x) ∧ ¬Q(x))', model, 1);
// candidate.valid === false
// candidate.inDomain === true
// candidate.text explains why Q(x) is true and hence ¬Q(x) is false at x = 1.
```

The return values also include machine-readable evidence trees. In a browser,
render `.text` with `textContent` and preserve whitespace. CommonJS callers can
load the exports with `await import(...)`. A Python host would need a small Node
bridge (for example, JSON input/output over stdin/stdout); no Python adapter is
included. Keep the existing JavaScript semantics if choosing that route.

## Adapt the destination's data and grading flow

The module takes an already-transcribed **formula**, **model**, and optionally a
**student truth value or candidate object**. It does not read PDFs, interpret
handwriting, assign points, or select a TA's grading category.

1. Map the host model to `{ domain, constants, predicates }`. Unary predicate
   extensions may be flat arrays, e.g. `P: [1, 2]`. Binary and higher-arity
   predicates use ordered tuples, e.g. `R: [[1, 2], [2, 2]]`. Empty extensions
   are `[]`. Different constants may denote the same object.
2. Supply supported formula notation or an explicit syntax tree. See README.md
   for the exact grammar. In particular, quantifier scope is the next unary
   formula: use parentheses around a quantified conditional or conjunction.
3. For a clear truth-value error, pass the student's boolean as `claimedTruth`
   to `explainTruth`, then present `.text` for the TA's selected feedback action.
4. For a clear wrong-object response, pass the actual domain object to
   `explainCandidate`, then present its `.text`. It checks just that choice,
   retaining any quantifiers after the first one.
5. Keep N/A handling, point allocation, which questions ask for an object, and
   the TA's decision to use automated feedback in the host project. Ambiguous
   transcriptions or deeper misconceptions remain part of that host workflow.

Only **true outermost existentials** require witnesses and only **false outermost
universals** require counterexamples. `explainTruth(...).requiredEvidence` reports
this semantic condition; it does not override a question's instructions.
For example, `(∃x P(x)) ∧ (∃x Q(x))` has no single outer witness request.

For `∃x ∀y R(x,y)`, candidate 2 fixes x to 2 and checks `∀y R(x,y)` for truth.
For `∀x ∃y R(x,y)`, candidate 2 fixes x to 2 and checks `∃y R(x,y)` for falsity.
Consecutive existential quantifiers still request only one outer object.

Numbers and strings are distinct domain objects: numeric `2` must not silently
be replaced by string `"2"`. Convert text input according to the host's known
domain; do not send N/A as if it were a candidate object. An out-of-domain
candidate returns `inDomain: false`, `valid: false`, and an explanation. Invalid
formulas/models throw errors; handle those as input/integration problems rather
than incorrect student answers.

## Explanation behavior and supported scope

The default explanation gives enough recursive evidence to establish the result:
one satisfying instance for a true existential, one failing instance for a false
universal, every instance for a false existential or true universal, and both
Boolean children. `{ exhaustive: true }` prints all quantified instances. The
returned evidence tree always contains all of them. A failed-candidate explanation
prints the body for that candidate and does not offer an alternative outer object.

The module supports monadic and arbitrary finite-arity predicates, identity,
negation, conjunction, disjunction, material conditional, biconditional, and
nested quantification with variable shadowing. Domains must be small, finite,
nonempty arrays of unique numbers or strings. There are no function symbols or
infinite-model procedures. Full evidence trees can grow quickly with domain size
and quantifier nesting.

## Validation and maintenance

Run in the source checkout:

```text
node --test fol-explanations/test/semantics.test.mjs
node fol-explanations/examples/generate-review.mjs
```

The 12 tests include an independently written key for all 21 questions in the
provided three-version Quiz 9 PDF, all 36 requested in-domain object choices,
every Boolean truth-table combination, and agreement with all existing monadic
bank checkers on all 512 interpretations of three unary predicates over three
objects and all three constant denotations. They also check nested quantifiers,
shadowing, identity, polyadic tuples, invalid inputs, and explanation coverage.

Add destination-specific checks for its model adapter and actual quiz formulas.
No new wording approval is needed to reuse the current approved wording. If
changing the wording, preserve the instructor-readable reference and request the
owner's review; regenerate FEEDBACK-REVIEW.md and commit it with commentary.mjs.
