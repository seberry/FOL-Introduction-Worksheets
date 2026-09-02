import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CONNECTIVES, caseCode, getCases, truthLabel, type ConnectiveId } from "../domain/connectives";
import { recordAnswer, type ProgressState } from "../domain/progress";
import { TruthValueToken } from "./LogicExpression";
import { TruthNotationInfo } from "./TruthNotationInfo";

interface TableScreenProps {
  connectiveIds: ConnectiveId[];
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onBack: () => void;
  onComplete: () => void;
}

export function TableScreen({ connectiveIds, progress, setProgress, onBack, onComplete }: TableScreenProps) {
  const [connectiveIndex, setConnectiveIndex] = useState(0);
  const [activeCell, setActiveCell] = useState(0);
  const [filled, setFilled] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [completedTables, setCompletedTables] = useState<ConnectiveId[]>([]);
  const connective = CONNECTIVES[connectiveIds[connectiveIndex]];
  const cases = getCases(connective);
  const activeCase = cases[activeCell];
  const tableComplete = filled.length === cases.length;

  const answer = (value: boolean) => {
    if (feedback === "correct" || tableComplete) return;
    const expected = connective.evaluate(activeCase.a, activeCase.b);
    const correct = value === expected;
    setProgress((current) => recordAnswer(current, `table:${connective.id}:${caseCode(activeCase.a, activeCase.b)}`, correct, 0));
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) {
      window.setTimeout(() => {
        setFilled((values) => [...values, expected]);
        setActiveCell((cell) => cell + 1);
        setFeedback(null);
      }, 520);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "t") answer(true);
      if (event.key.toLowerCase() === "f") answer(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const nextTable = () => {
    const completed = [...completedTables, connective.id];
    setCompletedTables(completed);
    if (connectiveIndex === connectiveIds.length - 1) {
      onComplete();
      return;
    }
    setConnectiveIndex((index) => index + 1);
    setActiveCell(0);
    setFilled([]);
    setFeedback(null);
  };

  return (
    <main className="table-shell" id="main-content">
      <div className="practice-topline">
        <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button>
        <span>{connectiveIndex + 1} of {connectiveIds.length} tables</span>
      </div>
      <section className="table-workspace" aria-labelledby="table-title">
        <div className="table-heading">
          <p className="eyebrow">Characteristic table</p>
          <h1 id="table-title">Build the table for {connective.shortName}</h1>
          <p>{connective.rule}</p>
          <TruthNotationInfo />
        </div>
        <div className="truth-table-wrap">
          <table className="truth-table">
            <caption className="sr-only">Truth table for {connective.shortName}</caption>
            <thead>
              <tr>
                <th scope="col">P</th>
                {connective.arity === 2 && <th scope="col">Q</th>}
                <th scope="col" aria-label={connective.arity === 1 ? "not P" : `P ${connective.spokenName} Q`}>
                  {connective.arity === 1 ? `${connective.primarySymbol}P` : `P ${connective.primarySymbol} Q`}
                </th>
              </tr>
            </thead>
            <tbody>
              {cases.map((truthCase, index) => (
                <tr key={caseCode(truthCase.a, truthCase.b)} className={index === activeCell ? "active-row" : ""}>
                  <td><TruthValueToken value={truthCase.a} /></td>
                  {connective.arity === 2 && <td><TruthValueToken value={Boolean(truthCase.b)} /></td>}
                  <td className="output-cell" aria-current={index === activeCell ? "true" : undefined}>
                    {index < filled.length ? <><Check aria-hidden="true" /> <TruthValueToken value={filled[index]} /></> : index === activeCell ? <span className="cell-question">?</span> : <span aria-label="Not answered">·</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!tableComplete ? (
          <div className="table-controls">
            <p>Choose the highlighted cell.</p>
            <div className="answer-buttons compact" aria-label="Choose the active cell truth value">
              <button type="button" onClick={() => answer(true)} disabled={feedback === "correct"}><TruthValueToken value={true} /><kbd>T</kbd></button>
              <button type="button" onClick={() => answer(false)} disabled={feedback === "correct"}><TruthValueToken value={false} /><kbd>F</kbd></button>
            </div>
            <div className="table-feedback" aria-live="assertive">
              {feedback === "incorrect" && <p className="feedback-incorrect"><span aria-hidden="true">×</span> Not quite. {connective.rule}</p>}
              {feedback === "correct" && <p className="feedback-correct"><span aria-hidden="true">✓</span> Correct</p>}
            </div>
          </div>
        ) : (
          <div className="table-complete" aria-live="polite">
            <p><span aria-hidden="true">✓</span> You completed the truth table for {connective.shortName}.</p>
            <p className="output-pattern">Output pattern: <strong>{filled.map((value) => truthLabel(value)).join("")}</strong></p>
            <button className="primary-button" type="button" onClick={nextTable}>
              {connectiveIndex === connectiveIds.length - 1 ? "Finish tables" : "Next table"} <ArrowRight aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
