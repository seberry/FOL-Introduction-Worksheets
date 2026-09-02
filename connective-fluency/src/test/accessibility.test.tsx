import { render } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("home accessibility", () => {
  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<App />);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
