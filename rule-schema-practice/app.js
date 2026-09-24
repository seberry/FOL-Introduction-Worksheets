"use strict";

const RULES = {
  andI: {
    symbol: "&I",
    name: "Conjunction Introduction",
    short: "Conjoin the cited line(s)",
    explanation: "&I lets you infer a conjunction whose two conjuncts are exactly the sentences on the cited line number(s).",
    note: "𝔄 and 𝔅 are placeholders for complete sentences of TFL. They may be the same sentence, and the same line may be cited twice. Thus, from P you may infer P & P by &I 1, 1.",
    schema: [
      { formula: "A" },
      { formula: "B" },
      { formula: "A & B", cite: "&I 1, 2" }
    ],
    everyday: [
      "The library is open.",
      "The café is open.",
      "The library is open and the café is open."
    ],
    demo: {
      a: "P → Q",
      b: "~R",
      lines: [line("P → Q"), line("~R"), line("(P → Q) & ~R", "&I 1, 2")]
    },
    callout: "The conclusion conjoins exactly what the cited lines say."
  },
  andE: {
    symbol: "&E",
    name: "Conjunction Elimination",
    short: "Take out either conjunct",
    explanation: "If you know 𝔄 & 𝔅, then you know each part separately. You may conclude 𝔄, or you may conclude 𝔅.",
    note: "You may take out one whole conjunct—not just a piece buried inside it.",
    schema: [
      { formula: "A & B" },
      { formula: "A", cite: "&E 1" }
    ],
    schemas: [
      [
        { formula: "A & B" },
        { formula: "A", cite: "&E 1" }
      ],
      [
        { formula: "A & B" },
        { formula: "B", cite: "&E 1" }
      ]
    ],
    everyday: [
      "The library is open and the café is open.",
      null,
      "The library is open."
    ],
    demo: {
      a: "P → Q",
      b: "~R",
      lines: [line("(P → Q) & ~R"), line("P → Q", "&E 1")]
    },
    callout: "We could equally have concluded: The café is open."
  },
  arrowE: {
    symbol: "→E",
    name: "Conditional Elimination",
    short: "Follow a conditional",
    explanation: "If you have 𝔄 → 𝔅, and you also have 𝔄, you may conclude 𝔅.",
    note: "The second line must match the entire left side of the conditional.",
    schema: [
      { formula: "A → B" },
      { formula: "A" },
      { formula: "B", cite: "→E 1, 2" }
    ],
    everyday: [
      "If the café is open, I can buy coffee.",
      "The café is open.",
      "I can buy coffee."
    ],
    demo: {
      a: "P & Q",
      b: "R → S",
      lines: [line("(P & Q) → (R → S)"), line("P & Q"), line("R → S", "→E 1, 2")]
    },
    callout: ""
  }
};

