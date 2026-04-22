import { describe, expect, it } from "vitest";
import { createGraphStore, type GraphSchema } from "../src";

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

describe("command dispatch", () => {
  it("adds nodes and edges and supports undo/redo", () => {
    const store = createGraphStore({ schema });

    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({
      type: "graph.addNode",
      node: { id: "organization:1", type: "organization", fields: { name: "Guild" } }
    });
    store.dispatch({
      type: "graph.addEdge",
      edge: { id: "edge:1", type: "membership", source: "person:1", target: "organization:1" }
    });

    expect(store.getState().graph.edges["edge:1"]).toBeDefined();

    store.undo();
    expect(store.getState().graph.edges["edge:1"]).toBeUndefined();

    store.redo();
    expect(store.getState().graph.edges["edge:1"]).toBeDefined();
  });
});
