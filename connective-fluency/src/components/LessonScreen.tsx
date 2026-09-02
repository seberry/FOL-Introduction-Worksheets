import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { CONNECTIVES, type ConnectiveId } from "../domain/connectives";

interface LessonScreenProps {
  connectiveId: ConnectiveId;
  onStart: () => void;
  onBack: () => void;
}

export function LessonScreen({ connectiveId, onStart, onBack }: LessonScreenProps) {
  const connective = CONNECTIVES[connectiveId];
  const example = connective.arity === 1 ? `${connective.primarySymbol}P` : `P ${connective.primarySymbol} Q`;
  const speak = () => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`${connective.shortName}. ${connective.rule}`));

  return (
    <main className="focus-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Learning path</button>
      <section className="lesson" aria-labelledby="lesson-title">
        <p className="eyebrow">New connective</p>
        <h1 id="lesson-title">{connective.shortName}</h1>
        <div className="lesson-expression" aria-label={`${connective.arity === 1 ? "not P" : `P ${connective.spokenName} Q`}`}>{example}</div>
        <p className="lesson-rule">{connective.rule}</p>
        {connective.expandedRule && <p className="lesson-detail">{connective.expandedRule}</p>}
        <p className="technical-name">Technical name: <strong>{connective.technicalName}</strong></p>
        <div className="lesson-actions">
          <button className="secondary-icon-button" type="button" onClick={speak} aria-label="Read rule aloud">
            <Volume2 aria-hidden="true" /> Listen
          </button>
          <button className="primary-button" type="button" onClick={onStart}>
            Start practice <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
