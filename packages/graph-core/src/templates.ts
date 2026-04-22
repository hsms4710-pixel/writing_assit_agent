import type { GraphCommand, GraphEdge, GraphNode } from "./types";

export type GraphTemplate = {
  id: string;
  label: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  placements: Record<string, { x: number; y: number }>;
};

export function instantiateTemplate(template: GraphTemplate): GraphCommand[] {
  const commands: GraphCommand[] = [];

  for (const node of template.nodes) {
    commands.push({ type: "graph.addNode", node });
  }

  for (const edge of template.edges) {
    commands.push({ type: "graph.addEdge", edge });
  }

  for (const [nodeId, placement] of Object.entries(template.placements)) {
    commands.push({
      type: "scene.moveNode",
      sceneId: "default",
      nodeId,
      x: placement.x,
      y: placement.y
    });
  }

  return commands;
}
