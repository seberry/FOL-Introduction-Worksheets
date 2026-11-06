import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  evaluate, parseFormula, formatFormula, variable, constant, requiredEvidence,
  explainTruth, explainCandidate
} from '../index.mjs';
import { versions, questions, polyadicModel } from '../examples/quiz9.mjs';

test('all 21 PDF questions and all 36 requested object choices match a handwritten key', () => {
  // Written directly from the supplied models, independently of evaluation code.
  const key = {
    A: { values: [false, true, true, false, true, true, true], objects: [[1], [2], [2], []] },
    B: { values: [false, false, true, false, true, false, false], objects: [[], [1, 2, 3], [3], []] },
    C: { values: [true, false, true, true, false, true, true], objects: [[], [2], [], [1]] }
  };
  for (const [version, model] of Object.entries(versions)) {
    for (const [index, question] of questions.entries()) {
      const trace = evaluate(question.formula, model);
      assert.equal(trace.value, key[version].values[index], `${version}${index + 1}`);
      if (question.objectRequested) {
        const expected = key[version].objects[index - 1];
        const valid = model.domain.filter(object => explainCandidate(question.formula, model, object).valid);
        assert.deepEqual(valid, expected, `${version}${index + 1} object choices`);
        assert.equal(requiredEvidence(trace), expected.length ? (index < 3 ? 'witness' : 'counterexample') : null);
      }
    }
  }
});

test('all Boolean combinations use classical truth conditions', () => {
  for (const left of [false, true]) for (const right of [false, true]) {
    const model = { domain: [1], constants: { a: 1 }, predicates: { P: left ? [1] : [], Q: right ? [1] : [] } };
    for (const [operator, expected] of [['∧', left && right], ['∨', left || right], ['→', !left || right], ['↔', left === right]]) {
      assert.equal(evaluate(`P(a) ${operator} Q(a)`, model).value, expected);
    }
    assert.equal(evaluate('¬P(a)', model).value, !left);
  }
});

test('general evaluator agrees with every existing monadic bank checker on all 512 three-predicate models and all constants', () => {
  const require = createRequire(import.meta.url);
  const { getAllProblems } = require('../../Quiz-Monadic-Truth/fol_problem_bank.js');
  const problems = getAllProblems().map(problem => ({ ...problem, ast: parseFormula(problem.formula_template) }));
  const domain = [1, 2, 3];
  for (let mask = 0; mask < 512; mask++) {
    const predicates = Object.fromEntries(['P', 'Q', 'R'].map((name, index) => [name, domain.filter((_, i) => mask & (1 << (index * 3 + i)))]));
    const legacy = { domain, ...predicates };
    for (const c of domain) {
      const model = { domain, constants: { c }, predicates };
      const subs = { P: 'P', Q: 'Q', R: 'R', c };
      for (const problem of problems) {
        assert.equal(evaluate(problem.ast, model).value, problem.checkAnswer(legacy, subs), `${problem.id}, mask=${mask}, c=${c}`);
        if (problem.checkWitness || problem.checkCounterexample) for (const object of domain) {
          const expected = problem.checkWitness ? problem.checkWitness(object, legacy, subs) : problem.checkCounterexample(object, legacy, subs);
          assert.equal(explainCandidate(problem.ast, model, object).valid, expected, `${problem.id}, object=${object}`);
        }
      }
    }
  }
});

test('separate quantifiers allow different objects and do not request a single outer witness', () => {
  const model = versions.C;
  const separate = evaluate('(∃x P(x)) ∧ (∃x Q(x))', model);
  assert.equal(separate.value, true);
  assert.equal(evaluate('∃x (P(x) ∧ Q(x))', model).value, false);
  assert.equal(requiredEvidence(separate), null);
  assert.throws(() => explainCandidate(separate.formula, model, 2), /outermost/);
});

test('nested candidates remove only the first quantifier; remaining quantifiers retain their scope', () => {
  const good = explainCandidate('∃x ∀y R(x,y)', polyadicModel, 1);
  const bad = explainCandidate('∃x ∀y R(x,y)', polyadicModel, 2);
  assert.equal(good.valid, true);
  assert.equal(bad.valid, false);
  assert.equal(bad.bodyTrace.formula.type, 'forall');
  assert.equal(bad.bodyTrace.children.length, 3);
  assert.equal(explainCandidate('∀x ∃y R(x,y)', polyadicModel, 3).valid, true);
  assert.equal(explainCandidate('∀x ∃y R(x,y)', polyadicModel, 2).valid, false);
  assert.equal(explainCandidate('∃x ∃y R(x,y)', polyadicModel, 2).valid, true);
  assert.equal(evaluate('∀x R(x,x)', polyadicModel).value, false);
});

test('shadowing changes only the inner assignment and does not mutate caller data', () => {
  const model = { domain: [1, 2], predicates: { P: [1], R: [[1, 1], [2, 2]] } };
  const assignment = { x: 2 };
  const before = JSON.stringify(model);
  const trace = evaluate('P(x) ∨ ∃x P(x)', model, assignment);
  assert.equal(trace.children[0].value, false);
  assert.equal(trace.children[1].value, true);
  assert.equal(evaluate('∀x ∃x P(x)', model).value, true);
  assert.equal(evaluate('∀x ∀y (R(x,y) → R(y,x))', model).value, true);
  assert.deepEqual(assignment, { x: 2 });
  assert.equal(JSON.stringify(model), before);
});

