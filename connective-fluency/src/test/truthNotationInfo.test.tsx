import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import { TruthNotationInfo } from "../components/TruthNotationInfo";

describe("truth-value notation help", () => {
  it("opens on request, closes with Escape, and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    render(<TruthNotationInfo />);

    const trigger = screen.getByRole("button", { name: "About T and F" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "About T and F" })).toHaveTextContent("T and F stand for the truth values true and false");
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("has no automatically detectable accessibility violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(<TruthNotationInfo />);
    await user.click(screen.getByRole("button", { name: "About T and F" }));
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