const LEVELS = [
  {
    id: "andI",
    label: "Level 1",
    ...RULES.andI,
    exercises: [
      ex("Choose the formula that belongs on line 3.", "andI", [line("P"), line("Q"), blank("&I 1, 2")], ["P & Q", "P → Q", "Q", "P"], "P & Q", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|P}", "{B|Q}", "{A|P} & {B|Q}"]), {
        "P → Q": "Careful: &I lets us infer a conjunction (&) of the sentences on the two cited lines.",
        "Q": "This omits the first cited line. &I 1, 2 must use the complete sentence on each cited line.",
        "P": "This omits the second cited line. &I 1, 2 must use the complete sentence on each cited line."
      }),
      ex("Choose the formula that belongs on line 3.", "andI", [line("~P"), line("R"), blank("&I 1, 2")], ["~P & R", "~(P & R)", "P & R", "~P"], "~P & R", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|~P}", "{B|R}", "{A|~P} & {B|R}"]), {
        "~(P & R)": "Careful: the main connective of a conclusion justified by &I must be &.",
        "P & R": "One conjunct does not exactly match the complete sentence on either cited line. &I copies the cited sentences without changing them.",
        "~P": "This omits the second cited line. &I 1, 2 must use the complete sentence on each cited line."
      }),
      ex("Now each placeholder is replaced by a more complex formula.", "andI", [line("P → Q"), line("~R"), blank("&I 1, 2")], ["(P → Q) & ~R", "P → (Q & ~R)", "Q & ~R", "(P & Q) → ~R"], "(P → Q) & ~R", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|(P → Q)}", "{B|~R}", "{A|(P → Q)} & {B|~R}"]), {
        "P → (Q & ~R)": "Careful: &I lets us infer a conjunction (&) of the sentences on the two cited lines.",
        "Q & ~R": "One conjunct is only part of the sentence on a cited line. Each conjunct must match a complete cited sentence.",
        "(P & Q) → ~R": "Careful: &I lets us infer a conjunction (&) of the sentences on the two cited lines."
      }),
      ex("Choose the formula that belongs on line 3.", "andI", [line("P & Q"), line("R → S"), blank("&I 1, 2")], ["(P & Q) & (R → S)", "Q & R", "P & (Q → R)", "(P & Q) → (R → S)"], "(P & Q) & (R → S)", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|(P & Q)}", "{B|(R → S)}", "{A|(P & Q)} & {B|(R → S)}"]), {
        "Q & R": "Both conjuncts are only parts of the sentences on the cited lines. Each conjunct must match a complete cited sentence.",
        "P & (Q → R)": "The conjuncts do not exactly match the complete sentences on the cited lines. &I does not rearrange their contents.",
        "(P & Q) → (R → S)": "Careful: the main connective of a conclusion justified by &I must be &."
      }),
      roleEx("In this application of &I, what whole formula is playing the role of 𝔄?", "andI", [line("P → Q"), line("R & S"), line("(P → Q) & (R & S)", "&I 1, 2")], ["P", "Q", "P → Q", "(P → Q) & (R & S)"], "P → Q", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|(P → Q)}", "{B|(R & S)}", "{A|(P → Q)} & {B|(R & S)}"]), "𝔄 matches all of line 1: P → Q. A placeholder can stand for a compound formula.", {
        "P": "This is only part of a sentence on a cited line. A metavariable must match a complete sentence.",
        "Q": "This is only part of a sentence on a cited line. A metavariable must match a complete sentence.",
        "(P → Q) & (R & S)": "This is the whole conclusion, which has the form 𝔄 & 𝔅. The question asks which complete part plays the role of 𝔄."
      }),
      ex("One last match: keep each whole formula intact.", "andI", [line("~(P → Q)"), line("R & S"), blank("&I 1, 2")], ["~(P → Q) & (R & S)", "~P → (Q & R)", "(P → Q) & (R → S)", "~((P → Q) & R)"], "~(P → Q) & (R & S)", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|~(P → Q)}", "{B|(R & S)}", "{A|~(P → Q)} & {B|(R & S)}"]), {
        "~P → (Q & R)": "Careful: &I lets us infer a conjunction (&) of the sentences on the two cited lines.",
        "(P → Q) & (R → S)": "The conjuncts do not exactly match the complete sentences on the cited lines. &I copies cited sentences without changing them.",
        "~((P → Q) & R)": "Careful: the main connective of a conclusion justified by &I must be &."
      })
    ]
  },
  {
    id: "andE",
    label: "Level 2",
    ...RULES.andE,
    exercises: [
      ex("Choose a formula that &E licenses on line 2.", "andE", [line("P & Q"), blank("&E 1")], ["P", "P → Q", "P & Q", "~Q"], "P", map(["{A|A} & {B|B}", "{A|A}"], ["{A|P} & {B|Q}", "{A|P}"]), {
        "P → Q": "This does not exactly match either whole conjunct on the cited line. &E copies one conjunct without changing it.",
        "P & Q": "This repeats the whole conjunction. &E lets us infer one of the complete things joined by its main &.",
        "~Q": "This changes one of the conjuncts. &E copies a whole conjunct without changing it."
      }),
      ex("This time, take out the other conjunct.", "andE", [line("P & Q"), blank("&E 1")], ["Q", "P → Q", "P & Q", "~P"], "Q", map(["{A|A} & {B|B}", "{B|B}"], ["{A|P} & {B|Q}", "{B|Q}"]), {
        "P → Q": "This does not exactly match either whole conjunct on the cited line. &E copies one conjunct without changing it.",
        "P & Q": "This repeats the whole conjunction. &E lets us infer one of the complete things joined by its main &.",
        "~P": "This changes one of the conjuncts. &E copies a whole conjunct without changing it."
      }),
      ex("Find one whole conjunct of line 1.", "andE", [line("~P & R"), blank("&E 1")], ["~P", "P", "~R", "P & R"], "~P", map(["{A|A} & {B|B}", "{A|A}"], ["{A|~P} & {B|R}", "{A|~P}"]), {
        "P": "This does not exactly match a whole conjunct on the cited line. &E copies a conjunct without dropping anything from it.",
        "~R": "This changes one of the conjuncts. &E copies a whole conjunct without changing it.",
        "P & R": "This is a new conjunction rather than one whole conjunct from the cited line."
      }),
      ex("The first conjunct is itself a conditional.", "andE", [line("(P → Q) & R"), blank("&E 1")], ["P → Q", "Q", "P", "Q & R"], "P → Q", map(["{A|A} & {B|B}", "{A|A}"], ["{A|(P → Q)} & {B|R}", "{A|(P → Q)}"]), {
        "Q": "This is only part of a conjunct. &E copies one whole conjunct—one complete thing joined by the main &.",
        "P": "This is only part of a conjunct. &E copies one whole conjunct—one complete thing joined by the main &.",
        "Q & R": "This builds a new conjunction from parts of the cited line. &E instead copies one whole conjunct."
      }),
      roleEx("What whole formula is playing the role of 𝔄?", "andE", [line("(P & Q) & (R → S)"), line("P & Q", "&E 1")], ["P", "P & Q", "Q", "(P & Q) & (R → S)"], "P & Q", map(["{A|A} & {B|B}", "{A|A}"], ["{A|(P & Q)} & {B|(R → S)}", "{A|(P & Q)}"]), "𝔄 is the whole left conjunct, P & Q—not merely the first letter P.", {
        "P": "This is only part of a conjunct. Here 𝔄 must match one whole conjunct of the premise.",
        "Q": "This is only part of a conjunct. Here 𝔄 must match one whole conjunct of the premise.",
        "(P & Q) & (R → S)": "This is the whole premise, which has the form 𝔄 & 𝔅. The question asks which complete part plays the role of 𝔄."
      }),
      ex("Choose the formula that &E licenses.", "andE", [line("~(P → Q) & (R & S)"), blank("&E 1")], ["R & S", "S", "P → Q", "~R & S"], "R & S", map(["{A|A} & {B|B}", "{B|B}"], ["{A|~(P → Q)} & {B|(R & S)}", "{B|(R & S)}"]), {
        "S": "This is only part of a conjunct. &E copies one whole conjunct—one complete thing joined by the main &.",
        "P → Q": "This does not exactly match a whole conjunct on the cited line. &E copies a conjunct without dropping anything from it.",
        "~R & S": "This does not exactly match either whole conjunct on the cited line. &E does not move material from one conjunct into another."
      })
    ]
  },
  {
    id: "arrowE",
    label: "Level 3",
    ...RULES.arrowE,
    exercises: [
      ex("Choose the formula that belongs on line 3.", "arrowE", [line("P → Q"), line("P"), blank("→E 1, 2")], ["Q", "P", "P → Q", "Q → P"], "Q", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|P} → {B|Q}", "{A|P}", "{B|Q}"]), {
        "P": "This repeats the antecedent (front half). →E lets us infer the consequent (back half) of the cited conditional.",
        "P → Q": "This repeats the conditional. →E lets us infer its consequent when another cited line contains its antecedent.",
        "Q → P": "This reverses the conditional. →E lets us infer its consequent; it does not infer a reversed conditional."
      }),
      ex("Here 𝔄 is a conjunction. Follow the same pattern.", "arrowE", [line("(P & Q) → R"), line("P & Q"), blank("→E 1, 2")], ["R", "Q", "P", "P & Q"], "R", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|(P & Q)} → {B|R}", "{A|(P & Q)}", "{B|R}"]), {
        "Q": "This is only part of the antecedent. →E lets us infer the complete consequent (back half) of the cited conditional.",
        "P": "This is only part of the antecedent. →E lets us infer the complete consequent (back half) of the cited conditional.",
        "P & Q": "This repeats the antecedent. →E lets us infer the consequent of the cited conditional."
      }),
      ex("Here 𝔅 is a conjunction. What may you conclude?", "arrowE", [line("P → (Q & R)"), line("P"), blank("→E 1, 2")], ["Q & R", "Q", "R", "P & Q"], "Q & R", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|P} → {B|(Q & R)}", "{A|P}", "{B|(Q & R)}"]), {
        "Q": "This is only part of the consequent. →E lets us infer the complete consequent (the whole back half) of the cited conditional.",
        "R": "This is only part of the consequent. →E lets us infer the complete consequent (the whole back half) of the cited conditional.",
        "P & Q": "This constructs a new sentence from parts of the cited lines. →E instead lets us infer the complete consequent of the cited conditional."
      }),
      ex("Which formula is needed on line 2 to make →E apply?", "arrowE", [line("(P → Q) → (R & S)"), blank(), line("R & S", "→E 1, 2")], ["P → Q", "Q", "R", "R & S"], "P → Q", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|(P → Q)} → {B|(R & S)}", "{A|(P → Q)}", "{B|(R & S)}"]), {
        "Q": "This is only part of the antecedent. To apply →E, the other cited line must contain the complete antecedent (front half) of the conditional.",
        "R": "This comes from the consequent. To apply →E, the other cited line must contain the complete antecedent (front half).",
        "R & S": "This is the consequent. To apply →E, the other cited line must contain the antecedent of the conditional."
      }),
      roleEx("What whole formula is playing the role of 𝔅?", "arrowE", [line("(P & Q) → (R → S)"), line("P & Q"), line("R → S", "→E 1, 2")], ["R", "S", "R → S", "P & Q"], "R → S", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|(P & Q)} → {B|(R → S)}", "{A|(P & Q)}", "{B|(R → S)}"]), "𝔅 is the entire consequent R → S. A placeholder may stand for a conditional.", {
        "R": "This is only part of the consequent. 𝔅 must match the complete consequent (the whole back half).",
        "S": "This is only part of the consequent. 𝔅 must match the complete consequent (the whole back half).",
        "P & Q": "This is the antecedent, so it plays the role of 𝔄, not 𝔅. Look for the complete consequent."
      }),
      ex("Which second premise makes the displayed inference work?", "arrowE", [line("~P → (Q & R)"), blank(), line("Q & R", "→E 1, 2")], ["~P", "P", "Q", "Q & R"], "~P", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|~P} → {B|(Q & R)}", "{A|~P}", "{B|(Q & R)}"]), {
        "P": "This does not exactly match the antecedent. The other cited line must contain the complete antecedent without changing it.",
        "Q": "This is only part of the consequent. The missing cited line must instead match the complete antecedent.",
        "Q & R": "This is the consequent. To apply →E, the other cited line must contain the antecedent of the conditional."
      })
    ]
  },
  {
    id: "mixed",
    label: "Level 4",
    symbol: "Mix",
    name: "Mixed Rule Practice",
    short: "Name the rule that fits",
    explanation: "Compare the provided proof with all three schemas and choose the rule that licenses its final line.",
    note: "",
    everyday: [],
    callout: "",
    schema: [],
    exercises: [
      mixedEx([line("P"), line("Q"), line("P & Q", "?")], "&I", "andI", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|P}", "{B|Q}", "{A|P} & {B|Q}"])),
      mixedEx([line("P & Q"), line("Q", "?")], "&E", "andE", map(["{A|A} & {B|B}", "{B|B}"], ["{A|P} & {B|Q}", "{B|Q}"])),
      mixedEx([line("P → Q"), line("P"), line("Q", "?")], "→E", "arrowE", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|P} → {B|Q}", "{A|P}", "{B|Q}"])),
      mixedEx([line("P & Q"), line("R → S"), line("(P & Q) & (R → S)", "?")], "&I", "andI", map(["{A|A}", "{B|B}", "{A|A} & {B|B}"], ["{A|(P & Q)}", "{B|(R → S)}", "{A|(P & Q)} & {B|(R → S)}"])),
      mixedEx([line("(P → Q) & (R & S)"), line("P → Q", "?")], "&E", "andE", map(["{A|A} & {B|B}", "{A|A}"], ["{A|(P → Q)} & {B|(R & S)}", "{A|(P → Q)}"])),
      mixedEx([line("(P & Q) → (R → S)"), line("P & Q"), line("R → S", "?")], "→E", "arrowE", map(["{A|A} → {B|B}", "{A|A}", "{B|B}"], ["{A|(P & Q)} → {B|(R → S)}", "{A|(P & Q)}", "{B|(R → S)}"]))
    ]
  }
];

