import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { CONNECTIVES, spokenExpression, type ConnectiveId } from "../domain/connectives";
import { CompactCasePrompt, CompactNotationLesson, ExpandedCasePrompt } from "./CasePrompts";
import { FormulaExpression, TruthValueToken } from "./LogicExpression";
import { TruthNotationInfo } from "./TruthNotationInfo";
import { recordAnswer, type ProgressState } from "../domain/progress";
import { compactTransitionDue, practicePresentation } from "../domain/presentation";
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

export function PracticeScreen({ title, connectiveIds, notation, progress, setProgress, onBack, onComplete }: PracticeScreenProps) {
  const items = useMemo(() => createItems(connectiveIds), [connectiveIds]);
  const [current, setCurrent] = useState(() => choosePracticeItem(items, progress));
  const [feedback, setFeedback] = useState<{ correct: boolean; expected: boolean } | null>(null);
  const [answered, setAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [retryQueue, setRetryQueue] = useState<RetryItem[]>([]);
  const [checkpoint, setCheckpoint] = useState(false);
  const [showTransition, setShowTransition] = useState(() => connectiveIds.length === 1 && compactTransitionDue(progress, connectiveIds[0]));
  const startedAt = useRef(performance.now());
  const advanceTimer = useRef<number | undefined>(undefined);
  const latestProgress = useRef(progress);

  const connective = CONNECTIVES[current.connectiveId];
  const symbol = notation === "alternate"
    ? connective.alternateSymbols[0]
    : notation === "mixed" && answered % 3 === 2 ? connective.alternateSymbols[0] : connective.primarySymbol;
  const presentation = practicePresentation(progress, connectiveIds);
  const expected = connective.evaluate(current.a, current.b);

  const nextQuestion = useCallback((nextProgress: ProgressState) => {
    if (connectiveIds.length === 1 && compactTransitionDue(nextProgress, connectiveIds[0])) {
      setFeedback(null);
      setShowTransition(true);
      return;
    }
    const nextAnswered = answered + 1;
    const dueIndex = retryQueue.findIndex((retry) => retry.dueAt <= nextAnswered && !recentKeys.slice(-1).includes(retry.item.key));
    const next = dueIndex >= 0 ? retryQueue[dueIndex].item : choosePracticeItem(items, nextProgress, [...recentKeys, current.key]);
    if (dueIndex >= 0) setRetryQueue((queue) => queue.filter((_, index) => index !== dueIndex));
    setRecentKeys((keys) => [...keys, current.key].slice(-4));
    setCurrent(next);
    setFeedback(null);
    startedAt.current = performance.now();
  }, [answered, connectiveIds, current.key, items, recentKeys, retryQueue]);

  const answer = useCallback((value: boolean) => {
    if (feedback || checkpoint || showTransition) return;
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
      advanceTimer.current = window.setTimeout(() => setCheckpoint(true), 750);
    } else if (correct && progress.settings.autoAdvance) {
      advanceTimer.current = window.setTimeout(() => nextQuestion(nextProgress), 720);
    }
  }, [answered, checkpoint, connectiveIds, current, expected, feedback, nextQuestion, progress, setProgress, showTransition]);

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
  }, [answer, feedback, nextQuestion]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);
  const speak = () => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`${spokenExpression(connective, current.a, current.b)} equals what?`));

  const continueWithCompact = () => {
    const nextProgress = { ...latestProgress.current, compactIntroduced: [...latestProgress.current.compactIntroduced, connective.id] };
    latestProgress.current = nextProgress;
    setProgress(nextProgress);
    setShowTransition(false);
    nextQuestion(nextProgress);
  };

  if (showTransition) return <CompactNotationLesson connective={connective} a={current.a} b={current.b} symbol={symbol} onContinue={continueWithCompact} />;

  if (checkpoint) return (
    <main className="focus-shell" id="main-content"><section className="checkpoint" aria-labelledby="checkpoint-title">
      <span className="checkpoint-icon" aria-hidden="true">✓</span><p className="eyebrow">Natural stopping point</p><h1 id="checkpoint-title">You practiced {title}.</h1>
      <p>{sessionCorrect} of {answered} responses were correct. Missed cases will keep receiving extra practice.</p>
      <div className="checkpoint-actions"><button className="secondary-button" type="button" onClick={() => { setCheckpoint(false); nextQuestion(progress); }}>Keep practicing</button><button className="primary-button" type="button" onClick={onComplete}>Back to menu <ArrowRight aria-hidden="true" /></button></div>
    </section></main>
  );

  const expanded = presentation === "expanded";
  return (
    <main className="focus-shell" id="main-content">
      <div className="practice-topline"><button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Menu</button><span aria-live="polite">{answered} answered</span></div>
      <section className={`practice ${expanded ? "expanded-practice" : ""}`} aria-labelledby="practice-title">
        <p className="eyebrow">{title}</p><h1 id="practice-title" className="sr-only">Evaluate the truth value</h1>
        <div className="problem-line">
          {expanded ? <ExpandedCasePrompt connective={connective} a={current.a} b={current.b} symbol={symbol} /> : <><CompactCasePrompt connective={connective} a={current.a} b={current.b} symbol={symbol} /><span aria-hidden="true">= ?</span><TruthNotationInfo /></>}
          <button className="listen-button" type="button" onClick={speak} aria-label="Read problem aloud" title="Read problem aloud"><Volume2 aria-hidden="true" /></button>
        </div>
        <div className="answer-buttons" aria-label="Choose the truth value">
          <button type="button" onClick={() => answer(true)} disabled={Boolean(feedback)}><TruthValueToken value={true} words /><kbd>T</kbd></button>
          <button type="button" onClick={() => answer(false)} disabled={Boolean(feedback)}><TruthValueToken value={false} words /><kbd>F</kbd></button>
        </div>
        <div className={`feedback-region ${feedback ? "visible" : ""}`} aria-live="assertive" aria-atomic="true">
          {feedback && <>
            <p className={feedback.correct ? "feedback-correct" : "feedback-incorrect"}><span aria-hidden="true">{feedback.correct ? "✓" : "×"}</span> {feedback.correct ? "Correct" : "Not quite"}</p>
            {expanded ? <div className="feedback-expanded"><p><span className="sentence-letter">P</span> is <TruthValueToken value={current.a} words />{connective.arity === 2 && <> and <span className="sentence-letter">Q</span> is <TruthValueToken value={Boolean(current.b)} words /></>}.</p><p><FormulaExpression connective={connective} symbol={symbol} /> is <TruthValueToken value={feedback.expected} words />.</p></div> : <p className="feedback-equation"><CompactCasePrompt connective={connective} a={current.a} b={current.b} symbol={symbol} /> = <TruthValueToken value={feedback.expected} /></p>}
            {!feedback.correct && <p className="feedback-rule">{connective.rule}</p>}
            {(!progress.settings.autoAdvance || !feedback.correct) && <button className="next-button" type="button" onClick={() => nextQuestion(latestProgress.current)}>Next case <ArrowRight aria-hidden="true" /></button>}
          </>}
        </div>
      </section>
    </main>
  );
}
