import { describe, expect, it } from "vitest";
import {
  createGraphStore,
  createMemoryStorageAdapter,
  createRecordingSyncAdapter,
  flushPendingCommands,
  loadSnapshot,
  saveSnapshot
} from "../src";

describe("persistence and sync", () => {
  it("persists graph and scene state together", async () => {
    const storage = createMemoryStorageAdapter();
    const store = createGraphStore();

    store.dispatch({
      type: "graph.addNode",
      node: { id: "person:1", type: "person", fields: { name: "Ada" } }
    });
    store.dispatch({ type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 120, y: 90 });

    await saveSnapshot(storage, "demo-graph", store.getState());
    const restored = await loadSnapshot(storage, "demo-graph");

    expect(restored?.scene.scenes.default.nodePlacements["person:1"]).toEqual({ x: 120, y: 90 });
  });

  it("keeps pending commands when remote sync fails", async () => {
    const sync = createRecordingSyncAdapter({ shouldFail: true });
    const result = await flushPendingCommands(sync, "demo-graph", [
      { type: "scene.moveNode", sceneId: "default", nodeId: "person:1", x: 120, y: 90 }
    ]);

    expect(result.acknowledged).toBe(0);
    expect(result.status).toBe("failed");
  });
});
