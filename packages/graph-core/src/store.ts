import { applyCommand } from "./commands";
import { pushHistory, takeSnapshot } from "./history";
import type { GraphSchema, GraphStoreState } from "./types";

const defaultState: GraphStoreState = {
  schema: undefined,
  graph: {
    nodes: {},
    edges: {},
    primaryStructureEdgeByNodeId: {}
  },
  scene: {
    activeSceneId: "default",
    scenes: {
      default: {
        nodePlacements: {}
      }
    }
  },
  history: {
    past: [],
    future: []
  },
  pendingCommands: []
};

export function createGraphStore(options: { schema?: GraphSchema } = {}) {
  let state: GraphStoreState = {
    ...structuredClone(defaultState),
    schema: options.schema
  };
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());

  return {
    getState() {
      return state;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    replaceState(nextState: GraphStoreState) {
      state = structuredClone(nextState);
      notify();
    },
    dispatch(command: Parameters<typeof applyCommand>[1]) {
      state = applyCommand(
        {
          ...state,
          history: pushHistory(state),
          pendingCommands: [...state.pendingCommands, command]
        },
        command
      );
      notify();
    },
    undo() {
      const previous = state.history.past.at(-1);
      if (!previous) {
        return;
      }

      state = {
        ...state,
        graph: previous.graph,
        scene: previous.scene,
        history: {
          past: state.history.past.slice(0, -1),
          future: [...state.history.future, takeSnapshot(state)]
        }
      };
      notify();
    },
    redo() {
      const next = state.history.future.at(-1);
      if (!next) {
        return;
      }

      state = {
        ...state,
        graph: next.graph,
        scene: next.scene,
        history: {
          past: [...state.history.past, takeSnapshot(state)],
          future: state.history.future.slice(0, -1)
        }
      };
      notify();
    }
  };
}
