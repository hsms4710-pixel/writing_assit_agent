import type { GraphTemplate } from "@graph/core";

export const mediumGraphFixture: GraphTemplate = {
  id: "medium-graph",
  label: "Medium Graph",
  nodes: Array.from({ length: 400 }, (_, index) => ({
    id: `person:${index}`,
    type: "person",
    fields: { name: `Person ${index}` }
  })),
  edges: [],
  placements: Object.fromEntries(
    Array.from({ length: 400 }, (_, index) => [
      `person:${index}`,
      { x: (index % 20) * 90, y: Math.floor(index / 20) * 70 }
    ])
  )
};
