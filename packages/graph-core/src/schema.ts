import type { GraphEdge, GraphNode, GraphSchema, GraphValue } from "./types";

function matchesKind(value: GraphValue, kind: "string" | "number" | "boolean" | "string[]") {
  if (kind === "string[]") {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
  }

  return typeof value === kind;
}

export function createSchemaValidator(schema: GraphSchema) {
  return {
    validateNode(node: GraphNode) {
      const nodeType = schema.nodeTypes[node.type];

      if (!nodeType) {
        throw new Error(`Unknown node type "${node.type}"`);
      }

      for (const [fieldName, definition] of Object.entries(nodeType.fields)) {
        const value = node.fields[fieldName];

        if (definition.required && value === undefined) {
          throw new Error(`Field "${fieldName}" is required for node type "${node.type}"`);
        }

        if (value !== undefined && !matchesKind(value, definition.kind)) {
          throw new Error(`Field "${fieldName}" must match kind "${definition.kind}"`);
        }
      }

      for (const [fieldName, value] of Object.entries(node.extensions ?? {})) {
        const slotDefinition = nodeType.customFieldSlots?.[fieldName];

        if (!slotDefinition) {
          throw new Error(`Extension field "${fieldName}" is not allowed for node type "${node.type}"`);
        }

        if (!matchesKind(value, slotDefinition.kind)) {
          throw new Error(`Extension field "${fieldName}" must match kind "${slotDefinition.kind}"`);
        }
      }
    },

    validateEdge(edge: GraphEdge, nodes: Record<string, GraphNode>) {
      const edgeType = schema.edgeTypes[edge.type];
      const sourceNode = nodes[edge.source];
      const targetNode = nodes[edge.target];

      if (!edgeType) {
        throw new Error(`Unknown edge type "${edge.type}"`);
      }

      if (!sourceNode || !targetNode) {
        throw new Error(`Edge "${edge.id}" references missing nodes`);
      }

      if (!edgeType.sourceTypes.includes(sourceNode.type) || !edgeType.targetTypes.includes(targetNode.type)) {
        throw new Error(`Edge type "${edge.type}" does not allow ${sourceNode.type} -> ${targetNode.type}`);
      }
    }
  };
}
