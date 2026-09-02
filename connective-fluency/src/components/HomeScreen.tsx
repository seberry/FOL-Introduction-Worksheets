import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { CONNECTIVES } from "../domain/connectives";
import { groupMastery, type ProgressState } from "../domain/progress";
import { STAGES, stageUnlocked, type StageDefinition } from "../domain/stages";

interface HomeScreenProps {
  progress: ProgressState;
  unlockAll: boolean;
  onSelect: (stage: StageDefinition) => void;
}

export function HomeScreen({ progress, unlockAll, onSelect }: HomeScreenProps) {
  const nextStage = STAGES.find((stage) => stageUnlocked(stage, progress, unlockAll) && !progress.completedStages.includes(stage.id)) ?? STAGES[STAGES.length - 1];

  return (
    <main className="home-shell" id="main-content">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">Characteristic truth functions</p>
        <h1 id="home-title">Practice one case at a time.</h1>
        <p>Build reliable recall without racing a clock or holding a whole truth table in mind.</p>
        <p>Build comfort with every case in a level to unlock the next.</p>
        <button className="primary-button continue-button" type="button" onClick={() => onSelect(nextStage)}>
          {progress.completedStages.length ? "Continue learning" : "Start with symbols"}
          <ArrowRight aria-hidden="true" />
        </button>
      </section>

      <section className="progress-strip" aria-labelledby="at-glance-title">
        <div>
          <p className="section-kicker">At a glance</p>
          <h2 id="at-glance-title">Your connectives</h2>
        </div>
        <div className="mastery-summary">
          {(["and", "or", "not", "iff", "conditional"] as const).map((id) => (
            <div className="mastery-summary-item" key={id}>
              <span className="summary-symbol" aria-label={CONNECTIVES[id].spokenName}>{CONNECTIVES[id].primarySymbol}</span>
              <span>
                <strong>{CONNECTIVES[id].shortName}</strong>
                <small>{groupMastery(progress, `eval:${id}:`)}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="stage-section" aria-labelledby="path-title">
        <p className="section-kicker">Learning path</p>
        <h2 id="path-title">Small steps, in order</h2>
        <ol className="stage-list">
          {STAGES.map((stage, index) => {
            const unlocked = stageUnlocked(stage, progress, unlockAll);
            const completed = progress.completedStages.includes(stage.id);
            return (
              <li key={stage.id}>
                <button
                  className="stage-row"
                  type="button"
                  onClick={() => onSelect(stage)}
                  disabled={!unlocked}
                  aria-label={`${index + 1}. ${stage.title}${completed ? ", complete" : unlocked ? "" : ", locked"}`}
                >
                  <span className={`stage-number ${completed ? "complete" : ""}`} aria-hidden="true">
                    {completed ? <Check /> : unlocked ? index + 1 : <LockKeyhole />}
                  </span>
                  <span className="stage-copy">
                    <strong>{stage.title}</strong>
                    <span>{stage.description}</span>
                  </span>
                  {unlocked && <ArrowRight className="stage-arrow" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
