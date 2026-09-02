import { ArrowLeft, ExternalLink } from "lucide-react";
import { CONNECTIVES, type ConnectiveId } from "../domain/connectives";
import type { ProgressState } from "../domain/progress";

interface InstructorScreenProps {
  progress: ProgressState;
  unlockAll: boolean;
  onUnlockAll: (value: boolean) => void;
  onPractice: (id: ConnectiveId, notation: "primary" | "alternate") => void;
  onBack: () => void;
}

export function InstructorScreen({ progress, unlockAll, onUnlockAll, onPractice, onBack }: InstructorScreenProps) {
  return (
    <main className="wide-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Settings</button>
      <section className="page-heading">
        <p className="eyebrow">Local utility</p>
        <h1>Instructor tools</h1>
        <p>These controls affect only this browser.</p>
      </section>
      <section className="instructor-section">
        <label className="checkbox-row">
          <input type="checkbox" checked={unlockAll} onChange={(event) => onUnlockAll(event.target.checked)} />
          <span><strong>Unlock all stages</strong><small>Useful for testing the full learning path.</small></span>
        </label>
        <h2>Open focused practice</h2>
        <div className="instructor-grid">
          {(Object.keys(CONNECTIVES) as ConnectiveId[]).map((id) => (
            <div className="instructor-connective" key={id}>
              <span aria-label={CONNECTIVES[id].spokenName}>{CONNECTIVES[id].primarySymbol}</span>
              <strong>{CONNECTIVES[id].shortName}</strong>
              <button type="button" onClick={() => onPractice(id, "primary")}>Primary <ExternalLink aria-hidden="true" /></button>
              <button type="button" onClick={() => onPractice(id, "alternate")}>Alternate <ExternalLink aria-hidden="true" /></button>
            </div>
          ))}
        </div>
      </section>
      <section className="instructor-section">
        <h2>Recent responses</h2>
        {progress.recentAnswers.length ? (
          <div className="recent-table-wrap">
            <table className="recent-table">
              <thead><tr><th scope="col">Skill</th><th scope="col">Result</th><th scope="col">Time</th></tr></thead>
              <tbody>
                {progress.recentAnswers.slice(0, 20).map((answer, index) => (
                  <tr key={`${answer.answeredAt}-${index}`}>
                    <td>{answer.key}</td>
                    <td>{answer.correct ? "Correct" : "Incorrect"}</td>
                    <td>{(answer.latencyMs / 1000).toFixed(1)} s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No responses stored yet.</p>}
      </section>
    </main>
  );
}
