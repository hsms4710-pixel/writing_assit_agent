import type { GraphStoreSnapshot, GraphStoreState } from "./types";

export function takeSnapshot(state: GraphStoreState): GraphStoreSnapshot {
  return {
    schema: state.schema,
    graph: state.graph,
    scene: state.scene
  };
}

export function pushHistory(state: GraphStoreState) {
  return {
    past: [...state.history.past, takeSnapshot(state)],
    future: []
  };
}
