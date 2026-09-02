import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CONNECTIVES, getCases, type ConnectiveId } from "../domain/connectives";
import { recordAnswer, type ProgressState } from "../domain/progress";
import { practicePresentation } from "../domain/presentation";
import { CompactCasePrompt, ExpandedCasePrompt } from "./CasePrompts";
import { FormulaExpression, TruthValueToken } from "./LogicExpression";
import { TruthNotationInfo } from "./TruthNotationInfo";

interface AlternateScreenProps {
  connectiveIds: ConnectiveId[];
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onBack: () => void;
  onComplete: () => void;
}

export function AlternateScreen({ connectiveIds, progress, setProgress, onBack, onComplete }: AlternateScreenProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"teach" | "practice">("teach");
  const [caseIndex, setCaseIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const connective = CONNECTIVES[connectiveIds[index]];
  const cases = getCases(connective);
  const truthCase = cases[caseIndex];
  const alternate = connective.alternateSymbols[0];
  const expected = connective.evaluate(truthCase.a, truthCase.b);

  const answer = (value: boolean) => {
    if (feedback === "correct") return;
    const correct = value === expected;
    setProgress((current) => recordAnswer(current, `alternate:${connective.id}`, correct, 0));
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) window.setTimeout(() => {
      if (caseIndex < 1) {
        setCaseIndex((caseNumber) => caseNumber + 1);
        setFeedback(null);
      } else if (index < connectiveIds.length - 1) {
        setIndex((connectiveNumber) => connectiveNumber + 1);
        setCaseIndex(0);
        setPhase("teach");
        setFeedback(null);
      } else {
        onComplete();
      }
    }, 650);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phase !== "practice") return;
      if (event.key.toLowerCase() === "t") answer(true);
      if (event.key.toLowerCase() === "f") answer(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (phase === "teach") {
    return (
      <main className="focus-shell" id="main-content">
        <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button>
        <section className="alternate-lesson" aria-labelledby="alternate-title">
          <p className="eyebrow">Alternate notation · {index + 1} of {connectiveIds.length}</p>
          <h1 id="alternate-title">You already know {connective.shortName}.</h1>
          <div className="symbol-transfer" aria-label={`${connective.primarySymbol} and ${alternate} both mean ${connective.shortName}`}>
            <span>{connective.primarySymbol}</span><ArrowRight aria-hidden="true" /><span>{alternate}</span>
          </div>
          <p>Some logic books write <strong>{connective.shortName}</strong> as <span className="inline-symbol">{alternate}</span>.</p>
          <p className="same-operation">Same operation, different symbol.</p>
          <button className="primary-button" type="button" onClick={() => setPhase("practice")}>Try two cases <ArrowRight aria-hidden="true" /></button>
        </section>
      </main>
    );
  }

  const presentation = practicePresentation(progress, [connective.id]);
  const expanded = presentation === "expanded";
  return (
    <main className="focus-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button>
      <section className={`practice alternate-practice ${expanded ? "expanded-practice" : ""}`} aria-labelledby="alternate-practice-title">
        <p className="eyebrow">{connective.shortName} in alternate notation</p>
        <h1 id="alternate-practice-title" className="sr-only">Evaluate the truth value</h1>
        <div className="problem-line alternate-problem-line">
          {expanded ? <ExpandedCasePrompt connective={connective} a={truthCase.a} b={truthCase.b} symbol={alternate} /> : <><CompactCasePrompt connective={connective} a={truthCase.a} b={truthCase.b} symbol={alternate} /><span aria-hidden="true">= ?</span><TruthNotationInfo /></>}
        </div>
        <div className="answer-buttons">
          <button type="button" onClick={() => answer(true)} disabled={feedback === "correct"}><TruthValueToken value={true} words /><kbd>T</kbd></button>
          <button type="button" onClick={() => answer(false)} disabled={feedback === "correct"}><TruthValueToken value={false} words /><kbd>F</kbd></button>
        </div>
        <div className={`feedback-region ${feedback ? "visible" : ""}`} aria-live="assertive">
          {feedback === "correct" && <p className="feedback-correct"><span aria-hidden="true">✓</span> Correct. It works exactly like {connective.primarySymbol}.</p>}
          {feedback === "incorrect" && <><p className="feedback-incorrect"><span aria-hidden="true">×</span> Not quite. {connective.rule}</p>{expanded ? <p className="feedback-expanded"><FormulaExpression connective={connective} symbol={alternate} /> is <TruthValueToken value={expected} words />.</p> : <p className="feedback-equation"><CompactCasePrompt connective={connective} a={truthCase.a} b={truthCase.b} symbol={alternate} /> = <TruthValueToken value={expected} /></p>}</>}
        </div>
      </section>
    </main>
  );
}
