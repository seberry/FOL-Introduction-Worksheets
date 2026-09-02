import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PracticeScreen } from "../components/PracticeScreen";
import { DEFAULT_PROGRESS, type ProgressState } from "../domain/progress";

describe("keyboard answering", () => {
  it("accepts T and F shortcuts", async () => {
    const user = userEvent.setup();
    let progress = structuredClone(DEFAULT_PROGRESS);
    const setProgress: React.Dispatch<React.SetStateAction<ProgressState>> = (update) => {
      progress = typeof update === "function" ? update(progress) : update;
    };
    render(
      <PracticeScreen
        title="NOT"
        connectiveIds={["not"]}
        notation="primary"
        stageId="not"
        progress={progress}
        setProgress={setProgress}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    );
    await user.keyboard("{f}");
    expect(await screen.findByText("Correct")).toBeInTheDocument();
    expect(progress.recentAnswers[0]).toMatchObject({ key: "eval:not:T", correct: true });
  });
});