function line(formula, cite = "") { return { formula, cite }; }
function blank(cite = "") { return { formula: null, cite }; }
function map(schema, actual) { return { schema, actual }; }
function ex(prompt, rule, lines, options, answer, reveal, wrong = {}) {
  return { kind: "fill", prompt, rule, lines, options, answer, reveal, wrong };
}
function roleEx(prompt, rule, lines, options, answer, reveal, correctText, wrong = {}) {
  return { kind: "role", prompt, rule, lines, options, answer, reveal, correctText, wrong };
}
function mixedEx(lines, answer, rule, reveal) {
  const feedbackByCorrectRule = {
    "&I": {
      "&E": "&E starts with a cited conjunction and copies one whole conjunct from it. Does the displayed proof have that shape?",
      "→E": "→E requires a cited conditional and another cited line containing its complete antecedent. Does the displayed proof have that shape?"
    },
    "&E": {
      "&I": "&I forms a conjunction from the exact sentences on its cited line number(s). Does the displayed proof have that shape?",
      "→E": "→E requires a cited conditional and another cited line containing its complete antecedent. Does the displayed proof have that shape?"
    },
    "→E": {
      "&I": "&I forms a conjunction from the exact sentences on its cited line number(s). Does the displayed proof have that shape?",
      "&E": "&E starts with a cited conjunction and copies one whole conjunct from it. Does the displayed proof have that shape?"
    }
  };
  return {
    kind: "rule",
    prompt: "Which rule licenses the final line?",
    rule,
    lines,
    options: ["&I", "&E", "→E"],
    answer,
    reveal,
    wrong: feedbackByCorrectRule[answer]
  };
}

