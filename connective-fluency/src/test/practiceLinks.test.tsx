import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(() => window.history.replaceState({}, "", "/"));

describe("focused practice links", () => {
  it.each([
    ["conditional", "IF…THEN", "if then"],
    ["iff", "IFF", "if and only if"],
  ])("opens %s practice and preserves unlocked home navigation", async (id, title, spoken) => {
    window.history.replaceState({}, "", `/?instructor=1&practice=${id}`);
    render(<App />);
    expect(screen.getByText(title, { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: new RegExp(spoken) })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^TRUE/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(screen.getByRole("button", { name: /6\. IF…THEN/ })).toBeEnabled();
  });

  it("opens the normal home screen for an unknown practice value", () => {
    window.history.replaceState({}, "", "/?practice=unknown");
    render(<App />);
    expect(screen.getByRole("button", { name: /6\. IF…THEN/ })).toBeDisabled();
  });
});
