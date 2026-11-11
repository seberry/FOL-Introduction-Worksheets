import { evaluate, formatFormula, renderExplanation } from '../fol-explanations/index.mjs';
const compact = text => text.replace(/\b([A-Z])\(([a-z])\)/g, '$1$2');
const name = formula => compact(formatFormula(formula));
const list = xs => xs.length === 0 ? 'nothing' : xs.length === 1 ? String(xs[0]) : xs.length === 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs.at(-1)}`;
const tv = value => value ? 'true' : 'false';
export function shortResponse(formula, m) {
 const t = evaluate(formula, m), f = t.formula;
 let detail;
 if (f.type === 'atomic') {
  const term=f.args[0], extension=m.predicates[f.relation];
  const membership=extension.length === 0 ? 'applies to nothing' : `${t.value ? 'applies' : 'only applies'} to ${list(extension)}`;
  detail=`${term.name} names ${t.resolvedTerms[0]} and ${f.relation} ${membership}, so ${name(f)} is ${tv(t.value)}.`;
 } else if (f.type === 'exists') {
  const found=t.children.find(c=>c.value);
  detail=found ? `${found.object} is a witness because ${f.body.relation} applies to ${found.object}, so ${formula} is true.` : `${f.body.relation} applies to nothing, so ${formula} is false.`;
 } else if (f.type === 'not') detail=`${name(f.body)} is ${tv(t.children[0].value)}, so ${formula} is ${tv(t.value)}.`;
 else detail=`${name(f.left)} is ${tv(t.children[0].value)} and ${name(f.right)} is ${tv(t.children[1].value)}, so ${formula} is ${tv(t.value)}.`;
 return `${t.value ? 'Correct!' : 'Not quite.'} ${detail}`;
}
export function expandedResponse(formula, m) { return compact(renderExplanation(evaluate(formula,m))); }
export function witnessResponse(object, valid) { return valid ? `Correct! P applies to ${object}, so ${object} is a witness.` : `Not quite. P does not apply to ${object}, so ${object} is not a witness.`; }