const app = document.querySelector("#app");
const headerProgress = document.querySelector("#header-progress");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const helpDialog = document.querySelector("#help-dialog");

let state = {
  view: "home",
  levelIndex: 0,
  exerciseIndex: 0,
  selected: null,
  answered: false,
  attempts: 0,
  firstTryCorrect: 0,
  lastIncorrect: null
};

function render() {
  headerProgress.hidden = state.view !== "practice";
  if (state.view === "home") renderHome();
  if (state.view === "intro") renderIntro();
  if (state.view === "practice") renderPractice();
  if (state.view === "complete") renderComplete();
  app.focus({ preventScroll: true });
}

function renderHome() {
  app.innerHTML = `
    <section class="page-shell">
      <div class="hero">
        <p class="eyebrow">Fitch rule practice</p>
        <h1>Recognize the first three <span>inference rules.</span></h1>
        <p class="hero-copy">Learn to identify concrete instances of &amp;I, &amp;E, and →E by matching formulas to their rule schemas.</p>
      </div>
      <div class="lesson-path" aria-label="Choose a level">
        ${LEVELS.map((level, index) => `
          <button class="level-card ${level.id === "mixed" ? "mixed" : ""}" type="button" data-start-level="${index}">
            <span class="level-number">${level.label}</span>
            <span class="level-symbol" aria-hidden="true">${level.symbol}</span>
            <h2>${level.name}</h2>
            <p>${level.short}</p>
            <span class="card-action">Begin <span aria-hidden="true">→</span></span>
          </button>
        `).join("")}
      </div>
    </section>`;
}

