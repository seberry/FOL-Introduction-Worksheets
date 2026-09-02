import { ArrowLeft } from "lucide-react";
import { CONNECTIVES, caseCode, getCases, type ConnectiveId } from "../domain/connectives";
import { groupMastery, masteryLabel, type ProgressState } from "../domain/progress";

interface ProgressScreenProps { progress: ProgressState; onBack: () => void }

export function ProgressScreen({ progress, onBack }: ProgressScreenProps) {
  const statusClass = (status: string) => `mastery-${status.toLowerCase().replace(" ", "-")}`;

  return (
    <main className="wide-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Home</button>
      <section className="page-heading">
        <h1>Progress</h1>
      </section>
      <div className="progress-groups">
        {(["not", "and", "or", "iff", "conditional"] as ConnectiveId[]).map((id) => {
          const connective = CONNECTIVES[id];
          const cases = getCases(connective);
          const status = groupMastery(progress, `eval:${id}:`);
          const comfortableCases = cases.filter(({ a, b }) => progress.skills[`eval:${id}:${caseCode(a, b)}`]?.mastery >= 0.5).length;
          return (
            <details className="progress-group" key={id}>
              <summary>
                <span className="progress-group-symbol" aria-label={connective.spokenName}>{connective.primarySymbol}</span>
                <span><strong>{connective.shortName}</strong><small>{connective.technicalName}</small></span>
                <span className="mastery-overview">
                  <span className="case-progress-copy">{comfortableCases} of {cases.length} cases comfortable</span>
                  <progress className={statusClass(status)} value={comfortableCases} max={cases.length} aria-label={`${connective.shortName}: ${comfortableCases} of ${cases.length} cases comfortable`} />
                </span>
                <span className={`mastery-badge ${statusClass(status)}`}>{status}</span>
              </summary>
              <div className="case-list">
                {cases.map(({ a, b }) => {
                  const code = caseCode(a, b);
                  const stats = progress.skills[`eval:${id}:${code}`];
                  const caseStatus = masteryLabel(stats);
                  return (
                    <div className="case-row" key={code}>
                      <span aria-label={connective.arity === 1 ? `${connective.spokenName} ${code}` : `${code[0]} ${connective.spokenName} ${code[1]}`}>
                        {connective.arity === 1 ? `${connective.primarySymbol}${code}` : `${code[0]} ${connective.primarySymbol} ${code[1]}`}
                      </span>
                      <span className={`case-mastery-label ${statusClass(caseStatus)}`}>{caseStatus}</span>
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
