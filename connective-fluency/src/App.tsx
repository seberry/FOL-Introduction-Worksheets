import { useState } from "react";
import { AlternateScreen } from "./components/AlternateScreen";
import { BrandHeader } from "./components/BrandHeader";
import { HomeScreen } from "./components/HomeScreen";
import { InstructorScreen } from "./components/InstructorScreen";
import { LessonScreen } from "./components/LessonScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { RecognitionScreen } from "./components/RecognitionScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { TableScreen } from "./components/TableScreen";
import type { ConnectiveId } from "./domain/connectives";
import { resetProgress, type ProgressState } from "./domain/progress";
import { type StageDefinition } from "./domain/stages";
import { useProgress } from "./hooks/useProgress";

type Screen =
  | { type: "home" }
  | { type: "progress" }
  | { type: "settings" }
  | { type: "instructor" }
  | { type: "stage"; stage: StageDefinition; lesson: boolean }
  | { type: "focused"; id: ConnectiveId; notation: "primary" | "alternate" };

function addUnique<T>(values: T[], value: T): T[] {
  return values.includes(value) ? values : [...values, value];
}

export default function App() {
  const [progress, setProgress] = useProgress();
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const [unlockAll, setUnlockAll] = useState(() => new URLSearchParams(window.location.search).get("instructor") === "1");

  const home = () => setScreen({ type: "home" });
  const selectStage = (stage: StageDefinition) => {
    setScreen({ type: "stage", stage, lesson: stage.kind === "connective" });
  };
  const completeStage = (stage: StageDefinition) => {
    setProgress((current: ProgressState) => ({
      ...current,
      completedStages: addUnique(current.completedStages, stage.id),
      learnedConnectives: stage.kind === "connective"
        ? addUnique(current.learnedConnectives, stage.connectiveIds[0])
        : current.learnedConnectives,
      alternateIntroduced: stage.kind === "alternate"
        ? stage.connectiveIds.reduce((values, id) => addUnique(values, id), current.alternateIntroduced)
        : current.alternateIntroduced,
    }));
    home();
  };

  const content = (() => {
    if (screen.type === "home") return <HomeScreen progress={progress} unlockAll={unlockAll} onSelect={selectStage} />;
    if (screen.type === "progress") return <ProgressScreen progress={progress} onBack={home} />;
    if (screen.type === "settings") return (
      <SettingsScreen
        progress={progress}
        setProgress={setProgress}
        onBack={home}
        onReset={() => { setProgress(resetProgress()); home(); }}
        onInstructor={() => setScreen({ type: "instructor" })}
      />
    );
    if (screen.type === "instructor") return (
      <InstructorScreen
        progress={progress}
        unlockAll={unlockAll}
        onUnlockAll={setUnlockAll}
        onBack={() => setScreen({ type: "settings" })}
        onPractice={(id, notation) => setScreen({ type: "focused", id, notation })}
      />
    );
    if (screen.type === "focused") return (
      <PracticeScreen
        title={CONNECTIVE_TITLE[screen.id]}
        connectiveIds={[screen.id]}
        notation={screen.notation}
        stageId="instructor"
        progress={progress}
        setProgress={setProgress}
        onBack={() => setScreen({ type: "instructor" })}
        onComplete={() => setScreen({ type: "instructor" })}
      />
    );

    const { stage } = screen;
    if (stage.kind === "recognition") return <RecognitionScreen connectiveIds={stage.connectiveIds} progress={progress} setProgress={setProgress} onBack={home} onComplete={() => completeStage(stage)} />;
    if (stage.kind === "connective" && screen.lesson) return <LessonScreen connectiveId={stage.connectiveIds[0]} onBack={home} onStart={() => setScreen({ ...screen, lesson: false })} />;
    if (stage.kind === "tables") return <TableScreen connectiveIds={stage.connectiveIds} progress={progress} setProgress={setProgress} onBack={home} onComplete={() => completeStage(stage)} />;
    if (stage.kind === "alternate") return <AlternateScreen connectiveIds={stage.connectiveIds} progress={progress} setProgress={setProgress} onBack={home} onComplete={() => completeStage(stage)} />;
    return (
      <PracticeScreen
        title={stage.title}
        connectiveIds={stage.connectiveIds}
        notation={stage.kind === "review" ? "mixed" : "primary"}
        stageId={stage.id}
        progress={progress}
        setProgress={setProgress}
        onBack={home}
        onComplete={() => completeStage(stage)}
      />
    );
  })();

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <BrandHeader onHome={home} onProgress={() => setScreen({ type: "progress" })} onSettings={() => setScreen({ type: "settings" })} />
      {content}
      <footer><span>Connective Fluency</span><span>Introductory propositional logic</span></footer>
    </div>
  );
}

const CONNECTIVE_TITLE: Record<ConnectiveId, string> = {
  not: "NOT",
  and: "AND",
  or: "OR",
  iff: "IFF",
  conditional: "IF…THEN",
};
