import type { GraphStoreState } from "@graph/core";

export function projectScene(state: GraphStoreState) {
  const placements = state.scene.scenes[state.scene.activeSceneId].nodePlacements;

  return Object.values(state.graph.nodes).map((node) => ({
    node,
    placement: placements[node.id] ?? { x: 0, y: 0 }
  }));
}
