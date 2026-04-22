import type { GraphSchema } from "@graph/core";

export const demoSchema: GraphSchema = {
  nodeTypes: {
    world: {
      label: "World",
      style: { shape: "plane" },
      fields: { name: { kind: "string", required: true } }
    },
    organization: {
      label: "Organization",
      style: { shape: "zone" },
      fields: { name: { kind: "string", required: true } }
    },
    person: {
      label: "Person",
      style: { shape: "card" },
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
