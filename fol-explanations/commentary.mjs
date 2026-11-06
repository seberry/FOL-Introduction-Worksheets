// Full-explanation wording approved by the repository owner on 2026-11-06.
// Keep future pedagogy edits here, separate from semantics, and update the review reference.
import { evaluate, checkCandidate, formatFormula, requiredEvidence } from './core.mjs';

const tv = value => value ? 'true' : 'false';
const objectName = object => typeof object === 'string' ? JSON.stringify(object) : String(object);

function termReason(term, object) {
  return term.kind === 'constant'
    ? `${term.name} denotes ${objectName(object)}`
    : `${term.name} = ${objectName(object)}`;
}

/** Render sufficient recursive evidence. Boolean children are all explained;
 * a true existential / false universal needs only one decisive instance.
 * exhaustive=true also prints the other quantified instances. */
export function renderExplanation(trace, { exhaustive = false } = {}) {
  const lines = [];
  function visit(node, depth) {
    const { formula: f, value, children } = node;
    const label = `${formatFormula(f)} is ${tv(value)}`;
    const line = text => lines.push(`${'  '.repeat(depth)}${text}`);
    if (f.type === 'atomic') {
      const tuple = node.resolvedTerms.length === 1 ? objectName(node.resolvedTerms[0])
        : `⟨${node.resolvedTerms.map(objectName).join(', ')}⟩`;
      const denotations = f.args.map((term, i) => termReason(term, node.resolvedTerms[i]));
      line(`${label} because ${[...new Set(denotations)].join(', ')} and ${tuple} is ${value ? '' : 'not '}in ${f.relation}.`);
    } else if (f.type === 'identity') {
      const [left, right] = node.resolvedTerms;
      line(`${label} because ${termReason(f.left, left)}, ${termReason(f.right, right)}, and these are ${value ? 'the same object' : 'different objects'}.`);
    } else if (f.type === 'not') {
      line(`${label} because ${formatFormula(f.body)} is ${tv(children[0].value)}.`);
      visit(children[0], depth + 1);
    } else if (['exists', 'forall'].includes(f.type)) {
      const decisive = f.type === 'exists' ? value : !value;
      const chosen = decisive
        ? children.find(child => child.value === (f.type === 'exists')) : null;
      if (chosen) {
        line(`${label} because its body is ${tv(chosen.value)} for ${f.variable} = ${objectName(chosen.object)}.`);
      } else {
        line(`${label} because its body is ${f.type === 'exists' ? 'false' : 'true'} for every object in the domain.`);
      }
      for (const child of exhaustive || !chosen ? children : [chosen]) {
        lines.push(`${'  '.repeat(depth + 1)}With ${f.variable} = ${objectName(child.object)}:`);
        visit(child, depth + 2);
      }
    } else {
      const [left, right] = children.map(child => child.value);
      let reason;
      if (f.type === 'and') reason = value ? 'both conjuncts are true'
        : !left && !right ? 'both conjuncts are false' : `its ${!left ? 'left' : 'right'} conjunct is false`;
      if (f.type === 'or') reason = !value ? 'both disjuncts are false'
        : left && right ? 'both disjuncts are true' : `its ${left ? 'left' : 'right'} disjunct is true`;
      if (f.type === 'implies') reason = !value ? 'its antecedent is true and its consequent is false'
        : !left ? 'its antecedent is false' : 'its consequent is true';
      if (f.type === 'iff') reason = value ? 'both sides have the same truth value' : 'the two sides have different truth values';
      line(`${label} because ${reason}.`);
      children.forEach(child => visit(child, depth + 1));
    }
  }
  visit(trace, 0);
  return lines.join('\n');
}

export function explainTruth(formula, model, options = {}) {
  const trace = evaluate(formula, model, options.assignment ?? {});
  let text = renderExplanation(trace, options);
  if (options.claimedTruth !== undefined) {
    if (typeof options.claimedTruth !== 'boolean') throw new Error('claimedTruth must be a boolean.');
    const prefix = options.claimedTruth === trace.value ? `Your truth-value answer is correct.`
      : `You answered ${tv(options.claimedTruth)}, but the sentence is ${tv(trace.value)} in this model.`;
    text = `${prefix}\n${text}`;
  }
  return { value: trace.value, requiredEvidence: requiredEvidence(trace), trace, text };
}

export function explainCandidate(formula, model, candidate, options = {}) {
  const result = checkCandidate(formula, model, candidate, options.assignment ?? {});
  const label = formatFormula(result.trace.formula);
  const object = objectName(candidate);
  let text;
  if (!result.inDomain) {
    text = `${object} is not a ${result.kind} for ${label} because it is not an object in the domain.`;
  } else {
    const f = result.trace.formula;
    const needs = result.kind === 'witness' ? 'true' : 'false';
    text = `${object} is ${result.valid ? '' : 'not '}a ${result.kind} for ${label}.\n`
      + `Removing just the first quantifier, the body ${formatFormula(f.body)} must be ${needs} when ${f.variable} = ${object}.\n`
      + renderExplanation(result.bodyTrace, options);
  }
  return { ...result, text };
}
