import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createGraphStore } from "@graph/core";
import { GraphProvider } from "@graph/react";
import { SceneCanvas } from "../src";

describe("SceneCanvas", () => {
  it("renders container zones and card nodes from scene placements", () => {
    const store = createGraphStore();

    store.dispatch({
      type: "graph.addNode",
      node: { id: "world:1", type: "world", fields: { name: "World" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "organization:1", x: 100, y: 100 });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 150, y: 160 });

    render(
      <GraphProvider store={store}>
        <SceneCanvas />
      </GraphProvider>
    );

    expect(screen.getByTestId("scene-canvas")).toBeTruthy();
    expect(screen.getByText("Guild")).toBeTruthy();
    expect(screen.getByText("Ada")).toBeTruthy();
  });
});