function renderIntro() {
  const level = LEVELS[state.levelIndex];
  app.innerHTML = `
    <section class="page-shell intro-shell">
      <div class="intro-grid">
        <div class="intro-copy">
          <p class="eyebrow">${level.label} · Meet the rule</p>
          <h1>${level.name} <span class="sr-only">${level.symbol}</span></h1>
          <div class="plain-language"><strong>In plain language</strong>${level.explanation}</div>
          ${level.everyday.length ? `<div class="example-card">
            <h2>Everyday example</h2>
            <dl class="everyday-lines">
              ${level.everyday.map((text, index) => text ? `<dt>${index === level.everyday.length - 1 ? '<span class="therefore">∴</span>' : index + 1}</dt><dd>${text}</dd>` : "").join("")}
            </dl>
            ${level.callout ? `<p class="callout">${level.callout}</p>` : ""}
          </div>` : ""}
          ${level.note ? `<p class="placeholder-note">${level.note}</p>` : ""}
          ${level.demo ? renderSchemaDemo(level) : ""}
          <div class="intro-actions">
            <button class="primary-button" type="button" data-begin-practice>Practice ${level.symbol}<span class="arrow" aria-hidden="true">→</span></button>
            <button class="secondary-button" type="button" data-go-home>Choose another level</button>
          </div>
        </div>
        ${level.id === "mixed" ? renderAllRulesCard() : renderRuleCard(level.id)}
      </div>
    </section>`;
}