test('identity compares denotations, including two different constants for the same object', () => {
  const model = { domain: [0, 'zero'], constants: { a: 0, b: 0, c: 'zero' }, predicates: {} };
  assert.equal(evaluate('a = b', model).value, true);
  assert.equal(evaluate('a ≠ c', model).value, true);
  assert.equal(evaluate('∀x ∃y x = y', model).value, true);
  assert.equal(explainCandidate('∃x x = a', model, 0).valid, true);
  assert.equal(explainCandidate('∃x x = a', model, '0').inDomain, false);
});

test('unary tuple storage and predicates of arity three are supported', () => {
  const model = { domain: [1, 2], constants: { a: 1 }, predicates: { P: [[1]], T: [[1, 2, 1]] } };
  assert.equal(evaluate('P(a)', model).value, true);
  assert.equal(evaluate('∃x ∃y ∃z T(x,y,z)', model).value, true);
  assert.equal(evaluate('∀x T(x,x,x)', model).value, false);
});

test('invalid inputs fail before evaluation, including errors in a nondecisive branch', () => {
  const model = versions.A;
  for (const formula of ['P(c) ∨ S(c)', 'P(c) ∨ P(a)', 'P(c) ∨ P(x)', 'P(c,c)']) {
    assert.throws(() => evaluate(formula, model));
  }
  assert.throws(() => evaluate('∀x P(x)', { domain: [], predicates: { P: [] } }), /nonempty/);
  assert.throws(() => evaluate('P(c)', { ...model, domain: [1, 1, 2, 3] }), /Duplicate/);
  assert.throws(() => evaluate('P(c)', { ...model, constants: { c: 4 } }), /outside/);
  assert.throws(() => evaluate('P(c)', { ...model, predicates: { P: [4] } }), /outside/);
  assert.throws(() => evaluate('P(c)', { ...model, predicates: { P: [[1], [1, 2]] } }), /arity/);
  assert.throws(() => evaluate('P(c)', { ...model, predicates: { P: [1, [2]] } }), /Mixed/);
  assert.throws(() => evaluate('∀x (S(x) ∧ S(x,x))', { domain: [1], predicates: { S: [] } }), /arity/i);
  assert.throws(() => evaluate('P(x)', model, { x: 4 }), /outside/);
});

test('parser respects scope, precedence, and aliases and rejects unsupported notation', () => {
  const a = parseFormula('exists x (Px & ~Qx)');
  const b = parseFormula('∃x (P(x) ∧ ¬Q(x))');
  assert.deepEqual(a, b);
  assert.deepEqual(parseFormula('∀x∀yRxy'), parseFormula('∀x ∀y R(x,y)'));
  assert.deepEqual(parseFormula('forall x (P(x) -> Q(x))'), parseFormula('∀x (P(x) → Q(x))'));
  assert.equal(parseFormula('∃xP(x) ∧ ∃xQ(x)').type, 'and');
  assert.equal(parseFormula('P(a) -> Q(a) -> R(a)').right.type, 'implies');
  assert.equal(parseFormula('P(a) | Q(a) & R(a)').right.type, 'and');
  assert.deepEqual(parseFormula('a != b'), parseFormula('a ≠ b'));
  for (const source of ['', 'P()', '∀x', 'P(x', 'P(x))', 'P(f(x))', 'P(a) garbage', 'P(a) ↔ Q(a) ↔ R(a)', 'P(a) v Q(a)']) {
    assert.throws(() => parseFormula(source), source);
  }
  for (const question of questions) {
    const formula = parseFormula(question.formula);
    assert.deepEqual(parseFormula(formatFormula(formula)), formula);
  }
  // Explicit AST terms allow names beyond the parser's conventional variable letters.
  assert.equal(evaluate({ type: 'atomic', relation: 'P', args: [variable('person')] }, modelForAst(), { person: 1 }).value, true);
  assert.equal(evaluate({ type: 'identity', left: constant('x'), right: constant('x') }, { domain: [1], constants: { x: 1 } }).value, true);
});
function modelForAst() { return { domain: [1], predicates: { P: [1] } }; }

test('explanations distinguish wrong truth values, failed candidates, and domain errors', () => {
  const result = explainTruth(questions[3].formula, versions.A, { claimedTruth: true });
  assert.match(result.text, /You answered true, but the sentence is false/);
  assert.match(result.text, /antecedent is true and its consequent is false/);
  assert.match(result.text, /2 is not in Q/);
  const candidate = explainCandidate(questions[2].formula, versions.A, 1);
  assert.equal(candidate.valid, false);
  assert.match(candidate.text, /1 is not a witness/);
  assert.match(candidate.text, /¬Q\(x\) is false because Q\(x\) is true/);
  assert.doesNotMatch(candidate.text, /With x = 2|sentence is false/);
  assert.match(explainCandidate(questions[1].formula, versions.A, 4).text, /not an object in the domain/);
  assert.throws(() => explainTruth('P(c)', versions.A, { claimedTruth: 'false' }), /boolean/);
});

test('explanations cover every required instance and optionally show every quantified instance', () => {
  const falseExistential = explainTruth(questions[1].formula, versions.B);
  const trueUniversal = explainTruth(questions[4].formula, versions.B);
  for (const result of [falseExistential, trueUniversal]) {
    for (const object of [1, 2, 3]) assert.ok(result.text.includes(`With x = ${object}:`));
  }
  const sufficient = explainTruth('∃x P(x)', versions.A);
  assert.match(sufficient.text, /With x = 1:/);
  assert.doesNotMatch(sufficient.text, /With x = 2:/);
  const exhaustive = explainTruth('∃x P(x)', versions.A, { exhaustive: true });
  for (const object of [1, 2, 3]) assert.ok(exhaustive.text.includes(`With x = ${object}:`));
  assert.equal(sufficient.trace.children.length, 3); // complete machine-readable evidence remains available
});
