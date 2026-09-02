import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CONNECTIVES, recognitionKey, type ConnectiveId } from "../domain/connectives";
import { recordAnswer, type ProgressState } from "../domain/progress";

interface RecognitionScreenProps {
  connectiveIds: ConnectiveId[];
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onBack: () => void;
  onComplete: () => void;
}

export function RecognitionScreen({ connectiveIds, progress, setProgress, onBack, onComplete }: RecognitionScreenProps) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; selected: ConnectiveId } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startedAt = useRef(performance.now());
  const direction = index < 4 ? "symbol-name" : "name-symbol";
  const connectiveId = connectiveIds[index % connectiveIds.length];
  const connective = CONNECTIVES[connectiveId];

  const answer = (selected: ConnectiveId) => {
    if (feedback) return;
    const correct = selected === connectiveId;
    const updated = recordAnswer(
      progress,
      recognitionKey(connectiveId, direction),
      correct,
      Math.round(performance.now() - startedAt.current),
    );
    setProgress(updated);
    setFeedback({ correct, selected });
    if (correct) setCorrectCount((count) => count + 1);
  };

  const next = useCallback(() => {
    if (index >= 7 && correctCount >= 6) {
      setCompleted(true);
      return;
    }
    setIndex((value) => value + 1);
    setFeedback(null);
    startedAt.current = performance.now();
  }, [correctCount, index]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") answer(connectiveIds[0]);
      if (event.key === "2") answer(connectiveIds[1]);
      if (event.key === "Enter" && feedback) next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (completed) {
    return (
      <main className="focus-shell" id="main-content">
        <section className="checkpoint" aria-labelledby="recognition-complete-title">
          <span className="checkpoint-icon" aria-hidden="true">✓</span>
          <h1 id="recognition-complete-title">AND and OR look different.</h1>
          <p>You practiced reading each symbol and choosing each symbol from its name.</p>
          <button className="primary-button" type="button" onClick={onComplete}>Continue <ArrowRight aria-hidden="true" /></button>
        </section>
      </main>
    );
  }

  return (
    <main className="focus-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button>
      <section className="recognition practice" aria-labelledby="recognition-title">
        <p className="eyebrow">Symbol recognition</p>
        <h1 id="recognition-title">{direction === "symbol-name" ? "What does this symbol mean?" : "Which symbol means this?"}</h1>
        <div className={direction === "symbol-name" ? "recognition-symbol" : "recognition-name"} aria-label={direction === "symbol-name" ? connective.spokenName : undefined}>
          {direction === "symbol-name" ? connective.primarySymbol : connective.shortName}
        </div>
        <div className="recognition-choices">
          {connectiveIds.map((id, choiceIndex) => (
            <button key={id} type="button" onClick={() => answer(id)} disabled={Boolean(feedback)}>
              <span className={direction === "name-symbol" ? "choice-symbol" : ""} aria-label={direction === "name-symbol" ? CONNECTIVES[id].spokenName : undefined}>
                {direction === "symbol-name" ? CONNECTIVES[id].shortName : CONNECTIVES[id].primarySymbol}
              </span>
              <kbd>{choiceIndex + 1}</kbd>
            </button>
          ))}
        </div>
        <div className={`feedback-region ${feedback ? "visible" : ""}`} aria-live="assertive">
          {feedback && (
            <>
              <p className={feedback.correct ? "feedback-correct" : "feedback-incorrect"}>
                <span aria-hidden="true">{feedback.correct ? "✓" : "×"}</span> {feedback.correct ? "Correct" : "Not quite"}
              </p>
              <p className="feedback-equation"><span aria-label={connective.spokenName}>{connective.primarySymbol}</span> = {connective.shortName}</p>
              <p className="technical-name">Technical name: <strong>{connective.technicalName}</strong></p>
              <button className="next-button" type="button" onClick={next}>Next <ArrowRight aria-hidden="true" /></button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