function renderSchemaDemo(level) {
  return `
    <div class="schema-demo">
      <h2>From schema to instance</h2>
      <p>A rule schema describes a whole family of allowed inferences. We may plug any sentence of TFL into <span class="meta-letter">𝔄</span> and any sentence of TFL into <span class="meta-letter">𝔅</span>.</p>
      <p>For example, plug in <strong>${level.demo.a}</strong> for <span class="meta-letter">𝔄</span> and <strong>${level.demo.b}</strong> for <span class="meta-letter">𝔅</span>. The ${level.symbol} schema then licenses this inference:</p>
      <div class="demo-proof" aria-label="Example instance of the rule">
        ${level.demo.lines.map(item => `<div class="demo-line"><span class="schema-rail ${item.cite ? "conclusion-rail" : ""}" aria-hidden="true"></span><span>${item.formula}</span><span class="schema-cite">${item.cite || ""}</span></div>`).join("")}
      </div>
    </div>`;
}

function renderRuleCard(ruleId, reveal = null) {
  const rule = RULES[ruleId];
  return `
    <aside class="rule-card" aria-label="Rule schema">
      <div class="rule-card-kicker"><span>Rule schema</span><span>${rule.symbol}</span></div>
      <h2>${rule.name}</h2>
      ${renderSchemaProofs(ruleId, rule, reveal)}
      <p class="schema-note">${rule.note}</p>
    </aside>`;
}

function renderSchemaProofs(ruleId, rule, reveal = null) {
  const schemas = rule.schemas || [rule.schema];
  const activeIndex = ruleId === "andE" && reveal && reveal.schema.at(-1).includes("{B|") ? 1 : 0;
  return schemas.map((schema, schemaIndex) => {
    const isActive = Boolean(reveal) && schemaIndex === activeIndex;
    const displayedLines = isActive
      ? reveal.schema.map((formula, index) => ({ formula, cite: schema[index]?.cite || "" }))
      : schema;
    return `
      ${schemaIndex > 0 ? '<div class="schema-divider" aria-hidden="true">or</div>' : ""}
      <div class="schema-proof">
        ${displayedLines.map(item => `<div class="schema-line"><span class="schema-rail ${item.cite ? "conclusion-rail" : ""}" aria-hidden="true"></span><span class="schema-formula">${isActive ? roleMarkup(item.formula, true) : formatSchemaFormula(item.formula)}</span><span class="schema-cite">${item.cite || ""}</span></div>`).join("")}
      </div>`;
  }).join("");
}

function renderAllRulesCard(activeRule = null, reveal = null) {
  return `
    <aside class="rule-card" aria-label="The three rule schemas">
      <div class="rule-card-kicker"><span>Rule bank</span><span>3 rules</span></div>
      ${Object.entries(RULES).map(([ruleId, rule]) => {
        return `
        <div class="mini-rule">
          <h2>${rule.symbol} <span class="sr-only">${rule.name}</span></h2>
          ${renderSchemaProofs(ruleId, rule, ruleId === activeRule ? reveal : null)}
        </div>
      `}).join("")}
    </aside>`;
}

