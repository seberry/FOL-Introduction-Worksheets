// Standalone finite-model FOL semantics. No DOM, dependencies, or feedback wording.
const own = (object, key) => Object.hasOwn(object, key);
const binary = new Set(['and', 'or', 'implies', 'iff']);
export const variable = name => ({ kind: 'variable', name });
export const constant = name => ({ kind: 'constant', name });

/** Parse common quiz notation. Quantifiers bind the next unary formula;
 * use parentheses to include a binary connective in their scope. */
export function parseFormula(source) {
  if (typeof source !== 'string' || !source.trim()) throw new Error('Expected a formula.');
  const input = source.trim();
  const tokens = [];
  const tokenPattern = /\s*(<->|->|!=|[¬~!∧&∨|→↔∀∃≠=(),]|[A-Z][0-9_]*|[a-z][a-z0-9_]*)/y;
  let position = 0;
  while (position < input.length) {
    tokenPattern.lastIndex = position;
    const match = tokenPattern.exec(input);
    if (!match) throw new Error(`Unexpected notation at character ${position + 1}.`);
    tokens.push(match[1]);
    position = tokenPattern.lastIndex;
  }
  let at = 0;
  const peek = () => tokens[at];
  const take = () => tokens[at++];
  const expect = token => {
    if (take() !== token) throw new Error(`Expected '${token}' near token ${at}.`);
  };
  const isIdentifier = token => /^[a-z][a-z0-9_]*$/.test(token ?? '');
  const term = (name, bound) => {
    if (!isIdentifier(name) || ['forall', 'exists'].includes(name)) {
      throw new Error(`Expected a term, received '${name}'.`);
    }
    return bound.includes(name) || /^[uvwxyz][0-9_]*$/.test(name)
      ? variable(name) : constant(name);
  };
  function unary(bound) {
    const token = take();
    if (['¬', '~', '!'].includes(token)) return { type: 'not', body: unary(bound) };
    if (['∀', '∃', 'forall', 'exists'].includes(token)) {
      const name = take();
      term(name, bound); // validate identifier
      return {
        type: ['∀', 'forall'].includes(token) ? 'forall' : 'exists',
        variable: name,
        body: unary([...bound, name])
      };
    }
    if (token === '(') {
      const formula = biconditional(bound);
      expect(')');
      return formula;
    }
    if (/^[A-Z][0-9_]*$/.test(token ?? '')) {
      const args = [];
      if (peek() === '(') {
        take();
        args.push(term(take(), bound));
        while (peek() === ',') { take(); args.push(term(take(), bound)); }
        expect(')');
      } else {
        const compact = take();
        if (!/^[a-z]+$/.test(compact ?? '')) {
          throw new Error('Compact predicate notation needs single-letter terms; otherwise use P(x) or R(x,y).');
        }
        args.push(...[...compact].map(name => term(name, bound)));
      }
      return { type: 'atomic', relation: token, args };
    }
    if (isIdentifier(token)) {
      const left = term(token, bound);
      const operator = take();
      if (!['=', '≠', '!='].includes(operator)) throw new Error('Expected identity (= or ≠).');
      const equality = { type: 'identity', left, right: term(take(), bound) };
      return operator === '=' ? equality : { type: 'not', body: equality };
    }
    throw new Error(`Expected a formula, received '${token}'.`);
  }
  function conjunction(bound) {
    let left = unary(bound);
    while (['∧', '&'].includes(peek())) {
      take(); left = { type: 'and', left, right: unary(bound) };
    }
    return left;
  }
  function disjunction(bound) {
    let left = conjunction(bound);
    while (['∨', '|'].includes(peek())) {
      take(); left = { type: 'or', left, right: conjunction(bound) };
    }
    return left;
  }
  function implication(bound) {
    const left = disjunction(bound);
    if (!['→', '->'].includes(peek())) return left;
    take(); return { type: 'implies', left, right: implication(bound) };
  }
  function biconditional(bound) {
    const left = implication(bound);
    if (!['↔', '<->'].includes(peek())) return left;
    take();
    const formula = { type: 'iff', left, right: implication(bound) };
    if (['↔', '<->'].includes(peek())) throw new Error('Parenthesize repeated biconditionals.');
    return formula;
  }
  const formula = biconditional([]);
  if (at !== tokens.length) throw new Error(`Unexpected token '${peek()}'.`);
  return formula;
}

export function formatFormula(formula) {
  switch (formula.type) {
    case 'atomic': return `${formula.relation}(${formula.args.map(t => t.name).join(',')})`;
    case 'identity': return `${formula.left.name} = ${formula.right.name}`;
    case 'not': return `¬${formula.body.type === 'identity' ? '(' + formatFormula(formula.body) + ')' : formatFormula(formula.body)}`;
    case 'exists': case 'forall':
      return `${formula.type === 'exists' ? '∃' : '∀'}${formula.variable} ${formatFormula(formula.body)}`;
    default: {
      const symbol = { and: '∧', or: '∨', implies: '→', iff: '↔' }[formula.type];
      if (!symbol) throw new Error(`Unknown formula type '${formula.type}'.`);
      return `(${formatFormula(formula.left)} ${symbol} ${formatFormula(formula.right)})`;
    }
  }
}

