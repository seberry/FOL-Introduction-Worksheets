import { useEffect, useState } from "react";
import { loadProgress, saveProgress, type ProgressState } from "../domain/progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  return [progress, setProgress] as const;
}
