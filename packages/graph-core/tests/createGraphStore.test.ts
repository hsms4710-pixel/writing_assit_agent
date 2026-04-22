import { describe, expect, it } from "vitest";
import { createGraphStore } from "../src";

describe("createGraphStore", () => {
  it("creates an empty graph and scene state", () => {
    const store = createGraphStore();

    expect(store.getState().graph.nodes).toEqual({});
    expect(store.getState().graph.edges).toEqual({});
    expect(store.getState().scene.activeSceneId).toBe("default");
  });
});
