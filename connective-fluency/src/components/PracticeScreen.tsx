import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import {
  CONNECTIVES,
  formatExpression,
  spokenExpression,
  truthLabel,
  type ConnectiveId,
} from "../domain/connectives";
import { recordAnswer, type ProgressState } from "../domain/progress";
import { choosePracticeItem, createItems, isConnectiveLearned, type PracticeItem } from "../domain/scheduler";

interface PracticeScreenProps {
  title: string;
  connectiveIds: ConnectiveId[];
  notation: "primary" | "alternate" | "mixed";
  stageId: string;
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onBack: () => void;
  onComplete: () => void;
}

interface RetryItem { item: PracticeItem; dueAt: number }

export function PracticeScreen({
  title,
  connectiveIds,
  notation,
  stageId,
  progress,
  setProgress,
  onBack,
  onComplete,
}: PracticeScreenProps) {
  const items = useMemo(() => createItems(connectiveIds), [connectiveIds]);
  const [current, setCurrent] = useState(() => choosePracticeItem(items, progress));
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: boolean } | null>(null);
  const [answered, setAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [retryQueue, setRetryQueue] = useState<RetryItem[]>([]);
  const [checkpoint, setCheckpoint] = useState(false);
  const startedAt = useRef(performance.now());
  const advanceTimer = useRef<number | undefined>(undefined);
  const latestProgress = useRef(progress);

  const connective = CONNECTIVES[current.connectiveId];
  const symbol = notation === "alternate"
    ? connective.alternateSymbols[0]
    : notation === "mixed" && answered % 3 === 2
      ? connective.alternateSymbols[0]
      : connective.primarySymbol;
  const useWords = progress.settings.truthDisplay === "words";
  const expected = connective.evaluate(current.a, current.b);
  const expression = formatExpression(connective, current.a, current.b, symbol, useWords);

  const nextQuestion = useCallback((nextProgress: ProgressState) => {
    const nextAnswered = answered + 1;
    const dueIndex = retryQueue.findIndex((retry) => retry.dueAt <= nextAnswered && !recentKeys.slice(-1).includes(retry.item.key));
    let next: PracticeItem;
    if (dueIndex >= 0) {
      next = retryQueue[dueIndex].item;
      setRetryQueue((queue) => queue.filter((_, index) => index !== dueIndex));
    } else {
      next = choosePracticeItem(items, nextProgress, [...recentKeys, current.key]);
    }
    setRecentKeys((keys) => [...keys, current.key].slice(-4));
    setCurrent(next);
    setFeedback(null);
    startedAt.current = performance.now();
  }, [answered, current.key, items, recentKeys, retryQueue]);

  const answer = useCallback((value: boolean) => {
    if (feedback || checkpoint) return;
    const correct = value === expected;
    const latencyMs = Math.round(performance.now() - startedAt.current);
    const nextProgress = recordAnswer(progress, current.key, correct, latencyMs);
    latestProgress.current = nextProgress;
    setProgress(nextProgress);
    setFeedback({ correct, expected });
    setAnswered((count) => count + 1);
    if (correct) setSessionCorrect((count) => count + 1);
    if (!correct) setRetryQueue((queue) => [...queue, { item: current, dueAt: answered + 3 }]);

    const completedConnective = connectiveIds.length === 1 && isConnectiveLearned(nextProgress, connectiveIds[0]);
    const completedMixed = connectiveIds.length > 1 && answered + 1 >= 12;
    if ((completedConnective || completedMixed) && correct) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = window.setTimeout(() => setCheckpoint(true), correct ? 750 : 0);
    } else if (correct && progress.settings.autoAdvance) {
      advanceTimer.current = window.setTimeout(() => nextQuestion(nextProgress), 720);
    }
  }, [answered, checkpoint, connectiveIds, current, expected, feedback, nextQuestion, progress, setProgress]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key.toLowerCase() === "t") answer(true);
      if (event.key.toLowerCase() === "f") answer(false);
      if ((event.key === "Enter" || event.key === " ") && feedback) {
        event.preventDefault();
        nextQuestion(latestProgress.current);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, feedback, nextQuestion, progress]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  const speak = () => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`${spokenExpression(connective, current.a, current.b)} equals what?`));

  if (checkpoint) {
    return (
      <main className="focus-shell" id="main-content">
        <section className="checkpoint" aria-labelledby="checkpoint-title">
          <span className="checkpoint-icon" aria-hidden="true">✓</span>
          <p className="eyebrow">Natural stopping point</p>
          <h1 id="checkpoint-title">You practiced {title}.</h1>
          <p>{sessionCorrect} of {answered} responses were correct. Missed cases will keep receiving extra practice.</p>
          <div className="checkpoint-actions">
            <button className="secondary-button" type="button" onClick={() => { setCheckpoint(false); nextQuestion(progress); }}>Keep practicing</button>
            <button className="primary-button" type="button" onClick={onComplete}>Back to menu <ArrowRight aria-hidden="true" /></button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="focus-shell" id="main-content">
      <div className="practice-topline">
        <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button>
        <span aria-live="polite">{answered} answered</span>
      </div>
      <section className="practice" aria-labelledby="practice-title">
        <p className="eyebrow">{title}</p>
        <h1 id="practice-title" className="sr-only">Evaluate the truth value</h1>
        <div className="problem-line">
          <span className="problem-expression" aria-label={spokenExpression(connective, current.a, current.b)}>{expression}</span>
          <span aria-hidden="true">= ?</span>
          <button className="listen-button" type="button" onClick={speak} aria-label="Read problem aloud" title="Read problem aloud">
            <Volume2 aria-hidden="true" />
          </button>
        </div>

        <div className="answer-buttons" aria-label="Choose the truth value">
          <button type="button" onClick={() => answer(true)} disabled={Boolean(feedback)}>
            <span>{truthLabel(true, useWords)}</span><kbd>T</kbd>
          </button>
          <button type="button" onClick={() => answer(false)} disabled={Boolean(feedback)}>
            <span>{truthLabel(false, useWords)}</span><kbd>F</kbd>
          </button>
        </div>

        <div className={`feedback-region ${feedback ? "visible" : ""}`} aria-live="assertive" aria-atomic="true">
          {feedback && (
            <>
              <p className={feedback.correct ? "feedback-correct" : "feedback-incorrect"}>
                <span aria-hidden="true">{feedback.correct ? "✓" : "×"}</span> {feedback.correct ? "Correct" : "Not quite"}
              </p>
              <p className="feedback-equation">{expression} = {truthLabel(feedback.expected, useWords)}</p>
              {!feedback.correct && <p className="feedback-rule">{connective.rule}</p>}
              {(!progress.settings.autoAdvance || !feedback.correct) && (
                <button className="next-button" type="button" onClick={() => nextQuestion(latestProgress.current)}>
                  Next case <ArrowRight aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
