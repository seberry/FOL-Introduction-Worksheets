import { describe, expect, it } from "vitest";
import { STAGES } from "../domain/stages";

describe("learning-path copy", () => {
  it("uses consistent practice descriptions and separate connective hints", () => {
    expect(STAGES.find((stage) => stage.id === "or")?.hint).toBe("This class uses inclusive OR: it is false only when both sides are false.");
    expect(STAGES.find((stage) => stage.id === "iff")).toMatchObject({ description: "Practice IFF.", hint: "Look for matching truth values." });
    expect(STAGES.find((stage) => stage.id === "conditional")).toMatchObject({ description: "Practice the material conditional.", hint: "There is only one false case." });
  });

  it("describes the culminating activities directly", () => {
    expect(STAGES.find((stage) => stage.id === "mixed")?.description).toBe("Practice all five connectives at once.");
    expect(STAGES.find((stage) => stage.id === "tables")?.title).toBe("Complete truth tables");
    expect(STAGES.find((stage) => stage.id === "review")?.title).toBe("Final review");
  });
});
