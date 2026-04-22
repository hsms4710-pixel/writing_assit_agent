export type GraphValue = string | number | boolean | string[];

export type GraphNode = {
  id: string;
  type: string;
  fields: Record<string, GraphValue>;
  extensions?: Record<string, GraphValue>;
};

export type GraphEdge = {
  id: string;
  type: string;
  source: string;
  target: string;
  fields?: Record<string, GraphValue>;
};

export type FieldDefinition = {
  kind: "string" | "number" | "boolean" | "string[]";
  required?: boolean;
};

export type NodeTypeDefinition = {
  label: string;
  style: { shape: "plane" | "zone" | "card" };
  fields: Record<string, FieldDefinition>;
  customFieldSlots?: Record<string, FieldDefinition>;
};

export type EdgeTypeDefinition = {
  label: string;
  class: "structure" | "relation";
  directed: boolean;
  sourceTypes: string[];
  targetTypes: string[];
};

export type GraphSchema = {
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
};

export type GraphCommand =
  | { type: "graph.addNode"; node: GraphNode }
  | { type: "graph.addEdge"; edge: GraphEdge }
  | { type: "graph.updateNodeFields"; nodeId: string; fields: Record<string, GraphValue> }
  | { type: "scene.moveNode"; nodeId: string; sceneId: string; x: number; y: number }
  | { type: "graph.setPrimaryStructureEdge"; nodeId: string; edgeId: string };

export type ScenePlacement = { x: number; y: number };

export type DropCandidateAction =
  | {
      kind: "create-structure-edge";
      nodeId: string;
      containerId: string;
      edgeType: string;
    }
  | {
      kind: "set-primary-structure-edge";
      nodeId: string;
      containerId: string;
      edgeType: string;
    }
  | {
      kind: "keep-layout-only";
      nodeId: string;
      containerId: string;
    };

export type GraphStoreState = {
  schema?: GraphSchema;
  graph: {
    nodes: Record<string, GraphNode>;
    edges: Record<string, GraphEdge>;
    primaryStructureEdgeByNodeId: Record<string, string>;
  };
  scene: {
    activeSceneId: string;
    scenes: Record<string, { nodePlacements: Record<string, ScenePlacement> }>;
  };
  history: {
    past: GraphStoreSnapshot[];
    future: GraphStoreSnapshot[];
  };
  pendingCommands: GraphCommand[];
};

export type GraphStoreSnapshot = Omit<GraphStoreState, "history" | "pendingCommands">;
