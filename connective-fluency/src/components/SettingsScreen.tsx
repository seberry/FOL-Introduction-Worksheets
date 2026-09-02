import { useState } from "react";
import { ArrowLeft, RotateCcw, Wrench } from "lucide-react";
import type { ProgressState } from "../domain/progress";

interface SettingsScreenProps {
  progress: ProgressState;
  setProgress: React.Dispatch<React.SetStateAction<ProgressState>>;
  onBack: () => void;
  onReset: () => void;
  onInstructor: () => void;
}

export function SettingsScreen({ progress, setProgress, onBack, onReset, onInstructor }: SettingsScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const updateSetting = <K extends keyof ProgressState["settings"]>(key: K, value: ProgressState["settings"][K]) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  return (
    <main className="wide-shell" id="main-content">
      <button className="back-button" type="button" onClick={onBack}><ArrowLeft aria-hidden="true" /> Home</button>
      <section className="page-heading">
        <p className="eyebrow">Preferences</p>
        <h1>Settings</h1>
      </section>
      <section className="settings-list" aria-label="Practice settings">
        <div className="setting-row">
          <div><h2>Practice presentation</h2><p>Truth-table reconstruction always uses conventional T/F cells.</p></div>
          <div className="segmented-control presentation-control" aria-label="Practice presentation">
            <button type="button" aria-pressed={progress.settings.practicePresentation === "guided"} onClick={() => updateSetting("practicePresentation", "guided")}>Guided <span className="recommended-label">Recommended</span><span className="setting-choice-description">Start with full truth assignments, then introduce shorthand.</span></button>
            <button type="button" aria-pressed={progress.settings.practicePresentation === "expanded"} onClick={() => updateSetting("practicePresentation", "expanded")}>Expanded <span className="setting-choice-description">Always show the sentence and its assigned truth value.</span></button>
            <button type="button" aria-pressed={progress.settings.practicePresentation === "compact"} onClick={() => updateSetting("practicePresentation", "compact")}>Compact <span className="setting-choice-description">Use T/F shorthand for faster practice.</span></button>
          </div>
        </div>
        <div className="setting-row">
          <div><h2>Advance after correct answers</h2><p>Turn this off to continue each case manually.</p></div>
          <label className="switch">
            <input type="checkbox" checked={progress.settings.autoAdvance} onChange={(event) => updateSetting("autoAdvance", event.target.checked)} />
            <span aria-hidden="true" />
            <span className="sr-only">Advance automatically</span>
          </label>
        </div>
        <div className="setting-row">
          <div><h2>Instructor tools</h2><p>Open stages directly and inspect locally stored answers.</p></div>
          <button className="secondary-icon-button" type="button" onClick={onInstructor}><Wrench aria-hidden="true" /> Open tools</button>
        </div>
      </section>
      <section className="reset-section">
        <h2>Reset progress</h2>
        <p>This removes mastery and answer history from this browser. Settings return to their defaults.</p>
        {!confirmReset ? (
          <button className="danger-button" type="button" onClick={() => setConfirmReset(true)}><RotateCcw aria-hidden="true" /> Reset progress</button>
        ) : (
          <div className="confirm-reset" role="group" aria-label="Confirm reset progress">
            <p><strong>Remove all saved progress?</strong></p>
            <button className="danger-button" type="button" onClick={onReset}>Yes, reset everything</button>
            <button className="secondary-button" type="button" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        )}
      </section>
    </main>
  );
}
