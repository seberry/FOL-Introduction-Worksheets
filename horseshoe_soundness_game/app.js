const rulesData = [
  {
    id: "and_intro",
    name: "∧I (And Introduction)",
    schemas: [
      { text: `i | 𝒜\n  |\n  | ...\n  |\nj | ℬ\n  |\n  | ...\n  |\nn | 𝒜 ∧ ℬ     ∧I i, j`, correct: true },
      { text: `i | 𝒜\n  |\n  | ...\n  |\nn | 𝒜 ∧ ℬ     ∧I i`, correct: false }
    ],
    horseshoeDiagram: "     i | 𝒜\n       |\n 𝟐     | ...                         𝟑\n       |\n     j | ℬ\n       |\n       | ...\n       |\n 𝟏   n | 𝒜 ∧ ℬ   ∧I i, j            𝟒",
    deltaOptions: [
      { text: "δᵢ ⊆ δₙ and δⱼ ⊆ δₙ, because we cannot reach into closed subproofs to cite lines i and j.", correct: true },
      { text: "δₙ ⊆ δᵢ and δₙ ⊆ δⱼ, because line n is asserted under fewer assumptions.", correct: false },
      { text: "δᵢ = δₙ = δⱼ, because they are inside the same proof.", correct: false }
    ],
    horseshoeSteps: [
      {
        prompt: "Step 1: Start (Bottom Left).",
        sentence: "Consider an arbitrary valuation v satisfying δₙ.",
        indent: 0,
        options: [
          "Assumption introduced to show δₙ ⊨ 𝒜 ∧ ℬ",
          "By the Inductive Hypothesis",
          "By the truth table for ∧"
        ],
        correct: 0,
        err: "We are trying to prove semantic entailment (δₙ ⊨ φₙ). We start by assuming an arbitrary valuation satisfies the premises/assumptions."
      },
      {
        prompt: "Step 2: Up (Syntax).",
        sentence: "v satisfies δᵢ and v satisfies δⱼ.",
        indent: 1,
        options: [
          "Because δᵢ ⊆ δₙ and δⱼ ⊆ δₙ, and v satisfies δₙ.",
          "By the Inductive Hypothesis.",
          "Because 𝒜 and ℬ are true."
        ],
        correct: 0,
        err: "We milked the syntax in Phase 1! Since v makes everything in δₙ true, and δᵢ is a subset of δₙ, it must make everything in δᵢ true."
      },
      {
        prompt: "Step 3: Across (Induction).",
        sentence: "v satisfies 𝒜 and v satisfies ℬ.",
        indent: 1,
        options: [
          "By the Inductive Hypothesis, lines i and j are shiny (δᵢ ⊨ 𝒜, δⱼ ⊨ ℬ).",
          "By the characteristic truth table for ∧.",
          "By the rules of Fitch proofs."
        ],
        correct: 0,
        err: "This is the core of the proof! We know v satisfies their assumptions, and by IH they are shiny, so v MUST satisfy the sentences 𝒜 and ℬ."
      },
      {
        prompt: "Step 4: Down.",
        sentence: "Therefore, v satisfies 𝒜 ∧ ℬ.",
        indent: 1,
        options: [
          "By the characteristic truth table for ∧, since it satisfies 𝒜 and satisfies ℬ.",
          "By Argument by Cases.",
          "By Contradiction."
        ],
        correct: 0,
        err: "We have 𝒜 and we have ℬ. The truth table for ∧ tells us this makes 𝒜 ∧ ℬ true."
      },
      {
        prompt: "Step 5: Conclusion.",
        sentence: "δₙ ⊨ 𝒜 ∧ ℬ; therefore line n is shiny.",
        indent: 0,
        options: [
          "Since we showed that any v satisfying δₙ must also satisfy 𝒜 ∧ ℬ = φₙ.",
          "By Double Negation.",
          "By the Inductive Hypothesis."
        ],
        correct: 0,
        err: "We proved the entailment we set out to prove in Step 1."
      }
    ]
  },
{
    id: "not_elim",
    name: "¬E (Not Elimination / Contradiction)",
    schemas: [
      { text: `i | 𝒜\n  |\n  | ...\n  |\nj | ¬𝒜\n  |\n  | ...\n  |\nn | ⊥         ¬E i, j`, correct: true },
      { text: `i | ¬𝒜\n  |\n  | ...\n  |\nn | ⊥         ¬E i`, correct: false }
    ],
    horseshoeDiagram: "     i | 𝒜\n       |\n 𝟐     | ...                         𝟑\n       |\n     j | ¬𝒜\n       |\n       | ...\n       |\n 𝟏   n | ⊥       ¬E i, j            𝟒",
    deltaOptions: [
      { text: "δᵢ ⊆ δₙ and δⱼ ⊆ δₙ, because lines i and j are not in closed subproofs.", correct: true },
      { text: "δₙ = {𝒜, ¬𝒜}", correct: false }
    ],
    horseshoeSteps: [
      {
        prompt: "Step 1: Start (Bottom Left).",
        sentence: "Consider an arbitrary valuation v satisfying δₙ.",
        indent: 0,
        options: [
          "Assumption introduced to show δₙ ⊨ ⊥",
          "By the Inductive Hypothesis",
          "By the truth table for ¬"
        ],
        correct: 0,
        err: "We always start a shininess proof by assuming an arbitrary valuation satisfies the active assumptions."
      },
      {
        prompt: "Step 2: Up (Syntax).",
        sentence: "v must satisfy δᵢ and δⱼ.",
        indent: 1,
        options: [
          "Because δᵢ ⊆ δₙ and δⱼ ⊆ δₙ.",
          "Because ⊥ is false.",
          "By the Inductive Hypothesis."
        ],
        correct: 0,
        err: "Remember Phase 1: v satisfies the superset, so it satisfies the subsets."
      },
      {
        prompt: "Step 3: Across (Induction).",
        sentence: "v must satisfy 𝒜 and v must satisfy ¬𝒜.",
        indent: 1,
        options: [
          "By the Inductive Hypothesis, lines i and j are shiny (δᵢ ⊨ 𝒜 and δⱼ ⊨ ¬𝒜).",
          "Because they are written on the lines.",
          "By the truth table for ¬."
        ],
        correct: 0,
        err: "The IH guarantees that since v satisfies the assumptions, it must satisfy the sentences!"
      },
      {
        prompt: "Step 4: Down.",
        sentence: "But no valuation can satisfy both 𝒜 and ¬𝒜.",
        indent: 1,
        options: [
          "By the characteristic truth table for ¬.",
          "By Argument by Cases.",
          "Because the Inductive Hypothesis failed."
        ],
        correct: 0,
        err: "The truth table for ¬ says v makes ¬𝒜 true iff it makes 𝒜 false. It can't do both."
      },
      {
        prompt: "Step 5: Conclusion.",
        sentence: "Therefore, no valuation can satisfy δₙ, meaning it is vacuously true that all valuations satisfying δₙ satisfy ⊥.",
        indent: 0,
        options: [
          "Because assuming a valuation satisfied δₙ led to a contradiction.",
          "Because ⊥ is always true.",
          "By Argument by Cases."
        ],
        correct: 0,
        err: "We assumed v satisfied δₙ and derived a contradiction. An empty set of satisfying valuations makes the entailment vacuously true."
      }
    ]
  }
    
  
];