function prepare(formula, model, assignment) {
  const isObject = value => typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value));
  if (!Array.isArray(model?.domain) || !model.domain.length || !model.domain.every(isObject)) {
    throw new Error('The domain must be a nonempty array of strings or finite numbers.');
  }
  if (new Set(model.domain).size !== model.domain.length) throw new Error('Duplicate domain objects.');
  const domain = new Set(model.domain);
  const constants = model.constants ?? {};
  const predicates = model.predicates ?? {};
  for (const [name, object] of Object.entries(constants)) {
    if (!domain.has(object)) throw new Error(`Constant '${name}' denotes an object outside the domain.`);
  }
  for (const [name, object] of Object.entries(assignment)) {
    if (!domain.has(object)) throw new Error(`Assignment for '${name}' is outside the domain.`);
  }
  const relations = Object.create(null);
  // Validate supplied interpretations even if a formula will not use them.
  for (const [name, extension] of Object.entries(predicates)) {
    if (!Array.isArray(extension)) throw new Error(`Predicate '${name}' needs an extension array.`);
    const tupleForm = extension.length > 0 && Array.isArray(extension[0]);
    let arity = null;
    relations[name] = extension.map(entry => {
      if (Array.isArray(entry) !== tupleForm) throw new Error(`Mixed extension formats for '${name}'.`);
      const tuple = tupleForm ? [...entry] : [entry];
      arity ??= tuple.length;
      if (!arity || tuple.length !== arity) throw new Error(`Inconsistent arity for '${name}'.`);
      if (!tuple.every(object => domain.has(object))) throw new Error(`Predicate '${name}' contains an object outside the domain.`);
      return tuple;
    });
  }
  const arities = new Map();
  function validateTerm(term, bound) {
    if (!term || typeof term.name !== 'string' || !/^[a-z][a-z0-9_]*$/.test(term.name)) {
      throw new Error('Invalid term.');
    }
    if (term.kind === 'constant') {
      if (!own(constants, term.name)) throw new Error(`Undefined constant '${term.name}'.`);
    } else if (term.kind === 'variable') {
      if (!bound.has(term.name) && !own(assignment, term.name)) throw new Error(`Unassigned free variable '${term.name}'.`);
    } else throw new Error('Terms must specify kind: variable or constant.');
  }
  function validate(node, bound) {
    if (!node || typeof node !== 'object') throw new Error('Invalid formula node.');
    if (node.type === 'atomic') {
      if (!own(relations, node.relation)) throw new Error(`Undefined predicate '${node.relation}'.`);
      if (!Array.isArray(node.args) || !node.args.length) throw new Error('An atomic formula needs at least one term.');
      const arity = node.args.length;
      if ((arities.has(node.relation) && arities.get(node.relation) !== arity)
          || relations[node.relation].some(tuple => tuple.length !== arity)) {
        throw new Error(`Arity mismatch for '${node.relation}'.`);
      }
      arities.set(node.relation, arity);
      node.args.forEach(term => validateTerm(term, bound));
    } else if (node.type === 'identity') {
      validateTerm(node.left, bound); validateTerm(node.right, bound);
    } else if (node.type === 'not') validate(node.body, bound);
    else if (binary.has(node.type)) { validate(node.left, bound); validate(node.right, bound); }
    else if (['exists', 'forall'].includes(node.type)) {
      if (typeof node.variable !== 'string' || !/^[a-z][a-z0-9_]*$/.test(node.variable)) throw new Error('Invalid bound variable.');
      validate(node.body, new Set([...bound, node.variable]));
    } else throw new Error(`Unknown formula type '${node.type}'.`);
  }
  validate(formula, new Set());
  return { constants, relations };
}

/** Return the complete evidence tree; no short-circuiting of subformulas. */
export function evaluate(input, model, assignment = {}) {
  const formula = typeof input === 'string' ? parseFormula(input) : input;
  const { constants, relations } = prepare(formula, model, assignment);
  const resolve = (term, env) => term.kind === 'variable' ? env[term.name] : constants[term.name];
  function visit(node, env) {
    let value;
    let children = [];
    let resolvedTerms = [];
    if (node.type === 'atomic') {
      resolvedTerms = node.args.map(term => resolve(term, env));
      value = relations[node.relation].some(tuple => tuple.every((object, i) => object === resolvedTerms[i]));
    } else if (node.type === 'identity') {
      resolvedTerms = [resolve(node.left, env), resolve(node.right, env)];
      value = resolvedTerms[0] === resolvedTerms[1];
    } else if (node.type === 'not') {
      children = [visit(node.body, env)]; value = !children[0].value;
    } else if (binary.has(node.type)) {
      children = [visit(node.left, env), visit(node.right, env)];
      const [left, right] = children.map(child => child.value);
      value = { and: left && right, or: left || right, implies: !left || right, iff: left === right }[node.type];
    } else {
      children = model.domain.map(object => ({
        ...visit(node.body, { ...env, [node.variable]: object }), object
      }));
      value = node.type === 'exists' ? children.some(child => child.value) : children.every(child => child.value);
    }
    return { formula: node, assignment: { ...env }, value, resolvedTerms, children };
  }
  return visit(formula, assignment);
}

/** Quiz convention: only the outermost quantifier can request an object. */
export function requiredEvidence(trace) {
  if (trace.formula.type === 'exists' && trace.value) return 'witness';
  if (trace.formula.type === 'forall' && !trace.value) return 'counterexample';
  return null;
}

export function checkCandidate(input, model, candidate, assignment = {}) {
  const trace = evaluate(input, model, assignment);
  const formula = trace.formula;
  if (!['exists', 'forall'].includes(formula.type)) {
    throw new Error('A candidate needs a formula whose outermost operator is a quantifier.');
  }
  const kind = formula.type === 'exists' ? 'witness' : 'counterexample';
  const bodyTrace = trace.children.find(child => child.object === candidate) ?? null;
  return {
    kind, candidate, inDomain: bodyTrace !== null,
    valid: bodyTrace !== null && (kind === 'witness' ? bodyTrace.value : !bodyTrace.value),
    required: requiredEvidence(trace) !== null,
    trace, bodyTrace
  };
}
