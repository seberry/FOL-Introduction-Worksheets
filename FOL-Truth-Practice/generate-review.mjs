import { lessons, gallery, truth, witness } from './models.mjs';
import { evaluate } from '../fol-explanations/index.mjs';
import { shortResponse, expandedResponse, witnessResponse } from './feedback.mjs';
const tv = value => value ? 'true' : 'false';
import { writeFileSync } from 'node:fs';

const list = xs => xs.length === 0 ? 'nothing' : xs.length === 1 ? String(xs[0]) : xs.length === 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}`;
const desc = m => `Domain: ${list(m.domain)}; a names ${m.constants.a}; b names ${m.constants.b}; P: ${list(m.predicates.P)}; Q: ${list(m.predicates.Q)}`;
const lines = ['# Proposed feedback for visual truth practice', '', '**Status: approved by the repository owner on 2026-11-11, with compact atomic notation.**', '', 'Each case below is one gallery card. A false card is an incorrect selection; a true card is an accepted selection. The model column is for instructor review, not additional student feedback. The same patterns apply to later rounds. The displayed short response mentions only facts relevant to the sentence.', '', 'For compound sentences, a “More explanation” control would reveal the existing explainer’s recursive explanation. Its current output for each case appears below the corresponding table. No new expanded wording is proposed here. For a simple atomic sentence, the short response already gives the name and full extension; an expanded control is unnecessary.', '', 'A disjunction is true when at least one disjunct is true: for example, if Pa is true and Qb is false, Pa ∨ Qb is true.', ''];
for (const lesson of lessons.slice(0, 8)) {
 lines.push(`## ${lesson.formula}`, '', lesson.introduction, '');
 for (const [kind, formula] of [['Initial sentence', lesson.formula], ['Related variation', lesson.variation]]) {
  lines.push(`### ${kind}: ${formula}`, '', '| Card | Model | Truth | Proposed short response |', '| --- | --- | --- | --- |');
  const cards=gallery(formula);
  cards.forEach((m,i) => { const value=truth(formula,m); lines.push(`| ${i+1} | ${desc(m)} | ${tv(value)} | ${shortResponse(formula,m)} |`); });
  if (evaluate(formula,cards[0]).formula.type !== 'atomic') {
    lines.push('', '<details>', '<summary>Existing full explanations for these six cards</summary>', '');
    cards.forEach((m,i) => lines.push(`Card ${i+1}:`, '', '```text', expandedResponse(formula,m), '```', ''));
    lines.push('</details>');
  }
  lines.push('');
 }
}
const wm={domain:[1,2,3],constants:{a:1,b:2},predicates:{P:[1,3],Q:[]}};
lines.push('## Witness activity: ∃x Px', '', `Model: ${desc(wm)}.`, '', '| Clicked object | Valid? | Proposed response |', '| --- | --- | --- |');
for (const object of wm.domain) { const valid=witness('∃x Px',wm,object); lines.push(`| ${object} | ${valid ? 'Yes' : 'No'} | ${witnessResponse(object, valid)} |`); }
lines.push('', 'For any true existential gallery model, the same pattern accepts each object in P and rejects each object outside P. If P is empty, ∃x Px is false and there is no witness.', '');
writeFileSync(new URL('./FEEDBACK-REVIEW.md', import.meta.url), lines.join('\n'));
