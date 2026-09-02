import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TableScreen } from "../components/TableScreen";
import { DEFAULT_PROGRESS, type ProgressState } from "../domain/progress";

describe("characteristic-table presentation", () => {
  it("keeps conventional T/F cells regardless of the practice preference", () => {
    const progress: ProgressState = { ...structuredClone(DEFAULT_PROGRESS), settings: { practicePresentation: "expanded", autoAdvance: true } };
    render(<TableScreen connectiveIds={["and"]} progress={progress} setProgress={vi.fn()} onBack={vi.fn()} onComplete={vi.fn()} />);
    expect(screen.getAllByText("T").length).toBeGreaterThan(0);
    expect(screen.queryByText("TRUE")).not.toBeInTheDocument();
  });
});