function renderPractice() {
  const level = LEVELS[state.levelIndex];
  const exercise = level.exercises[state.exerciseIndex];
  const percent = (state.exerciseIndex / level.exercises.length) * 100;
  progressLabel.textContent = `Problem ${state.exerciseIndex + 1} of ${level.exercises.length}`;
  progressFill.style.width = `${percent}%`;

  app.innerHTML = `
    <section class="page-shell practice-shell">
      <div class="practice-heading">
        <p class="eyebrow">${level.label} · Problem ${state.exerciseIndex + 1} of ${level.exercises.length}</p>
        <h1>${exercise.kind === "role" ? "Name the placeholder" : exercise.kind === "rule" ? "Name the rule" : "Complete the proof"}</h1>
      </div>
      <div class="practice-grid">
        <article class="problem-card">
          <p class="prompt" id="problem-prompt">${exercise.prompt}</p>
          ${renderProof(exercise)}
          <fieldset class="choices" aria-describedby="problem-prompt" ${state.answered ? "disabled" : ""}>
            <legend>Select one answer</legend>
            ${exercise.options.map((option, index) => {
              const classes = ["choice"];
              if (state.selected === option && !state.answered) classes.push("selected");
              return `<button class="${classes.join(" ")}" type="button" data-choice="${escapeAttr(option)}"><span>${option}</span><span class="sr-only">Choice ${index + 1}</span></button>`;
            }).join("")}
          </fieldset>
          <div class="problem-actions">
            <button class="check-button" type="button" data-check ${state.selected === null || state.answered ? "disabled" : ""}>Check answer</button>
            <span class="keyboard-note">Keys 1–${exercise.options.length} select · Enter checks</span>
          </div>
          <div id="feedback-region" aria-live="polite">${renderFeedback(exercise)}</div>
        </article>
        ${level.id === "mixed"
          ? renderAllRulesCard(state.answered ? exercise.rule : null, state.answered ? exercise.reveal : null)
          : renderRuleCard(exercise.rule, state.answered ? exercise.reveal : null)}
      </div>
    </section>`;

  if (state.answered) document.querySelector("[data-next]")?.focus({ preventScroll: true });
}

function renderProof(exercise) {
  return `<div class="proof" aria-label="Fitch proof">
    ${exercise.lines.map((item, index) => {
      const isBlank = item.formula === null;
      const fill = isBlank && state.selected && exercise.kind === "fill";
      const formula = state.answered
        ? roleMarkup(exercise.reveal.actual[index])
        : isBlank
          ? `<span class="blank-formula ${fill ? "filled" : ""}">${fill ? state.selected : '<span aria-hidden="true">?</span><span class="sr-only">blank</span>'}</span>`
          : item.formula;
      return `<div class="proof-line ${item.cite ? "conclusion-line" : ""}"><span class="line-number">${index + 1}</span><span class="fitch-rail ${item.cite ? "conclusion-rail" : ""}" aria-hidden="true"></span><span class="formula-cell">${formula}</span><span class="citation">${item.cite || ""}</span></div>`;
    }).join("")}
  </div>`;
}

function renderFeedback(exercise) {
  if (!state.answered && state.lastIncorrect === null) return "";
  if (!state.answered) {
    const checkedChoice = state.lastIncorrect;
    const fallback = exercise.wrong[checkedChoice] || (exercise.kind === "role"
      ? "Look for the complete formula occupying that placeholder—not just a letter inside it."
      : "Compare the whole formulas in the proof with each line of the rule schema.");
    return `<div class="feedback incorrect"><h2>Not quite—try again.</h2><p>${fallback}</p></div>`;
  }

  const correctText = correctFeedback(exercise);
  return `
    <div class="feedback correct">
      <p><strong>Correct.</strong> ${correctText}</p>
      <button class="primary-button" type="button" data-next>${state.exerciseIndex === LEVELS[state.levelIndex].exercises.length - 1 ? "Finish level" : "Next problem"}<span class="arrow" aria-hidden="true">→</span></button>
    </div>`;
}

function correctFeedback(exercise) {
  const roles = extractRoles(exercise.reveal);
  const rule = RULES[exercise.rule];
  return `This instantiates the ${rule.symbol} schema with <span class="role-assignment role-assignment-a"><span class="meta-letter">𝔄</span> = <strong>${roles.A}</strong></span> and <span class="role-assignment role-assignment-b"><span class="meta-letter">𝔅</span> = <strong>${roles.B}</strong></span>.`;
}

function extractRoles(reveal) {
  const roles = {};
  for (const value of reveal.actual) {
    for (const match of value.matchAll(/\{([AB])\|([^}]+)\}/g)) {
      if (!roles[match[1]]) roles[match[1]] = match[2];
    }
  }
  return roles;
}

function roleMarkup(value, useScriptLetters = false) {
  return value.replace(/\{([AB])\|([^}]+)\}/g, (_, role, text) => {
    const displayText = useScriptLetters && text === "A" ? "𝔄" : useScriptLetters && text === "B" ? "𝔅" : text;
    return `<span class="role role-${role.toLowerCase()}">${displayText}</span>`;
  });
}

function formatSchemaFormula(formula) {
  return formula.replace(/\bA\b/g, "𝔄").replace(/\bB\b/g, "𝔅");
}

