import { evaluate, checkCandidate } from '../fol-explanations/index.mjs';
export const lessons = [
  ['Pa', 'Pa says that the object named by a has property P.', 'Qb'],
  ['Pa ∨ Qa', 'At least one of P and Q applies to the object named by a.', 'Pb ∨ Qb'],
  ['Pa ∧ Qb', 'P applies to the object named by a, and Q applies to the object named by b.', 'Qa ∧ Pb'],
  ['¬Pa', 'P does not apply to the object named by a.', '¬Qb'],
  ['¬Pa ∧ Qa', 'P does not apply to a, and Q does apply to a.', 'Pa ∧ ¬Qa'],
  ['¬Pa ∨ Qa', 'Either P does not apply to a, or Q applies to a, or both.', 'Pa ∨ ¬Qa'],
  ['Pa → Qa', 'If P applies to a, then Q applies to a. The conditional is false only when P applies to a and Q does not.', 'Pb → Qb'],
  ['∃x Px', 'At least one object has property P.', '∃x Qx']
].map(([formula, introduction, variation], index) => ({ id: index + 1, formula, introduction, variation }));
export function model(a, b, p, q) { return { domain: [1, 2, 3], constants: { a, b }, predicates: { P: p, Q: q } }; }
const subsets = [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]];
export const pool = [1, 2, 3].flatMap(a => [1, 2, 3].flatMap(b => subsets.flatMap(p => subsets.map(q => model(a, b, p, q)))));
export const truth = (formula, m) => evaluate(formula, m).value;
export const witness = (formula, m, object) => checkCandidate(formula, m, object).valid;
export function gallery(formula, round = 0) {
  if (formula === 'Pa' && round === 0) return [
    model(1, 1, [1], []), model(2, 1, [1, 3], []),
    model(2, 1, [1, 2], []), model(1, 1, [2, 3], []),
    model(3, 1, [1, 3], []), model(3, 1, [], [])
  ];
  const target = [3, 2, 4][round % 3];
  const predicates = ['P', 'Q'].filter(p => formula.includes(p));
  const constants = ['a', 'b'].filter(c => formula.includes(c));
  const seen = new Set(), groups = [[], []];
  const source = formula.startsWith('∃') ? [1, 2, 3, 4].flatMap(size => {
    const domain = Array.from({length: size}, (_, i) => i + 1);
    return Array.from({length: 2 ** size}, (_, mask) => {
      const extension = domain.filter((_, i) => mask & (1 << i));
      return {domain, constants: {a: 1, b: 1}, predicates: {P: predicates[0] === 'P' ? extension : [], Q: predicates[0] === 'Q' ? extension : []}};
    });
  }) : pool;
  for (const m of source) {
    const key = JSON.stringify([m.domain, constants.map(c => m.constants[c]), predicates.map(p => m.predicates[p])]);
    if (seen.has(key)) continue;
    seen.add(key); groups[Number(truth(formula, m))].push(m);
  }
  const shuffle = (items, seed) => {
    const result = [...items]; let state = seed >>> 0;
    for (let i = result.length - 1; i > 0; i--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = state % (i + 1); [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const seed = [...formula].reduce((n, c) => n * 31 + c.codePointAt(0), 1) + round * 991;
  const yes = shuffle(groups[1], seed).slice(0, target);
  const no = shuffle(groups[0], seed + 313).slice(0, 6 - target);
  return shuffle([...yes, ...no], seed + 719);
}
