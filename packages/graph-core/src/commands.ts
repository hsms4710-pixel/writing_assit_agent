import { createSchemaValidator } from "./schema";
import type { GraphCommand, GraphStoreState } from "./types";

export function applyCommand(state: GraphStoreState, command: GraphCommand) {
  switch (command.type) {
    case "graph.addNode": {
      if (state.schema) {
        createSchemaValidator(state.schema).validateNode(command.node);
      }
      return {
        ...state,
        graph: {
          ...state.graph,
          nodes: {
            ...state.graph.nodes,
            [command.node.id]: command.node
          }
        }
      };
    }

    case "graph.addEdge": {
      if (state.schema) {
        createSchemaValidator(state.schema).validateEdge(command.edge, state.graph.nodes);
      }
      return {
        ...state,
        graph: {
          ...state.graph,
          edges: {
            ...state.graph.edges,
            [command.edge.id]: command.edge
          }
        }
      };
    }

    case "graph.updateNodeFields": {
      const currentNode = state.graph.nodes[command.nodeId];

      return {
        ...state,
        graph: {
          ...state.graph,
          nodes: {
            ...state.graph.nodes,
            [command.nodeId]: {
              ...currentNode,
              fields: {
                ...currentNode.fields,
                ...command.fields
              }
            }
          }
        }
      };
    }

    case "scene.moveNode": {
      const currentScene = state.scene.scenes[command.sceneId];

      return {
        ...state,
        scene: {
          ...state.scene,
          scenes: {
            ...state.scene.scenes,
            [command.sceneId]: {
              ...currentScene,
              nodePlacements: {
                ...currentScene.nodePlacements,
                [command.nodeId]: { x: command.x, y: command.y }
              }
            }
          }
        }
      };
    }

    case "graph.setPrimaryStructureEdge": {
      return {
        ...state,
        graph: {
          ...state.graph,
          primaryStructureEdgeByNodeId: {
            ...state.graph.primaryStructureEdgeByNodeId,
            [command.nodeId]: command.edgeId
          }
        }
      };
    }
  }
}
