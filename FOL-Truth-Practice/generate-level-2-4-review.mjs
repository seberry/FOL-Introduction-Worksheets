import { writeFileSync } from 'node:fs';
import { evaluate, renderExplanation, checkCandidate } from '../fol-explanations/index.mjs';
import { proposedLessons, proposedResponse, proposedCandidate, describe } from './quantified.mjs';
const model=(P,Q,R=[])=>({domain:[1,2,3],constants:{a:1,b:1},predicates:{P,Q,R}});
const examples=[
 ['Existential: a witness satisfies both properties','∃x (Px ∧ Qx)',model([1,2],[2,3])],
 ['Existential: different objects satisfy the two properties','∃x (Px ∧ Qx)',model([1],[2,3])],
 ['Existential: no object has either property','∃x (Px ∨ Qx)',model([],[])],
 ['Existential: one object has P without Q','∃x (Px ∧ ¬Qx)',model([1,2],[2,3])],
 ['Three properties: no single object has all three','∃x (Px ∧ Qx ∧ Rx)',model([1,2],[2,3],[1,3])],
 ['Universal: every object satisfies the matrix','∀x (Px ∨ Qx)',model([1,2],[3])],
 ['Universal: a counterexample fails the matrix','∀x (Px ∧ Qx)',model([1,2,3],[1,3])],
 ['Universal conditional: a false antecedent is harmless','∀x (Px → (Qx ∧ Rx))',model([],[],[])],
 ['Combination: separate witnesses can be different','(∃x Px) ∧ (∃x Qx)',model([1],[2])],
 ['Combination: the first part is true and the second is false','(∃x Px) ∧ (∀x ¬Qx)',model([1],[2])],
 ['Conditional: a false antecedent makes it true','(∀x Px) → (∃x Qx)',model([1],[])],
 ['Conditional: true antecedent and false consequent','(∀x Px) → (∃x Qx)',model([1,2,3],[])]
];
const lines=['# Levels 2–4: representative feedback for review','','**Approved by the repository owner on 2026-11-11.**','','## Pedagogical choices','','- For a true existential, name one witness and say that it satisfies the matrix. For a false existential, say no object satisfies the matrix. The short feedback does not list every object; the optional full explanation can show more detail.','- For a false universal, name one counterexample and say it fails the matrix. For a true universal, say every object satisfies the matrix.','- For a truth-functional combination of quantified sentences, state the truth value of each part, then the truth value of the whole. Different existential conjuncts may have different witnesses.','- For candidate-object practice, accept every object that satisfies the matrix of a true outermost existential, and every object that fails the matrix of a false outermost universal. The short response states whether that chosen object works and the matrix’s truth value for it.','- “More explanation” can show the existing recursive explainer. Short feedback and candidate responses below illustrate the approved wording; the existing full explainer is also reviewed.','','## Representative gallery selections','','| Situation | Model | Sentence | Proposed response |','| --- | --- | --- | --- |'];
for(const [label,f,m] of examples) lines.push(`| ${label} | ${describe(m)} | ${f} | ${proposedResponse(f,m)} |`);
lines.push('','## Representative object choices','','| Model | Sentence | Choice | Valid? | Proposed response |','| --- | --- | --- | --- |');
for(const [f,m] of [['∃x (Px ∨ Qx)',model([1],[2])],['∀x Qx',model([1,2,3],[1,3])]]) for(const n of m.domain) lines.push(`| ${describe(m)} | ${f} | ${n} | ${checkCandidate(f,m,n).valid?'yes':'no'} | ${proposedCandidate(f,m,n)} |`);
lines.push('','## Example of expanded explanation','','For the second row above (∃x (Px ∧ Qx), with P only on 1 and Q on 2 and 3), the existing explainer produces:','','```text',renderExplanation(evaluate(examples[1][1],examples[1][2])).replace(/\b([A-Z])\(([a-z])\)/g,'$1$2'),'```','','## Lesson scope','',...proposedLessons.map(l=>`- Level ${l.level}: ${l.formula}; variation ${l.variation}.`),'','The already implemented ∃x Px lesson precedes the new Level 2 lessons. Automated checks cover gallery sizes and truth counts, truth conditions, witness and counterexample validity, empty extensions, and conditional edge cases. Additional UI and generation checks will accompany implementation as needed.','');
writeFileSync(new URL('./LEVEL-2-4-FEEDBACK-REVIEW.md',import.meta.url),lines.join('\n'));
