import type { GraphTemplate } from "@graph/core";

export const demoTemplate: GraphTemplate = {
  id: "demo-template",
  label: "Writing starter",
  nodes: [
    { id: "world:1", type: "world", fields: { name: "World" } },
    { id: "organization:1", type: "organization", fields: { name: "Starter Guild" } }
  ],
  edges: [],
  placements: {
    "world:1": { x: 40, y: 40 },
    "organization:1": { x: 180, y: 140 }
  }
};
