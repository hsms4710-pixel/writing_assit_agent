import type { DropCandidateAction, GraphStoreState } from "./types";

export function buildDropCandidateActions(
  state: GraphStoreState,
  input: { nodeId: string; containerId: string; sceneId: string }
): DropCandidateAction[] {
  const node = state.graph.nodes[input.nodeId];
  const container = state.graph.nodes[input.containerId];

  const matchingStructureEdgeType = Object.entries(state.schema?.edgeTypes ?? {}).find(([, definition]) => {
    return (
      definition.class === "structure" &&
      definition.sourceTypes.includes(node.type) &&
      definition.targetTypes.includes(container.type)
    );
  });

  if (!matchingStructureEdgeType) {
    return [{ kind: "keep-layout-only", nodeId: input.nodeId, containerId: input.containerId }];
  }

  const [edgeType] = matchingStructureEdgeType;

  return [
    { kind: "create-structure-edge", nodeId: input.nodeId, containerId: input.containerId, edgeType },
    { kind: "set-primary-structure-edge", nodeId: input.nodeId, containerId: input.containerId, edgeType },
    { kind: "keep-layout-only", nodeId: input.nodeId, containerId: input.containerId }
  ];
}