function renderComplete() {
  const level = LEVELS[state.levelIndex];
  const total = level.exercises.length;
  progressFill.style.width = "100%";
  app.innerHTML = `
    <section class="page-shell completion">
      <div class="completion-mark" aria-hidden="true">✓</div>
      <p class="eyebrow">${level.label} complete</p>
      <h1>Pattern matched.</h1>
      <p>You finished ${level.name}. The important habit is to match <span class="meta-letter">𝔄</span> and <span class="meta-letter">𝔅</span> with whole formulas, even when those formulas have connectives inside them.</p>
      <div class="completion-summary">
        <div class="summary-item"><strong>${total} problems completed</strong><span>You worked through every example in this level.</span></div>
        <div class="summary-item"><strong>${state.firstTryCorrect} on the first try</strong><span>Retries are part of practice; explanations stay available as you work.</span></div>
      </div>
      <div class="completion-actions">
        ${state.levelIndex < LEVELS.length - 1 ? `<button class="primary-button" type="button" data-next-level>Continue to ${LEVELS[state.levelIndex + 1].symbol}<span class="arrow" aria-hidden="true">→</span></button>` : ""}
        <button class="secondary-button" type="button" data-repeat>Practice this level again</button>
        <button class="secondary-button" type="button" data-go-home>Choose a level</button>
      </div>
    </section>`;
}

function chooseLevel(index) {
  state = { ...state, view: "intro", levelIndex: index, exerciseIndex: 0, selected: null, answered: false, attempts: 0, firstTryCorrect: 0, lastIncorrect: null };
  render();
}

function beginPractice() {
  state.view = "practice";
  state.exerciseIndex = 0;
  state.selected = null;
  state.answered = false;
  state.attempts = 0;
  state.firstTryCorrect = 0;
  state.lastIncorrect = null;
  render();
}

function selectChoice(choice) {
  if (state.answered) return;
  state.selected = choice;
  state.lastIncorrect = null;
  renderPractice();
}

function checkAnswer() {
  if (state.selected === null || state.answered) return;
  const exercise = LEVELS[state.levelIndex].exercises[state.exerciseIndex];
  state.attempts += 1;
  if (state.selected === exercise.answer) {
    state.answered = true;
    state.lastIncorrect = null;
    if (state.attempts === 1) state.firstTryCorrect += 1;
  } else {
    state.lastIncorrect = state.selected;
    state.selected = null;
  }
  renderPractice();
}

function nextExercise() {
  const level = LEVELS[state.levelIndex];
  if (state.exerciseIndex >= level.exercises.length - 1) {
    state.view = "complete";
  } else {
    state.exerciseIndex += 1;
    state.selected = null;
    state.answered = false;
    state.attempts = 0;
    state.lastIncorrect = null;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

function escapeAttr(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

document.addEventListener("click", event => {
  const levelButton = event.target.closest("[data-start-level]");
  if (levelButton) return chooseLevel(Number(levelButton.dataset.startLevel));
  if (event.target.closest("[data-begin-practice]")) return beginPractice();
  if (event.target.closest("[data-go-home]")) { state.view = "home"; return render(); }
  const choice = event.target.closest("[data-choice]");
  if (choice) return selectChoice(choice.dataset.choice);
  if (event.target.closest("[data-check]")) return checkAnswer();
  if (event.target.closest("[data-next]")) return nextExercise();
  if (event.target.closest("[data-repeat]")) return beginPractice();
  if (event.target.closest("[data-next-level]")) return chooseLevel(state.levelIndex + 1);
});

document.addEventListener("keydown", event => {
  if (state.view !== "practice" || event.target.closest("button")) return;
  const exercise = LEVELS[state.levelIndex].exercises[state.exerciseIndex];
  const number = Number(event.key);
  if (!state.answered && number >= 1 && number <= exercise.options.length) selectChoice(exercise.options[number - 1]);
  if (event.key === "Enter") {
    if (state.answered) nextExercise();
    else checkAnswer();
  }
});

document.querySelector("#home-button").addEventListener("click", () => { state.view = "home"; render(); });
document.querySelector("#how-button").addEventListener("click", () => helpDialog.showModal());
document.querySelector("#close-help").addEventListener("click", () => helpDialog.close());
helpDialog.addEventListener("click", event => {
  if (event.target === helpDialog) helpDialog.close();
});

render();
