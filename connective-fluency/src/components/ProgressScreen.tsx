import { ArrowLeft } from "lucide-react";
import { CONNECTIVES, caseCode, getCases, type ConnectiveId } from "../domain/connectives";
import { groupMastery, masteryLabel, type ProgressState } from "../domain/progress";

interface ProgressScreenProps { progress: ProgressState; onBack: () => void }

export function ProgressScreen({ progress, onBack }: ProgressScreenProps) {
  return (
    <main className="wide-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Home</button>
      <section className="page-heading">
        <p className="eyebrow">Progress</p>
        <h1>What feels familiar?</h1>
        <p>Each case is tracked separately. A difficult case can receive more practice without erasing what you know.</p>
      </section>
      <div className="progress-groups">
        {(["not", "and", "or", "iff", "conditional"] as ConnectiveId[]).map((id) => {
          const connective = CONNECTIVES[id];
          return (
            <details className="progress-group" key={id}>
              <summary>
                <span className="progress-group-symbol" aria-label={connective.spokenName}>{connective.primarySymbol}</span>
                <span><strong>{connective.shortName}</strong><small>{connective.technicalName}</small></span>
                <span className="mastery-badge">{groupMastery(progress, `eval:${id}:`)}</span>
              </summary>
              <div className="case-list">
                {getCases(connective).map(({ a, b }) => {
                  const code = caseCode(a, b);
                  const stats = progress.skills[`eval:${id}:${code}`];
                  return (
                    <div className="case-row" key={code}>
                      <span aria-label={connective.arity === 1 ? `${connective.spokenName} ${code}` : `${code[0]} ${connective.spokenName} ${code[1]}`}>
                        {connective.arity === 1 ? `${connective.primarySymbol}${code}` : `${code[0]} ${connective.primarySymbol} ${code[1]}`}
                      </span>
                      <span>{masteryLabel(stats)}</span>
                      <small>{stats ? `${stats.correct} of ${stats.attempts} correct` : "No attempts yet"}</small>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}
