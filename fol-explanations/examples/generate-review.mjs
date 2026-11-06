import { writeFile } from 'node:fs/promises';
import { explainTruth, explainCandidate } from '../index.mjs';
import { versions, questions, polyadicModel } from './quiz9.mjs';

// Regenerate from the exact same functions that callers use; never hand-edit output.
const lines = [
  '# FOL explanation wording — approved reference', '',
  'Status: the repository owner approved this full-explanation wording on 2026-11-06: '
    + '"i dont think we need to work on it. just commit that". Full explanations, not hints. '
    + 'Future wording changes require review under AGENTS.md.', '',
  'Source: the supplied three-page Quiz_9_Monadic_FOL_Truth_A_C (3).pdf. '
    + 'Versions A, B, and C each have seven questions. Models and formulas are transcribed in examples/quiz9.mjs.', '',
  'Every question includes the response to the opposite (incorrect) truth-value answer. '
    + 'Questions 2–5 additionally include every in-domain object choice, including all distractors. '
    + 'An N/A entry is correct only when the true existential / false universal convention does not require an object. '
    + 'The candidate explanations check only the first quantifier and do not give a replacement object.', '',
  'Logical values and candidate sets are checked against a separately written answer key in test/semantics.test.mjs. '
    + 'The module is standalone; existing worksheets and quizzes have not yet been connected to it.', '',
  'For reuse, see INTEGRATION.md and README.md. If proposing future wording changes, review this file with '
    + 'commentary.mjs (wording) and core.mjs (semantics), then regenerate this reference.', '',
  'Regenerate with: `node fol-explanations/examples/generate-review.mjs`.', ''
];
const block = text => lines.push('```text', text, '```', '');

for (const [version, model] of Object.entries(versions)) {
  lines.push(`## Quiz 9 — Version ${version}`, '', `Model: \`${JSON.stringify(model)}\``, '',
    '| Question | Truth | Required object | Valid choices |', '| --- | --- | --- | --- |');
  for (const question of questions) {
    const result = explainTruth(question.formula, model);
    const kind = question.objectRequested ? result.requiredEvidence : null;
    const candidates = kind ? model.domain.filter(object => explainCandidate(question.formula, model, object).valid) : [];
    lines.push(`| ${question.number} | ${result.value ? 'True' : 'False'} | ${question.objectRequested ? kind ?? 'N/A' : 'not asked'} | ${candidates.join(', ') || '—'} |`);
  }
  lines.push('');
  for (const question of questions) {
    const result = explainTruth(question.formula, model);
    lines.push(`### ${version}${question.number}. ${question.formula}`, '',
      `Incorrect truth-value response: **${result.value ? 'False' : 'True'}**. Proposed explanation:`, '');
    block(explainTruth(question.formula, model, { claimedTruth: !result.value }).text);
    if (question.objectRequested) {
      lines.push(result.requiredEvidence
        ? `N/A is incorrect: a ${result.requiredEvidence} is required for this ${result.value ? 'true existential' : 'false universal'}.`
        : 'N/A is correct: this question does not require an object for the actual truth value.', '');
      for (const object of model.domain) {
        const candidate = explainCandidate(question.formula, model, object);
        lines.push(`Object choice **${object}** — **${candidate.valid ? 'valid' : 'invalid'} ${candidate.kind}**:`, '');
        block(candidate.text);
      }
    }
  }
}

lines.push('## Additional polyadic and nested-quantifier cases', '', `Model: \`${JSON.stringify(polyadicModel)}\``, '');
for (const [formula, object] of [
  ['∃x ∀y R(x,y)', 2],
  ['∀x ∃y R(x,y)', 3],
  ['∃x ∃y R(x,y)', 2],
  ['∀x R(x,x)', 3],
  ['∃x (R(a,x) ∧ x ≠ a)', 1]
]) {
  lines.push(`### ${formula}`, '', 'Truth explanation:', '');
  block(explainTruth(formula, polyadicModel).text);
  lines.push(`Checking the proposed object **${object}** for just the first quantifier:`, '');
  block(explainCandidate(formula, polyadicModel, object).text);
}
lines.push('## Out-of-domain response', '');
block(explainCandidate(questions[1].formula, versions.A, 4).text);

await writeFile(new URL('../FEEDBACK-REVIEW.md', import.meta.url), lines.join('\n'), 'utf8');
process.stdout.write('Wrote fol-explanations/FEEDBACK-REVIEW.md\n');