let activeRule = null;
let ruleIndex = 0;
let builtSentences = [];
let availableSentences = [];
let phase2State = "claim"; // can be "claim" or "justification"

// UI Elements
const ruleButtonsContainer = document.getElementById("ruleButtons");
const phase1 = document.getElementById("phase1");
const phase2 = document.getElementById("phase2");

const ruleNameDisplay = document.getElementById("ruleNameDisplay");
const schemaOptions = document.getElementById("schemaOptions");
const deltaBlock = document.getElementById("deltaBlock");
const deltaOptions = document.getElementById("deltaOptions");
const phase1Feedback = document.getElementById("phase1Feedback");

const ruleBuilt = document.getElementById("ruleBuilt");
const sentenceBankContainer = document.getElementById("sentenceBankContainer");
const sentenceBank = document.getElementById("sentenceBank");
const justificationContainer = document.getElementById("justificationContainer");
const ruleStep = document.getElementById("ruleStep");
const ruleChoices = document.getElementById("ruleChoices");
const ruleFeedback = document.getElementById("ruleFeedback");
const resetRuleBtn = document.getElementById("resetRuleBtn");
const horseshoeDiagramView = document.getElementById("horseshoeDiagramView");

// Helper: Fisher-Yates Shuffle
function shuffleArray(array) {
  let curId = array.length;
  while (0 !== curId) {
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}

function init() {
  ruleButtonsContainer.innerHTML = "";
  rulesData.forEach(r => {
    const btn = document.createElement("button");
    btn.className = "primary-btn";
    btn.textContent = r.name;
    btn.onclick = () => loadRule(r);
    ruleButtonsContainer.appendChild(btn);
  });
}

function loadRule(rule) {
  activeRule = rule;
  phase1.classList.remove("hidden");
  phase2.classList.add("hidden");
  ruleNameDisplay.textContent = rule.name;
  
  horseshoeDiagramView.innerHTML = rule.horseshoeDiagram;
  
  deltaBlock.classList.add("hidden");
  phase1Feedback.textContent = "";
  
  schemaOptions.innerHTML = "";
  rule.schemas.forEach((sc) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<pre>${sc.text}</pre>`;
    btn.onclick = () => {
      Array.from(schemaOptions.children).forEach(c => {
        c.classList.remove("selected-correct", "selected-wrong");
        c.disabled = true;
      });
      if (sc.correct) {
        btn.classList.add("selected-correct");
        phase1Feedback.textContent = "Correct schema. Now identify the assumption relationship.";
        phase1Feedback.className = "feedback ok";
        showDeltaPhase();
      } else {
        btn.classList.add("selected-wrong");
        phase1Feedback.textContent = "Incorrect schema. Try again.";
        phase1Feedback.className = "feedback bad";
        Array.from(schemaOptions.children).forEach(c => c.disabled = false);
      }
    };
    schemaOptions.appendChild(btn);
  });
}

function showDeltaPhase() {
  deltaBlock.classList.remove("hidden");
  deltaOptions.innerHTML = "";
  activeRule.deltaOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt.text;
    btn.onclick = () => {
      Array.from(deltaOptions.children).forEach(c => {
        c.classList.remove("selected-correct", "selected-wrong");
        c.disabled = true;
      });
      if (opt.correct) {
        btn.classList.add("selected-correct");
        phase1Feedback.textContent = "Excellent. Transitioning to The Horseshoe...";
        phase1Feedback.className = "feedback ok";
        setTimeout(() => startPhase2(), 1500);
      } else {
        btn.classList.add("selected-wrong");
        phase1Feedback.textContent = "Incorrect relationship. Remember we can't cite a closed subproof.";
        phase1Feedback.className = "feedback bad";
        Array.from(deltaOptions.children).forEach(c => c.disabled = false);
      }
    };
    deltaOptions.appendChild(btn);
  });
}

function startPhase2() {
  phase1.classList.add("hidden");
  phase2.classList.remove("hidden");
  resetRuleLevel();
}

function renderRuleBuilt() {
  if (builtSentences.length === 0) {
    ruleBuilt.textContent = "No completed steps yet.";
    return;
  }
  const ol = document.createElement("ol");
  builtSentences.forEach((item) => {
    const li = document.createElement("li");
    li.className = "built-row";
    
    const sentenceSpan = document.createElement("span");
    sentenceSpan.textContent = item.sentence;
    sentenceSpan.className = "built-sentence";
    
    const whySpan = document.createElement("span");
    whySpan.textContent = ` (Justification: ${item.justification})`;
    whySpan.className = "built-why";
    
    li.appendChild(sentenceSpan);
    li.appendChild(whySpan);
    li.style.marginLeft = `${(item.indent || 0) * 1.5}rem`;
    ol.appendChild(li);
  });
  ruleBuilt.innerHTML = "";
  ruleBuilt.appendChild(ol);
}

function renderRuleStep() {
  ruleChoices.innerHTML = "";
  sentenceBank.innerHTML = "";
  ruleFeedback.textContent = "";
  ruleFeedback.className = "feedback";

  if (ruleIndex >= activeRule.horseshoeSteps.length) {
    sentenceBankContainer.classList.add("hidden");
    justificationContainer.classList.add("hidden");
    ruleBuilt.innerHTML += "<br/><strong>Proof Complete!</strong> You have successfully executed the horseshoe method.";
    return;
  }

  const step = activeRule.horseshoeSteps[ruleIndex];

  if (phase2State === "claim") {
    // Show Sentence Bank, hide Justifications
    sentenceBankContainer.classList.remove("hidden");
    justificationContainer.classList.add("hidden");
    
    // Render the prompt above the sentence bank
    const promptEl = document.createElement("h4");
    promptEl.textContent = `${step.prompt} Which claim comes next?`;
    sentenceBank.appendChild(promptEl);

    availableSentences.forEach((sentenceOption) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = sentenceOption;
      btn.onclick = () => {
        if (sentenceOption === step.sentence) {
          // Correct claim! Remove it from the available pool.
          availableSentences = availableSentences.filter(s => s !== sentenceOption);
          phase2State = "justification";
          renderRuleStep(); // Re-render to show justification choices
        } else {
          ruleFeedback.textContent = "Not quite. Think about where we are in the horseshoe.";
          ruleFeedback.className = "feedback bad";
        }
      };
      sentenceBank.appendChild(btn);
    });

  } else if (phase2State === "justification") {
    // Hide Sentence Bank, show Justifications
    sentenceBankContainer.classList.add("hidden");
    justificationContainer.classList.remove("hidden");

    ruleStep.innerHTML = `<strong>${step.prompt}</strong><br/>Claim: <em>"${step.sentence}"</em><br/><br/><strong>Why is this justified?</strong>`;
    
    step.options.forEach((option, idx) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = option;
      btn.onclick = () => {
        if (idx === step.correct) {
          builtSentences.push({
            sentence: step.sentence,
            indent: step.indent || 0,
            justification: option
          });
          ruleIndex += 1;
          phase2State = "claim"; // Reset to looking for the next claim
          renderRuleBuilt();
          renderRuleStep();
        } else {
          ruleFeedback.textContent = `Incorrect! ${step.err}`;
          ruleFeedback.className = "feedback bad";
        }
      };
      ruleChoices.appendChild(btn);
    });
  }
}

function resetRuleLevel() {
  ruleIndex = 0;
  builtSentences = [];
  phase2State = "claim";
  
  // Extract all sentences for this rule and shuffle them
  availableSentences = activeRule.horseshoeSteps.map(step => step.sentence);
  shuffleArray(availableSentences);

  renderRuleBuilt();
  renderRuleStep();
}

resetRuleBtn.addEventListener("click", resetRuleLevel);

init();