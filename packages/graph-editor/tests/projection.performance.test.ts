import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { projectScene } from "../src/projection";

describe("projectScene performance", () => {
  it("projects 1000 nodes without dropping placements", () => {
    const store = createGraphStore();

    for (let index = 0; index < 1000; index += 1) {
      const id = `person:${index}`;
      store.dispatch({ type: "graph.addNode", node: { id, type: "person", fields: { name: id } } });
      store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: id, x: index, y: index });
    }

    const projected = projectScene(store.getState());

    expect(projected).toHaveLength(1000);
    expect(projected[999].placement).toEqual({ x: 999, y: 999 });
  });
});
