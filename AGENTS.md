# Repository guidance

## Reusable FOL truth and witness/counterexample explanations

For truth in finite FOL models or quiz feedback, start with
[`fol-explanations/README.md`](fol-explanations/README.md). The dependency-free
browser/Node module exports evaluation, human-readable explanations, and candidate
checks through `fol-explanations/index.mjs`. It covers monadic/polyadic predicates,
identity, Boolean connectives, and nested quantifiers. Reuse it rather than adding
another checker for each formula template.

- [`fol-explanations/INTEGRATION.md`](fol-explanations/INTEGRATION.md) is the handoff
  for other projects, including model adaptation and caller responsibilities.
- [`fol-explanations/FEEDBACK-REVIEW.md`](fol-explanations/FEEDBACK-REVIEW.md) records
  the approved full-explanation examples for all three versions of Quiz 9 and
  additional polyadic/nested cases. The repository owner approved the current
  wording on 2026-11-06. Future wording changes still follow the review rule below.
- Witnesses are required only for true outermost existentials; counterexamples
  only for false outermost universals. Check candidates by removing just the
  first quantifier. The host quiz decides which questions request an object.
- Run `node --test fol-explanations/test/semantics.test.mjs` to check semantics;
  regenerate the reference with `node fol-explanations/examples/generate-review.mjs`.

## Educational games and practice activities

Treat incorrect-answer feedback as high-risk instructional content. Before implementing or committing new or revised feedback:

1. Create or update an instructor-readable feedback reference showing each problem, distractor, and proposed response.
2. Ask the repository owner to review and approve the wording.
3. Do not describe the feedback as final or copy it into the activity until approval is given.
4. Check every explanation against the exact formal rule, including limiting or degenerate cases such as citing the same line twice for `&I`.
5. Avoid claims stronger than the rule itself. Prefer hints that direct the student back to the schema without supplying the correct answer.

After approval, keep the implemented feedback and its instructor-facing reference synchronized in the same commit.
