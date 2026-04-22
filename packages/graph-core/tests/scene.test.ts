import { describe, expect, it } from "vitest";
import { buildDropCandidateActions, createGraphStore, type GraphSchema } from "../src";

const schema: GraphSchema = {
  nodeTypes: {
    person: {
      label: "Person",
      style: { shape: "card" },
      fields: { name: { kind: "string", required: true } }
    },
    organization: {
      label: "Organization",
      style: { shape: "zone" },
      fields: { name: { kind: "string", required: true } }
    }
  },
  edgeTypes: {
    membership: {
      label: "Membership",
      class: "structure",
      directed: true,
      sourceTypes: ["person"],
      targetTypes: ["organization"]
    }
  }
};

describe("scene separation", () => {
  it("keeps layout changes separate from structural edges", () => {
    const store = createGraphStore({ schema });
    store.dispatch({ type: "graph.addNode", node: { id: "person:1", type: "person", fields: { name: "Ada" } } });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });

    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 240, y: 180 });

    expect(store.getState().scene.scenes.default.nodePlacements["person:1"]).toEqual({ x: 240, y: 180 });
    expect(Object.keys(store.getState().graph.edges)).toHaveLength(0);
  });

  it("offers explicit candidate actions when dropping into a compatible container", () => {
    const store = createGraphStore({ schema });
    store.dispatch({ type: "graph.addNode", node: { id: "person:1", type: "person", fields: { name: "Ada" } } });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });

    const actions = buildDropCandidateActions(store.getState(), {
      nodeId: "person:1",
      containerId: "organization:1",
      sceneId: "default"
    });

    expect(actions.map((action) => action.kind)).toEqual([
      "create-structure-edge",
      "set-primary-structure-edge",
      "keep-layout-only"
    ]);
  });
});
